'use client';

import React from 'react';
import { Box, Container, Typography, Link, Stack, Divider, IconButton, useTheme } from '@mui/material';
import { GitHub, LinkedIn, Instagram, Email, ArrowUpward } from '@mui/icons-material';

export const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Box 
      component="footer" 
      sx={{
        py: 4,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <IconButton
            onClick={scrollToTop}
            aria-label="Voltar ao topo"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                transform: 'translateY(-5px)'
              },
              transition: 'all 0.3s',
              boxShadow: theme.shadows[4]
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Box>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          spacing={3}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              Whalter Duarte
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showcasing my skills and projects
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              &copy; {currentYear} All rights reserved.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Links Rápidos
            </Typography>
            <Stack spacing={1}>
              <Link href="/" color="inherit" underline="hover">Início</Link>
              <Link href="/projects" color="inherit" underline="hover">Projetos</Link>
              <Link href="/about" color="inherit" underline="hover">Sobre</Link>
              <Link href="/contact" color="inherit" underline="hover">Contato</Link>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Contato
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <IconButton 
                size="small" 
                aria-label="GitHub"
                href="https://github.com/whalterduarte"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                <GitHub fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="LinkedIn"
                href="https://www.linkedin.com/in/whalter-duarte/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="Email"
                href="mailto:whalterdev@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                <Email fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{ fontWeight: 300 }}
        >
          Desenvolvido com ❤️ usando React, Next.js e Material-UI
        </Typography>
      </Container>
    </Box>
  );
}; 