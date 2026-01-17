import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 30 // Revalidate every 30 seconds

interface BitcoinDetailedData {
  price: number
  change24h: number
  change7d: number
  change30d: number
  marketCap: number
  volume24h: number
  circulatingSupply: number
  totalSupply: number
  maxSupply: number
  ath: number
  athDate: string
  athChangePercent: number
  atl: number
  atlDate: string
  atlChangePercent: number
  lastUpdated: string
  sparkline7d: number[]
}

export async function GET() {
  try {
    // Fetch detailed Bitcoin data
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 30 }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Bitcoin data')
    }

    const data = await response.json()

    const bitcoinData: BitcoinDetailedData = {
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_percentage_24h,
      change7d: data.market_data.price_change_percentage_7d,
      change30d: data.market_data.price_change_percentage_30d,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      circulatingSupply: data.market_data.circulating_supply,
      totalSupply: data.market_data.total_supply,
      maxSupply: data.market_data.max_supply || 21000000,
      ath: data.market_data.ath.usd,
      athDate: data.market_data.ath_date.usd,
      athChangePercent: data.market_data.ath_change_percentage.usd,
      atl: data.market_data.atl.usd,
      atlDate: data.market_data.atl_date.usd,
      atlChangePercent: data.market_data.atl_change_percentage.usd,
      lastUpdated: data.market_data.last_updated,
      sparkline7d: data.market_data.sparkline_7d?.price || [],
    }

    return NextResponse.json({
      success: true,
      data: bitcoinData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Bitcoin API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Bitcoin data',
        data: null
      },
      { status: 500 }
    )
  }
}
