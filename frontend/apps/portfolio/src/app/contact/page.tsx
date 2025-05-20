'use client';

import { useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { Navigation } from '../../components/layout/Navigation';
import { Footer } from '../../components/layout/Footer';
import ContactSection from '../../components/contact/ContactSection';

export default function ContactPage() {
  // Add parallax background elements
  useEffect(() => {
    // Add client-side effect to match the home page visual style
    const handleScroll = () => {
      // Could add parallax scrolling effects if needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Navigation />
      <Box
        sx={{
          background: 'linear-gradient(135deg, #5b21b6 0%, #1e40af 100%)',
          py: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background visual elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            left: '10%',
            top: '40%',
            background: 'radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.3), rgba(139, 92, 246, 0))',
            borderRadius: '50%',
            filter: 'blur(50px)',
            opacity: 0.7,
            animation: 'pulse 8s infinite alternate'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            right: '5%',
            top: '10%',
            background: 'radial-gradient(circle at 30% 30%, rgba(96, 165, 250, 0.4), rgba(59, 130, 246, 0))',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.7,
            animation: 'pulse 10s infinite alternate',
            animationDelay: '2s'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            Entre em Contato
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '800px',
              mx: 'auto',
              mb: 6,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Tem um projeto em mente? Vamos conversar sobre como posso ajudar!
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <ContactSection marginTop="-2" />
      </Box>
      
      <Box sx={{ mt: { xs: 4, md: 6 } }}>
        <Footer />
      </Box>
      
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0.5; transform: scale(0.95); }
        }
      `}</style>
    </Box>
  );
} 