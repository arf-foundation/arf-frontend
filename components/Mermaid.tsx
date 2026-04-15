'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize Mermaid once with dark theme and secure settings
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  flowchart: { useMaxWidth: true },
});

export default function Mermaid({ chart, className = "" }: { chart: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!ref.current) return;
      // Avoid re‑rendering if already done and chart hasn't changed
      if (rendered.current) return;
      try {
        // Clear any existing content
        ref.current.innerHTML = '';
        // Render the diagram
        const { svg } = await mermaid.render('mermaid-diagram', chart);
        ref.current.innerHTML = svg;
        rendered.current = true;
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        ref.current.innerHTML = '<div class="text-red-400 p-4">Failed to render diagram</div>';
      }
    };
    renderDiagram();
  }, [chart]);

  return <div ref={ref} className={className} />;
}
