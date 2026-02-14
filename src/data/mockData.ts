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
  { id: "us-east-1", name: "US East 1", country: "US" },
  { id: "us-east-2", name: "US East 2", country: "US" },
  { id: "us-west-1", name: "US West 1", country: "US" },
  { id: "us-west-2", name: "US West 2", country: "US" },
  { id: "ca-central-1", name: "Canada Central 1", country: "CA" },
  { id: "eu-central-1", name: "EU Central 1", country: "EU" },
  { id: "eu-west-1", name: "EU West 1", country: "EU" },
  { id: "eu-west-2", name: "EU West 2", country: "EU" },
  { id: "eu-west-3", name: "EU West 3", country: "EU" },
  { id: "eu-north-1", name: "EU North 1", country: "EU" },
  { id: "eu-south-1", name: "EU South 1", country: "EU" },
  { id: "ap-south-1", name: "AP South 1", country: "IN" },
  { id: "ap-south-2", name: "AP South 2", country: "IN" },
  { id: "ap-southeast-1", name: "AP Southeast 1", country: "SG" },
  { id: "ap-southeast-2", name: "AP Southeast 2", country: "AU" },
  { id: "ap-southeast-3", name: "AP Southeast 3", country: "ID" },
  { id: "ap-northeast-1", name: "AP Northeast 1", country: "JP" },
  { id: "ap-northeast-2", name: "AP Northeast 2", country: "KR" },
  { id: "ap-northeast-3", name: "AP Northeast 3", country: "JP" },
  { id: "me-south-1", name: "Middle East South 1", country: "BH" },
  { id: "af-south-1", name: "Africa South 1", country: "ZA" },
  { id: "sa-east-1", name: "South America East 1", country: "BR" },
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
