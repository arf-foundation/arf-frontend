/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.arf-ai.com',
  generateRobotsTxt: false,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/dashboard', '/signup'],
};
