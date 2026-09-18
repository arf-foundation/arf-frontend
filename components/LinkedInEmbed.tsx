'use client';

// Was importing the root-level hooks/useInView.ts, which has no `once`
// support and never unobserves -- this component worked around that by
// hand-rolling its own "only load once" tracking via a ref plus a second
// piece of state kept in sync via an effect (which also fails this repo's
// react-hooks/set-state-in-effect lint rule). app/hooks/useInView.ts (what
// every other component in this app actually uses) has `once` built in and
// unobserves itself once triggered, so `inView` itself -- once true, it
// stays true -- already is the "should load" signal; no separate state or
// effect needed at all.
import { useInView } from '../app/hooks/useInView';

export default function LinkedInEmbed() {
  const { ref: rawRef, inView } = useInView({ threshold: 0.1, once: true });
  const ref = rawRef as React.RefObject<HTMLDivElement>;

  return (
    <div ref={ref} className="flex justify-center">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-800/50 p-4" style={{ minHeight: '500px' }}>
        {inView ? (
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
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
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
