'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

export default function GitHubStars() {
  const repoName = 'arf-spec';
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    // Try to read from cache first
    const cacheKey = `github-stars-${repoName}`;
    const cached = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(`${cacheKey}-time`);
    const now = Date.now();

    if (cached && cachedTime && now - parseInt(cachedTime) < 3600000) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStars(JSON.parse(cached));
      return;
    }

    // No valid cache – fetch from GitHub
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
        setStars(0);
      });
  }, [repoName]);

  return (
    <a
      href="https://github.com/arf-foundation/arf-spec"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-sm min-w-[70px] justify-center"
      title="Stars for the public specification – the core engine is not open source"
    >
      <Star size={14} className="fill-yellow-400 text-yellow-400" />
      <span className="min-w-[40px] text-left">
        {stars !== null ? (
          stars.toLocaleString()
        ) : (
          <span className="inline-block w-10 h-4 bg-gray-700 animate-pulse rounded" />
        )}
      </span>
    </a>
  );
}
