'use client';

import { useState } from 'react';
import { Box, Typography, Button, TextField, Container, Paper, MenuItem, Select, FormControl, InputLabel, Divider, Alert } from '@mui/material';
import { AdminHeader } from '../../components/layout/AdminHeader';
import axios from 'axios';

export default function DebugPage() {
  const [endpoint, setEndpoint] = useState('/api/about');
  const [method, setMethod] = useState('GET');
  const [payload, setPayload] = useState('{\n  "title": "Debug Test",\n  "description": "Test description",\n  "skills": [],\n  "education": [],\n  "experience": []\n}');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Find and replace all hardcoded URLs
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const BASE_URL = API_URL.replace('/api', '');

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let apiResponse;
      
      switch (method) {
        case 'GET':
          apiResponse = await axios.get(endpoint);
          break;
        case 'POST':
          apiResponse = await axios.post(endpoint, JSON.parse(payload));
          break;
        case 'PUT':
          apiResponse = await axios.put(endpoint, JSON.parse(payload));
          break;
        case 'DELETE':
          apiResponse = await axios.delete(endpoint);
          break;
        default:
          apiResponse = await axios.get(endpoint);
      }
      
      setResponse(apiResponse.data);
    } catch (err: any) {
      console.error('Debug API error:', err);
      setError(`${err.message}\n${err.response?.data ? JSON.stringify(err.response.data, null, 2) : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', pt: 3, pb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
            API Debug Tool
          </Typography>
          
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              Test API Endpoints
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="API Endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                helperText="Example: /api/about, /api/projects"
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Method</InputLabel>
                <Select
                  value={method}
                  label="Method"
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                </Select>
              </FormControl>
              
              {(method === 'POST' || method === 'PUT') && (
                <TextField
                  fullWidth
                  label="Request Payload (JSON)"
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  multiline
                  rows={8}
                  sx={{ mb: 2, fontFamily: 'monospace' }}
                />
              )}
              
              <Button 
                variant="contained" 
                onClick={handleTest}
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test Endpoint'}
              </Button>
            </Box>
          </Paper>
          
          {error && (
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#fff4f4', border: '1px solid #ffcdd2' }}>
              <Typography variant="h6" color="error" gutterBottom>
                Error
              </Typography>
              <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {error}
              </Typography>
            </Paper>
          )}
          
          {response && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="h6" gutterBottom>
                Response
              </Typography>
              <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {JSON.stringify(response, null, 2)}
              </Typography>
            </Paper>
          )}
          
          <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              Common API Endpoints
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button variant="outlined" size="small" onClick={() => setEndpoint(`${API_URL}/about`)}>
                GET /api/about
              </Button>
              <Button variant="outlined" size="small" onClick={() => {
                setEndpoint(`${API_URL}/about`);
                setMethod('POST');
              }}>
                POST /api/about
              </Button>
              <Button variant="outlined" size="small" onClick={() => setEndpoint(`${API_URL}/about/current`)}>
                GET /api/about/current
              </Button>
              <Button variant="outlined" size="small" onClick={() => setEndpoint(`${API_URL}/projects`)}>
                GET /api/projects
              </Button>
              <Button variant="outlined" size="small" onClick={() => setEndpoint(`${API_URL}/about`)}>
                NestJS: GET /api/about
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              API Diagnostic Tools
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={async () => {
                  setLoading(true);
                  try {
                    const response = await axios.get(`/api/debug?url=${API_URL}/about`);
                    setResponse(response.data);
                  } catch (err: any) {
                    setError(`Error: ${err.message}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Test Backend API Connection
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={async () => {
                  setLoading(true);
                  try {
                    const response = await axios.post(`${API_URL}/debug`, {
                      url: `${API_URL}/about`,
                      method: 'POST',
                      data: {
                        title: "Debug Test POST via Backend",
                        description: "Testing direct API connection to backend",
                        skills: [],
                        education: [],
                        experience: []
                      }
                    });
                    setResponse(response.data);
                  } catch (err: any) {
                    setError(`Error: ${err.message}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Test Backend API POST
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={async () => {
                  setLoading(true);
                  try {
                    // This tests if the local API route is working
                    const response = await axios.post(`${API_URL}/about`, {
                      title: "Debug Test via Local API",
                      description: "Testing API routing through Next.js",
                      skills: [],
                      education: [],
                      experience: []
                    });
                    setResponse(response.data);
                  } catch (err: any) {
                    setError(`Error: ${err.message}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Test Local API Routing
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              Direct Service Tests
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                color="warning"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const { AboutService } = await import('@lib/services/about.service');
                    const aboutService = new AboutService();
                    
                    // Create a simple about entry using the regular create method
                    const aboutData = {
                      title: "Test About via Direct API Call",
                      description: "This was created using a direct API call to the backend",
                      skills: [{name: "API Testing", level: 100, category: "Backend"}],
                      education: [],
                      experience: []
                    };
                    
                    // Use the regular create method that returns an Observable
                    await new Promise<any>((resolve, reject) => {
                      aboutService.create(aboutData).subscribe({
                        next: (result) => {
                          setResponse({
                            message: "About created successfully with direct call",
                            result
                          });
                          resolve(result);
                        },
                        error: (err) => {
                          setError(`Direct API Error: ${err.message}\n${err.response?.data ? JSON.stringify(err.response.data, null, 2) : ''}`);
                          reject(err);
                        }
                      });
                    });
                  } catch (err: any) {
                    setError(`Direct API Error: ${err.message}\n${err.response?.data ? JSON.stringify(err.response.data, null, 2) : ''}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Test Direct About Creation
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              API Connection Tester
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Test various API connections to diagnose connectivity issues:
              </Typography>
              
              <Button 
                variant="outlined" 
                onClick={async () => {
                  setLoading(true);
                  try {
                    const response = await axios.get(BASE_URL);
                    setResponse({
                      message: "Successfully connected to backend base URL",
                      status: response.status,
                      data: response.data
                    });
                  } catch (err: any) {
                    setError(`Backend base URL Error: ${err.message}\n${err.response?.data ? JSON.stringify(err.response.data, null, 2) : ''}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Test Backend Base URL ({BASE_URL})
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={async () => {
                  setLoading(true);
                  try {
                    const response = await axios.get(API_URL);
                    setResponse({
                      message: "Successfully connected to backend API root",
                      status: response.status,
                      data: response.data
                    });
                  } catch (err: any) {
                    setError(`Backend API Error: ${err.message}\n${err.response?.data ? JSON.stringify(err.response.data, null, 2) : ''}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Test Backend API Root ({API_URL})
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={async () => {
                  setLoading(true);
                  try {
                    const response = await axios.get(`${API_URL}/about`);
                    setResponse({
                      message: "Successfully connected to backend About API",
                      status: response.status,
                      data: response.data
                    });
                  } catch (err: any) {
                    setError(`Backend About API Error: ${err.message}\n${err.response?.data ? JSON.stringify(err.response.data, null, 2) : ''}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Test Backend About API ({API_URL}/about)
              </Button>
              
              {/* Different ports to try */}
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Try Different Ports:</Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[3000, 3001, 3002, 3003, 3004, 3005].map(port => (
                  <Button 
                    key={port}
                    size="small"
                    variant="outlined" 
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const response = await axios.get(`${BASE_URL}:${port}/api/about`);
                        setResponse({
                          message: `Successfully connected to port ${port}`,
                          status: response.status,
                          data: response.data
                        });
                      } catch (err: any) {
                        setError(`Port ${port} Error: ${err.message}\n${err.response?.data ? JSON.stringify(err.response.data, null, 2) : ''}`);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Test Port {port}
                  </Button>
                ))}
              </Box>
            </Box>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              Advanced API Testing
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Advanced API Testing:</Typography>
              
              <Button 
                variant="contained" 
                color="warning"
                onClick={async () => {
                  setLoading(true);
                  try {
                    // Use our special debug route to test the API with full control
                    const response = await axios.patch(`${API_URL}/debug`, {
                      port: 3001,
                      endpoint: `/api/about`,
                      method: 'POST',
                      data: {
                        title: "Debug Direct Test",
                        description: "Testing direct API connection with custom headers",
                        skills: [{name: "API Testing", level: 100, category: "Backend"}],
                        education: [],
                        experience: []
                      }
                    });
                    setResponse(response.data);
                  } catch (err: any) {
                    setError(`Direct API Testing Error: ${err.message}\n${err.response?.data ? JSON.stringify(err.response.data, null, 2) : ''}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Advanced API Test
              </Button>
            </Box>
          </Paper>
          
        </Container>
      </Box>
    </Box>
  );
} 