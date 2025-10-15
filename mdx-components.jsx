import { useMDXComponents as getBlogMDXComponents } from 'nextra-theme-blog'
import { Breadcrumbs } from './app/components/breadcrumbs'

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

function formatDate(date) {
  try {
    return DATE_FORMATTER.format(date)
  } catch {
    return date.toISOString().slice(0, 10)
  }
}

async function ArticleWrapper({ children, metadata }) {
  const meta = metadata ?? {}
  const heroGlyph = meta.emoji ?? meta.icon ?? null
  const route =
    meta.route ?? meta.href ?? meta.permalink ?? meta.url ?? '/posts'
  const includePostsCrumb =
    typeof route === 'string' &&
    (route === '/posts' || route.startsWith('/posts/'))
  const breadcrumbPrefix =
    Array.isArray(meta.breadcrumbs) && meta.breadcrumbs.length > 0
      ? meta.breadcrumbs
      : [
          { label: 'home', href: '/' },
          ...(includePostsCrumb
            ? [{ label: 'posts', href: '/posts' }]
            : [])
        ]
  const publishedDate = parseDate(meta.date ?? meta.publishedAt)
  const updatedDate = parseDate(
    meta.lastUpdated ?? meta.updated ?? meta.modified ?? meta.lastModified
  )
  const readingTime =
    typeof meta.readingTime === 'string'
      ? meta.readingTime
      : typeof meta.readingTime?.text === 'string'
        ? meta.readingTime.text
        : Number.isFinite(meta.readingTime?.minutes)
          ? (() => {
              const minutes = Math.max(1, Math.round(meta.readingTime.minutes))
              const suffix = minutes === 1 ? 'minute' : 'minutes'
              return `${minutes} ${suffix} read`
            })()
          : null

  const metaItems = []
  if (publishedDate) {
    metaItems.push(`Published ${formatDate(publishedDate)}`)
  }
  if (updatedDate) {
    metaItems.push(`Updated ${formatDate(updatedDate)}`)
  }
  if (readingTime) {
    metaItems.push(readingTime)
  }

  const tags = Array.isArray(meta.tags)
    ? meta.tags.filter(Boolean)
    : typeof meta.tags === 'string'
      ? meta.tags.split(',').map(tag => tag.trim())
      : []

  return (
    <div className="page-container page-vertical">
      <article className="m-0 p-0">
        <header className="mb-6 sm:mb-8">
          <Breadcrumbs
            prefix={breadcrumbPrefix}
            currentLabel={meta.breadcrumb ?? undefined}
          />

          {meta.title && (
            <div className="flex flex-wrap items-start gap-3">
              {heroGlyph && (
                <span className="text-2xl sm:text-3xl" aria-hidden>
                  {heroGlyph}
                </span>
              )}
              <h1 className="mb-0 text-3xl font-medium text-[var(--page-fg)] sm:text-4xl">
                {meta.title}
              </h1>
            </div>
          )}

          {metaItems.length > 0 && (
            <p className="mt-2 flex flex-wrap items-center gap-x-0 gap-y-1 text-sm text-[var(--page-fg)]">
              {metaItems.map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center whitespace-nowrap text-[var(--page-fg)]/70">
                  {index > 0 && (
                    <span aria-hidden className="mx-2 text-[var(--page-fg)]/70 font-semibold">·</span>
                  )}
                  <span>{item}</span>
                </span>
              ))}
            </p>
          )}

          {tags.length > 0 && (
            <ul className="mt-2 not-prose flex flex-wrap items-center gap-2 text-sm text-[var(--page-fg)]/70 list-none pl-0 ml-0 [&>li]:list-none [&>li]:pl-0 [&>li]:ml-0">
              {tags.map(tag => (
                <li key={tag}>
                  <span className="inline-badge normal-case text-xs font-medium">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {meta.description && (
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--page-fg)]">
              {meta.description}
            </p>
          )}
        </header>

        <div data-article-root className="article-prose prose dark:prose-invert">
          {children}
        </div>
      </article>
    </div>
  )
}

const blogComponents = getBlogMDXComponents({
  wrapper: ArticleWrapper,
  h1: ({ children, id, ...rest }) => {
    const text = extractText(children)
    const anchorId = id || (text ? slugify(text) : undefined)
    return (
      <h1 id={anchorId} {...rest} className="text-2xl font-semibold text-[var(--page-fg)]">
        {children}
        {anchorId ? (
          <a
            href={`#${anchorId}`}
            className="not-prose subheading-anchor"
            aria-label="Permalink for this section"
          />
        ) : null}
      </h1>
    )
  },
  DateFormatter: ({ date }) => formatDate(date)
})

export function useMDXComponents(components) {
  return {
    ...blogComponents,
    ...components
  }
}

function parseDate(value) {
  if (!value) return null

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  const parsed =
    typeof value === 'number' || typeof value === 'string'
      ? new Date(value)
      : null

  if (!parsed || Number.isNaN(parsed?.getTime?.())) {
    return null
  }

  return parsed
}

// Removed slugify/title-anchor: explicit request to hide anchors on page titles
function extractText(node) {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  if (typeof node === 'object') return extractText(node.props?.children)
  return ''
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
