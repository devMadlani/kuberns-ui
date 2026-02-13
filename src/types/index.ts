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
  // GitHub Connection
  githubConnected: boolean;
  gitlabConnected: boolean;
  organizationId: string;
  repositoryId: string;
  branchId: string;
  
  // App Details
  appName: string;
  regionId: string;
  frameworkId: string;
  planId: string;
  
  // Database
  databaseEnabled: boolean;
  databaseTypeId: string;
  
  // Port Configuration
  portType: 'random' | 'custom';
  customPort: string;
  
  // Environment Variables
  environmentVariables: EnvironmentVariable[];
}
