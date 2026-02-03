import type { MetadataRoute } from 'next';
import oresJSON from '@/data/v20260201/ores.json';

const SITE_URL = 'https://www.forgeore.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastUpdatedRaw = oresJSON.metadata?.lastUpdated || '2026-02-01';
  const lastModified = new Date(lastUpdatedRaw);

  const oreUrls: MetadataRoute.Sitemap = (oresJSON.ores || []).map((ore) => ({
    url: `${SITE_URL}/ores/${ore.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/optimize`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ores`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...oreUrls,
  ];
}
