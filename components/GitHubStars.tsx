'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

// Helper to get cached stars (runs only once during initial render)
const getCachedStars = (repoName: string): number | null => {
  if (typeof window === 'undefined') return null;
  const cacheKey = `github-stars-${repoName}`;
  const cached = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(`${cacheKey}-time`);
  const now = Date.now();
  if (cached && cachedTime && now - parseInt(cachedTime) < 3600000) {
    return JSON.parse(cached);
  }
  return null;
};

export default function GitHubStars() {
  const repoName = 'arf-spec';
  const [stars, setStars] = useState<number | null>(() => getCachedStars(repoName));

  useEffect(() => {
    // Only fetch if no valid cached stars
    if (stars !== null) return;

    fetch(`https://api.github.com/repos/arf-foundation/${repoName}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const starCount = data.stargazers_count;
        setStars(starCount);
        localStorage.setItem(`github-stars-${repoName}`, JSON.stringify(starCount));
        localStorage.setItem(`github-stars-${repoName}-time`, Date.now().toString());
      })
      .catch(err => {
        console.error('Failed to fetch GitHub stars:', err);
        setStars(0);
      });
  }, [stars, repoName]);

  if (stars === null) return null;
  return (
    <a
      href="https://github.com/arf-foundation/arf-spec"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-sm"
      title="Stars for the public specification – the core engine is not open source"
    >
      <Star size={14} className="fill-yellow-400 text-yellow-400" />
      <span>{stars.toLocaleString()}</span>
    </a>
  );
}
