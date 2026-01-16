'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Trash2, Download, Copy, Check, Building } from 'lucide-react'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
}

interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  fromName: string
  fromAddress: string
  fromEmail: string
  toName: string
  toAddress: string
  toEmail: string
  items: InvoiceItem[]
  notes: string
  taxRate: number
}

export function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fromName: '',
    fromAddress: '',
    fromEmail: '',
    toName: '',
    toAddress: '',
    toEmail: '',
    items: [{ id: '1', description: '', quantity: 1, price: 0 }],
    notes: '',
    taxRate: 10
  })
  const [copied, setCopied] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const updateField = (field: keyof InvoiceData, value: any) => {
    setInvoice({ ...invoice, [field]: value })
  }

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]
    })
  }

  const removeItem = (id: string) => {
    if (invoice.items.length <= 1) return
    setInvoice({
      ...invoice,
      items: invoice.items.filter(item => item.id !== id)
    })
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice({
      ...invoice,
      items: invoice.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    })
  }

  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const tax = subtotal * (invoice.taxRate / 100)
  const total = subtotal + tax

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const generateHTML = (): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .invoice-title { font-size: 32px; font-weight: bold; color: #333; }
    .invoice-number { color: #666; }
    .addresses { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .address-block { width: 45%; }
    .address-label { font-weight: bold; color: #666; margin-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f5f5f5; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    .text-right { text-align: right; }
    .totals { width: 300px; margin-left: auto; margin-top: 20px; }
    .totals td { padding: 8px 0; }
    .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #333; }
    .notes { margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 5px; }
    .notes-label { font-weight: bold; margin-bottom: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">${invoice.invoiceNumber}</div>
    </div>
    <div class="text-right">
      <div>Date: ${invoice.date}</div>
      <div>Due: ${invoice.dueDate}</div>
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <div class="address-label">FROM</div>
      <div><strong>${invoice.fromName}</strong></div>
      <div>${invoice.fromAddress}</div>
      <div>${invoice.fromEmail}</div>
    </div>
    <div class="address-block">
      <div class="address-label">TO</div>
      <div><strong>${invoice.toName}</strong></div>
      <div>${invoice.toAddress}</div>
      <div>${invoice.toEmail}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Price</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map(item => `
        <tr>
          <td>${item.description || '-'}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${formatCurrency(item.price)}</td>
          <td class="text-right">${formatCurrency(item.quantity * item.price)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <table class="totals">
    <tr>
      <td>Subtotal</td>
      <td class="text-right">${formatCurrency(subtotal)}</td>
    </tr>
    <tr>
      <td>Tax (${invoice.taxRate}%)</td>
      <td class="text-right">${formatCurrency(tax)}</td>
    </tr>
    <tr class="total-row">
      <td>Total</td>
      <td class="text-right">${formatCurrency(total)}</td>
    </tr>
  </table>

  ${invoice.notes ? `
    <div class="notes">
      <div class="notes-label">Notes</div>
      <div>${invoice.notes}</div>
    </div>
  ` : ''}
</body>
</html>
    `
  }

  const downloadHTML = () => {
    const html = generateHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${invoice.invoiceNumber}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printInvoice = () => {
    const html = generateHTML()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-4">
          <FileText className="w-4 h-4" />
          Business
        </div>
        <h2 className="text-2xl font-bold">Invoice Generator</h2>
        <p className="text-muted-foreground mt-2">
          Create professional invoices in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          {/* Invoice Details */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <h3 className="font-semibold">Invoice Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Invoice #</label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => updateField('invoiceNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Tax Rate (%)</label>
                <input
                  type="number"
                  value={invoice.taxRate}
                  onChange={(e) => updateField('taxRate', Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Date</label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Due Date</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
            </div>
          </div>

          {/* From */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Building className="w-4 h-4" />
              From (Your Info)
            </h3>
            <input
              type="text"
              placeholder="Name / Company"
              value={invoice.fromName}
              onChange={(e) => updateField('fromName', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
            <input
              type="text"
              placeholder="Address"
              value={invoice.fromAddress}
              onChange={(e) => updateField('fromAddress', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={invoice.fromEmail}
              onChange={(e) => updateField('fromEmail', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>

          {/* To */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <h3 className="font-semibold">Bill To (Client)</h3>
            <input
              type="text"
              placeholder="Client Name / Company"
              value={invoice.toName}
              onChange={(e) => updateField('toName', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
            <input
              type="text"
              placeholder="Address"
              value={invoice.toAddress}
              onChange={(e) => updateField('toAddress', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={invoice.toEmail}
              onChange={(e) => updateField('toEmail', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>

          {/* Items */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Items</h3>
              <button
                onClick={addItem}
                className="p-1 rounded hover:bg-muted"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {invoice.items.map((item, idx) => (
              <div key={item.id} className="flex gap-2 items-start">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  min={1}
                  className="w-16 px-2 py-2 rounded-lg border border-border bg-background text-sm"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className="w-24 px-2 py-2 rounded-lg border border-border bg-background text-sm"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-red-500"
                  disabled={invoice.items.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <label className="text-sm font-medium mb-2 block">Notes</label>
            <textarea
              value={invoice.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Payment terms, thank you message, etc."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl border border-border bg-white text-black" ref={printRef}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                <p className="text-gray-500">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>Date: {invoice.date}</p>
                <p>Due: {invoice.dueDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
              <div>
                <p className="text-gray-500 mb-1">From</p>
                <p className="font-semibold">{invoice.fromName || 'Your Name'}</p>
                <p className="text-gray-600">{invoice.fromAddress || 'Address'}</p>
                <p className="text-gray-600">{invoice.fromEmail || 'email@example.com'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">To</p>
                <p className="font-semibold">{invoice.toName || 'Client Name'}</p>
                <p className="text-gray-600">{invoice.toAddress || 'Address'}</p>
                <p className="text-gray-600">{invoice.toEmail || 'client@example.com'}</p>
              </div>
            </div>

            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 text-gray-600">Description</th>
                  <th className="text-right py-2 text-gray-600">Qty</th>
                  <th className="text-right py-2 text-gray-600">Price</th>
                  <th className="text-right py-2 text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2">{item.description || '-'}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">{formatCurrency(item.price)}</td>
                    <td className="text-right py-2">{formatCurrency(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-48 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-gray-800 font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm">
                <p className="text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={downloadHTML}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download HTML
            </button>
            <button
              onClick={printInvoice}
              className="px-4 py-3 bg-muted rounded-xl font-medium"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
