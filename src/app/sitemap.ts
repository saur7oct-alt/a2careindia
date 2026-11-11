import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { productSlugs } from '@/data/products';
import { projectSlugs } from '@/data/projects';

const now = () => new Date().toISOString();

/**
 * The industries list is a single page with in-page anchors rather than ten thin pages —
 * a location/industry doorway page with no original content would hurt more than help, and
 * sitemap URLs carrying fragment identifiers are ignored by crawlers anyway. /industries
 * is listed once, above.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const top = [
    { path: '/', priority: 1 },
    { path: '/solutions', priority: 0.9 },
    { path: '/products', priority: 0.9 },
    { path: '/projects', priority: 0.85 },
    { path: '/industries', priority: 0.8 },
    { path: '/about', priority: 0.75 },
    { path: '/contact', priority: 0.8 },
  ].map(({ path, priority }) => ({
    url: new URL(path, site.url).toString(),
    lastModified: now(),
    changeFrequency: 'monthly' as const,
    priority,
  }));

  const products = productSlugs.map((slug) => ({
    url: new URL(`/products/${slug}`, site.url).toString(),
    lastModified: now(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const projects = projectSlugs.map((slug) => ({
    url: new URL(`/projects/${slug}`, site.url).toString(),
    lastModified: now(),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const legal = ['/privacy-policy', '/terms'].map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: now(),
    changeFrequency: 'yearly' as const,
    priority: 0.1,
  }));

  return [...top, ...products, ...projects, ...legal];
}
