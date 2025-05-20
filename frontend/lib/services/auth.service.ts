import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import Cookies from 'js-cookie';

export class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${this.baseUrl}/auth/login`, credentials);
    this.setToken(response.data.access_token);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${this.baseUrl}/auth/register`, credentials);
    return response.data;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      Cookies.set('token', token, { expires: 7 });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return Cookies.get('token') || null;
    }
    return null;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove('token');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
