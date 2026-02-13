import { Card, CardContent } from './ui/card';
import { Select } from './ui/select';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Settings, User, GitBranch } from 'lucide-react';
import { Organization, Repository, Branch } from '../types';

interface RepositorySelectorProps {
  organizations: Organization[];
  repositories: Repository[];
  branches: Branch[];
  selectedOrgId: string;
  selectedRepoId: string;
  selectedBranchId: string;
  onOrgChange: (orgId: string) => void;
  onRepoChange: (repoId: string) => void;
  onBranchChange: (branchId: string) => void;
}

export function RepositorySelector({
  organizations,
  repositories,
  branches,
  selectedOrgId,
  selectedRepoId,
  selectedBranchId,
  onOrgChange,
  onRepoChange,
  onBranchChange,
}: RepositorySelectorProps) {
  const filteredRepos = repositories.filter(
    (repo) => repo.organizationId === selectedOrgId
  );
  const filteredBranches = branches.filter(
    (branch) => branch.repositoryId === selectedRepoId
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organization" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Organization
            </Label>
            <Select
              id="organization"
              value={selectedOrgId}
              onChange={(e) => onOrgChange(e.target.value)}
            >
              <option value="">*Select Organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repository" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Repository
            </Label>
            <Select
              id="repository"
              value={selectedRepoId}
              onChange={(e) => onRepoChange(e.target.value)}
              disabled={!selectedOrgId}
            >
              <option value="">*Select Repository</option>
              {filteredRepos.map((repo) => (
                <option key={repo.id} value={repo.id}>
                  {repo.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Branch
            </Label>
            <div className="flex gap-2">
              <Select
                id="branch"
                value={selectedBranchId}
                onChange={(e) => onBranchChange(e.target.value)}
                disabled={!selectedRepoId}
                className="flex-1"
              >
                <option value="">*Select Branch</option>
                {filteredBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </Select>
              <Button variant="outline" size="icon" className="shrink-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
