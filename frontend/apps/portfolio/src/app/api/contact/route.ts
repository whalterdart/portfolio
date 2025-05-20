import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '../../../../../../lib/services/contact.service';
import { ApiRouteAdapter } from '../../../../../../lib/adapters/api-route.adapter';

const contactService = new ContactService();
const adapter = new ApiRouteAdapter(contactService);

export async function GET(req: NextRequest) {
  return adapter.handleGetAll(req);
}

export async function POST(req: NextRequest) {
  return adapter.handleCreate(req);
} 