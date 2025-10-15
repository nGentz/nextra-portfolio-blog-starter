"use client"

import { useEffect } from "react"

export default function ScrollFixes() {
  useEffect(() => {
    // Ensure same-hash clicks re-scroll to the element instead of no-op
    const onClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return

      const raw = anchor.getAttribute('href')
      const id = decodeURIComponent(raw.slice(1))
      if (!id) return

      const el = document.getElementById(id)
      if (!el) return

      // If we're already at this hash, force a jump scroll again
      if (location.hash.replace(/^#/, '') === id) {
        e.preventDefault()
        // Jump to the element top without smooth behavior
        el.scrollIntoView({ behavior: 'auto', block: 'start' })
        // Accessibility: move focus without causing another scroll
        el.setAttribute('tabindex', '-1')
        el.focus({ preventScroll: true })
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}

