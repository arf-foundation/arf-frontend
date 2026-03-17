// components/GitHubStars.tsx
'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

export default function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem('github-stars');
    const cachedTime = localStorage.getItem('github-stars-time');
    const now = Date.now();

    // Use cache if less than 1 hour old
    if (cached && cachedTime && now - parseInt(cachedTime) < 3600000) {
      setStars(parseInt(cached));
      return;
    }

    fetch('https://api.github.com/repos/arf-foundation/agentic-reliability-framework')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
          localStorage.setItem('github-stars', data.stargazers_count.toString());
          localStorage.setItem('github-stars-time', now.toString());
        }
      })
      .catch(err => console.error('Failed to fetch GitHub stars:', err));
  }, []);

  if (!stars) return null;

  return (
    <a
      href="https://github.com/arf-foundation/agentic-reliability-framework"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white bg-gray-800 px-3 py-1 rounded-full border border-gray-700 transition"
    >
      <Star size={16} className="fill-yellow-400 text-yellow-400" />
      <span>{stars.toLocaleString()}</span>
    </a>
  );
}
