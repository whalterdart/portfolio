'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Container, Breadcrumbs, Link } from '@mui/material';
import { Home as HomeIcon, Folder as FolderIcon, Edit as EditIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { AdminHeader } from '../../../../components/layout/AdminHeader';
import { ProjectForm } from '../../../../components/projects/ProjectForm';
import { use } from 'react';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  return (
    <>
      <AdminHeader />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          px: 2,
          bgcolor: 'background.default'
        }}
      >
        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<ChevronRightIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 3 }}
          >
            <Link
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              href="/dashboard"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </Link>
            <Link
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              href="/projects"
            >
              <FolderIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Projetos
            </Link>
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              color="text.primary"
            >
              <EditIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Editar Projeto
            </Typography>
          </Breadcrumbs>

          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Editar Projeto
            </Typography>
          </Box>

          {/* Form */}
          <ProjectForm
            projectId={projectId}
            onSuccess={() => {
              router.push('/projects');
              router.refresh();
            }}
          />
        </Container>
      </Box>
    </>
  );
} 