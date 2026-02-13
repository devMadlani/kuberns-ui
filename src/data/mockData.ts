import { Plan, Organization, Repository, Branch, Region, Framework, DatabaseType } from '../types';

export const mockPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    storage: '10 GB',
    bandwidth: '10 GB',
    memory: '10 GB',
    cpu: '2 GB',
    monthlyCost: '₹0',
    pricePerHour: '₹0',
    description: 'Ideal for personal blogs and small websites',
  },
  {
    id: 'pro',
    name: 'Pro',
    storage: '50 GB',
    bandwidth: '100 GB',
    memory: '20 GB',
    cpu: '4 GB',
    monthlyCost: '₹999',
    pricePerHour: '₹1.5',
    description: 'Perfect for growing businesses and applications',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    storage: '200 GB',
    bandwidth: '500 GB',
    memory: '50 GB',
    cpu: '8 GB',
    monthlyCost: '₹2999',
    pricePerHour: '₹4.5',
    description: 'For large-scale applications and enterprises',
  },
];

export const mockOrganizations: Organization[] = [
  { id: 'org1', name: 'Adith Narein T', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adith' },
  { id: 'org2', name: 'Acme Corp', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Acme' },
  { id: 'org3', name: 'Tech Startup', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech' },
];

export const mockRepositories: Repository[] = [
  { id: 'repo1', name: 'Kuberns Page', organizationId: 'org1' },
  { id: 'repo2', name: 'My Awesome App', organizationId: 'org1' },
  { id: 'repo3', name: 'Project Alpha', organizationId: 'org2' },
  { id: 'repo4', name: 'Web Dashboard', organizationId: 'org2' },
  { id: 'repo5', name: 'API Server', organizationId: 'org3' },
];

export const mockBranches: Branch[] = [
  { id: 'branch1', name: 'main', repositoryId: 'repo1' },
  { id: 'branch2', name: 'develop', repositoryId: 'repo1' },
  { id: 'branch3', name: 'feature/new-ui', repositoryId: 'repo1' },
  { id: 'branch4', name: 'main', repositoryId: 'repo2' },
  { id: 'branch5', name: 'staging', repositoryId: 'repo2' },
];

export const mockRegions: Region[] = [
  { id: 'us-michigan', name: 'United States - Michigan', country: 'US' },
  { id: 'us-california', name: 'United States - California', country: 'US' },
  { id: 'eu-ireland', name: 'Europe - Ireland', country: 'EU' },
  { id: 'asia-singapore', name: 'Asia - Singapore', country: 'SG' },
  { id: 'asia-mumbai', name: 'Asia - Mumbai', country: 'IN' },
];

export const mockFrameworks: Framework[] = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue.js' },
  { id: 'node', name: 'Node.js' },
  { id: 'next', name: 'Next.js' },
  { id: 'angular', name: 'Angular' },
  { id: 'svelte', name: 'Svelte' },
];

export const mockDatabaseTypes: DatabaseType[] = [
  { id: 'postgresql', name: 'PostgreSQL' },
  { id: 'mysql', name: 'MySQL' },
  { id: 'mongodb', name: 'MongoDB' },
];
