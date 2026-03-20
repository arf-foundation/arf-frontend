'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Calendar, Tag, ArrowRight, Copy, Check, Github, Rocket, Code } from 'lucide-react';

// Types for GitHub release data
interface GitHubRelease {
  repo: string;
  name: string;
  tag_name: string;
  published_at: string;
  body: string;
  html_url: string;
}

interface GitHubApiRelease {
  name: string | null;
  tag_name: string;
  published_at: string;
  body: string | null;
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
  const [copiedCode, setCopiedCode] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Agentic Reliability Framework (ARF) – AI Reliability & Self‑Healing Control Plane";
  }, []);

  const copyCode = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

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
            const data: GitHubApiRelease[] = await response.json();
            return data.map((release) => ({
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

  const truncateBody = (body: string, maxLength = 250) => {
    if (body.length <= maxLength) return body;
    return body.slice(0, maxLength).replace(/\n/g, ' ') + '…';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Agentic Reliability Framework (ARF) – AI Reliability & Self‑Healing Control Plane
            </h1>
            <div className="animate-pulse space-y-4 mt-8">
              <div className="h-8 bg-gray-700 rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Agentic Reliability Framework (ARF) – AI Reliability & Self‑Healing Control Plane
            </h1>
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 mt-8">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero / Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Agentic Reliability Framework (ARF) – AI Reliability & Self‑Healing Control Plane
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              v4.2.0 – Bayesian governance for auditable, self‑healing AI systems
            </p>
          </div>

          {/* Problem‑Solution‑Outcome */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-red-400 font-bold text-xl mb-2">⚠️ Problem</div>
                <p className="text-gray-300">Most AI systems fail silently in production.</p>
              </div>
              <div>
                <div className="text-green-400 font-bold text-xl mb-2">🔧 Solution</div>
                <p className="text-gray-300">ARF turns probabilistic AI into deterministic, auditable action.</p>
              </div>
              <div>
                <div className="text-blue-400 font-bold text-xl mb-2">📈 Outcome</div>
                <p className="text-gray-300">Reduce MTTR by up to 85% with self‑healing systems.</p>
              </div>
            </div>
          </div>

          {/* CTA Block */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a
              href="https://a-r-f-agentic-reliability-framework-api.hf.space/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              API Docs <ArrowRight size={18} />
            </a>
            <a
              href="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-v4"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
            >
              Live Demo <Rocket size={18} />
            </a>
            <a
              href="https://github.com/arf-foundation/agentic-reliability-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center gap-2"
            >
              GitHub <Github size={18} />
            </a>
            <a
              href="https://calendly.com/petter2025us/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-white transition flex items-center gap-2"
            >
              Book a Call <Calendar size={18} />
            </a>
          </div>

          {/* Diagram */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-center">How ARF Works</h2>
            <div className="overflow-x-auto">
              <pre className="text-sm text-left text-gray-300 font-mono">
{`flowchart TD
    subgraph Input["🔌 Input Sources"]
        Services[Agents / Services]
        Metrics[Metrics / Logs]
    end

    Services --> Signals[Observability Signals]
    Metrics --> Signals

    Signals --> Interpreter[ARF Reliability Interpreter]
    
    subgraph Engine["⚙️ ARF Core Engine"]
        Interpreter --> Risk[Bayesian Risk Engine]
        Risk --> Intent[Healing Intent Engine]
    end
    
    Intent --> Recovery[Recovery Actions]
    
    style Interpreter fill:#e1f5fe,stroke:#01579b
    style Risk fill:#fff3e0,stroke:#e65100
    style Intent fill:#e8f5e8,stroke:#1b5e20`}
              </pre>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">(Mermaid diagram – view source for rendered version)</p>
          </div>

          {/* Code Snippet */}
          <div className="bg-gray-800 rounded-lg p-6 mb-12 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Try It Now</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg">
                <pre className="text-sm font-mono text-green-300 flex-1 overflow-x-auto whitespace-pre-wrap break-all">
                  curl -X POST https://a-r-f-agentic-reliability-framework-api.hf.space/api/v1/incidents/evaluate \
                    -H "Content-Type: application/json" \
                    -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'
                </pre>
                <button
                  onClick={() => copyCode('curl -X POST https://a-r-f-agentic-reliability-framework-api.hf.space/api/v1/incidents/evaluate -H "Content-Type: application/json" -d \'{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}\'')}
                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                  aria-label="Copy code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
                </button>
              </div>
              <p className="text-sm text-gray-400">
                Returns a full <span className="font-mono">HealingIntent</span> with risk score, risk factors, and recommended action.
              </p>
            </div>
          </div>

          {/* Changelog Header */}
          <div className="border-b border-gray-700 pb-4 mb-6">
            <h2 className="text-2xl font-bold">Latest Releases</h2>
            <p className="text-gray-400">From the ARF ecosystem – Core Engine, API, and Frontend</p>
          </div>

          {/* Release List */}
          {releases.length === 0 ? (
            <p className="text-gray-500">No releases found.</p>
          ) : (
            <div className="space-y-6">
              {releases.map((release, idx) => (
                <div
                  key={`${release.repo}-${release.tag_name}-${idx}`}
                  className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-700"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm font-medium">
                        {getRepoDisplay(release.repo)}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Tag size={14} />
                        {release.tag_name}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(release.published_at)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {release.name}
                  </h3>

                  <p className="text-gray-300 mb-4">
                    {truncateBody(release.body)}
                  </p>

                  <a
                    href={release.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition"
                  >
                    View on GitHub <ExternalLink size={16} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
