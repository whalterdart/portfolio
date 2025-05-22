import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log('[DEBUG] Contact form data received:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        missingFields,
        receivedData: data
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Form data is valid',
      data
    });
  } catch (error) {
    console.error('[DEBUG] Error processing contact form data:', error);
    return NextResponse.json({ 
      error: 'Error processing data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 