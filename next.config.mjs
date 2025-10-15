import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  readingTime: true
})

/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_BASE_PATH || ''
const nextConfig = {
  reactStrictMode: true,
  cleanDistDir: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: { mdxRs: true }, // ensure Next's MDX is on
  // Static export for GitHub Pages and similar hosts
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`
      }
    : {})
}

export default withNextra(nextConfig)
