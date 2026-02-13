import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Clock3,
  Database,
  Layers,
  Rocket,
  Server,
  X,
} from 'lucide-react';

import {
  DeploymentSummary,
  EnvironmentSummary,
  WebAppDetail,
  WebAppListItem,
  webappApi,
} from '../lib/webappApi';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success';

const DEPLOYMENT_PREVIEW_COUNT = 3;

const formatDate = (value: string): string => {
  return new Date(value).toLocaleString();
};

const getStatusVariant = (status: string): BadgeVariant => {
  const normalized = status.toLowerCase();

  if (normalized === 'active' || normalized === 'success') {
    return 'success';
  }

  if (normalized === 'failed' || normalized === 'error') {
    return 'destructive';
  }

  if (normalized === 'pending') {
    return 'secondary';
  }

  return 'outline';
};

const getStatusLabel = (status: string | null | undefined): string => {
  if (!status) {
    return 'Unknown';
  }

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

type MetricCardProps = {
  label: string;
  value: string | number;
};

const MetricCard = ({ label, value }: MetricCardProps): JSX.Element => {
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
};

type HeaderBlockProps = {
  detailData: WebAppDetail;
};

const HeaderBlock = ({ detailData }: HeaderBlockProps): JSX.Element => {
  const latestDeployment = detailData.deployments[0];

  return (
    <section className="rounded-xl border border-border bg-gradient-to-br from-card via-card to-muted/20 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">{detailData.name}</h3>
          <p className="text-sm text-muted-foreground break-all">
            {detailData.repoProvider} / {detailData.repoOwner}/{detailData.repoName}
          </p>
        </div>
        <Badge variant={getStatusVariant(latestDeployment?.status ?? 'pending')}>
          {getStatusLabel(latestDeployment?.status ?? 'pending')}
        </Badge>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{detailData.defaultBranch}</Badge>
        <span>Created {formatDate(detailData.createdAt)}</span>
      </div>
    </section>
  );
};

type StatusMetricsProps = {
  detailData: WebAppDetail;
};

const StatusMetrics = ({ detailData }: StatusMetricsProps): JSX.Element => {
  return (
    <section className="grid grid-cols-2 gap-2">
      <MetricCard label="Plan" value={detailData.plan} />
      <MetricCard label="Region" value={detailData.region} />
      <MetricCard label="Environments" value={detailData.environments.length} />
      <MetricCard label="Deployments" value={detailData.deployments.length} />
    </section>
  );
};

type EnvironmentSectionProps = {
  environments: EnvironmentSummary[];
  showEnvVarsByEnvironmentId: Record<string, boolean>;
  onToggleEnvVars: (environmentId: string) => void;
};

const EnvironmentSection = ({
  environments,
  showEnvVarsByEnvironmentId,
  onToggleEnvVars,
}: EnvironmentSectionProps): JSX.Element => {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold tracking-wide">Environments</h4>
      </div>
      {environments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
          No environments found.
        </div>
      ) : (
        environments.map((environment) => {
          const envVarsExpanded = Boolean(showEnvVarsByEnvironmentId[environment.id]);
          const envVars = Object.entries(environment.envVars ?? {});

          return (
            <div key={environment.id} className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{environment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Branch {environment.branch} | Port {environment.port}
                  </p>
                </div>
                <Badge variant={getStatusVariant(environment.status)}>{getStatusLabel(environment.status)}</Badge>
              </div>

              {environment.instance ? (
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Instance ({environment.instance.instanceType})</span>
                    <Badge variant={getStatusVariant(environment.instance.status)}>
                      {getStatusLabel(environment.instance.status)}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <MetricCard label="CPU" value={environment.instance.cpu} />
                    <MetricCard label="RAM MB" value={environment.instance.ram} />
                    <MetricCard label="Storage GB" value={environment.instance.storage} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground break-all">
                    Public IP: {environment.instance.publicIp ?? '-'}
                  </p>
                </div>
              ) : null}

              <div className="space-y-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  onClick={() => onToggleEnvVars(environment.id)}
                >
                  {envVarsExpanded ? 'Hide env vars' : 'Show env vars'}
                  {envVarsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {envVarsExpanded ? (
                  envVars.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No environment variables.</p>
                  ) : (
                    <div className="rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <tbody>
                          {envVars.map(([key, value]) => (
                            <tr key={key} className="border-b last:border-b-0">
                              <td className="px-3 py-2 font-medium align-top">{key}</td>
                              <td className="px-3 py-2 text-muted-foreground break-all">{String(value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : null}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
};

type DeploymentSectionProps = {
  deployments: DeploymentSummary[];
  showDeploymentsExpanded: boolean;
  onToggleDeployments: () => void;
};

const DeploymentSection = ({
  deployments,
  showDeploymentsExpanded,
  onToggleDeployments,
}: DeploymentSectionProps): JSX.Element => {
  const deploymentsToRender = showDeploymentsExpanded
    ? deployments
    : deployments.slice(0, DEPLOYMENT_PREVIEW_COUNT);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Rocket className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold tracking-wide">Deployments</h4>
      </div>

      {deployments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
          No deployments yet.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left px-3 py-2 text-xs font-semibold">Status</th>
                <th className="text-left px-3 py-2 text-xs font-semibold">Created</th>
                <th className="text-left px-3 py-2 text-xs font-semibold">Error</th>
              </tr>
            </thead>
            <tbody>
              {deploymentsToRender.map((deployment) => (
                <tr key={deployment.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2">
                    <Badge variant={getStatusVariant(deployment.status)}>{getStatusLabel(deployment.status)}</Badge>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDate(deployment.createdAt)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{deployment.errorMessage ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deployments.length > DEPLOYMENT_PREVIEW_COUNT ? (
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          onClick={onToggleDeployments}
        >
          {showDeploymentsExpanded ? 'Show less' : 'Show all deployments'}
          {showDeploymentsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      ) : null}
    </section>
  );
};

const DetailSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4">
      <div className="h-24 w-full rounded-xl bg-muted animate-pulse" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-16 rounded-xl bg-muted animate-pulse" />
        <div className="h-16 rounded-xl bg-muted animate-pulse" />
        <div className="h-16 rounded-xl bg-muted animate-pulse" />
        <div className="h-16 rounded-xl bg-muted animate-pulse" />
      </div>
      <div className="h-32 w-full rounded-xl bg-muted animate-pulse" />
      <div className="h-32 w-full rounded-xl bg-muted animate-pulse" />
    </div>
  );
};

type DetailPanelContentProps = {
  selectedWebappId: string | null;
  detailData: WebAppDetail | null;
  detailLoading: boolean;
  detailError: string | null;
  startDeploymentLoading: boolean;
  startDeploymentError: string | null;
  onStartDeployment: () => void;
  onRetryDetail: () => void;
};

const DetailPanelContent = ({
  selectedWebappId,
  detailData,
  detailLoading,
  detailError,
  startDeploymentLoading,
  startDeploymentError,
  onStartDeployment,
  onRetryDetail,
}: DetailPanelContentProps): JSX.Element => {
  const [showDeploymentsExpanded, setShowDeploymentsExpanded] = useState(false);
  const [showEnvVarsByEnvironmentId, setShowEnvVarsByEnvironmentId] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setShowDeploymentsExpanded(false);
    setShowEnvVarsByEnvironmentId({});
  }, [selectedWebappId]);

  const totalDeployments = detailData?.deployments.length ?? 0;

  if (!selectedWebappId) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-6 text-center">
        <Database className="h-6 w-6 mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm font-medium">No app selected</p>
        <p className="text-sm text-muted-foreground mt-1">
          Select a webapp row to inspect infrastructure, environments, and deployments.
        </p>
      </div>
    );
  }

  if (detailLoading) {
    return <DetailSkeleton />;
  }

  if (detailError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2">
        <p className="text-sm text-destructive font-medium">Unable to load details</p>
        <p className="text-sm text-muted-foreground">{detailError}</p>
        <Button size="sm" variant="outline" onClick={onRetryDetail}>
          Retry
        </Button>
      </div>
    );
  }

  if (!detailData) {
    return <></>;
  }

  const latestDeployment = detailData.deployments[0];
  const canStartDeployment =
    latestDeployment && ['pending', 'failed'].includes(latestDeployment.status.toLowerCase());

  return (
    <div className="space-y-4">
      <HeaderBlock detailData={detailData} />
      <StatusMetrics detailData={detailData} />
      <section className="rounded-xl border border-border bg-card p-3 text-xs shadow-sm space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground">
            Deployment trigger: <strong>manual</strong>
          </p>
          {canStartDeployment ? (
            <Button size="sm" onClick={onStartDeployment} disabled={startDeploymentLoading}>
              {startDeploymentLoading ? 'Deploying...' : 'Deploy'}
            </Button>
          ) : null}
        </div>
        {!latestDeployment ? (
          <p className="text-muted-foreground">No deployment record available.</p>
        ) : (
          <p className="text-muted-foreground">
            Current status: <strong>{getStatusLabel(latestDeployment.status)}</strong>
          </p>
        )}
        {startDeploymentError ? <p className="text-destructive">{startDeploymentError}</p> : null}
      </section>
      <EnvironmentSection
        environments={detailData.environments}
        showEnvVarsByEnvironmentId={showEnvVarsByEnvironmentId}
        onToggleEnvVars={(environmentId) => {
          setShowEnvVarsByEnvironmentId((prev) => ({
            ...prev,
            [environmentId]: !prev[environmentId],
          }));
        }}
      />
      <DeploymentSection
        deployments={detailData.deployments}
        showDeploymentsExpanded={showDeploymentsExpanded}
        onToggleDeployments={() => setShowDeploymentsExpanded((prev) => !prev)}
      />
      {totalDeployments === 0 ? null : (
        <div className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground shadow-sm">
          Latest deployment status: <strong>{getStatusLabel(detailData.deployments[0]?.status)}</strong>
        </div>
      )}
    </div>
  );
};

export function WebappsPage() {
  const navigate = useNavigate();

  const [webapps, setWebapps] = useState<WebAppListItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedWebappId, setSelectedWebappId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<WebAppDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [startDeploymentLoading, setStartDeploymentLoading] = useState(false);
  const [startDeploymentError, setStartDeploymentError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const loadList = async (): Promise<void> => {
      setListLoading(true);
      setListError(null);

      try {
        const data = await webappApi.listWebApps();
        setWebapps(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load webapps';
        setListError(message);
      } finally {
        setListLoading(false);
      }
    };

    void loadList();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const fetchDetail = async (webappId: string): Promise<void> => {
    setDetailData(null);
    setDetailError(null);
    setDetailLoading(true);

    try {
      const detail = await webappApi.getWebApp(webappId);
      setDetailData(detail);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load webapp details';
      setDetailError(message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRowClick = async (webapp: WebAppListItem): Promise<void> => {
    setStartDeploymentError(null);
    setSelectedWebappId(webapp.id);
    setIsDrawerOpen(true);
    await fetchDetail(webapp.id);
  };

  const closeDetail = (): void => {
    setSelectedWebappId(null);
    setDetailData(null);
    setDetailError(null);
    setDetailLoading(false);
    setStartDeploymentLoading(false);
    setStartDeploymentError(null);
    setIsDrawerOpen(false);
  };

  const retryDetail = (): void => {
    if (!selectedWebappId) {
      return;
    }

    void fetchDetail(selectedWebappId);
  };

  const handleStartDeployment = async (): Promise<void> => {
    if (!detailData || !selectedWebappId) {
      return;
    }

    const latestDeployment = detailData.deployments[0];

    if (!latestDeployment) {
      setStartDeploymentError('No deployment record available.');
      return;
    }

    setStartDeploymentLoading(true);
    setStartDeploymentError(null);

    try {
      await webappApi.startDeployment(latestDeployment.id);
      await fetchDetail(selectedWebappId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start deployment';
      setStartDeploymentError(message);
    } finally {
      setStartDeploymentLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Webapps</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and inspect all your deployed app configurations.
          </p>
        </div>
        <Button onClick={() => navigate('/')}>Create New App</Button>
      </div>

      {listLoading ? <p className="text-sm text-muted-foreground">Loading webapps...</p> : null}
      {listError ? <p className="text-sm text-destructive">{listError}</p> : null}

      {!listLoading && !listError && webapps.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No webapps yet.</p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              Create your first app
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!listLoading && !listError && webapps.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Webapps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 text-xs font-medium">Name</th>
                      <th className="text-left py-2 px-2 text-xs font-medium">Region</th>
                      <th className="text-left py-2 px-2 text-xs font-medium">Plan</th>
                      <th className="text-left py-2 px-2 text-xs font-medium">Framework</th>
                      <th className="text-left py-2 px-2 text-xs font-medium">Repository</th>
                      <th className="text-left py-2 px-2 text-xs font-medium">Branch</th>
                      <th className="text-left py-2 px-2 text-xs font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webapps.map((webapp) => (
                      <tr
                        key={webapp.id}
                        className={`border-b cursor-pointer hover:bg-muted/40 transition-colors ${
                          selectedWebappId === webapp.id ? 'bg-muted/30 ring-1 ring-primary/20' : ''
                        }`}
                        onClick={() => void handleRowClick(webapp)}
                      >
                        <td className="py-2 px-2 text-sm font-medium">{webapp.name}</td>
                        <td className="py-2 px-2 text-sm">{webapp.region}</td>
                        <td className="py-2 px-2 text-sm">{webapp.plan}</td>
                        <td className="py-2 px-2 text-sm">{webapp.framework}</td>
                        <td className="py-2 px-2 text-sm text-muted-foreground">
                          {webapp.repoOwner}/{webapp.repoName}
                        </td>
                        <td className="py-2 px-2 text-sm">{webapp.defaultBranch}</td>
                        <td className="py-2 px-2 text-sm text-muted-foreground">{formatDate(webapp.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="hidden xl:flex xl:flex-col">
            <CardHeader className="sticky top-0 bg-card/95 backdrop-blur z-10 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle>Details</CardTitle>
                {selectedWebappId ? (
                  <button type="button" className="text-sm text-primary hover:underline" onClick={closeDetail}>
                    Close
                  </button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 overflow-auto max-h-[72vh]">
              <DetailPanelContent
                selectedWebappId={selectedWebappId}
                detailData={detailData}
                detailLoading={detailLoading}
                detailError={detailError}
                startDeploymentLoading={startDeploymentLoading}
                startDeploymentError={startDeploymentError}
                onStartDeployment={() => void handleStartDeployment()}
                onRetryDetail={retryDetail}
              />
            </CardContent>
          </Card>
        </div>
      ) : null}

      {isDrawerOpen ? (
        <div className="xl:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            onClick={closeDetail}
            aria-label="Close details"
          />
          <div className="absolute right-0 top-0 h-full w-[94%] max-w-md bg-background border-l border-border shadow-2xl p-4 overflow-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 backdrop-blur pb-3">
              <h2 className="text-lg font-semibold">Webapp Details</h2>
              <Button variant="ghost" size="icon" onClick={closeDetail} aria-label="Close details drawer">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <DetailPanelContent
              selectedWebappId={selectedWebappId}
              detailData={detailData}
              detailLoading={detailLoading}
              detailError={detailError}
              startDeploymentLoading={startDeploymentLoading}
              startDeploymentError={startDeploymentError}
              onStartDeployment={() => void handleStartDeployment()}
              onRetryDetail={retryDetail}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
