import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

interface CoinGeckoPrice {
  [key: string]: {
    usd: number
    usd_24h_change: number
    usd_24h_vol: number
    usd_market_cap: number
    last_updated_at: number
  }
}

interface CryptoData {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  lastUpdated: string
}

const COINS = 'bitcoin,ethereum,binancecoin,solana,cardano,ripple,polkadot,dogecoin,avalanche-2,chainlink'

export async function GET() {
  try {
    // Using CoinGecko's free API (no API key required)
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${COINS}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices')
    }

    const data: CoinGeckoPrice = await response.json()

    const coinNames: Record<string, { name: string; symbol: string }> = {
      'bitcoin': { name: 'Bitcoin', symbol: 'BTC' },
      'ethereum': { name: 'Ethereum', symbol: 'ETH' },
      'binancecoin': { name: 'BNB', symbol: 'BNB' },
      'solana': { name: 'Solana', symbol: 'SOL' },
      'cardano': { name: 'Cardano', symbol: 'ADA' },
      'ripple': { name: 'XRP', symbol: 'XRP' },
      'polkadot': { name: 'Polkadot', symbol: 'DOT' },
      'dogecoin': { name: 'Dogecoin', symbol: 'DOGE' },
      'avalanche-2': { name: 'Avalanche', symbol: 'AVAX' },
      'chainlink': { name: 'Chainlink', symbol: 'LINK' },
    }

    const prices: CryptoData[] = Object.entries(data).map(([id, info]) => ({
      id,
      symbol: coinNames[id]?.symbol || id.toUpperCase(),
      name: coinNames[id]?.name || id,
      price: info.usd,
      change24h: info.usd_24h_change,
      volume24h: info.usd_24h_vol,
      marketCap: info.usd_market_cap,
      lastUpdated: new Date(info.last_updated_at * 1000).toISOString(),
    }))

    // Sort by market cap
    prices.sort((a, b) => b.marketCap - a.marketCap)

    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Crypto API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crypto prices',
        data: []
      },
      { status: 500 }
    )
  }
}
