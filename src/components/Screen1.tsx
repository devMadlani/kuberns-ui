import { ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { mockDatabaseTypes, mockFrameworks, mockPlans, mockRegions } from '../data/mockData';
import { githubApi } from '../lib/githubApi';
import { webappApi } from '../lib/webappApi';
import { AppFormData, Branch, DatabaseType, Framework, Organization, Plan, Region, Repository } from '../types';
import { AppDetailsForm } from './AppDetailsForm';
import { DatabaseToggle } from './DatabaseToggle';
import { GitHubConnectCard } from './GitHubConnectCard';
import { PlanSelector } from './PlanSelector';
import { RepositorySelector } from './RepositorySelector';
import { Button } from './ui/button';

interface Screen1Props {
  formData: AppFormData;
  onFormDataChange: (data: AppFormData) => void;
  onNext: () => void;
}

export function Screen1({ formData, onFormDataChange, onNext }: Screen1Props) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [regions, setRegions] = useState<Region[]>(mockRegions);
  const [frameworks, setFrameworks] = useState<Framework[]>(mockFrameworks);
  const [databaseTypes, setDatabaseTypes] = useState<DatabaseType[]>(mockDatabaseTypes);
  const [plans, setPlans] = useState<Plan[]>(mockPlans);

  const [githubLoading, setGithubLoading] = useState(false);
  const [isOrgsLoading, setIsOrgsLoading] = useState(false);
  const [isReposLoading, setIsReposLoading] = useState(false);
  const [isBranchesLoading, setIsBranchesLoading] = useState(false);
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);
  const [isPlansLoading, setIsPlansLoading] = useState(false);

  const [githubError, setGithubError] = useState<string | null>(null);
  const [githubDataError, setGithubDataError] = useState<string | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [plansError, setPlansError] = useState<string | null>(null);
  const requireOrganizationSelection = organizations.length > 0;

  useEffect(() => {
    const loadMetadata = async (): Promise<void> => {
      setIsMetadataLoading(true);
      setMetadataError(null);

      try {
        const metadata = await webappApi.getMetadata();
        setRegions(metadata.regions);
        setFrameworks(metadata.frameworks);
        setDatabaseTypes(metadata.databaseTypes);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load metadata';
        setMetadataError(message);
      } finally {
        setIsMetadataLoading(false);
      }
    };

    void loadMetadata();
  }, []);

  useEffect(() => {
    const loadPlans = async (): Promise<void> => {
      setIsPlansLoading(true);
      setPlansError(null);

      try {
        const data = await webappApi.getPlans();
        setPlans(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load plans';
        setPlansError(message);
      } finally {
        setIsPlansLoading(false);
      }
    };

    void loadPlans();
  }, []);

  const handleGithubConnect = async (): Promise<void> => {
    setGithubError(null);
    setGithubLoading(true);

    try {
      const { url } = await githubApi.getOAuthUrl();
      window.location.assign(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start GitHub OAuth';
      setGithubError(message);
      setGithubLoading(false);
    }
  };

  const handleGitlabConnect = (): void => {
    onFormDataChange({ ...formData, gitlabConnected: true });
  };

  const handleOrgChange = (orgId: string): void => {
    onFormDataChange({
      ...formData,
      organizationId: orgId,
      repositoryId: '',
      branchId: '',
    });
  };

  const handleRepoChange = (repoId: string): void => {
    onFormDataChange({
      ...formData,
      repositoryId: repoId,
      branchId: '',
    });
  };

  const handleBranchChange = (branchId: string): void => {
    onFormDataChange({ ...formData, branchId });
  };

  const handleAppNameChange = (appName: string): void => {
    onFormDataChange({ ...formData, appName });
  };

  const handleRegionChange = (regionId: string): void => {
    onFormDataChange({ ...formData, regionId });
  };

  const handleFrameworkChange = (frameworkId: string): void => {
    onFormDataChange({ ...formData, frameworkId });
  };

  const handlePlanSelect = (planId: string): void => {
    onFormDataChange({ ...formData, planId });
  };

  const handleDatabaseToggle = (enabled: boolean): void => {
    onFormDataChange({
      ...formData,
      databaseEnabled: enabled,
      databaseTypeId: enabled ? formData.databaseTypeId : '',
    });
  };

  const handleDatabaseTypeChange = (databaseTypeId: string): void => {
    onFormDataChange({ ...formData, databaseTypeId });
  };

  useEffect(() => {
    const loadOrganizations = async (): Promise<void> => {
      if (!formData.githubConnected || !formData.githubUserId) {
        setOrganizations([]);
        setRepositories([]);
        setBranches([]);
        return;
      }

      setIsOrgsLoading(true);
      setGithubDataError(null);

      try {
        const data = await githubApi.getOrganizations(formData.githubUserId);
        setOrganizations(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load organizations';
        setGithubDataError(message);
      } finally {
        setIsOrgsLoading(false);
      }
    };

    void loadOrganizations();
  }, [formData.githubConnected, formData.githubUserId]);

  useEffect(() => {
    const loadRepositories = async (): Promise<void> => {
      if (!formData.githubUserId) {
        setRepositories([]);
        setBranches([]);
        return;
      }

      if (requireOrganizationSelection && !formData.organizationId) {
        setRepositories([]);
        setBranches([]);
        return;
      }

      setIsReposLoading(true);
      setGithubDataError(null);

      try {
        const data = await githubApi.getRepositories(
          requireOrganizationSelection ? formData.organizationId : undefined,
          formData.githubUserId,
        );
        setRepositories(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load repositories';
        setGithubDataError(message);
      } finally {
        setIsReposLoading(false);
      }
    };

    void loadRepositories();
  }, [formData.organizationId, formData.githubUserId, requireOrganizationSelection]);

  const selectedRepository = useMemo(() => {
    return repositories.find((repo) => repo.id === formData.repositoryId);
  }, [formData.repositoryId, repositories]);

  useEffect(() => {
    const loadBranches = async (): Promise<void> => {
      if (!selectedRepository || !selectedRepository.owner || !selectedRepository.repoName || !formData.githubUserId) {
        setBranches([]);
        return;
      }

      setIsBranchesLoading(true);
      setGithubDataError(null);

      try {
        const data = await githubApi.getBranches(
          selectedRepository.owner,
          selectedRepository.repoName,
          formData.githubUserId,
        );
        setBranches(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load branches';
        setGithubDataError(message);
      } finally {
        setIsBranchesLoading(false);
      }
    };

    void loadBranches();
  }, [formData.githubUserId, selectedRepository]);

  const canProceed =
    formData.githubConnected &&
    (!requireOrganizationSelection || Boolean(formData.organizationId)) &&
    formData.repositoryId &&
    formData.branchId &&
    formData.appName &&
    formData.regionId &&
    formData.frameworkId &&
    formData.planId;

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-0">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Create New App</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Connect your repository and fill in the requirements to see the app deployed in seconds.
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 text-sm">
        <span className="font-medium text-primary text-lg">1</span>
        <span className="text-muted-foreground hidden sm:inline">........</span>
        <span className="text-muted-foreground text-lg">2</span>
      </div>

      <div className="space-y-6">
        <GitHubConnectCard
          githubConnected={formData.githubConnected}
          githubUsername={formData.githubUsername}
          gitlabConnected={formData.gitlabConnected}
          githubLoading={githubLoading}
          githubError={githubError}
          onGithubConnect={() => {
            void handleGithubConnect();
          }}
          onGitlabConnect={handleGitlabConnect}
        />

        {formData.githubConnected ? (
          <RepositorySelector
            organizations={organizations}
            repositories={repositories}
            branches={branches}
            requireOrganizationSelection={requireOrganizationSelection}
            selectedOrgId={formData.organizationId}
            selectedRepoId={formData.repositoryId}
            selectedBranchId={formData.branchId}
            isOrgsLoading={isOrgsLoading}
            isReposLoading={isReposLoading}
            isBranchesLoading={isBranchesLoading}
            githubDataError={githubDataError}
            onOrgChange={handleOrgChange}
            onRepoChange={handleRepoChange}
            onBranchChange={handleBranchChange}
          />
        ) : null}

        <AppDetailsForm
          appName={formData.appName}
          selectedRegionId={formData.regionId}
          selectedFrameworkId={formData.frameworkId}
          regions={regions}
          frameworks={frameworks}
          onAppNameChange={handleAppNameChange}
          onRegionChange={handleRegionChange}
          onFrameworkChange={handleFrameworkChange}
        />

        <PlanSelector plans={plans} selectedPlanId={formData.planId} onPlanSelect={handlePlanSelect} />

        <DatabaseToggle
          databaseTypes={databaseTypes}
          enabled={formData.databaseEnabled}
          selectedDatabaseTypeId={formData.databaseTypeId}
          onToggle={handleDatabaseToggle}
          onDatabaseTypeChange={handleDatabaseTypeChange}
        />
        {isMetadataLoading ? <p className="text-sm text-muted-foreground">Loading metadata...</p> : null}
        {metadataError ? <p className="text-sm text-destructive">{metadataError}</p> : null}
        {isPlansLoading ? <p className="text-sm text-muted-foreground">Loading plans...</p> : null}
        {plansError ? <p className="text-sm text-destructive">{plansError}</p> : null}
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={onNext} disabled={!canProceed} className="px-6 w-full sm:w-auto">
          Set Up Env Variables
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

