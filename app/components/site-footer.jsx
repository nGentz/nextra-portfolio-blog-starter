'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'

const timePartsFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZoneName: 'short'
})

function SunIcon(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function ThemeSegmentedControl() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const active = resolvedTheme ?? theme ?? 'system'

  const options = [
    { value: 'dark', title: 'dark', Icon: MoonIcon },
    { value: 'light', title: 'light', Icon: SunIcon }
  ]

  return (
    <div className="site-footer-theme-segment flex w-fit items-center gap-[2px] rounded-[5px] border border-neutral-200/60 bg-neutral-100/70 p-[2px] dark:border-neutral-700/40 dark:bg-neutral-800/60">
      {options.map(({ value, title, Icon }) => {
        const isActive = active === value
        const base =
          'flex h-6 w-6 items-center justify-center rounded-[4px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

        const palette = mounted && isActive
          ? 'bg-white text-neutral-900 dark:bg-neutral-700/70 dark:text-white'
          : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-100'

        return (
          <button
            key={value}
            type="button"
            title={title}
            onClick={() => setTheme(value)}
            className={`${base} ${palette}`}
            aria-pressed={mounted ? isActive : undefined}
          >
            <Icon className="h-3 w-3" />
          </button>
        )
      })}
    </div>
  )
}

export function SiteFooter() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timerId
    const update = () => setNow(new Date())
    const scheduleNext = () => {
      const n = new Date()
      const msUntilNextMinute = (60 - n.getSeconds()) * 1000 - n.getMilliseconds()
      timerId = window.setTimeout(() => {
        update()
        scheduleNext()
      }, Math.max(msUntilNextMinute, 1000))
    }
    update()
    scheduleNext()
    return () => window.clearTimeout(timerId)
  }, [])

  const time = useMemo(() => {
    try {
      const parts = timePartsFormatter.formatToParts(now)
      const get = type => parts.find(p => p.type === type)?.value || ''
      const h = get('hour')
      const m = get('minute')
      const ap = get('dayPeriod')?.toUpperCase() || ''
      const tz = get('timeZoneName') || ''
      if (h && m && ap && tz) return `${h}:${m} ${ap} ${tz}`
      // Fallback
      return now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      })
    } catch {
      return ''
    }
  }, [now])

  return (
    <footer className="site-footer not-prose page-container pb-12">
      <div className="border-t border-neutral-200/80 py-8 text-[var(--page-fg)]/60 dark:border-neutral-800/40">
        <div className="grid items-center gap-4 text-center sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:text-left">
          <div className="justify-self-center flex items-center justify-center gap-2 text-xs font-normal text-[var(--page-fg)]/50 sm:justify-self-start sm:text-left sm:text-sm">
            {time}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-normal text-[var(--page-fg)]/50 sm:text-sm">
            <Link
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--page-fg)]/55 transition-colors hover:text-[var(--page-fg)]"
            >
              LinkedIn
            </Link>
            <span className="text-[var(--page-fg)]/35">/</span>
            <Link
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--page-fg)]/55 transition-colors hover:text-[var(--page-fg)]"
            >
              GitHub
            </Link>
          </div>
          <div className="justify-self-center text-[var(--page-fg)]/60 sm:justify-self-end">
            <ThemeSegmentedControl />
          </div>
        </div>
      </div>
    </footer>
  )
}
