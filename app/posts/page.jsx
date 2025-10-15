import Link from 'next/link'
import { Breadcrumbs } from '../components/breadcrumbs'
import { getPosts } from './get-posts'

export const metadata = { title: 'posts' }

function formatMonthYear(date) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric'
    }).format(date)
  } catch {
    return ''
  }
}

function titleize(slug = '') {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <main className="page-container page-vertical" data-pagefind-ignore="all">
      <Breadcrumbs route="/posts" className="text-[var(--page-fg)]/65" />

      <header className="space-y-3">
        <h1 className="mb-0 text-[28px] font-medium text-[var(--page-fg)] sm:text-[32px]">
          My works
        </h1>
        <p className="text-base leading-7 text-[var(--page-fg)]">
          Display your notes, works, or blog posts in reverse chronological order.
        </p>
      </header>

      <ul className="not-prose mt-12 list-none divide-y divide-neutral-200/70 border-y border-neutral-200/70 pl-0 ml-0 [&>li]:list-none [&>li]:pl-0 [&>li]:ml-0 dark:divide-neutral-800/35 dark:border-neutral-800/35">
        {posts.map(post => {
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
                className="flex items-center justify-between gap-6 py-5 text-base transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
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
        })}
      </ul>
    </main>
  )
}
