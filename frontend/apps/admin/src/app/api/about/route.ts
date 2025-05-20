import { NextRequest, NextResponse } from 'next/server';
import { AboutService } from '@lib/services/about.service';
import { ApiRouteAdapter } from '@lib/adapters/api-route.adapter';
import axios from 'axios';

const aboutService = new AboutService();
const adapter = new ApiRouteAdapter(aboutService);
const API_URL = 'http://localhost:3001/api';

export async function GET(req: NextRequest) {
  console.log('Admin API Route - GET /api/about received');
  
  // Verificar se a URL tem o parâmetro de caminho 'current' ou um ID específico
  const url = new URL(req.url);
  const pathname = url.pathname;
  const pathParts = pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  
  console.log('Admin API Route - GET pathname:', pathname, 'lastPart:', lastPart);
  
  if (lastPart === 'current') {
    try {
      // Buscar o about ativo diretamente do backend
      const response = await axios.get(`${API_URL}/about/current`);
      return NextResponse.json(response.data);
    } catch (error) {
      console.error('Erro ao buscar about ativo:', error);
      return NextResponse.json({ error: 'Falha ao buscar about ativo' }, { status: 500 });
    }
  } else if (lastPart !== 'about') {
    // Se não for 'about' nem 'current', considera como ID específico
    try {
      const response = await axios.get(`${API_URL}/about/${lastPart}`);
      return NextResponse.json(response.data);
    } catch (error) {
      console.error(`Erro ao buscar about com ID ${lastPart}:`, error);
      return NextResponse.json({ error: 'Falha ao buscar about específico' }, { status: 500 });
    }
  }
  
  // Caso contrário, buscar todos os abouts
  try {
    const response = await axios.get(`${API_URL}/about`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar todos os abouts:', error);
    return NextResponse.json({ error: 'Falha ao buscar abouts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('Admin API Route - POST /api/about received');
  
  try {
    const data = await req.json();
    console.log('Admin API Route - Forwarding POST to backend:', JSON.stringify(data, null, 2));
    
    const response = await axios.post(`${API_URL}/about`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error('Admin API Route - Error in POST /api/about:', error.message);
    
    if (error.response) {
      console.error('Admin API Route - Response status:', error.response.status);
      console.error('Admin API Route - Response data:', error.response.data);
      
      return NextResponse.json({ 
        error: 'Failed to create about entry',
        details: error.response.data
      }, { status: error.response.status || 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create about entry',
      message: error.message
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  console.log('Admin API Route - PUT /api/about received');
  
  const url = new URL(req.url);
  const pathname = url.pathname;
  const pathParts = pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  
  console.log('Admin API Route - PUT pathname:', pathname, 'id:', id);
  
  try {
    const data = await req.json();
    
    if (id === 'activate') {
      const aboutId = data.id;
      
      if (!aboutId) {
        return NextResponse.json({ error: 'ID do about não fornecido' }, { status: 400 });
      }
      
      const response = await axios.patch(`${API_URL}/about/${aboutId}/set-active`, {});
      return NextResponse.json(response.data);
    }
    
    const response = await axios.put(`${API_URL}/about/${id}`, data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`Erro ao atualizar about:`, error.message);
    return NextResponse.json({ error: 'Falha ao atualizar about' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  console.log('Admin API Route - DELETE /api/about received');
  
  const url = new URL(req.url);
  const pathname = url.pathname;
  const pathParts = pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  
  console.log('Admin API Route - DELETE pathname:', pathname, 'id:', id);
  
  try {
    const response = await axios.delete(`${API_URL}/about/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`Erro ao excluir about:`, error.message);
    return NextResponse.json({ error: 'Falha ao excluir about' }, { status: 500 });
  }
}
