// hooks/useCountUp.ts
import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  /** Animation only begins once this flips true (pair with useInView). */
  start?: boolean;
  duration?: number;
}

/** Ease-out count from 0 to `target`, triggered once `start` is true. No
 * library -- requestAnimationFrame plus a cubic ease-out. Returns `target`
 * directly under prefers-reduced-motion (checked once, at mount -- it
 * doesn't change mid-session) instead of animating. That flag lives in state
 * (lazy-initialized), not a ref: refs can't be read during render here, only
 * inside effects/handlers. */
export function useCountUp(target: number, options: UseCountUpOptions = {}) {
  const { start = false, duration = 900 } = options;
  const [prefersReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current || prefersReduced) return;
    startedRef.current = true;

    let raf: number;
    let startTime: number | null = null;

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, prefersReduced]);

  return prefersReduced ? target : value;
}
