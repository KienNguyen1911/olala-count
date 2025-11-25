/**
 * PWA Configuration Helper
 * 
 * Sử dụng file này để cấu hình PWA settings
 * Import vào vite.config.ts để sử dụng
 */

export const PWA_CONFIG = {
  // Thông tin ứng dụng
  app: {
    name: 'NEO-COUNT',
    shortName: 'NEO-COUNT',
    description: 'A modern progressive web app for counting and tracking',
    themeColor: '#ffffff',
    backgroundColor: '#f3f4f6',
  },

  // Service Worker
  sw: {
    registerType: 'prompt' as const, // 'prompt' | 'autoUpdate'
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      runtimeCaching: [
        // Google Fonts
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst' as const,
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        // Gstatic fonts
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst' as const,
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        // Tailwind CDN
        {
          urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
          handler: 'CacheFirst' as const,
          options: {
            cacheName: 'tailwind-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        // API calls - Network First (try network, fall back to cache)
        {
          urlPattern: /^https:\/\/api\./i,
          handler: 'NetworkFirst' as const,
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 5 * 60, // 5 minutes
            },
          },
        },
      ],
    },
  },

  // Icons
  icons: [
    {
      src: '/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/pwa-maskable-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/pwa-maskable-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],

  // Screenshots (optional)
  screenshots: [
    {
      src: '/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      form_factor: 'narrow',
    },
    {
      src: '/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      form_factor: 'wide',
    },
  ],

  // Shortcuts (optional)
  shortcuts: [
    {
      name: 'Open App',
      short_name: 'Open',
      description: 'Open NEO-COUNT app',
      url: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
        },
      ],
    },
  ],
};

/**
 * Hàm helper để thêm custom caching rule
 * 
 * Ví dụ:
 * addRuntimeCache({
 *   urlPattern: regex pattern,
 *   handler: 'NetworkFirst',
 *   cacheName: 'custom-api-cache',
 *   maxAge: 60 * 60
 * })
 */
export function addRuntimeCache(config: {
  urlPattern: RegExp;
  handler: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate';
  cacheName: string;
  maxAge?: number;
}) {
  const cacheConfig = {
    urlPattern: config.urlPattern,
    handler: config.handler,
    options: {
      cacheName: config.cacheName,
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: config.maxAge || 60 * 60 * 24, // Default 1 day
      },
    },
  };

  PWA_CONFIG.sw.workbox.runtimeCaching.push(cacheConfig as any);
  return PWA_CONFIG;
}

/**
 * Hàm helper để update thông tin app
 */
export function updateAppInfo(updates: Partial<typeof PWA_CONFIG.app>) {
  PWA_CONFIG.app = { ...PWA_CONFIG.app, ...updates };
  return PWA_CONFIG;
}
