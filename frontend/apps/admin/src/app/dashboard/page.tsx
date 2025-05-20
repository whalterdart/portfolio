'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@lib/services/auth.service';
import { AdminHeader } from '@/components/layout/AdminHeader';

// Material UI imports
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Info as AboutIcon
} from '@mui/icons-material';

const authService = new AuthService();

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', pt: 3, pb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: '#111827' }}>
            Dashboard
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Projeto Card */}
            <Card elevation={2} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ViewListIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Projetos
                  </Typography>
                </Box>
                <Typography variant="h3" color="text.primary" sx={{ fontWeight: 'medium' }}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Total de projetos publicados
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" href="/projects">
                  Ver todos
                </Button>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<AddIcon />}
                  href="/projects/new"
                >
                  Adicionar
                </Button>
              </CardActions>
            </Card>

            {/* About Card */}
            <Card elevation={2} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AboutIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    About (Sobre Mim)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Gerencie informações do seu perfil, habilidades e experiências
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" href="/about">
                  Ver todos
                </Button>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<AddIcon />}
                  href="/about/new"
                >
                  Adicionar
                </Button>
              </CardActions>
            </Card>

            {/* Estatísticas Card */}
            <Card elevation={2} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Estatísticas
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Visualize as estatísticas de visitantes e interações com seu portfólio
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Ver relatório
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
