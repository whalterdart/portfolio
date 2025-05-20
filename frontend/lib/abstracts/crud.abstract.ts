import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Pager<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface SearchParams {
  [key: string]: string | number | boolean | undefined;
}

export abstract class CrudAbstract<T> {
  protected abstract endpoint: string;
  protected baseUrl: string;
  protected http: AxiosInstance;
  
  constructor() {
    // Definindo a URL base correta da API
    const isClient = typeof window !== 'undefined';
    
    if (isClient) {
      // No frontend, vamos usar a API baseada no host atual
      // para suportar acesso via localhost ou IP
      const protocol = window.location.protocol;
      const host = window.location.hostname; // hostname não inclui a porta
      const port = '3001'; // Porta fixa da API
      const apiUrl = `${protocol}//${host}:${port}/api`;
      
      this.baseUrl = apiUrl;
      console.log(`CrudAbstract: configurando baseUrl como ${apiUrl} (baseado no host atual)`);
      
      this.http = axios.create({
        baseURL: apiUrl,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    } else {
      // No server-side, aponta diretamente para a API NestJS
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      this.baseUrl = apiUrl;
      this.http = axios.create({
        baseURL: apiUrl,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    }
    
    console.log(`CrudAbstract: baseUrl definida como ${this.baseUrl}`);
  }
  
  // Core HTTP methods
  protected get<R>(url: string, config?: AxiosRequestConfig): Observable<R> {
    return from(this.http.get<R>(url, config)).pipe(
      map((response: AxiosResponse<R>) => {
        // Verificar se a resposta tem a estrutura esperada
        if (response.data && (response.data as any).data) {
          return (response.data as any).data;
        }
        return response.data;
      }),
      catchError(error => {
        console.error(`Error fetching from GET ${url}:`, error);
        return throwError(() => error);
      })
    );
  }

  protected post<R>(url: string, data?: any, config?: AxiosRequestConfig): Observable<R> {
    return from(this.http.post<R>(url, data, config)).pipe(
      map((response: AxiosResponse<R>) => {
        // Verificar se a resposta tem a estrutura esperada
        if (response.data && (response.data as any).data) {
          return (response.data as any).data;
        }
        return response.data;
      }),
      catchError(error => {
        console.error(`Error in POST to ${url}:`, error);
        return throwError(() => error);
      })
    );
  }

  protected put<R>(url: string, data?: any, config?: AxiosRequestConfig): Observable<R> {
    return from(this.http.put<R>(url, data, config)).pipe(
      map((response: AxiosResponse<R>) => {
        // Verificar se a resposta tem a estrutura esperada
        if (response.data && (response.data as any).data) {
          return (response.data as any).data;
        }
        return response.data;
      }),
      catchError(error => {
        console.error(`Error in PUT to ${url}:`, error);
        return throwError(() => error);
      })
    );
  }

  protected delete<R>(url: string, config?: AxiosRequestConfig): Observable<R> {
    return from(this.http.delete<R>(url, config)).pipe(
      map((response: AxiosResponse<R>) => {
        // Verificar se a resposta tem a estrutura esperada
        if (response.data && (response.data as any).data) {
          return (response.data as any).data;
        }
        return response.data;
      }),
      catchError(error => {
        console.error(`Error in DELETE to ${url}:`, error);
        return throwError(() => error);
      })
    );
  }
  
  protected patch<R>(url: string, data?: any, config?: AxiosRequestConfig): Observable<R> {
    return from(this.http.patch<R>(url, data, config)).pipe(
      map((response: AxiosResponse<R>) => {
        // Verificar se a resposta tem a estrutura esperada
        if (response.data && (response.data as any).data) {
          return (response.data as any).data;
        }
        return response.data;
      }),
      catchError(error => {
        console.error(`Error in PATCH to ${url}:`, error);
        return throwError(() => error);
      })
    );
  }
  
  // Lifecycle hooks
  protected preCreate(obj: Partial<T>): void {}
  protected preUpdate(obj: Partial<T>): void {}
  
  // URL helpers
  protected getURLBase(): string {
    return this.endpoint;
  }
  
  // High-level Observable-based CRUD methods
  getList(page: number = 1, perPage: number = 10, search?: string, params?: Partial<SearchParams>): Observable<Pager<T>> {
    let url = `${this.getURLBase()}?page=${page}&perPage=${perPage}`;
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url += `&${key}=${value}`;
        }
      });
    }
    
    return this.get<Pager<T>>(url);
  }
  
  getById(id: string): Observable<T> {
    return this.get<T>(`${this.getURLBase()}/${id}`);
  }
  
  create(obj: Partial<T>): Observable<T> {
    this.preCreate(obj);
    return this.post<T>(this.getURLBase(), obj);
  }
  
  update(id: string, obj: Partial<T>): Observable<T> {
    this.preUpdate(obj);
    return this.put<T>(`${this.getURLBase()}/${id}`, obj);
  }
  
  remove(id: string): Observable<void> {
    return this.delete<void>(`${this.getURLBase()}/${id}`);
  }
  
  // Promise-based methods for backwards compatibility
  async findAll(): Promise<T[]> {
    try {
      const response = await this.http.get<T[]>(this.endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching from API ${this.baseUrl}/${this.endpoint}:`, error);
      throw error;
    }
  }

  async findOne(id: string): Promise<T | null> {
    try {
      const response = await this.http.get<T>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error(`Error fetching item with id ${id}:`, error);
      throw error;
    }
  }
}
