'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { Navigation } from '../../components/layout/Navigation';
import { Footer } from '../../components/layout/Footer';
import AboutMeSection from '../../components/about/AboutMeSection';

export default function AboutPage() {
  const [loading, setLoading] = useState(true);

  // Handle loading state from child component
  const handleLoadingComplete = () => {
    setLoading(false);
  };

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
      
      {/* Hero section */}
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
            Sobre Mim
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
            Conheça mais sobre minha experiência, habilidades e trajetória profissional
          </Typography>
        </Container>
      </Box>

      {/* About content section */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 8, 
          position: 'relative', 
          mt: -6 
        }}
      >
        <Paper 
          elevation={4} 
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            p: { xs: 2, sm: 4, md: 6 },
            position: 'relative',
            zIndex: 1,
            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(245,247,250,1))',
            minHeight: 400 // Ensure minimum height for loading state
          }}
        >
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '30%',
              background: 'linear-gradient(to bottom, rgba(241,245,249,0.5), rgba(255,255,255,0))',
              zIndex: 0,
              opacity: 0.7
            }}
          />
          
          {/* Circle decorations */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              right: '5%',
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
              zIndex: 0
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              left: '5%',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, rgba(139, 92, 246, 0) 70%)',
              zIndex: 0
            }}
          />
          
          {/* Content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {loading && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '300px' 
              }}>
                <CircularProgress />
              </Box>
            )}
            <Box sx={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
              <AboutMeSection onLoadingComplete={handleLoadingComplete} />
            </Box>
          </Box>
        </Paper>
      </Container>
      
      <Footer />
      
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