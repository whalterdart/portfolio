import { CrudAbstract, Pager } from '../abstracts/crud.abstract';
import { Project } from '../types/project.types';
import { Observable } from 'rxjs';
import axios from 'axios';

export class ProjectService extends CrudAbstract<Project> {
  protected endpoint = 'projects';
  
  constructor() {
    super();
  }
  
  async findAll(): Promise<Project[]> {
    try {
      const isServer = typeof window === 'undefined';
      let url: string;
      
      if (isServer) {
        url = `${this.baseUrl}/${this.endpoint}`;
      } else {
        url = `${window.location.origin}/api/${this.endpoint}`;
      }
      
      console.log(`ProjectService: Buscando projetos da API em ${url}`);
      const response = await axios.get(url);
      const projects = Array.isArray(response.data) ? response.data : [response.data];
      return projects;
    } catch (error) {
      console.error('ProjectService: Erro ao buscar projetos da API:', error);
      throw error;
    }
  }
  
  getProject(id: string): Observable<Project> {
    return this.getById(id);
  }
  
  getAllProjects(page: number = 1, perPage: number = 10): Observable<Pager<Project>> {
    return this.getList(page, perPage);
  }
  
  getProjectsWithTech(technology: string): Observable<Project[]> {
    return this.get<Project[]>(`${this.getURLBase()}/tech/${technology}`);
  }
  
  getProjectsPaged(page: number, perPage: number, tech?: string): Observable<Pager<Project>> {
    if (!tech) {
      return this.getList(page, perPage);
    }
    return this.getList(page, perPage, undefined, { tech });
  }
  
  toggleProjectStatus(projectId: string, active: boolean): Observable<Project> {
    return this.put<Project>(`${this.getURLBase()}/status/${projectId}`, { active });
  }
}
