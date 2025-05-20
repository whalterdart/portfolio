import { NextRequest, NextResponse } from 'next/server';
import { CrudAbstract, SearchParams } from '../abstracts/crud.abstract';

export class ApiRouteAdapter<T> {
  private service: CrudAbstract<T>;

  constructor(service: CrudAbstract<T>) {
    this.service = service;
  }

  async handleGetAll(req: NextRequest): Promise<NextResponse> {
    try {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const perPage = parseInt(url.searchParams.get('perPage') || '10');
      const search = url.searchParams.get('search') || undefined;
      
      const params: Partial<SearchParams> = {};
      url.searchParams.forEach((value, key) => {
        if (!['page', 'perPage', 'search'].includes(key)) {
          params[key] = value;
        }
      });
      
      if (url.searchParams.has('page') || url.searchParams.has('perPage')) {
        const result = await new Promise((resolve, reject) => {
          this.service.getList(page, perPage, search, params).subscribe({
            next: (res) => resolve(res),
            error: (err) => reject(err)
          });
        });
        return NextResponse.json(result);
      } 
      
      const items = await this.service.findAll();
      return NextResponse.json(items);
    } catch (error) {
      console.error('Erro ao buscar lista de itens:', error);
      return NextResponse.json({ error: 'Falha ao buscar dados' }, { status: 500 });
    }
  }

  async handleGetById(id: string): Promise<NextResponse> {
    try {
      const item = await this.service.findOne(id);
      
      if (!item) {
        return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
      }
      
      return NextResponse.json(item);
    } catch (error) {
      console.error(`Erro ao buscar item com ID ${id}:`, error);
      return NextResponse.json({ error: 'Falha ao buscar item' }, { status: 500 });
    }
  }
  
  async handleCreate(req: NextRequest): Promise<NextResponse> {
    try {
      const data = await req.json();
      console.log('ApiRouteAdapter: Attempting to create item with data:', JSON.stringify(data, null, 2));
      
      const result = await new Promise((resolve, reject) => {
        this.service.create(data).subscribe({
          next: (res) => {
            console.log('ApiRouteAdapter: Create successful:', res);
            resolve(res);
          },
          error: (err) => {
            console.error('ApiRouteAdapter: Create error:', err);
            console.error('ApiRouteAdapter: Error response data:', err.response?.data);
            console.error('ApiRouteAdapter: Error status:', err.response?.status);
            reject(err);
          }
        });
      });
      return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
      console.error('ApiRouteAdapter: Error creating item:', error);
      
      // Get more detailed error information
      let errorMessage = 'Falha ao criar item';
      let errorDetails = {};
      let statusCode = 500;
      
      if (error.response) {
        console.error('ApiRouteAdapter: Error response data:', error.response.data);
        statusCode = error.response.status || 500;
        errorMessage = error.response.data?.message || error.message || errorMessage;
        errorDetails = error.response.data || {};
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        details: errorDetails,
        status: statusCode
      }, { status: statusCode });
    }
  }
  
  async handleUpdate(id: string, req: NextRequest): Promise<NextResponse> {
    try {
      const data = await req.json();
      
      const result = await new Promise((resolve, reject) => {
        this.service.update(id, data).subscribe({
          next: (res) => resolve(res),
          error: (err) => reject(err)
        });
      });
      return NextResponse.json(result);
    } catch (error) {
      console.error(`Erro ao atualizar item com ID ${id}:`, error);
      return NextResponse.json({ error: 'Falha ao atualizar item' }, { status: 500 });
    }
  }
  
  async handleDelete(id: string): Promise<NextResponse> {
    try {
      await new Promise<void>((resolve, reject) => {
        this.service.remove(id).subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
      });
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error(`Erro ao excluir item com ID ${id}:`, error);
      return NextResponse.json({ error: 'Falha ao excluir item' }, { status: 500 });
    }
  }
}
