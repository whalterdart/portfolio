import { CrudAbstract } from '../abstracts/crud.abstract';
import { About } from '../types/about.types';
import { Observable, catchError, tap } from 'rxjs';
import axios from 'axios';

export class AboutService extends CrudAbstract<About> {
  protected endpoint = 'about';
  
  constructor() {
    super();
  }
  
  async findAll(): Promise<About[]> {
    try {
      console.log(`AboutService: Buscando todos os abouts em ${this.baseUrl}/${this.endpoint}`);
      const response = await this.http.get(`${this.endpoint}`);
      
      // Verificar se a resposta tem a estrutura esperada
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('AboutService: Erro ao buscar informações da API:', error);
      throw error;
    }
  }
  
  async findOne(id: string = 'current'): Promise<About | null> {
    try {
      // Usar a abordagem que funciona no ProjectService
      const isServer = typeof window === 'undefined';
      let url: string;
      
      if (isServer) {
        url = `${this.baseUrl}/${this.endpoint}/${id}`;
      } else {
        url = `${window.location.origin}/api/${this.endpoint}/${id}`;
      }
      
      console.log(`AboutService: Buscando about com ID ${id} em ${url}`);
      const response = await axios.get(url);
      
      // Verificar se a resposta tem a estrutura esperada
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`AboutService: Erro ao buscar about com ID ${id}:`, error);
      return null;
    }
  }
  
  // Override the create method to add additional logging
  create(obj: Partial<About>): Observable<About> {
    this.preCreate(obj);
    console.log(`AboutService: Creating about with data:`, JSON.stringify(obj, null, 2));
    
    return this.post<About>(this.getURLBase(), obj).pipe(
      tap(response => {
        console.log(`AboutService: Create successful, response:`, response);
      }),
      catchError(error => {
        console.error(`AboutService: Create error:`, error);
        if (error.response) {
          console.error(`AboutService: Error response:`, error.response.data);
        }
        throw error;
      })
    );
  }
  
  getCurrentAbout(): Observable<About> {
    return this.getById('current');
  }
  
  updateProfile(profile: Partial<About['profile']>): Observable<About> {
    return this.put<About>(`${this.getURLBase()}/profile`, { profile });
  }
  
  addSkill(skill: string): Observable<About> {
    return this.put<About>(`${this.getURLBase()}/skills/add`, { skill });
  }
  
  removeSkill(skill: string): Observable<About> {
    return this.put<About>(`${this.getURLBase()}/skills/remove`, { skill });
  }
  
  addEducation(education: any): Observable<About> {
    return this.put<About>(`${this.getURLBase()}/education/add`, { education });
  }
  
  updateEducation(index: number, education: any): Observable<About> {
    return this.put<About>(`${this.getURLBase()}/education/${index}`, { education });
  }
  
  removeEducation(index: number): Observable<About> {
    return this.put<About>(`${this.getURLBase()}/education/${index}/remove`, {});
  }
  
  addExperience(experience: any): Observable<About> {
    return this.put<About>(`${this.getURLBase()}/experience/add`, { experience });
  }
  
  updateExperience(index: number, experience: any): Observable<About> {
    return this.put<About>(`${this.getURLBase()}/experience/${index}`, { experience });
  }
  
  removeExperience(index: number): Observable<About> {
    return this.put<About>(`${this.getURLBase()}/experience/${index}/remove`, {});
  }
  
  // Método para definir um About como ativo
  setActive(id: string): Observable<About> {
    return this.patch<About>(`${this.getURLBase()}/${id}/set-active`, {});
  }
  
  // Método para obter o About ativo atual
  getCurrentActiveAbout(): Observable<About> {
    return this.getById('current');
  }

  async findActive(): Promise<About | null> {
    try {
      // Usar a abordagem que funciona no ProjectService
      const isServer = typeof window === 'undefined';
      let url: string;
      
      if (isServer) {
        url = `${this.baseUrl}/${this.endpoint}/current`;
      } else {
        url = `${window.location.origin}/api/${this.endpoint}/current`;
      }
      
      console.log(`AboutService: Buscando about ativo em ${url}`);
      const response = await axios.get(url);
      
      // Verificar se a resposta tem a estrutura esperada
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data || null;
    } catch (error) {
      console.error('AboutService: Erro ao buscar about ativo:', error);
      return null;
    }
  }
}