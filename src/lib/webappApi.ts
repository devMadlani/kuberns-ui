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

export type MetadataResponse = {
  regions: Array<{ id: string; name: string; country: string }>;
  frameworks: Array<{ id: string; name: string }>;
  databaseTypes: Array<{ id: string; name: string }>;
};

export type PlanResponse = {
  id: string;
  name: string;
  storage: string;
  bandwidth: string;
  memory: string;
  cpu: string;
  monthlyCost: string;
  pricePerHour: string;
  description: string;
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

export type InstanceSummary = {
  id: string;
  cpu: number;
  ram: number;
  storage: number;
  instanceType: string;
  publicIp?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type DeploymentSummary = {
  id: string;
  webAppId: string;
  environmentId: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
};

export type DeploymentLogEntry = {
  id: string;
  deploymentId: string;
  level: string;
  message: string;
  createdAt: string;
};

export type StartDeploymentResponse = {
  publicIp: string;
  status: 'active';
};

export type EnvironmentSummary = {
  id: string;
  webAppId: string;
  name: string;
  branch: string;
  port: number;
  envVars: Record<string, string>;
  status: string;
  createdAt: string;
  updatedAt: string;
  instance: InstanceSummary | null;
  deployments: DeploymentSummary[];
};

export type WebAppDetail = WebAppListItem & {
  environments: EnvironmentSummary[];
  deployments: DeploymentSummary[];
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

  startDeployment: async (deploymentId: string): Promise<StartDeploymentResponse> => {
    return request<StartDeploymentResponse>(`/api/deployments/${deploymentId}/start`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  getDeploymentLogs: async (deploymentId: string): Promise<DeploymentLogEntry[]> => {
    return request<DeploymentLogEntry[]>(`/api/deployments/${deploymentId}/logs`, {
      method: 'GET',
    });
  },

  getMetadata: async (): Promise<MetadataResponse> => {
    return request<MetadataResponse>('/api/metadata', { method: 'GET' });
  },

  getPlans: async (): Promise<PlanResponse[]> => {
    return request<PlanResponse[]>('/api/plans', { method: 'GET' });
  },
};
