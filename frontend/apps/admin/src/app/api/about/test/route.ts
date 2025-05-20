import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Test route: Received data:', body);

    // Add direct debugging to check URLs
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const url = `${apiUrl}/about`;
    
    console.log('Test route: Calling backend API directly at:', url);
    console.log('Test route: With data:', JSON.stringify(body, null, 2));
    
    // Make direct HTTP request to backend
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Test route: Backend response:', response.data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test successful', 
      backendResponse: response.data 
    });
  } catch (error: any) {
    console.error('Test route error:', error);
    console.error('Response data if available:', error.response?.data);
    console.error('Request data if available:', error.config?.data);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    }, { status: 500 });
  }
} 