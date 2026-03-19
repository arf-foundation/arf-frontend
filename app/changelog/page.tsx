'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Calendar, Tag } from 'lucide-react';

// Types for GitHub release data
interface GitHubRelease {
  repo: string;
  name: string;
  tag_name: string;
  published_at: string;
  body: string;
  html_url: string;
}

interface CachedData {
  releases: GitHubRelease[];
  timestamp: number;
}

const REPOS = [
  'agentic-reliability-framework',
  'arf-api',
  'arf-frontend'
] as const;

const CACHE_KEY = 'arf-changelog';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export default function ChangelogPage() {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllReleases = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { releases, timestamp }: CachedData = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setReleases(releases);
            setLoading(false);
            return;
          }
        }

        // Fetch from all repos in parallel
        const results = await Promise.allSettled(
          REPOS.map(async (repo) => {
            const response = await fetch(`https://api.github.com/repos/arf-foundation/${repo}/releases`);
            if (!response.ok) throw new Error(`Failed to fetch ${repo} releases`);
            const data = await response.json();
            // Map to our format
            return data.map((release: any) => ({
              repo,
              name: release.name || release.tag_name,
              tag_name: release.tag_name,
              published_at: release.published_at,
              body: release.body || '',
              html_url: release.html_url,
            }));
          })
        );

        // Combine successful results
        const allReleases: GitHubRelease[] = [];
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            allReleases.push(...result.value);
          } else {
            console.error(result.reason);
          }
        });

        // Sort by date descending
        allReleases.sort((a, b) => 
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );

        // Cache and set state
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          releases: allReleases,
          timestamp: Date.now(),
        }));
        setReleases(allReleases);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load releases');
      } finally {
        setLoading(false);
      }
    };

    fetchAllReleases();
  }, []);

  // Helper to truncate release body
  const truncateBody = (body: string, maxLength = 250) => {
    if (body.length <= maxLength) return body;
    return body.slice(0, maxLength).replace(/\n/g, ' ') + '…';
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper to get repo display name
  const getRepoDisplay = (repo: string) => {
    switch (repo) {
      case 'agentic-reliability-framework': return 'Core Engine';
      case 'arf-api': return 'API';
      case 'arf-frontend': return 'Frontend';
      default: return repo;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Changelog</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Changelog</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
            <p>Error loading releases: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Changelog</h1>
        <p className="text-gray-600 mb-8">
          Latest releases from across the ARF ecosystem.
        </p>

        {releases.length === 0 ? (
          <p className="text-gray-500">No releases found.</p>
        ) : (
          <div className="space-y-6">
            {releases.map((release, idx) => (
              <div
                key={`${release.repo}-${release.tag_name}-${idx}`}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {getRepoDisplay(release.repo)}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Tag size={14} />
                      {release.tag_name}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(release.published_at)}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {release.name}
                </h2>

                <p className="text-gray-600 mb-4">
                  {truncateBody(release.body)}
                </p>

                <a
                  href={release.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  View on GitHub <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
