'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Container } from '@mui/material';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { AboutForm } from '../../../components/about/AboutForm';

export default function NewAboutPage() {
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', pt: 3, pb: 6 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#111827' }}>
              Novo About
            </Typography>
          </Box>
          
          <AboutForm 
            onSuccess={() => router.push('/about')}
          />
        </Container>
      </Box>
    </Box>
  );
}
