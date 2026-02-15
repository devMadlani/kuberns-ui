import { FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type AuthMode = 'login' | 'register';
type AuthView = 'auth' | 'verify';

type AuthPageProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<{ email: string; otpPreview?: string }>;
  onVerifyOtp: (email: string, otp: string) => Promise<void>;
  onResendOtp: (email: string) => Promise<{ otpPreview?: string }>;
  initialMode?: AuthMode;
  onSwitchMode?: (mode: AuthMode) => void;
  loading: boolean;
  error: string | null;
};

export function AuthPage({
  onLogin,
  onRegister,
  onVerifyOtp,
  onResendOtp,
  initialMode = 'login',
  onSwitchMode,
  loading,
  error,
}: AuthPageProps) {
  const [view, setView] = useState<AuthView>('auth');
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setView('auth');
    setLocalMessage(null);
    setOtp('');
    setOtpPreview(null);
    setShowPassword(false);
  }, [initialMode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (view === 'verify') {
      await onVerifyOtp(email, otp);
      return;
    }

    if (mode === 'login') {
      await onLogin(email, password);
      return;
    }

    const result = await onRegister(email, password);
    setView('verify');
    setOtpPreview(result.otpPreview ?? null);
    setLocalMessage('Registration successful. Enter OTP to verify your email.');
  };

  const handleResendOtp = async (): Promise<void> => {
    const result = await onResendOtp(email);
    setOtpPreview(result.otpPreview ?? null);
    setLocalMessage('New OTP sent successfully.');
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-0 py-10">
      <Card>
        <CardHeader>
          <CardTitle>
            {view === 'verify' ? 'Verify Email OTP' : mode === 'login' ? 'Login to Kuberns' : 'Create Kuberns Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            {view === 'verify' ? (
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium">
                  OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  required
                  maxLength={6}
                  minLength={6}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm tracking-[0.3em]"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {localMessage ? <p className="text-sm text-muted-foreground">{localMessage}</p> : null}
            {otpPreview ? <p className="text-sm text-primary">Dev OTP: {otpPreview}</p> : null}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Please wait...' : view === 'verify' ? 'Verify OTP' : mode === 'login' ? 'Login' : 'Register'}
            </Button>
          </form>

          {view === 'verify' ? (
            <div className="mt-4 flex items-center justify-between text-sm">
              <button type="button" onClick={() => void handleResendOtp()} className="text-primary hover:underline">
                Resend OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setView('auth');
                  setMode('login');
                }}
                className="text-muted-foreground hover:underline"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  const nextMode = mode === 'login' ? 'register' : 'login';
                  setMode(nextMode);
                  onSwitchMode?.(nextMode);
                }}
                className="text-primary hover:underline"
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
