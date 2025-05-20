import { NextRequest, NextResponse } from 'next/server';
import { AboutService } from '../../../../../../lib/services/about.service';
import { ApiRouteAdapter } from '../../../../../../lib/adapters/api-route.adapter';

const aboutService = new AboutService();
const adapter = new ApiRouteAdapter(aboutService);

export async function GET(req: NextRequest) {
  // Verificar se a URL tem o parâmetro de caminho 'current' ou um ID específico
  const url = new URL(req.url);
  const pathname = url.pathname;
  const pathParts = pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  
  if (lastPart === 'current') {
    try {
      // Buscar o about ativo
      const about = await aboutService.findActive();
      if (!about) {
        return NextResponse.json({ error: 'Nenhum about ativo encontrado' }, { status: 404 });
      }
      return NextResponse.json(about);
    } catch (error) {
      console.error('Erro ao buscar about ativo:', error);
      return NextResponse.json({ error: 'Falha ao buscar about ativo' }, { status: 500 });
    }
  } else if (lastPart !== 'about') {
    // Se não for 'about' nem 'current', considera como ID específico
    try {
      const about = await aboutService.findOne(lastPart);
      if (!about) {
        return NextResponse.json({ error: 'About não encontrado' }, { status: 404 });
      }
      return NextResponse.json(about);
    } catch (error) {
      console.error(`Erro ao buscar about com ID ${lastPart}:`, error);
      return NextResponse.json({ error: 'Falha ao buscar about específico' }, { status: 500 });
    }
  }
  
  // Caso contrário, buscar todos os abouts
  return adapter.handleGetAll(req);
}

export async function POST(req: NextRequest) {
  return adapter.handleCreate(req);
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  
  if (id === 'activate') {
    try {
      const data = await req.json();
      const aboutId = data.id;
      
      if (!aboutId) {
        return NextResponse.json({ error: 'ID do about não fornecido' }, { status: 400 });
      }
      
      const result = await aboutService.setActive(aboutId);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Erro ao ativar about:', error);
      return NextResponse.json({ error: 'Falha ao ativar about' }, { status: 500 });
    }
  }
  
  return adapter.handleUpdate(id, req);
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  
  return adapter.handleDelete(id, req);
}
