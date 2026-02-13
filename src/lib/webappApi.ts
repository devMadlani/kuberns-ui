const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

export type CreateWebAppRequest = {
  name: string;
  region: string;
  plan: string;
  framework: string;
  repository: {
    provider: string;
    owner: string;
    repo: string;
    branch: string;
  };
  port: number;
  envVars: Array<{ key: string; value: string }>;
};

export type CreateWebAppResponse = {
  webAppId: string;
  deploymentId: string;
  status: 'pending';
};

export type WebAppListItem = {
  id: string;
  name: string;
  region: string;
  plan: string;
  framework: string;
  repoProvider: string;
  repoOwner: string;
  repoName: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
};

export type WebAppDetail = WebAppListItem & {
  environments: unknown[];
  deployments: unknown[];
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message?: unknown }).message ?? 'Request failed')
        : 'Request failed';
    throw new Error(message);
  }

  return payload as T;
};

export const webappApi = {
  createWebApp: async (input: CreateWebAppRequest): Promise<CreateWebAppResponse> => {
    return request<CreateWebAppResponse>('/api/webapps', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  listWebApps: async (): Promise<WebAppListItem[]> => {
    return request<WebAppListItem[]>('/api/webapps', { method: 'GET' });
  },

  getWebApp: async (id: string): Promise<WebAppDetail> => {
    return request<WebAppDetail>(`/api/webapps/${id}`, { method: 'GET' });
  },
};
