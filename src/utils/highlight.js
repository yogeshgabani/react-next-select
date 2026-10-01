import { createElement } from 'react'

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Wraps every case-insensitive occurrence of `query` in `text` with
 * <mark className="rns__highlight">. Returns `text` unchanged when there's
 * nothing to highlight.
 * @param {string} text
 * @param {string} query
 */
export function highlightText(text, query) {
  const q = query.trim()
  if (!q || typeof text !== 'string') return text
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, 'gi'))
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1
      ? createElement('mark', { key: i, className: 'rns__highlight' }, part)
      : part,
  )
}
