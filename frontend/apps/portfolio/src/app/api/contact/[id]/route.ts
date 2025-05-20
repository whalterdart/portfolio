import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '../../../../../../../lib/services/contact.service';
import { ApiRouteAdapter } from '../../../../../../../lib/adapters/api-route.adapter';

const contactService = new ContactService();
const adapter = new ApiRouteAdapter(contactService);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return adapter.handleGetById(params.id);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return adapter.handleUpdate(params.id, req);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return adapter.handleDelete(params.id);
} 