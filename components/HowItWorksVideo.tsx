"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
// The site's theme is a `dark` class on <html> (set before paint in layout.tsx,
// toggled by NavBar), not prefers-color-scheme, so follow the class itself.
const subscribeDark = (onChange: () => void) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};
const isDark = () => document.documentElement.classList.contains("dark");

/**
 * A 30-second silent loop of one governed write, recorded from a real run of
 * the ONTAP MCP admission proxy against a simulated cluster.
 *
 * - Neither the poster nor the clip is requested until the frame is within
 *   300px of the viewport (IntersectionObserver; poster and sources both wait
 *   for it, and preload="none"). Before that, the box is an empty 16:9 panel.
 * - A fixed 16:9 box means no layout shift when the video arrives.
 * - With prefers-reduced-motion it shows the poster and a play button instead
 *   of autoplaying. While it plays, a Pause button is always available
 *   (WCAG 2.2.2: moving content that starts by itself must be stoppable).
 * - The clip and poster follow the site theme: a light and a dark render of the
 *   same timeline (scripts/video, ?theme=dark).
 * - The visually hidden transcript carries the same content for screen readers.
 */
export default function HowItWorksVideo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  // Server render assumes motion is allowed and the light theme; nothing plays
  // before hydration anyway.
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const dark = useSyncExternalStore(subscribeDark, isDark, () => false);
  const [playing, setPlaying] = useState(false);
  const [pausedByVisitor, setPausedByVisitor] = useState(false);
  // What the visitor last asked for, read by the effect below. "auto" follows
  // reduced motion. A ref, so a click does not re-run the effect's load().
  const intent = useRef<"auto" | "play" | "pause">("auto");
  const clip = dark ? "/media/arf-how-it-works-dark" : "/media/arf-how-it-works";

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
    if (!v || !near) return;
    // Changing a <source> src on an element that has already chosen a resource
    // does nothing until load(): without it, a theme switch keeps the old clip.
    v.load();
    const wanted = intent.current === "play" || (intent.current === "auto" && !reduced);
    if (wanted) v.play().catch(() => {});
  }, [near, dark, reduced]);

  const play = () => {
    intent.current = "play";
    setPausedByVisitor(false);
    videoRef.current?.play().catch(() => {});
  };
  const pause = () => {
    intent.current = "pause";
    setPausedByVisitor(true);
    videoRef.current?.pause();
  };

  return (
    <figure className="m-0">
      <div
        ref={boxRef}
        className="relative w-full overflow-hidden rounded-[14px] border border-[color:var(--hairline)] bg-[color:var(--surface-canvas)]"
        style={{ aspectRatio: "16 / 9" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full"
          muted
          loop
          playsInline
          preload="none"
          // A poster attribute is fetched as soon as it is set, whatever preload
          // says, so it waits for `near` too. By then the theme is the client's:
          // only the matching poster is ever requested.
          poster={near ? `${clip}-poster.webp` : undefined}
          aria-describedby="how-it-works-transcript"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {near && <source src={`${clip}.webm`} type="video/webm" />}
          {near && <source src={`${clip}.mp4`} type="video/mp4" />}
        </video>
        {reduced && !playing && !pausedByVisitor && (
          <button
            type="button"
            onClick={play}
            className="arf-btn-secondary absolute bottom-4 left-4"
          >
            Play the 30-second walkthrough
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-start justify-between gap-x-6 gap-y-2 text-[14.5px] leading-[1.6] text-[color:var(--text-secondary)]">
        <span>
          A recorded run against a simulated ONTAP cluster. Every value shown comes from the run&apos;s output.
        </span>
        {near && (
          <button
            type="button"
            onClick={playing ? pause : play}
            aria-label={playing ? "Pause the walkthrough video" : "Play the walkthrough video"}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--hairline)] px-3 py-1 text-[13px] font-medium text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
          >
            {playing ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
            {playing ? "Pause" : "Play"}
          </button>
        )}
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
