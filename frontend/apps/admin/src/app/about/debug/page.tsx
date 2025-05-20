'use client';

import { useState } from 'react';
import { Box, Button, Container, Typography, Paper, TextField, CircularProgress } from '@mui/material';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import axios from 'axios';

export default function DebugAboutApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Basic test data
  const testData = {
    title: "Debug Test",
    description: "This is a test from the debug page",
    skills: [
      {
        name: "Testing",
        level: 100,
        category: "Debug"
      }
    ],
    education: [],
    experience: [],
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
      instagram: ""
    },
    active: false
  };

  const testDirectBackendApi = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);

      console.log('Testing direct backend API connection...');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      console.log('Using API URL:', apiUrl);

      const response = await axios.post(`${apiUrl}/about`, testData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Direct backend API response:', response.data);
      setResult({
        method: 'Direct to Backend',
        data: response.data
      });
    } catch (err: any) {
      console.error('Direct backend API error:', err);
      setError(`Direct backend error: ${err.message} - ${JSON.stringify(err.response?.data || {})}`);
    } finally {
      setLoading(false);
    }
  };

  const testNextjsApiRoute = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);

      console.log('Testing Next.js API route...');
      const response = await axios.post('/api/about/test', testData);

      console.log('Next.js API route response:', response.data);
      setResult({
        method: 'Next.js API Route',
        data: response.data
      });
    } catch (err: any) {
      console.error('Next.js API route error:', err);
      setError(`Next.js API route error: ${err.message} - ${JSON.stringify(err.response?.data || {})}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegularApiRoute = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);

      console.log('Testing regular API route...');
      const response = await axios.post('/api/about', testData);

      console.log('Regular API route response:', response.data);
      setResult({
        method: 'Regular API Route',
        data: response.data
      });
    } catch (err: any) {
      console.error('Regular API route error:', err);
      setError(`Regular API route error: ${err.message} - ${JSON.stringify(err.response?.data || {})}`);
    } finally {
      setLoading(false);
    }
  };

  const testAdminApiRoute = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);

      console.log('Testing Admin API route directly...');
      // Force using the current window's hostname and port
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/about`;
      
      console.log('Direct Admin API request to:', url);
      const response = await axios.post(url, testData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Direct Admin API response:', response.data);
      setResult({
        method: 'Direct Admin API Request',
        data: response.data
      });
    } catch (err: any) {
      console.error('Direct Admin API error:', err);
      setError(`Direct Admin API error: ${err.message} - ${JSON.stringify(err.response?.data || {})}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', pt: 3, pb: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
            Debug About API
          </Typography>
          
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Test API Connection</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              This page will help diagnose API connection issues by testing different methods to create an About entry.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                onClick={testDirectBackendApi}
                disabled={loading}
              >
                Test Direct Backend API
              </Button>
              
              <Button 
                variant="contained" 
                onClick={testNextjsApiRoute}
                disabled={loading}
              >
                Test Next.js API Route
              </Button>
              
              <Button 
                variant="contained" 
                onClick={testRegularApiRoute}
                disabled={loading}
              >
                Test Regular API Route
              </Button>
              
              <Button 
                variant="contained" 
                onClick={testAdminApiRoute}
                disabled={loading}
                color="secondary"
              >
                Test Direct Admin API Route
              </Button>
            </Box>
            
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            )}
            
            {error && (
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#fef2f2', color: '#b91c1c' }}>
                <Typography variant="subtitle1" fontWeight="bold">Error:</Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{error}</Typography>
              </Paper>
            )}
            
            {result && (
              <Paper sx={{ p: 2, bgcolor: '#f0fdf4' }}>
                <Typography variant="subtitle1" fontWeight="bold">Result ({result.method}):</Typography>
                <Box 
                  component="pre" 
                  sx={{ 
                    mt: 1, 
                    p: 2, 
                    bgcolor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: 1,
                    overflowX: 'auto'
                  }}
                >
                  {JSON.stringify(result.data, null, 2)}
                </Box>
              </Paper>
            )}
          </Paper>
          
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Test Data Being Sent</Typography>
            <Box 
              component="pre" 
              sx={{ 
                mt: 1, 
                p: 2, 
                bgcolor: '#f8fafc', 
                border: '1px solid #e2e8f0',
                borderRadius: 1,
                overflowX: 'auto'
              }}
            >
              {JSON.stringify(testData, null, 2)}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
} 