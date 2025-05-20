import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// API test with direct backend connection
export async function PATCH(req: NextRequest) {
  try {
    const { port, endpoint, method, data } = await req.json();
    
    // Build the URL
    const baseUrl = `http://localhost:${port || 3001}`;
    const fullUrl = `${baseUrl}${endpoint || '/api/about'}`;
    
    console.log(`Debug API route - Testing direct connection to ${fullUrl} with method ${method}`);
    
    // Test the connection
    const response = await axios({
      method: method || 'GET',
      url: fullUrl,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3002',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
    return NextResponse.json({
      success: true,
      url: fullUrl,
      method,
      status: response.status,
      data: response.data
    });
  } catch (error: any) {
    console.error(`Debug API route - Direct test error:`, error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : null
    }, { status: 500 });
  }
} 