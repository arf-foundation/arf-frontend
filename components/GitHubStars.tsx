'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

export default function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/arf-foundation/arf-frontend')
      .then(res => res.json())
      .then(data => setStars(data.stargazers_count))
      .catch(err => console.error('Failed to fetch stars:', err));
  }, []);

  if (stars === null) return null;
  return (
    <a
      href="https://github.com/arf-foundation/arf-frontend"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-sm"
    >
      <Star size={14} className="fill-yellow-400 text-yellow-400" />
      <span>{stars.toLocaleString()}</span>
    </a>
  );
}
