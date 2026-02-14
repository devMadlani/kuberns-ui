import { GitBranch, Settings, User } from "lucide-react";

import { Branch, Organization, Repository } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

interface RepositorySelectorProps {
  organizations: Organization[];
  repositories: Repository[];
  branches: Branch[];
  requireOrganizationSelection: boolean;
  selectedOrgId: string;
  selectedRepoId: string;
  selectedBranchId: string;
  isOrgsLoading: boolean;
  isReposLoading: boolean;
  isBranchesLoading: boolean;
  githubDataError: string | null;
  onOrgChange: (orgId: string) => void;
  onRepoChange: (repoId: string) => void;
  onBranchChange: (branchId: string) => void;
}

export function RepositorySelector({
  organizations,
  repositories,
  branches,
  requireOrganizationSelection,
  selectedOrgId,
  selectedRepoId,
  selectedBranchId,
  isOrgsLoading,
  isReposLoading,
  isBranchesLoading,
  githubDataError,
  onOrgChange,
  onRepoChange,
  onBranchChange,
}: RepositorySelectorProps) {
  const filteredRepos = requireOrganizationSelection
    ? repositories.filter((repo) => repo.organizationId === selectedOrgId)
    : repositories;
  const filteredBranches = branches.filter(
    (branch) => branch.repositoryId === selectedRepoId,
  );

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organization" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Organization{" "}
              {requireOrganizationSelection ? (
                <span className="text-destructive">*</span>
              ) : null}
            </Label>
            <Select
              id="organization"
              value={selectedOrgId}
              onChange={(e) => onOrgChange(e.target.value)}
              disabled={isOrgsLoading || !requireOrganizationSelection}
            >
              <option value="">
                {requireOrganizationSelection
                  ? isOrgsLoading
                    ? "Loading organizations..."
                    : "Select Organization"
                  : "No organizations found"}
              </option>
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
              Repository <span className="text-destructive">*</span>
            </Label>
            <Select
              id="repository"
              value={selectedRepoId}
              onChange={(e) => onRepoChange(e.target.value)}
              disabled={
                (requireOrganizationSelection && !selectedOrgId) ||
                isReposLoading
              }
            >
              <option value="">
                {isReposLoading
                  ? "Loading repositories..."
                  : "Select Repository"}
              </option>
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
              Branch <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2 ">
              <Select
                id="branch"
                value={selectedBranchId}
                onChange={(e) => onBranchChange(e.target.value)}
                disabled={!selectedRepoId || isBranchesLoading}
                className="flex-1 w-full"
              >
                <option value="">
                  {isBranchesLoading ? "Loading branches..." : "Select Branch"}
                </option>
                {filteredBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                type="button"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {githubDataError ? (
          <p className="text-sm text-destructive">{githubDataError}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
