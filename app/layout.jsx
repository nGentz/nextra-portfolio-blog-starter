import { Inter } from 'next/font/google'
import { Layout } from 'nextra-theme-blog'
import { Head } from 'nextra/components'
import { SiteFooter } from './components/site-footer'
import ScrollFixes from './components/scroll-fixes'
import 'nextra-theme-blog/style.css'
import './globals.css'
import './overrides.css'

export const metadata = {
  title: 'Blog Example'
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700']
})

export default async function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${inter.variable}`}
      suppressHydrationWarning
    >
      <Head backgroundColor={{ dark: '#141414', light: '#ffffff' }} />
      <body suppressHydrationWarning>
        <Layout>
          <ScrollFixes /> 
          {children}
          <SiteFooter />
        </Layout>
      </body>
    </html>
  )
}
