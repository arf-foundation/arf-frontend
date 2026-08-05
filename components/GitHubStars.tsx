'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

export default function GitHubStars() {
  const repoName = 'arf-spec';
  const [stars, setStars] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);

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
        // Was setStars(0) on any failure, including the 404 that arf-spec
        // being private currently causes unconditionally (verified: `gh
        // repo view arf-foundation/arf-spec` shows private) -- that showed
        // a confident, specific, wrong number instead of "we don't know."
        // Not changing the target repo: this component's own tooltip
        // implies arf-spec is meant to be the public counterpart to the
        // access-controlled core engine, which reads as a repo-visibility
        // decision for whoever owns that, not something to guess a
        // different repo name for.
        console.error('Failed to fetch GitHub stars:', err);
        setStars(null);
        setUnavailable(true);
      });
  }, [repoName]);

  return (
    <a
      href="https://github.com/arf-foundation/arf-spec"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-sm min-w-[70px] justify-center"
      title="Stars for the public specification – the core engine is access-controlled and proprietary"
    >
      <Star size={14} className="fill-yellow-400 text-yellow-400" />
      <span className="min-w-[40px] text-left">
        {unavailable ? (
          <span aria-label="Star count unavailable">—</span>
        ) : stars !== null ? (
          stars.toLocaleString()
        ) : (
          <span className="inline-block w-10 h-4 bg-gray-700 animate-pulse rounded" />
        )}
      </span>
    </a>
  );
}
