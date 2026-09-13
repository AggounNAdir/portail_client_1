// Service d'authentification

import { apiClient } from './apiClient';

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export class AuthService {
  async login(codeClient: string, password: string): Promise<LoginResponse> {
    const trimmedCode = codeClient.trim();

    try {
      const data = await apiClient.request<any>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            code_client: trimmedCode,
            password: password,
          }),
        },
        () => {
          // Fallback d'authentification locale pour démo/test
          if (password.length >= 4) {
            return {
              access_token: `jwt-demo-${Date.now()}`,
              token_type: 'bearer',
            };
          }
          throw new Error('Code client ou mot de passe incorrect.');
        }
      );

      const token = data.access_token || data.accessToken;
      apiClient.saveToken(token, trimmedCode);

      return {
        accessToken: token,
        tokenType: data.token_type || 'bearer',
      };
    } catch (err: any) {
      throw new Error(err.message || 'Erreur de connexion');
    }
  }

  async logout(): Promise<void> {
    apiClient.clearAuth();
  }

  isAuthenticated(): boolean {
    return apiClient.hasToken();
  }

  getCachedCodeClient(): string | null {
    return apiClient.getCachedCodeClient();
  }
}

export const authService = new AuthService();
