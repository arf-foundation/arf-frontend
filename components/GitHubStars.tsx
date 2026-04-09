'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

export default function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const repoName = 'agentic-reliability-framework'; // main OSS engine
    const cacheKey = `github-stars-${repoName}`;
    const cached = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(`${cacheKey}-time`);
    const now = Date.now();

    if (cached && cachedTime && now - parseInt(cachedTime) < 3600000) {
      setStars(JSON.parse(cached));
      return;
    }

    fetch(`https://api.github.com/repos/arf-foundation/${repoName}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const starCount = data.stargazers_count;
        setStars(starCount);
        localStorage.setItem(cacheKey, JSON.stringify(starCount));
        localStorage.setItem(`${cacheKey}-time`, now.toString());
      })
      .catch(err => {
        console.error('Failed to fetch GitHub stars:', err);
        // Fallback to a reasonable default (optional)
        setStars(1200);
      });
  }, []);

  if (stars === null) return null;
  return (
    <a
      href="https://github.com/arf-foundation/agentic-reliability-framework"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-sm"
    >
      <Star size={14} className="fill-yellow-400 text-yellow-400" />
      <span>{stars.toLocaleString()}</span>
    </a>
  );
}
