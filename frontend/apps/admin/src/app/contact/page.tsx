'use client';

import { Box, Typography, Container, Paper, Breadcrumbs, Link } from '@mui/material';
import { Home as HomeIcon, Email as EmailIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { AdminHeader } from '../../components/layout/AdminHeader';
import ContactList from '../../components/contact/ContactList';

export default function ContactPage() {
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
              <EmailIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Mensagens de Contato
            </Typography>
          </Breadcrumbs>

          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Mensagens de Contato
            </Typography>
          </Box>

          {/* Contact List */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            <ContactList />
          </Paper>
        </Container>
      </Box>
    </>
  );
} 