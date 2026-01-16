'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Hash, RefreshCw } from 'lucide-react'

type HashType = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

const HASH_TYPES: { type: HashType; bits: number }[] = [
  { type: 'MD5', bits: 128 },
  { type: 'SHA-1', bits: 160 },
  { type: 'SHA-256', bits: 256 },
  { type: 'SHA-384', bits: 384 },
  { type: 'SHA-512', bits: 512 },
]

// Simple MD5 implementation
function md5(string: string): string {
  function rotateLeft(x: number, n: number) {
    return (x << n) | (x >>> (32 - n))
  }

  function addUnsigned(x: number, y: number) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  function F(x: number, y: number, z: number) { return (x & y) | (~x & z) }
  function G(x: number, y: number, z: number) { return (x & z) | (y & ~z) }
  function H(x: number, y: number, z: number) { return x ^ y ^ z }
  function I(x: number, y: number, z: number) { return y ^ (x | ~z) }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function convertToWordArray(string: string) {
    let messageLength = string.length
    let numberOfWords = (((messageLength + 8) - ((messageLength + 8) % 64)) / 64 + 1) * 16
    let wordArray = new Array(numberOfWords - 1)
    let wordCount, byteCount = 0, bytePosition = 0
    while (byteCount < messageLength) {
      wordCount = (byteCount - (byteCount % 4)) / 4
      bytePosition = (byteCount % 4) * 8
      wordArray[wordCount] = wordArray[wordCount] | (string.charCodeAt(byteCount) << bytePosition)
      byteCount++
    }
    wordCount = (byteCount - (byteCount % 4)) / 4
    bytePosition = (byteCount % 4) * 8
    wordArray[wordCount] = wordArray[wordCount] | (0x80 << bytePosition)
    wordArray[numberOfWords - 2] = messageLength << 3
    wordArray[numberOfWords - 1] = messageLength >>> 29
    return wordArray
  }

  function wordToHex(value: number) {
    let hex = '', temp = ''
    for (let count = 0; count <= 3; count++) {
      temp = (value >>> (count * 8) & 255).toString(16)
      hex = hex + (temp.length < 2 ? '0' + temp : temp)
    }
    return hex
  }

  let x = convertToWordArray(string)
  let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476
  let AA, BB, CC, DD

  const S11=7, S12=12, S13=17, S14=22
  const S21=5, S22=9, S23=14, S24=20
  const S31=4, S32=11, S33=16, S34=23
  const S41=6, S42=10, S43=15, S44=21

  for (let k = 0; k < x.length; k += 16) {
    AA = a; BB = b; CC = c; DD = d
    a = FF(a, b, c, d, x[k+0], S11, 0xD76AA478)
    d = FF(d, a, b, c, x[k+1], S12, 0xE8C7B756)
    c = FF(c, d, a, b, x[k+2], S13, 0x242070DB)
    b = FF(b, c, d, a, x[k+3], S14, 0xC1BDCEEE)
    a = FF(a, b, c, d, x[k+4], S11, 0xF57C0FAF)
    d = FF(d, a, b, c, x[k+5], S12, 0x4787C62A)
    c = FF(c, d, a, b, x[k+6], S13, 0xA8304613)
    b = FF(b, c, d, a, x[k+7], S14, 0xFD469501)
    a = FF(a, b, c, d, x[k+8], S11, 0x698098D8)
    d = FF(d, a, b, c, x[k+9], S12, 0x8B44F7AF)
    c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1)
    b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE)
    a = FF(a, b, c, d, x[k+12], S11, 0x6B901122)
    d = FF(d, a, b, c, x[k+13], S12, 0xFD987193)
    c = FF(c, d, a, b, x[k+14], S13, 0xA679438E)
    b = FF(b, c, d, a, x[k+15], S14, 0x49B40821)
    a = GG(a, b, c, d, x[k+1], S21, 0xF61E2562)
    d = GG(d, a, b, c, x[k+6], S22, 0xC040B340)
    c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51)
    b = GG(b, c, d, a, x[k+0], S24, 0xE9B6C7AA)
    a = GG(a, b, c, d, x[k+5], S21, 0xD62F105D)
    d = GG(d, a, b, c, x[k+10], S22, 0x02441453)
    c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681)
    b = GG(b, c, d, a, x[k+4], S24, 0xE7D3FBC8)
    a = GG(a, b, c, d, x[k+9], S21, 0x21E1CDE6)
    d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6)
    c = GG(c, d, a, b, x[k+3], S23, 0xF4D50D87)
    b = GG(b, c, d, a, x[k+8], S24, 0x455A14ED)
    a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905)
    d = GG(d, a, b, c, x[k+2], S22, 0xFCEFA3F8)
    c = GG(c, d, a, b, x[k+7], S23, 0x676F02D9)
    b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A)
    a = HH(a, b, c, d, x[k+5], S31, 0xFFFA3942)
    d = HH(d, a, b, c, x[k+8], S32, 0x8771F681)
    c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122)
    b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C)
    a = HH(a, b, c, d, x[k+1], S31, 0xA4BEEA44)
    d = HH(d, a, b, c, x[k+4], S32, 0x4BDECFA9)
    c = HH(c, d, a, b, x[k+7], S33, 0xF6BB4B60)
    b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70)
    a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6)
    d = HH(d, a, b, c, x[k+0], S32, 0xEAA127FA)
    c = HH(c, d, a, b, x[k+3], S33, 0xD4EF3085)
    b = HH(b, c, d, a, x[k+6], S34, 0x04881D05)
    a = HH(a, b, c, d, x[k+9], S31, 0xD9D4D039)
    d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5)
    c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8)
    b = HH(b, c, d, a, x[k+2], S34, 0xC4AC5665)
    a = II(a, b, c, d, x[k+0], S41, 0xF4292244)
    d = II(d, a, b, c, x[k+7], S42, 0x432AFF97)
    c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7)
    b = II(b, c, d, a, x[k+5], S44, 0xFC93A039)
    a = II(a, b, c, d, x[k+12], S41, 0x655B59C3)
    d = II(d, a, b, c, x[k+3], S42, 0x8F0CCC92)
    c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D)
    b = II(b, c, d, a, x[k+1], S44, 0x85845DD1)
    a = II(a, b, c, d, x[k+8], S41, 0x6FA87E4F)
    d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0)
    c = II(c, d, a, b, x[k+6], S43, 0xA3014314)
    b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1)
    a = II(a, b, c, d, x[k+4], S41, 0xF7537E82)
    d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235)
    c = II(c, d, a, b, x[k+2], S43, 0x2AD7D2BB)
    b = II(b, c, d, a, x[k+9], S44, 0xEB86D391)
    a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD)
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase()
}

async function generateHash(text: string, type: HashType): Promise<string> {
  if (type === 'MD5') {
    return md5(text)
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const algorithm = type === 'SHA-1' ? 'SHA-1' : type
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<HashType, string>>({
    'MD5': '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': '',
  })
  const [copiedType, setCopiedType] = useState<HashType | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateAllHashes = async () => {
    if (!input) {
      setHashes({
        'MD5': '',
        'SHA-1': '',
        'SHA-256': '',
        'SHA-384': '',
        'SHA-512': '',
      })
      return
    }

    setIsGenerating(true)
    const newHashes: Record<HashType, string> = {
      'MD5': '',
      'SHA-1': '',
      'SHA-256': '',
      'SHA-384': '',
      'SHA-512': '',
    }

    for (const { type } of HASH_TYPES) {
      newHashes[type] = await generateHash(input, type)
    }

    setHashes(newHashes)
    setIsGenerating(false)
  }

  const copyToClipboard = async (type: HashType) => {
    await navigator.clipboard.writeText(hashes[type])
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Hash Generator</h1>
        <p className="text-muted-foreground">Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Enter Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            rows={4}
            className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>

        <button
          onClick={generateAllHashes}
          disabled={isGenerating}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-6"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Hash className="w-4 h-4" />
          )}
          Generate Hashes
        </button>

        <div className="space-y-4">
          {HASH_TYPES.map(({ type, bits }) => (
            <div key={type} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{type}</span>
                <span className="text-xs text-muted-foreground">{bits} bits</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hashes[type]}
                  readOnly
                  placeholder="Hash will appear here..."
                  className="flex-1 px-3 py-2 bg-background rounded border text-xs font-mono overflow-x-auto"
                />
                <button
                  onClick={() => copyToClipboard(type)}
                  disabled={!hashes[type]}
                  className="p-2 bg-background rounded border hover:bg-muted transition-colors disabled:opacity-50"
                  title="Copy"
                >
                  {copiedType === type ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg text-sm">
          <p className="font-semibold text-yellow-600 mb-1">Security Note</p>
          <p className="text-muted-foreground">
            MD5 and SHA-1 are considered cryptographically broken. Use SHA-256 or higher for security-sensitive applications.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
