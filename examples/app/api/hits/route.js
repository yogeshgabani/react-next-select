import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getStore } from '@netlify/blobs'

// Persisted in Netlify Blobs — a free, zero-config key/value store that
// comes with every Netlify site (no external DB / API key needed).
const STORE_NAME = 'react-next-select-stats'
const STATS_KEY = 'stats'
const VISITOR_COOKIE = 'rns_visitor_id'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export async function GET(request) {
  const now = new Date().toISOString()

  let store
  try {
    store = getStore({ name: STORE_NAME, consistency: 'strong' })
  } catch {
    // Netlify Blobs isn't available outside a Netlify deploy (e.g. plain
    // `next dev` without `netlify dev`) — degrade gracefully instead of 500ing.
    return NextResponse.json({ hits: 0, visitors: 0, lastUpdated: now, live: false })
  }

  let stats = { hits: 0, visitors: 0 }
  try {
    stats = (await store.get(STATS_KEY, { type: 'json' })) || stats
  } catch {
    // first request ever, or a transient read error — start from zero
  }

  stats.hits = (stats.hits || 0) + 1

  const existingVisitorId = request.cookies.get(VISITOR_COOKIE)?.value
  const isNewVisitor = !existingVisitorId
  if (isNewVisitor) {
    stats.visitors = (stats.visitors || 0) + 1
  }
  stats.lastUpdated = now

  try {
    await store.setJSON(STATS_KEY, stats)
  } catch {
    // best-effort write — still return this request's numbers below
  }

  const response = NextResponse.json({ ...stats, live: true })
  if (isNewVisitor) {
    response.cookies.set(VISITOR_COOKIE, randomUUID(), {
      maxAge: ONE_YEAR_SECONDS,
      path: '/',
      sameSite: 'lax',
    })
  }
  return response
}
