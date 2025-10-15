"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
function normalizeRoute(route) {
  if (!route) return ''
  if (route === '/') return '/'
  return route.startsWith('/') ? route : `/${route}`
}

function formatSegment(segment = '') {
  if (!segment) return ''
  const decoded = decodeURIComponent(segment)
  return decoded.replace(/[-_]/g, ' ').trim()
}

export function Breadcrumbs({
  route,
  prefix = [{ label: 'home', href: '/' }],
  currentLabel,
  className = ''
}) {
  const pathname = usePathname?.() || '/'
  const baseRoute = route && typeof route === 'string' ? route : pathname
  const normalizedRoute = normalizeRoute(baseRoute)
  const segments = normalizedRoute
    .split('/')
    .filter(Boolean)
    .filter(segment => !(segment.startsWith('(') && segment.endsWith(')')))
  const crumbs = [...prefix]

  // Avoid duplicating the first path segment when the prefix already
  // contains the same crumb (e.g., prefix has 'posts' and path starts with '/posts').
  let startIndex = 0
  if (segments.length) {
    const first = segments[0]
    const lastPrefix = crumbs[crumbs.length - 1]
    const lastLabel = (lastPrefix?.label || '').toString().toLowerCase()
    const firstFormatted = formatSegment(first).toLowerCase()
    if (lastPrefix && (lastPrefix.href === `/${first}` || lastLabel === firstFormatted)) {
      startIndex = 1
    }
  }

  let pathAccumulator = ''
  segments.slice(startIndex).forEach((segment, idx) => {
    pathAccumulator += `/${segment}`
    const isLast = idx === (segments.length - 1 - startIndex)
    const raw = decodeURIComponent(segment)
    const label = isLast ? (currentLabel ?? raw) : formatSegment(segment)
    crumbs.push({
      label,
      href: isLast ? undefined : pathAccumulator
    })
  })

  const trail = crumbs.filter(item => item?.label)

  if (!trail.length) {
    return null
  }

  const navClassName = [
    'breadcrumb-nav not-prose text-sm tracking-tight text-[var(--page-fg)]/65 m-0 p-0 block',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <nav
      aria-label="Breadcrumb"
      className={navClassName}
    >
      <ol className="breadcrumb-list flex flex-nowrap items-center gap-2 pl-0 ml-0 list-none overflow-hidden max-w-full">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1
          return (
            <li
              key={`${item.href ?? item.label}-${index}`}
              className="flex shrink-0 items-center gap-1 pl-0 ml-0"
            >
              {item.href && !isLast ? (
                <Link href={item.href} className="transition">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[var(--page-fg)]/65">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span
                  aria-hidden
                  className="px-1 text-base text-[var(--page-fg)]/35"
                >
                  ›
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
