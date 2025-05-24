import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '../../../../../../lib/services/contact.service';
import { ApiRouteAdapter } from '../../../../../../lib/adapters/api-route.adapter';

const contactService = new ContactService();
const adapter = new ApiRouteAdapter(contactService);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  
  if (id) {
    try {
      return await adapter.handleGetById(id);
    } catch (error) {
      return NextResponse.json({ error: "Failed to get contact" }, { status: 500 });
    }
  }
  
  return adapter.handleGetAll(req);
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
  }
  
  try {
    return await adapter.handleUpdate(id, req);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
  }
  
  try {
    return await adapter.handleDelete(id);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return adapter.handleCreate(req);
} 