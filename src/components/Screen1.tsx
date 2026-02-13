import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { GitHubConnectCard } from './GitHubConnectCard';
import { RepositorySelector } from './RepositorySelector';
import { AppDetailsForm } from './AppDetailsForm';
import { PlanSelector } from './PlanSelector';
import { DatabaseToggle } from './DatabaseToggle';
import {
  mockOrganizations,
  mockRepositories,
  mockBranches,
  mockRegions,
  mockFrameworks,
  mockPlans,
  mockDatabaseTypes,
} from '../data/mockData';
import { AppFormData } from '../types';

interface Screen1Props {
  formData: AppFormData;
  onFormDataChange: (data: AppFormData) => void;
  onNext: () => void;
}

export function Screen1({ formData, onFormDataChange, onNext }: Screen1Props) {
  const handleGithubConnect = () => {
    onFormDataChange({ ...formData, githubConnected: true });
  };

  const handleGitlabConnect = () => {
    onFormDataChange({ ...formData, gitlabConnected: true });
  };

  const handleOrgChange = (orgId: string) => {
    onFormDataChange({
      ...formData,
      organizationId: orgId,
      repositoryId: '',
      branchId: '',
    });
  };

  const handleRepoChange = (repoId: string) => {
    onFormDataChange({
      ...formData,
      repositoryId: repoId,
      branchId: '',
    });
  };

  const handleBranchChange = (branchId: string) => {
    onFormDataChange({ ...formData, branchId });
  };

  const handleAppNameChange = (appName: string) => {
    onFormDataChange({ ...formData, appName });
  };

  const handleRegionChange = (regionId: string) => {
    onFormDataChange({ ...formData, regionId });
  };

  const handleFrameworkChange = (frameworkId: string) => {
    onFormDataChange({ ...formData, frameworkId });
  };

  const handlePlanSelect = (planId: string) => {
    onFormDataChange({ ...formData, planId });
  };

  const handleDatabaseToggle = (enabled: boolean) => {
    onFormDataChange({
      ...formData,
      databaseEnabled: enabled,
      databaseTypeId: enabled ? formData.databaseTypeId : '',
    });
  };

  const handleDatabaseTypeChange = (databaseTypeId: string) => {
    onFormDataChange({ ...formData, databaseTypeId });
  };

  const canProceed =
    formData.githubConnected &&
    formData.organizationId &&
    formData.repositoryId &&
    formData.branchId &&
    formData.appName &&
    formData.regionId &&
    formData.frameworkId &&
    formData.planId;

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Create New App</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Connect your repository and fill in the requirements to see the app
          deployed in seconds.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-end gap-2 text-sm">
        <span className="font-medium text-primary text-lg">1</span>
        <span className="text-muted-foreground hidden sm:inline">........</span>
        <span className="text-muted-foreground text-lg">2</span>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        <GitHubConnectCard
          githubConnected={formData.githubConnected}
          gitlabConnected={formData.gitlabConnected}
          onGithubConnect={handleGithubConnect}
          onGitlabConnect={handleGitlabConnect}
        />

        {formData.githubConnected && (
          <RepositorySelector
            organizations={mockOrganizations}
            repositories={mockRepositories}
            branches={mockBranches}
            selectedOrgId={formData.organizationId}
            selectedRepoId={formData.repositoryId}
            selectedBranchId={formData.branchId}
            onOrgChange={handleOrgChange}
            onRepoChange={handleRepoChange}
            onBranchChange={handleBranchChange}
          />
        )}

        <AppDetailsForm
          appName={formData.appName}
          selectedRegionId={formData.regionId}
          selectedFrameworkId={formData.frameworkId}
          regions={mockRegions}
          frameworks={mockFrameworks}
          onAppNameChange={handleAppNameChange}
          onRegionChange={handleRegionChange}
          onFrameworkChange={handleFrameworkChange}
        />

        <PlanSelector
          plans={mockPlans}
          selectedPlanId={formData.planId}
          onPlanSelect={handlePlanSelect}
        />

        <DatabaseToggle
          databaseTypes={mockDatabaseTypes}
          enabled={formData.databaseEnabled}
          selectedDatabaseTypeId={formData.databaseTypeId}
          onToggle={handleDatabaseToggle}
          onDatabaseTypeChange={handleDatabaseTypeChange}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 w-full sm:w-auto"
        >
          Set Up Env Variables
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
