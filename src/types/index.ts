export interface Plan {
  id: string;
  name: string;
  storage: string;
  bandwidth: string;
  memory: string;
  cpu: string;
  monthlyCost: string;
  pricePerHour: string;
  description: string;
}

export interface Organization {
  id: string;
  name: string;
  avatar?: string;
}

export interface Repository {
  id: string;
  name: string;
  organizationId: string;
  owner?: string;
  repoName?: string;
}

export interface Branch {
  id: string;
  name: string;
  repositoryId: string;
}

export interface Region {
  id: string;
  name: string;
  country: string;
}

export interface Framework {
  id: string;
  name: string;
  icon?: string;
}

export interface DatabaseType {
  id: string;
  name: string;
  icon?: string;
}

export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
}

export interface AppFormData {
  githubConnected: boolean;
  gitlabConnected: boolean;
  githubUserId: string;
  githubUsername: string;
  organizationId: string;
  repositoryId: string;
  branchId: string;

  appName: string;
  regionId: string;
  frameworkId: string;
  planId: string;

  databaseEnabled: boolean;
  databaseTypeId: string;

  portType: 'random' | 'custom';
  customPort: string;

  environmentVariables: EnvironmentVariable[];
}
