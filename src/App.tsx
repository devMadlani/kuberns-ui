import { useEffect, useState } from 'react';

import { Layout } from './components/Layout';
import { Screen1 } from './components/Screen1';
import { Screen2 } from './components/Screen2';
import { githubApi } from './lib/githubApi';
import { AppFormData } from './types';

const GITHUB_USER_ID_STORAGE_KEY = 'kuberns.githubUserId';
const GITHUB_USERNAME_STORAGE_KEY = 'kuberns.githubUsername';

const createInitialFormData = (): AppFormData => {
  const savedGithubUserId = sessionStorage.getItem(GITHUB_USER_ID_STORAGE_KEY) ?? '';
  const savedGithubUsername = sessionStorage.getItem(GITHUB_USERNAME_STORAGE_KEY) ?? '';

  return {
    githubConnected: Boolean(savedGithubUserId),
    gitlabConnected: false,
    githubUserId: savedGithubUserId,
    githubUsername: savedGithubUsername,
    organizationId: '',
    repositoryId: '',
    branchId: '',
    appName: '',
    regionId: '',
    frameworkId: '',
    planId: '',
    databaseEnabled: false,
    databaseTypeId: '',
    portType: 'random',
    customPort: '',
    environmentVariables: [],
  };
};

function App() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<AppFormData>(() => createInitialFormData());
  const [oauthProcessing, setOauthProcessing] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const isGithubCallbackPage = window.location.pathname === '/oauth/github/callback';

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const githubConnected = query.get('githubConnected');
    const githubId = query.get('githubId');
    const githubUsername = query.get('githubUsername');
    const error = query.get('error');

    if (githubConnected === 'true' && githubId && githubUsername) {
      sessionStorage.setItem(GITHUB_USER_ID_STORAGE_KEY, githubId);
      sessionStorage.setItem(GITHUB_USERNAME_STORAGE_KEY, githubUsername);

      setFormData((prev) => ({
        ...prev,
        githubConnected: true,
        githubUserId: githubId,
        githubUsername,
      }));
    }

    if (githubConnected === 'false' && error) {
      setOauthError(error);
    }

    if (githubConnected) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const handleGithubCallback = async (): Promise<void> => {
      if (!isGithubCallbackPage) {
        return;
      }

      const query = new URLSearchParams(window.location.search);
      const code = query.get('code');
      const oauthErrorMessage = query.get('error_description') ?? query.get('error');

      if (oauthErrorMessage) {
        setOauthError(oauthErrorMessage);
        return;
      }

      if (!code) {
        setOauthError('Missing OAuth code in callback URL');
        return;
      }

      setOauthProcessing(true);
      setOauthError(null);

      try {
        const result = await githubApi.completeOAuth(code);

        sessionStorage.setItem(GITHUB_USER_ID_STORAGE_KEY, result.githubId);
        sessionStorage.setItem(GITHUB_USERNAME_STORAGE_KEY, result.githubUsername);

        setFormData((prev) => ({
          ...prev,
          githubConnected: true,
          githubUserId: result.githubId,
          githubUsername: result.githubUsername,
        }));

        window.history.replaceState({}, '', '/');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'GitHub callback failed';
        setOauthError(message);
      } finally {
        setOauthProcessing(false);
      }
    };

    void handleGithubCallback();
  }, [isGithubCallbackPage]);

  const handleNext = (): void => {
    setCurrentStep(2);
  };

  const handleBack = (): void => {
    setCurrentStep(1);
  };

  const handleFinish = (): void => {
    console.log('Form submitted:', formData);
    alert('Setup completed! Check console for form data.');
  };

  if (isGithubCallbackPage) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-0 py-12">
          <h1 className="text-2xl font-bold">GitHub Connection</h1>
          <p className="mt-3 text-muted-foreground">
            {oauthProcessing ? 'Completing OAuth with backend...' : oauthError ?? 'Connected successfully.'}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {oauthError ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-0 pt-4">
          <p className="text-sm text-destructive">{oauthError}</p>
        </div>
      ) : null}
      {currentStep === 1 ? (
        <Screen1 formData={formData} onFormDataChange={setFormData} onNext={handleNext} />
      ) : (
        <Screen2 formData={formData} onFormDataChange={setFormData} onBack={handleBack} onFinish={handleFinish} />
      )}
    </Layout>
  );
}

export default App;
