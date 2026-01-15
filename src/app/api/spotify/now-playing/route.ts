import { NextResponse } from 'next/server'

// Spotify API endpoints
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'

// Get access token using refresh token
async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    return null
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Failed to get Spotify access token:', error)
    return null
  }
}

// Get currently playing track
async function getNowPlaying(accessToken: string) {
  try {
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // Don't cache this request
      cache: 'no-store',
    })

    if (response.status === 204 || response.status > 400) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to get now playing:', error)
    return null
  }
}

// Get recently played track
async function getRecentlyPlayed(accessToken: string) {
  try {
    const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.items?.[0]?.track || null
  } catch (error) {
    console.error('Failed to get recently played:', error)
    return null
  }
}

export async function GET() {
  const accessToken = await getAccessToken()

  // If no Spotify credentials, return demo data
  if (!accessToken) {
    return NextResponse.json({
      isPlaying: false,
      configured: false,
      message: 'Spotify not configured. Add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN to .env'
    })
  }

  // Try to get currently playing
  const nowPlaying = await getNowPlaying(accessToken)

  if (nowPlaying?.is_playing && nowPlaying?.item) {
    const track = nowPlaying.item
    return NextResponse.json({
      isPlaying: true,
      configured: true,
      track: {
        title: track.name,
        artist: track.artists.map((a: any) => a.name).join(', '),
        album: track.album.name,
        albumImage: track.album.images[0]?.url,
        songUrl: track.external_urls.spotify,
        duration: track.duration_ms,
        progress: nowPlaying.progress_ms,
      },
    })
  }

  // If not playing, try to get recently played
  const recentTrack = await getRecentlyPlayed(accessToken)

  if (recentTrack) {
    return NextResponse.json({
      isPlaying: false,
      configured: true,
      recentTrack: {
        title: recentTrack.name,
        artist: recentTrack.artists.map((a: any) => a.name).join(', '),
        album: recentTrack.album.name,
        albumImage: recentTrack.album.images[0]?.url,
        songUrl: recentTrack.external_urls.spotify,
      },
    })
  }

  return NextResponse.json({
    isPlaying: false,
    configured: true,
    message: 'No recent tracks found',
  })
}
