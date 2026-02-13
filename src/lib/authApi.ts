const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type AuthUser = {
  id: string;
  email: string;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload.data;
};

export const authApi = {
  async register(email: string, password: string): Promise<{ email: string; otpRequired: boolean; otpPreview?: string }> {
    return request<{ email: string; otpRequired: boolean; otpPreview?: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async login(email: string, password: string): Promise<AuthUser> {
    const data = await request<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    return data.user;
  },

  async me(): Promise<AuthUser> {
    const data = await request<{ user: AuthUser }>('/api/auth/me', {
      method: 'GET',
    });

    return data.user;
  },

  async logout(): Promise<void> {
    await request<null>('/api/auth/logout', {
      method: 'POST',
    });
  },

  async verifyOtp(email: string, otp: string): Promise<AuthUser> {
    const data = await request<{ user: AuthUser }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });

    return data.user;
  },

  async resendOtp(email: string): Promise<{ otpPreview?: string }> {
    return request<{ otpPreview?: string }>('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};
