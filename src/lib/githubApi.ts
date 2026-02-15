import { ApiResponse, Branch, Organization, Repository } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? 'Request failed');
  }

  return payload.data;
};

const request = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
  });

  return parseJsonResponse<T>(response);
};

export const githubApi = {
  getOAuthUrl: async (): Promise<{ url: string }> => {
    return request<{ url: string }>('/git/github/oauth/url');
  },

  completeOAuth: async (code: string): Promise<{ githubId: string; githubUsername: string }> => {
    return request<{ githubId: string; githubUsername: string }>(
      `/git/github/callback?code=${encodeURIComponent(code)}`,
    );
  },

  getOrganizations: async (): Promise<Organization[]> => {
    const orgs = await request<Array<{ id: number; login: string; avatar_url: string }>>(
      '/git/github/orgs',
    );

    return orgs.map((org) => ({
      id: org.login,
      name: org.login,
      avatar: org.avatar_url,
    }));
  },

  getRepositories: async (org: string | undefined): Promise<Repository[]> => {
    const query = org ? `?org=${encodeURIComponent(org)}` : '';
    const repos = await request<Array<{ name: string; full_name: string }>>(
      `/git/github/repos${query}`,
    );

    return repos.map((repo) => {
      const [owner, repoName] = repo.full_name.split('/');

      return {
        id: repo.full_name,
        name: repo.name,
        organizationId: org ?? '__personal__',
        owner,
        repoName,
      };
    });
  },

  getBranches: async (owner: string, repo: string): Promise<Branch[]> => {
    const branches = await request<Array<{ name: string }>>(
      `/git/github/branches?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
    );

    return branches.map((branch) => ({
      id: branch.name,
      name: branch.name,
      repositoryId: `${owner}/${repo}`,
    }));
  },
};
