'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window === window.parent &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) =>
          console.error('Service worker registration failed:', err)
        );
      });
    }
  }, []);

  return null;
}
