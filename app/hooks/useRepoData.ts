// hooks/useRepoData.ts
import { useEffect, useState } from 'react';

interface RepoData {
  stargazers_count: number;
  language: string | null;
}

export function useRepoData(repoName: string | undefined) {
  const [data, setData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!repoName) return;

    const fetchData = async () => {
      setLoading(true);
      const cached = localStorage.getItem(`github-${repoName}`);
      const cachedTime = localStorage.getItem(`github-${repoName}-time`);
      const now = Date.now();

      if (cached && cachedTime && now - parseInt(cachedTime) < 3600000) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://api.github.com/repos/arf-foundation/${repoName}`);
        const result = await response.json();
        if (result.stargazers_count !== undefined) {
          const newData = {
            stargazers_count: result.stargazers_count,
            language: result.language
          };
          setData(newData);
          localStorage.setItem(`github-${repoName}`, JSON.stringify(newData));
          localStorage.setItem(`github-${repoName}-time`, now.toString());
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repoName]);

  return { data, loading, error };
}
