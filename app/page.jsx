import Link from 'next/link'
import { getPosts } from './posts/get-posts'

export const metadata = {
  title: 'Portfolio Starter — Home'
}

function formatMonthYear(date) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric'
    }).format(new Date(date))
  } catch {
    return ''
  }
}

function titleize(slug = '') {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

export default async function HomePage() {
  const posts = await getPosts()
  const featured = posts.slice(0, 3)

  return (
    <main className="page-container page-vertical">
      <section className="space-y-7">
        <div className="space-y-2">
          <h1 className="mb-0 text-4xl font-medium text-[var(--page-fg)] sm:text-5xl">
            Portfolio Blog Starter
          </h1>
        </div>
        <p className="text-base leading-7 text-[var(--page-fg)]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur
        </p>
        <nav className="flex flex-wrap gap-6 text-sm font-medium text-[var(--page-fg)]/70">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 transition"
          >
            <span><i>learn more about me here</i></span>
            <span aria-hidden>→</span>
          </Link>
        </nav>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-[11px] font-semibold text-[var(--page-fg)]/60">
          my work
        </h2>
        <ul className="not-prose list-none divide-y divide-neutral-200/70 border-y border-neutral-200/70 pl-0 ml-0 [&>li]:list-none [&>li]:pl-0 [&>li]:pr-0 [&>li]:ml-0 dark:divide-neutral-800/35 dark:border-neutral-800/35">
          {featured.length > 0 ? (
            featured.map(post => {
              const title =
                post?.meta?.title ??
                post?.frontMatter?.title ??
                titleize(post?.name)
              const date = post?.frontMatter?.date
                ? new Date(post.frontMatter.date)
                : null
              const formattedDate = date ? formatMonthYear(date) : null

              return (
                <li key={post.route}>
                  <Link
                    href={post.route}
                    className="flex items-center justify-between gap-4 py-4 text-base transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                  >
                    <span className="truncate font-medium">
                      {title}
                    </span>
                    {formattedDate && (
                      <time
                        dateTime={date?.toISOString()}
                        className="shrink-0 text-sm text-current opacity-60"
                      >
                        {formattedDate}
                      </time>
                    )}
                  </Link>
                </li>
              )
            })
          ) : (
            <li className="py-6 text-sm text-[var(--page-fg)]/70">
              Writing is brewing — check back soon.
            </li>
          )}
        </ul>
        <div className="flex justify-end">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm font-normal text-[var(--page-fg)] transition"
          >
            <span>view all works</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
