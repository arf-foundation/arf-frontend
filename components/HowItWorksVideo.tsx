'use client';

import { useSyncExternalStore } from 'react';

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

const darkTheme = () => document.documentElement.classList.contains('dark');
const serverTheme = () => false;

export default function HowItWorksVideo() {
  const dark = useSyncExternalStore(subscribeTheme, darkTheme, serverTheme);
  const clip = dark ? '/media/arf-how-it-works-dark' : '/media/arf-how-it-works';

  return (
    <figure className="m-0 min-w-0">
      <video
        key={clip}
        className="aspect-video w-full rounded-xl bg-arf-dark object-contain"
        controls
        muted
        playsInline
        preload="none"
        poster={`${clip}-poster.webp`}
        aria-label="Approval and readback on a simulated ONTAP cluster"
        aria-describedby="how-it-works-transcript"
      >
        <source src={`${clip}.webm`} type="video/webm" />
        <source src={`${clip}.mp4`} type="video/mp4" />
      </video>
      <figcaption className="mt-2 text-sm text-[color:var(--text-secondary)]">
        Silent walkthrough recorded against a simulated ONTAP cluster.
      </figcaption>
      <p id="how-it-works-transcript" className="sr-only">
        ARF records a proposed deletion of app_data and holds it for approval.
        The approved call is scoped to app_data. A separate read checks the result.
        The unmodeled delete_lun call is refused without forwarding it.
      </p>
    </figure>
  );
}
