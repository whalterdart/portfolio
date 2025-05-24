'use client';

import { useEffect, useState } from 'react';
import { ProjectService } from '../../../../../lib/services/project.service';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { Navigation } from '../../components/layout/Navigation';
import { Footer } from '../../components/layout/Footer';
import ClientProjectsPage from '../../components/projects/ClientProjectsPage';
import { Project } from '../../../../../lib/types/project.types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectService = new ProjectService();
        const projectsData = await projectService.findAll();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Navigation />
      
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #5b21b6 0%, #1e40af 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          mb: 6,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.3), rgba(139, 92, 246, 0))',
            filter: 'blur(50px)',
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(96, 165, 250, 0.4), rgba(59, 130, 246, 0))',
            filter: 'blur(60px)',
            opacity: 0.7,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Meus Projetos
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ maxWidth: 800, mx: 'auto', opacity: 0.8, mb: 4 }}
          >
            Confira abaixo alguns dos meus trabalhos mais recentes e descubra como posso ajudar em seu próximo projeto.
          </Typography>
        </Container>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ClientProjectsPage projects={projects} />
      )}

      <Footer />
    </Box>
  );
}
