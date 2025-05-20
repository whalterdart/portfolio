'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Email, LocationOn } from '@mui/icons-material';

interface ContactInfoProps {
  variant?: 'default' | 'compact';
  email?: string;
  location?: string;
  showTitle?: boolean;
}

const ContactInfo = ({ 
  variant = 'default', 
  email = 'whalterdev@gmail.com',
  location = 'Brasilia, Distrito Federal',
  showTitle = true
}: ContactInfoProps) => {
  const theme = useTheme();
  
  const isCompact = variant === 'compact';
  
  return (
    <Box sx={{ mt: 2 }}>
      {showTitle && (
        <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" sx={{ mb: isCompact ? 2 : 4 }}>
          Informações de Contato
        </Typography>
      )}
      
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateX(5px)'
          }
        }}
      >
        <Email sx={{ mr: 2, color: theme.palette.primary.light }} />
        <Typography variant="body1">
          <strong>Email:</strong> {email}
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateX(5px)'
          }
        }}
      >
        <LocationOn sx={{ mr: 2, color: theme.palette.primary.light }} />
        <Typography variant="body1">
          <strong>Localização:</strong> {location}
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactInfo; 