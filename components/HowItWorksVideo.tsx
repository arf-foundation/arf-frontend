"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/**
 * A 30-second silent loop of one governed write, recorded from a real run of
 * the ONTAP MCP admission proxy against a simulated cluster.
 *
 * - Nothing loads until the frame is near the viewport (preload="none" plus
 *   IntersectionObserver), so it never competes with the hero for LCP.
 * - A fixed 16:9 box means no layout shift when the video arrives.
 * - With prefers-reduced-motion it shows the poster and a play button instead
 *   of autoplaying.
 * - The visually hidden transcript carries the same content for screen readers.
 */
export default function HowItWorksVideo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  // Server render assumes motion is allowed; nothing plays before hydration anyway.
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !near || reduced) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [near, reduced]);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  return (
    <figure className="m-0">
      <div
        ref={boxRef}
        className="relative w-full overflow-hidden rounded-[14px] border border-[color:var(--color-arf-line)] bg-[color:var(--color-arf-canvas)]"
        style={{ aspectRatio: "16 / 9" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full"
          muted
          loop
          playsInline
          preload="none"
          poster="/media/arf-how-it-works-poster.webp"
          aria-describedby="how-it-works-transcript"
        >
          {near && <source src="/media/arf-how-it-works.webm" type="video/webm" />}
          {near && <source src="/media/arf-how-it-works.mp4" type="video/mp4" />}
        </video>
        {reduced && !playing && (
          <button
            type="button"
            onClick={play}
            className="arf-btn-secondary absolute bottom-4 left-4"
          >
            Play the 30-second walkthrough
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-[14.5px] leading-[1.6] text-[color:var(--text-secondary)]">
        A recorded run against a simulated ONTAP cluster. Every value shown comes from the run&apos;s output.
      </figcaption>
      <div id="how-it-works-transcript" className="sr-only">
        An AI agent asks to delete the production volume app_data. ARF records the attempt
        before anything runs, then holds the delete until a storage admin approves it; the
        agent cannot approve its own request. The approval names app_data only, so a delete of
        another volume waits again. Once approved, the delete runs and an independent read
        confirms the volume is gone. A delete ARF cannot model, delete_lun, is refused and never
        forwarded: zero upstream calls. Every step is a signed, hash-chained record, and editing
        any entry afterwards makes the chain fail verification.
      </div>
    </figure>
  );
}
