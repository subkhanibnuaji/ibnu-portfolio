'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Award, Scale, ArrowUpDown } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  unit: string
}

const UNITS = ['g', 'kg', 'oz', 'lb', 'ml', 'L', 'fl oz', 'pcs', 'pack']

export function UnitPriceCalculator() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Product A', price: 0, quantity: 0, unit: 'g' },
    { id: '2', name: 'Product B', price: 0, quantity: 0, unit: 'g' },
  ])
  const [sortBy, setSortBy] = useState<'price' | 'name'>('price')

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: `Product ${String.fromCharCode(65 + products.length)}`,
      price: 0,
      quantity: 0,
      unit: 'g',
    }
    setProducts([...products, newProduct])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProduct = (id: string) => {
    if (products.length <= 2) return
    setProducts(products.filter(p => p.id !== id))
  }

  // Convert all products to same unit for comparison
  const normalizeToGrams = (quantity: number, unit: string): number => {
    const conversions: Record<string, number> = {
      'g': 1,
      'kg': 1000,
      'oz': 28.3495,
      'lb': 453.592,
      'ml': 1, // treat ml as g for simplicity
      'L': 1000,
      'fl oz': 29.5735,
      'pcs': 1,
      'pack': 1,
    }
    return quantity * (conversions[unit] || 1)
  }

  const productsWithUnitPrice = useMemo(() => {
    return products.map(p => {
      const normalizedQuantity = normalizeToGrams(p.quantity, p.unit)
      const unitPrice = normalizedQuantity > 0 ? p.price / normalizedQuantity : 0
      return { ...p, unitPrice, normalizedQuantity }
    })
  }, [products])

  const sortedProducts = useMemo(() => {
    return [...productsWithUnitPrice].sort((a, b) => {
      if (sortBy === 'price') {
        // Products with 0 unit price go to bottom
        if (a.unitPrice === 0 && b.unitPrice === 0) return 0
        if (a.unitPrice === 0) return 1
        if (b.unitPrice === 0) return -1
        return a.unitPrice - b.unitPrice
      }
      return a.name.localeCompare(b.name)
    })
  }, [productsWithUnitPrice, sortBy])

  const validProducts = sortedProducts.filter(p => p.unitPrice > 0)
  const bestDealId = validProducts.length > 0 ? validProducts[0].id : null

  const formatUnitPrice = (price: number, unit: string): string => {
    if (price === 0) return '—'

    // Display in appropriate unit based on original unit
    const perUnit = ['kg', 'L', 'lb'].includes(unit) ? 'kg/L' : ['g', 'ml', 'oz', 'fl oz'].includes(unit) ? '100g/ml' : 'unit'

    if (perUnit === 'kg/L') {
      return `$${(price * 1000).toFixed(2)}/${perUnit}`
    } else if (perUnit === '100g/ml') {
      return `$${(price * 100).toFixed(2)}/100${unit.includes('oz') ? 'oz' : unit}`
    }
    return `$${price.toFixed(4)}/unit`
  }

  const calculateSavings = (product: typeof sortedProducts[0]): string => {
    if (!bestDealId || product.id === bestDealId || product.unitPrice === 0) return ''

    const bestProduct = sortedProducts.find(p => p.id === bestDealId)
    if (!bestProduct || bestProduct.unitPrice === 0) return ''

    const savingsPercent = ((product.unitPrice - bestProduct.unitPrice) / product.unitPrice) * 100
    return `+${savingsPercent.toFixed(1)}% more expensive`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Unit Price Calculator</h1>
        <p className="text-muted-foreground">Compare prices to find the best deal</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <button
            onClick={addProduct}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          <button
            onClick={() => setSortBy(sortBy === 'price' ? 'name' : 'price')}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort by {sortBy === 'price' ? 'Name' : 'Price'}
          </button>
        </div>

        {/* Products */}
        <div className="space-y-4">
          <AnimatePresence>
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  product.id === bestDealId
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-transparent bg-muted/50'
                }`}
              >
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8">
                    {product.unitPrice > 0 && (
                      index === 0 ? (
                        <Award className="w-6 h-6 text-yellow-500" />
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                      )
                    )}
                  </div>

                  {/* Product Name */}
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                    className="w-32 px-3 py-2 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                  />

                  {/* Price */}
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">$</span>
                    <input
                      type="number"
                      value={product.price || ''}
                      onChange={(e) => updateProduct(product.id, { price: parseFloat(e.target.value) || 0 })}
                      className="w-20 px-3 py-2 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={product.quantity || ''}
                      onChange={(e) => updateProduct(product.id, { quantity: parseFloat(e.target.value) || 0 })}
                      className="w-20 px-3 py-2 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                    <select
                      value={product.unit}
                      onChange={(e) => updateProduct(product.id, { unit: e.target.value })}
                      className="px-2 py-2 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {UNITS.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  {/* Unit Price */}
                  <div className="flex-1 text-right">
                    <div className={`font-semibold ${product.id === bestDealId ? 'text-green-500' : ''}`}>
                      {formatUnitPrice(product.unitPrice, product.unit)}
                    </div>
                    {calculateSavings(product) && (
                      <div className="text-xs text-red-500">{calculateSavings(product)}</div>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteProduct(product.id)}
                    disabled={products.length <= 2}
                    className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Best Deal Summary */}
        {bestDealId && validProducts.length > 1 && (
          <div className="mt-6 p-4 bg-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-500 font-semibold mb-2">
              <Award className="w-5 h-5" />
              Best Deal
            </div>
            <p className="text-sm">
              <span className="font-semibold">{sortedProducts.find(p => p.id === bestDealId)?.name}</span>
              {' '}offers the best value at{' '}
              <span className="font-semibold">
                {formatUnitPrice(sortedProducts.find(p => p.id === bestDealId)?.unitPrice || 0, sortedProducts.find(p => p.id === bestDealId)?.unit || 'g')}
              </span>
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Use</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Enter the name, price, and quantity for each product</li>
            <li>Select the appropriate unit (grams, kg, ml, etc.)</li>
            <li>The calculator will show the price per unit for easy comparison</li>
            <li>The best deal is highlighted in green</li>
            <li>Add more products to compare using the &quot;Add Product&quot; button</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
