import { CrudAbstract, Pager } from '../abstracts/crud.abstract';
import { Profile } from '../types/profile.types';
import { Observable } from 'rxjs';
import axios from 'axios';

export class ProfileService extends CrudAbstract<Profile> {
  protected endpoint = 'profile';
  
  constructor() {
    super();
  }
  
  async findAll(): Promise<Profile[]> {
    try {
      // Usar a URL correta baseada no baseUrl do CrudAbstract
      const url = `${this.baseUrl}/${this.endpoint}`;
      
      // Log de debug para verificar a URL sendo usada
      console.log(`ProfileService: Buscando perfis da API em ${url} (baseUrl: ${this.baseUrl})`)
      
      console.log(`ProfileService: Buscando perfil da API em ${url}`);
      const response = await axios.get(url);
      const profiles = Array.isArray(response.data) ? response.data : [response.data];
      return profiles;
    } catch (error) {
      console.error('ProfileService: Erro ao buscar perfil da API:', error);
      throw error;
    }
  }
  
  async findActive(): Promise<Profile | null> {
    try {
      // Usar a abordagem que funciona no ProjectService
      const isServer = typeof window === 'undefined';
      let url: string;
      
      if (isServer) {
        url = `${this.baseUrl}/${this.endpoint}/active`;
      } else {
        url = `${window.location.origin}/api/${this.endpoint}/active`;
      }
      
      // Log de debug para verificar a URL sendo usada
      console.log(`ProfileService: Buscando perfil ativo da API em ${url}`);
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('ProfileService: Erro ao buscar perfil ativo da API:', error);
      if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 500)) {
        return null;
      }
      throw error;
    }
  }
  
  getProfile(id: string): Observable<Profile> {
    return this.getById(id);
  }
  
  getAllProfiles(page: number = 1, perPage: number = 10): Observable<Pager<Profile>> {
    return this.getList(page, perPage);
  }
  
  updateProfile(id: string, data: Partial<Profile>): Observable<Profile> {
    // Remove propriedades que podem causar conflitos com o MongoDB/NestJS
    // Extrai apenas os campos esperados pelo DTO do backend
    const sanitizedData = {
      name: data.name || '',
      highlightedText: data.highlightedText || '',
      description: data.description || '',
      socialLinks: (data.socialLinks || []).map(link => ({
        platform: link.platform,
        url: link.url,
        active: typeof link.active === 'boolean' ? link.active : true
      })),
      active: typeof data.active === 'boolean' ? data.active : true
    };
    
    // Converte para JSON e de volta para objeto para remover campos undefined
    const cleanData = JSON.parse(JSON.stringify(sanitizedData));
    console.log('ProfileService: Dados limpos para update:', cleanData);
    
    // Usa diretamente o método HTTP subjacente para evitar qualquer transformação adicional
    return this.put<Profile>(`${this.endpoint}/${id}`, cleanData);
  }
  
  addSocialLink(profileId: string, platform: string, url: string): Observable<Profile> {
    return this.post<Profile>(`${this.getURLBase()}/${profileId}/social`, { platform, url });
  }
  
  updateSocialLink(profileId: string, index: number, platform: string, url: string): Observable<Profile> {
    return this.put<Profile>(`${this.getURLBase()}/${profileId}/social/${index}`, { platform, url });
  }
  
  removeSocialLink(profileId: string, index: number): Observable<Profile> {
    return this.delete<Profile>(`${this.getURLBase()}/${profileId}/social/${index}`);
  }
  
  setActive(profileId: string): Observable<Profile> {
    return this.patch<Profile>(`${this.getURLBase()}/${profileId}/set-active`, {});
  }
}
