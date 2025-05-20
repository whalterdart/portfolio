import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// This route helps diagnose API connectivity issues
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url') || 'http://localhost:3001/api/about';
  
  console.log(`Debug API route - Testing connection to: ${targetUrl}`);
  
  try {
    const response = await axios.get(targetUrl);
    
    return NextResponse.json({
      success: true,
      url: targetUrl,
      status: response.status,
      data: response.data,
      headers: response.headers
    });
  } catch (error: any) {
    console.error(`Debug API route - Error connecting to ${targetUrl}:`, error);
    
    return NextResponse.json({
      success: false,
      url: targetUrl,
      error: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : null
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, method, data } = await req.json();
    
    console.log(`Debug API route - ${method} request to: ${url}`);
    console.log(`Debug API route - Request data:`, data);
    
    const response = await axios({
      method: method || 'GET',
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    return NextResponse.json({
      success: true,
      url,
      method,
      status: response.status,
      data: response.data
    });
  } catch (error: any) {
    console.error(`Debug API route - Error:`, error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    }, { status: 500 });
  }
} 