'use client';

import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';

export default function LinkedInEmbed() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (inView) setShouldLoad(true);
  }, [inView]);

  return (
    <div ref={ref} className="flex justify-center">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        {shouldLoad ? (
          <iframe
            src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7436928497408880640?collapsed=1"
            height="877"
            width="504"
            frameBorder="0"
            allowFullScreen
            title="LinkedIn post – ARF access control agent"
            loading="lazy"
            className="mx-auto w-full"
            style={{ maxWidth: '100%', height: 'auto', minHeight: '400px' }}
          />
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            <div className="animate-pulse">Loading LinkedIn post …</div>
          </div>
        )}
      </div>
    </div>
  );
}
