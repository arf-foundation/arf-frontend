import { MetadataRoute } from 'next'

// Must match app/layout.tsx's metadataBase -- these drifted apart once
// already (this file still pointed at the old Vercel preview domain after
// metadataBase moved to the real one), which told search engines two
// different things about which URL is canonical for the same page.
const baseUrl = 'https://arf-ai.com'

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified on any entry: none of these pages have a real
  // last-modified source (no CMS/DB timestamp to read), and `new Date()`
  // on every entry was worse than no signal at all -- it told crawlers
  // every page changed today, regardless of whether it actually did,
  // which can waste crawl budget re-fetching unchanged pages.
  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/pricing`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/dashboard`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/signup`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/agent`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/changelog`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/history`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
