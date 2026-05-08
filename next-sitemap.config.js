/** @type {import('next-sitemap').Config} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  outDir: 'out',
  exclude: ['/server-sitemap-index.xml'],
  transform: async (config, path) => {
    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: path === '/' ? 1 : 0.7,
    }
  },
}