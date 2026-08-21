"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

/* startViewTransition isn't yet in the lib.dom.d.ts this project ships --
   guarded with a runtime `in` check rather than augmenting the global type. */
type DocumentWithViewTransitions = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    finished: Promise<void>;
  };
};

/**
 * Every route change on this site was a hard cut -- no transition anywhere
 * in the App Router setup, confirmed by grep against layout.tsx before this
 * existed. This wraps {children} in RootLayout with a cross-fade + rise:
 * the native View Transitions API where supported (Chromium/Edge today),
 * degrading to a CSS keyframe fallback (arf-route-fade in globals.css)
 * everywhere else -- not a no-op fallback, a real one, just a different
 * mechanism. Both respect prefers-reduced-motion the same way the rest of
 * the site's motion does (globally, in globals.css).
 */
export default function RouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [supportsViewTransitions] = useState(
    () => typeof document !== "undefined" && "startViewTransition" in document,
  );
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Without View Transitions, the CSS-fallback render path below uses
    // `children` directly (keyed by pathname, animates in on mount by
    // itself) -- displayChildren only exists for the VT path, which needs
    // to hold the OLD content until the callback below swaps it.
    if (!supportsViewTransitions) return;

    if (prevPathname.current === pathname) {
      // Same route, content changed for some other reason (e.g. client
      // state up the tree) -- sync without transitioning. The cross-fade is
      // for navigation, not every re-render.
      setDisplayChildren(children);
      return;
    }
    prevPathname.current = pathname;

    const doc = document as DocumentWithViewTransitions;
    const transition = doc.startViewTransition?.(() => {
      // flushSync, not the plain setState this project uses everywhere
      // else: the View Transitions API snapshots the DOM synchronously
      // right after this callback returns. React's default batching
      // defers the actual DOM write, so without flushSync the browser
      // captures its "after" snapshot before React has painted anything --
      // the exact cause of the InvalidStateError this threw during testing.
      flushSync(() => {
        setDisplayChildren(children);
      });
    });
    // A transition already in flight (a fast second navigation before the
    // first finishes) makes the browser reject with InvalidStateError. The
    // callback above still ran and state is already correct either way;
    // this only stops that rejection surfacing as an unhandled promise
    // rejection in the console. All three promises are independent and can
    // each reject on their own -- catching only one still leaves the others
    // unhandled.
    transition?.ready.catch(() => {});
    transition?.updateCallbackDone.catch(() => {});
    transition?.finished.catch(() => {});
  }, [pathname, children, supportsViewTransitions]);

  if (supportsViewTransitions) {
    return <>{displayChildren}</>;
  }
  return (
    <div key={pathname} className="arf-route-fade">
      {children}
    </div>
  );
}
