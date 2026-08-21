// hooks/useAnimatedNumber.ts
import { useEffect, useRef, useState } from "react";

/** Tweens from the previous value to a new one whenever `value` changes --
 * the dashboard's counterpart to useCountUp (which fires once on scroll into
 * view against a fixed target). Dashboard numbers refresh in place while
 * already visible, so what needs animating is the delta on change, not an
 * entrance. Under prefers-reduced-motion returns `value` directly, bypassing
 * the tween entirely. That flag lives in state (lazy-initialized, checked
 * once at mount), not a ref -- refs can't be read during render here. */
export function useAnimatedNumber(value: number, duration = 500) {
  const [prefersReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prefersReduced) {
      prevRef.current = value;
      return;
    }

    const from = prevRef.current;
    const to = value;
    if (from === to) return;

    let raf: number;
    let startTime: number | null = null;

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevRef.current = to;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, prefersReduced]);

  return prefersReduced ? value : display;
}
