import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AuthPage } from "./components/AuthPage";
import { Layout } from "./components/Layout";
import { Screen1 } from "./components/Screen1";
import { Screen2 } from "./components/Screen2";
import { WebappsPage } from "./components/WebappsPage";
import { authApi } from "./lib/authApi";
import { githubApi } from "./lib/githubApi";
import { webappApi } from "./lib/webappApi";
import { AppFormData } from "./types";

const GITHUB_USER_ID_STORAGE_KEY = "kuberns.githubUserId";
const GITHUB_USERNAME_STORAGE_KEY = "kuberns.githubUsername";

const createInitialFormData = (): AppFormData => {
  const savedGithubUserId =
    sessionStorage.getItem(GITHUB_USER_ID_STORAGE_KEY) ?? "";
  const savedGithubUsername =
    sessionStorage.getItem(GITHUB_USERNAME_STORAGE_KEY) ?? "";

  return {
    githubConnected: Boolean(savedGithubUserId),
    gitlabConnected: false,
    githubUserId: savedGithubUserId,
    githubUsername: savedGithubUsername,
    organizationId: "",
    repositoryId: "",
    branchId: "",
    appName: "",
    regionId: "",
    frameworkId: "",
    planId: "",
    databaseEnabled: false,
    databaseTypeId: "",
    portType: "random",
    customPort: "",
    environmentVariables: [],
  };
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<AppFormData>(() =>
    createInitialFormData(),
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string>("");
  const [oauthProcessing, setOauthProcessing] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [createWebAppLoading, setCreateWebAppLoading] = useState(false);
  const [createWebAppError, setCreateWebAppError] = useState<string | null>(
    null,
  );

  const isGithubCallbackPage = location.pathname === "/oauth/github/callback";

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const githubConnected = query.get("githubConnected");
    const githubId = query.get("githubId");
    const githubUsername = query.get("githubUsername");
    const error = query.get("error");

    if (githubConnected === "true" && githubId && githubUsername) {
      sessionStorage.setItem(GITHUB_USER_ID_STORAGE_KEY, githubId);
      sessionStorage.setItem(GITHUB_USERNAME_STORAGE_KEY, githubUsername);

      setFormData((prev) => ({
        ...prev,
        githubConnected: true,
        githubUserId: githubId,
        githubUsername,
      }));
    }

    if (githubConnected === "false" && error) {
      setOauthError(error);
    }

    if (githubConnected) {
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      try {
        const user = await authApi.me();
        setIsAuthenticated(true);
        setAuthEmail(user.email);
      } catch (_error) {
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    void checkSession();
  }, []);

  useEffect(() => {
    const handleGithubCallback = async (): Promise<void> => {
      if (!isGithubCallbackPage) {
        return;
      }

      const query = new URLSearchParams(window.location.search);
      const code = query.get("code");
      const oauthErrorMessage =
        query.get("error_description") ?? query.get("error");

      if (oauthErrorMessage) {
        setOauthError(oauthErrorMessage);
        return;
      }

      if (!code) {
        setOauthError("Missing OAuth code in callback URL");
        return;
      }

      setOauthProcessing(true);
      setOauthError(null);

      try {
        const result = await githubApi.completeOAuth(code);

        sessionStorage.setItem(GITHUB_USER_ID_STORAGE_KEY, result.githubId);
        sessionStorage.setItem(
          GITHUB_USERNAME_STORAGE_KEY,
          result.githubUsername,
        );

        setFormData((prev) => ({
          ...prev,
          githubConnected: true,
          githubUserId: result.githubId,
          githubUsername: result.githubUsername,
        }));

        navigate("/", { replace: true });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "GitHub callback failed";
        setOauthError(message);
      } finally {
        setOauthProcessing(false);
      }
    };

    void handleGithubCallback();
  }, [isGithubCallbackPage, location.search, navigate]);

  const handleNext = (): void => {
    setCurrentStep(2);
  };

  const handleBack = (): void => {
    setCurrentStep(1);
  };

  const handleFinish = async (): Promise<void> => {
    setCreateWebAppError(null);
    setCreateWebAppLoading(true);

    try {
      const [owner, repo] = formData.repositoryId.split("/");

      if (!owner || !repo) {
        throw new Error("Invalid repository selection");
      }

      if (!formData.branchId) {
        throw new Error("Please select a branch");
      }

      const resolvedPort =
        formData.portType === "custom" ? Number(formData.customPort) : 3000;

      if (
        !Number.isInteger(resolvedPort) ||
        resolvedPort < 1024 ||
        resolvedPort > 65535
      ) {
        throw new Error("Port must be an integer between 1024 and 65535");
      }

      const response = await webappApi.createWebApp({
        name: formData.appName,
        region: formData.regionId,
        plan: formData.planId,
        framework: formData.frameworkId,
        repository: {
          provider: "github",
          owner,
          repo,
          branch: formData.branchId,
        },
        port: resolvedPort,
        envVars: formData.environmentVariables.map(({ key, value }) => ({
          key,
          value,
        })),
      });
      if (response.status === "pending") {
        setCreateWebAppError(null);
        navigate("/webapps", {
          replace: true,
          state: {
            autoDeployWebAppId: response.webAppId,
            autoDeployDeploymentId: response.deploymentId,
          },
        });
        setFormData(createInitialFormData());
        setCurrentStep(1);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create webapp";
      setCreateWebAppError(message);
    } finally {
      setCreateWebAppLoading(false);
    }
  };

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<void> => {
    setAuthError(null);
    setAuthActionLoading(true);

    try {
      const user = await authApi.login(email, password);
      setIsAuthenticated(true);
      setAuthEmail(user.email);
      navigate("/", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setAuthError(message);
    } finally {
      setAuthActionLoading(false);
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
  ): Promise<{ email: string; otpPreview?: string }> => {
    setAuthError(null);
    setAuthActionLoading(true);

    try {
      const result = await authApi.register(email, password);
      return {
        email: result.email,
        otpPreview: result.otpPreview,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      setAuthError(message);
      throw error;
    } finally {
      setAuthActionLoading(false);
    }
  };

  const handleVerifyOtp = async (email: string, otp: string): Promise<void> => {
    setAuthError(null);
    setAuthActionLoading(true);

    try {
      const user = await authApi.verifyOtp(email, otp);
      setIsAuthenticated(true);
      setAuthEmail(user.email);
      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "OTP verification failed";
      setAuthError(message);
      throw error;
    } finally {
      setAuthActionLoading(false);
    }
  };

  const handleResendOtp = async (
    email: string,
  ): Promise<{ otpPreview?: string }> => {
    setAuthError(null);
    setAuthActionLoading(true);

    try {
      return await authApi.resendOtp(email);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to resend OTP";
      setAuthError(message);
      throw error;
    } finally {
      setAuthActionLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await authApi.logout();
    setIsAuthenticated(false);
    setAuthEmail("");
    setCurrentStep(1);
    setCreateWebAppError(null);
    navigate("/login", { replace: true });
  };

  const handleOpenWebapps = (): void => {
    navigate("/webapps");
  };

  if (isGithubCallbackPage) {
    return (
      <Layout
        isAuthenticated={isAuthenticated}
        authEmail={authEmail}
        onLogout={() => void handleLogout()}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-0 py-12">
          <h1 className="text-2xl font-bold">GitHub Connection</h1>
          <p className="mt-3 text-muted-foreground">
            {oauthProcessing
              ? "Completing OAuth with backend..."
              : (oauthError ?? "Connected successfully.")}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      isAuthenticated={isAuthenticated}
      authEmail={authEmail}
      onLogout={() => void handleLogout()}
      onOpenWebapps={handleOpenWebapps}
    >
      {oauthError ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-0 pt-4">
          <p className="text-sm text-destructive">{oauthError}</p>
        </div>
      ) : null}
      {authLoading ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-0 py-8">
          <p className="text-sm text-muted-foreground">Checking session...</p>
        </div>
      ) : null}
      {!authLoading && !isAuthenticated ? (
        <Routes>
          <Route
            path="/login"
            element={
              <AuthPage
                initialMode="login"
                onLogin={handleLogin}
                onRegister={handleRegister}
                onVerifyOtp={handleVerifyOtp}
                onResendOtp={handleResendOtp}
                onSwitchMode={(mode) =>
                  navigate(mode === "login" ? "/login" : "/register")
                }
                loading={authActionLoading}
                error={authError}
              />
            }
          />
          <Route
            path="/register"
            element={
              <AuthPage
                initialMode="register"
                onLogin={handleLogin}
                onRegister={handleRegister}
                onVerifyOtp={handleVerifyOtp}
                onResendOtp={handleResendOtp}
                onSwitchMode={(mode) =>
                  navigate(mode === "login" ? "/login" : "/register")
                }
                loading={authActionLoading}
                error={authError}
              />
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : null}
      {!authLoading && isAuthenticated ? (
        <Routes>
          <Route
            path="/"
            element={
              currentStep === 1 ? (
                <Screen1
                  formData={formData}
                  onFormDataChange={setFormData}
                  onNext={handleNext}
                />
              ) : (
                <Screen2
                  formData={formData}
                  onFormDataChange={setFormData}
                  onBack={handleBack}
                  onFinish={handleFinish}
                  submitLoading={createWebAppLoading}
                  submitError={createWebAppError}
                />
              )
            }
          />
          <Route path="/webapps" element={<WebappsPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : null}
    </Layout>
  );
}

export default App;
