'use client';

import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Email, LocationOn, Phone } from '@mui/icons-material';
import ContactForm from './ContactForm';

interface ContactSectionProps {
  containerMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTitle?: boolean;
  marginTop?: number | string;
  email?: string;
  location?: string;
  phone?: string;
  description?: string;
}

const ContactSection = ({
  containerMaxWidth = 'lg',
  showTitle = true,
  marginTop = 0,
  email = 'whalterdev@gmail.com',
  location = 'Brasilia, Distrito Federal',
  phone = '(61) 99199-3353',
  description = 'Estou disponível para trabalhos freelance, projetos em equipe ou oportunidades de trabalho. Entre em contato para discutirmos como posso contribuir para seus projetos.'
}: ContactSectionProps) => {
  return (
    <Container maxWidth={containerMaxWidth} sx={{ position: 'relative', mt: marginTop }}>
      <Paper 
        elevation={4} 
        sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: { xs: 'auto', md: '600px' }
          }}
        >
          {/* Contact details section */}
          <Box 
            sx={{ 
              flex: '0 0 40%', 
              bgcolor: '#5b21b6', // Deep purple color from the image
              color: 'white',
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {showTitle && (
              <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                Informações de Contato
              </Typography>
            )}
            
            <Typography variant="body1" paragraph sx={{ mb: 4, lineHeight: 1.6 }}>
              {description}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    mr: 2
                  }}
                >
                  <Email sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Email:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {email}
                  </Typography>
                </Box>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    mr: 2
                  }}
                >
                  <Phone sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Telefone:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {phone}
                  </Typography>
                </Box>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    mr: 2
                  }}
                >
                  <LocationOn sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Localização:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {location}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* Contact form section */}
          <Box 
            sx={{ 
              flex: '1',
              bgcolor: '#4338ca', // Deep blue color from the image
              color: 'white',
              backgroundImage: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                opacity: 0.1,
                background: 'url(/images/pattern-dot.svg) repeat',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -80,
                left: -80,
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
              }}
            />
            <Box 
              sx={{ 
                position: 'relative', 
                zIndex: 1,
                width: '100%',
                maxWidth: { xs: '100%', md: '90%' },
                mx: 'auto',
                my: { xs: 3, md: 6 },
                px: '5px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <ContactForm showTitle={false} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactSection; 