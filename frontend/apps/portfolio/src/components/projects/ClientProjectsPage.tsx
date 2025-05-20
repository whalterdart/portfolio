'use client';

import React from 'react';
import { Project } from '../../../../../lib/types/project.types';
import { Box, Container, Typography, Divider, Paper } from '@mui/material';
import { ProjectCard } from './ProjectCard';
import dynamic from 'next/dynamic';

const TimelineComponent = dynamic(() => import('./TimelineComponent'), { ssr: false });

interface ClientProjectsPageProps {
  projects: Project[];
}

export default function ClientProjectsPage({ projects }: ClientProjectsPageProps) {
  const processedProjects = projects.map(project => ({
    ...project,
    createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
    updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt || project.createdAt)
  }));

  const noProjectsMessage = () => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h6" color="text.secondary">
        Nenhum projeto encontrado.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Os projetos adicionados pelo painel administrativo aparecerão aqui.
      </Typography>
    </Box>
  );

  const displayProjects: Project[] = processedProjects;

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Divider sx={{ flexGrow: 1, mr: 2 }} />
            <Typography variant="h4" component="h2" color="primary" fontWeight="bold">
              Linha do Tempo
            </Typography>
            <Divider sx={{ flexGrow: 1, ml: 2 }} />
          </Box>
          <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
            {displayProjects.length > 0 ? (
              <TimelineComponent projects={displayProjects} />
            ) : (
              noProjectsMessage()
            )}
          </Paper>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Divider sx={{ flexGrow: 1, mr: 2 }} />
          <Typography variant="h4" component="h2" color="primary" fontWeight="bold">
            Galeria de Projetos
          </Typography>
          <Divider sx={{ flexGrow: 1, ml: 2 }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {displayProjects.length > 0 ? (
            displayProjects.map((project) => (
              <Box key={project.id}>
                <ProjectCard project={project} />
              </Box>
            ))
          ) : (
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Nenhum projeto encontrado.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}
