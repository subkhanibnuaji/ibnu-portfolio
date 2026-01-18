'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, Unlock, Copy, Check, ArrowLeftRight,
  Key, Shield, Eye, EyeOff
} from 'lucide-react'

type EncryptionMethod = 'caesar' | 'vigenere' | 'base64' | 'rot13' | 'atbash' | 'aes'

export function EncryptionTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [method, setMethod] = useState<EncryptionMethod>('caesar')
  const [key, setKey] = useState('')
  const [shift, setShift] = useState(3)
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)

  // Caesar Cipher
  const caesarCipher = (text: string, shiftAmount: number, decrypt: boolean): string => {
    const actualShift = decrypt ? -shiftAmount : shiftAmount
    return text.split('').map(char => {
      if (/[a-zA-Z]/.test(char)) {
        const base = char === char.toUpperCase() ? 65 : 97
        return String.fromCharCode(((char.charCodeAt(0) - base + actualShift + 26) % 26) + base)
      }
      return char
    }).join('')
  }

  // Vigenere Cipher
  const vigenereCipher = (text: string, keyword: string, decrypt: boolean): string => {
    if (!keyword) return text
    const key = keyword.toUpperCase()
    let keyIndex = 0

    return text.split('').map(char => {
      if (/[a-zA-Z]/.test(char)) {
        const base = char === char.toUpperCase() ? 65 : 97
        const shift = key.charCodeAt(keyIndex % key.length) - 65
        const actualShift = decrypt ? -shift : shift
        keyIndex++
        return String.fromCharCode(((char.charCodeAt(0) - base + actualShift + 26) % 26) + base)
      }
      return char
    }).join('')
  }

  // ROT13
  const rot13 = (text: string): string => {
    return caesarCipher(text, 13, false)
  }

  // Atbash Cipher
  const atbash = (text: string): string => {
    return text.split('').map(char => {
      if (/[a-z]/.test(char)) {
        return String.fromCharCode(219 - char.charCodeAt(0))
      } else if (/[A-Z]/.test(char)) {
        return String.fromCharCode(155 - char.charCodeAt(0))
      }
      return char
    }).join('')
  }

  // Base64
  const base64Encrypt = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)))
    } catch {
      return 'Error: Invalid input'
    }
  }

  const base64Decrypt = (text: string): string => {
    try {
      return decodeURIComponent(escape(atob(text)))
    } catch {
      return 'Error: Invalid Base64'
    }
  }

  // Simple AES-like XOR encryption (for demo purposes)
  const xorEncrypt = (text: string, key: string): string => {
    if (!key) return text
    const result = text.split('').map((char, i) => {
      const keyChar = key.charCodeAt(i % key.length)
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar)
    })
    return btoa(result.join(''))
  }

  const xorDecrypt = (text: string, key: string): string => {
    if (!key) return text
    try {
      const decoded = atob(text)
      return decoded.split('').map((char, i) => {
        const keyChar = key.charCodeAt(i % key.length)
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar)
      }).join('')
    } catch {
      return 'Error: Invalid encrypted text'
    }
  }

  const process = () => {
    let result = ''

    switch (method) {
      case 'caesar':
        result = caesarCipher(input, shift, mode === 'decrypt')
        break
      case 'vigenere':
        result = vigenereCipher(input, key, mode === 'decrypt')
        break
      case 'rot13':
        result = rot13(input)
        break
      case 'atbash':
        result = atbash(input)
        break
      case 'base64':
        result = mode === 'encrypt' ? base64Encrypt(input) : base64Decrypt(input)
        break
      case 'aes':
        result = mode === 'encrypt' ? xorEncrypt(input, key) : xorDecrypt(input, key)
        break
    }

    setOutput(result)
  }

  const swapInputOutput = () => {
    setInput(output)
    setOutput('')
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const methods: { id: EncryptionMethod; name: string; description: string }[] = [
    { id: 'caesar', name: 'Caesar Cipher', description: 'Shift letters by a fixed amount' },
    { id: 'vigenere', name: 'Vigenère Cipher', description: 'Polyalphabetic substitution with keyword' },
    { id: 'rot13', name: 'ROT13', description: 'Rotate letters by 13 positions' },
    { id: 'atbash', name: 'Atbash', description: 'Reverse alphabet substitution' },
    { id: 'base64', name: 'Base64', description: 'Binary-to-text encoding' },
    { id: 'aes', name: 'XOR Cipher', description: 'Simple XOR encryption with key' }
  ]

  const needsKey = method === 'vigenere' || method === 'aes'
  const needsShift = method === 'caesar'

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Method Selection */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block">Encryption Method</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {methods.map(m => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  method === m.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <div className="font-medium text-sm">{m.name}</div>
                <div className={`text-xs ${method === m.id ? 'text-white/70' : 'text-white/50'}`}>
                  {m.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('encrypt')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              mode === 'encrypt'
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Lock className="w-5 h-5" />
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              mode === 'decrypt'
                ? 'bg-red-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Unlock className="w-5 h-5" />
            Decrypt
          </button>
        </div>

        {/* Key/Shift Input */}
        {(needsKey || needsShift) && (
          <div className="mb-4">
            {needsShift && (
              <div>
                <label className="text-white/70 text-sm mb-2 block">Shift Amount: {shift}</label>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={shift}
                  onChange={(e) => setShift(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {needsKey && (
              <div>
                <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Encryption Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter encryption key..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500 pr-12"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div className="mb-4">
          <label className="text-white/70 text-sm mb-2 block">
            {mode === 'encrypt' ? 'Plain Text' : 'Encrypted Text'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...'}
            className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none font-mono"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={process}
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
          <button
            onClick={swapInputOutput}
            className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            title="Swap input and output"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-white/70 text-sm">
              {mode === 'encrypt' ? 'Encrypted Text' : 'Decrypted Text'}
            </label>
            {output && (
              <button
                onClick={copyOutput}
                className="text-white/50 hover:text-white flex items-center gap-1 text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="w-full min-h-[128px] px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white font-mono break-all">
            {output || <span className="text-white/30">Output will appear here...</span>}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <h4 className="text-white font-medium mb-2">About {methods.find(m => m.id === method)?.name}</h4>
          <p className="text-white/50 text-sm">
            {method === 'caesar' && 'The Caesar cipher shifts each letter by a fixed number of positions in the alphabet. It was used by Julius Caesar to communicate with his generals.'}
            {method === 'vigenere' && 'The Vigenère cipher uses a keyword to determine the shift for each letter, making it harder to crack than simple substitution ciphers.'}
            {method === 'rot13' && 'ROT13 is a special case of the Caesar cipher with a shift of 13. Applying it twice returns the original text.'}
            {method === 'atbash' && 'Atbash is a substitution cipher where A becomes Z, B becomes Y, and so on. It\'s self-reversing like ROT13.'}
            {method === 'base64' && 'Base64 is an encoding scheme that converts binary data to ASCII text. It\'s not encryption but is useful for data transmission.'}
            {method === 'aes' && 'This XOR cipher demonstrates symmetric encryption principles. For real security, use actual AES encryption.'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
