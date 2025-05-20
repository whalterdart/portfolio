'use client';

import { Box, Container, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import { Home as HomeIcon, Folder as FolderIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { ProjectList } from '../../components/projects/ProjectList';

export default function ProjectsPage() {
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
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              color="text.primary"
            >
              <FolderIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Projetos
            </Typography>
          </Breadcrumbs>

          <ProjectList />
        </Container>
      </Box>
    </>
  );
}
