import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '../../../../../../lib/services/profile.service';
import { ApiRouteAdapter } from '../../../../../../lib/adapters/api-route.adapter';

const profileService = new ProfileService();
const adapter = new ApiRouteAdapter(profileService);

export async function GET(req: NextRequest) {
  // Check if the URL has the 'active' path parameter
  const url = new URL(req.url);
  const pathname = url.pathname;
  
  if (pathname.endsWith('/active')) {
    try {
      const profile = await profileService.findActive();
      if (!profile) {
        return NextResponse.json({ error: 'No active profile found' }, { status: 404 });
      }
      return NextResponse.json(profile);
    } catch (error) {
      console.error('Error fetching active profile:', error);
      return NextResponse.json({ error: 'Failed to fetch active profile' }, { status: 500 });
    }
  }
  
  return adapter.handleGetAll(req);
}

export async function POST(req: NextRequest) {
  return adapter.handleCreate(req);
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  
  return adapter.handleUpdate(id, req);
}
