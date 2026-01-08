import { MetadataRoute } from 'next';

const baseUrl = 'https://lisandroandia.com';
const locales = ['es', 'en'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Add root routes for each locale
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    });

    // Add /servicios route for each locale
    routes.push({
      url: `${baseUrl}/${locale}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  return routes;
}
