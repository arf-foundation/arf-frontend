'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from '../hooks/useInView';

export default function LinkedInEmbed() {
  const { ref: rawRef, inView } = useInView({ threshold: 0.1 });
  const ref = rawRef as React.RefObject<HTMLDivElement>;
  const [shouldLoad, setShouldLoad] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (inView && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldLoad(true);
    }
  }, [inView]);

  return (
    <div ref={ref} className="flex justify-center">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-800/50 p-4" style={{ minHeight: '500px' }}>
        {shouldLoad ? (
          <iframe
            src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7436928497408880640?collapsed=1"
            width="100%"
            height="450"
            frameBorder="0"
            allowFullScreen
            title="LinkedIn post – ARF access control agent"
            loading="lazy"
            className="mx-auto"
            style={{ display: 'block', height: '450px' }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        ) : (
          <div className="h-[450px] flex items-center justify-center text-gray-400">
            <div className="animate-pulse">Loading LinkedIn post …</div>
          </div>
        )}
      </div>
    </div>
  );
}
