import {
  Plan,
  Organization,
  Repository,
  Branch,
  Region,
  Framework,
  DatabaseType,
} from "../types";

export const mockPlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    storage: "10 GB",
    bandwidth: "10 GB",
    memory: "1024 MB",
    cpu: "1 vCPU",
    monthlyCost: "$0",
    pricePerHour: "$0",
    description: "Ideal for personal blogs and small websites",
  },
  {
    id: "pro",
    name: "Pro",
    storage: "50 GB",
    bandwidth: "100 GB",
    memory: "4096 MB",
    cpu: "2 vCPU",
    monthlyCost: "$29",
    pricePerHour: "$0.04",
    description: "Perfect for growing businesses and applications",
  },
];

export const mockOrganizations: Organization[] = [
  {
    id: "org1",
    name: "Adith Narein T",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adith",
  },
  {
    id: "org2",
    name: "Acme Corp",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Acme",
  },
  {
    id: "org3",
    name: "Tech Startup",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
  },
];

export const mockRepositories: Repository[] = [
  { id: "repo1", name: "Kuberns Page", organizationId: "org1" },
  { id: "repo2", name: "My Awesome App", organizationId: "org1" },
  { id: "repo3", name: "Project Alpha", organizationId: "org2" },
  { id: "repo4", name: "Web Dashboard", organizationId: "org2" },
  { id: "repo5", name: "API Server", organizationId: "org3" },
];

export const mockBranches: Branch[] = [
  { id: "branch1", name: "main", repositoryId: "repo1" },
  { id: "branch2", name: "develop", repositoryId: "repo1" },
  { id: "branch3", name: "feature/new-ui", repositoryId: "repo1" },
  { id: "branch4", name: "main", repositoryId: "repo2" },
  { id: "branch5", name: "staging", repositoryId: "repo2" },
];

export const mockRegions: Region[] = [
  { id: "us-east-1", name: "N. Virginia", country: "US" },
  { id: "us-east-2", name: "Ohio", country: "US" },
  { id: "us-west-1", name: "N. California", country: "US" },
  { id: "us-west-2", name: "Oregon", country: "US" },
  { id: "ca-central-1", name: "Central", country: "CA" },
  { id: "eu-central-1", name: "Frankfurt", country: "DE" },
  { id: "eu-west-1", name: "Ireland", country: "IE" },
  { id: "eu-west-2", name: "London", country: "GB" },
  { id: "eu-west-3", name: "Paris", country: "FR" },
  { id: "eu-north-1", name: "Stockholm", country: "SE" },
  { id: "ap-south-1", name: "Mumbai", country: "IN" },
  { id: "ap-southeast-1", name: "Singapore", country: "SG" },
  { id: "ap-southeast-2", name: "Sydney", country: "AU" },
  { id: "ap-northeast-1", name: "Tokyo", country: "JP" },
  { id: "ap-northeast-2", name: "Seoul", country: "KR" },
  { id: "ap-northeast-3", name: "Osaka", country: "JP" },
  { id: "sa-east-1", name: "Sao Paulo", country: "BR" },
];

export const mockFrameworks: Framework[] = [
  { id: "react", name: "React" },
  { id: "vue", name: "Vue.js" },
  { id: "node", name: "Node.js" },
  { id: "next", name: "Next.js" },
  { id: "angular", name: "Angular" },
  { id: "svelte", name: "Svelte" },
];

export const mockDatabaseTypes: DatabaseType[] = [
  { id: "postgresql", name: "PostgreSQL" },
  { id: "mysql", name: "MySQL" },
  { id: "mongodb", name: "MongoDB" },
];
