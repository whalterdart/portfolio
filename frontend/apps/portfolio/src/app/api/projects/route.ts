import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '../../../../../../lib/services/project.service';
import { ApiRouteAdapter } from '../../../../../../lib/adapters/api-route.adapter';

const projectService = new ProjectService();
const adapter = new ApiRouteAdapter(projectService);

export async function GET(req: NextRequest) {
  return adapter.handleGetAll(req);
}

export async function POST(req: NextRequest) {
  return adapter.handleCreate(req);
}
