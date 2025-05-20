'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '../../../../../lib/services/auth.service';
import type { RegisterCredentials } from '../../../../../lib/types/auth.types';

// Material UI imports
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Container, 
  Alert, 
  Paper, 
  Divider, 
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const authService = new AuthService();

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const credentials: RegisterCredentials = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      await authService.register(credentials);
      window.location.href = '/login?registered=true';
    } catch (err) {
      console.error('Erro de registro:', err);
      setError('O registro falhou. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated shapes */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          '& .shape': {
            position: 'absolute',
            borderRadius: '50%',
            opacity: 0.15,
            animation: 'float 10s infinite ease-in-out'
          },
          '& .shape1': {
            top: -100,
            right: -100,
            width: 200,
            height: 200,
            background: '#9333EA'
          },
          '& .shape2': {
            top: 100,
            left: -120,
            width: 240,
            height: 240,
            background: '#3B82F6',
            animationDelay: '2s'
          },
          '& .shape3': {
            bottom: 0,
            right: 0,
            width: 160,
            height: 160,
            background: '#EC4899',
            animationDelay: '4s'
          }
        }}
      >
        <Box className="shape shape1" />
        <Box className="shape shape2" />
        <Box className="shape shape3" />
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo or Brand */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              background: 'linear-gradient(to right, #fff, #bfdbfe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Criar sua conta
          </Typography>
          <Typography variant="h6" sx={{ color: '#bfdbfe' }}>
            Preencha os dados para se registrar
          </Typography>
        </Box>

        {/* Card */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: 'white',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, animation: 'fadeIn 0.3s' }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome Completo"
              name="name"
              autoComplete="name"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                bgcolor: '#4F46E5',
                '&:hover': {
                  bgcolor: '#4338CA'
                },
                transition: 'all 0.2s'
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Processando...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>

            <Box sx={{ position: 'relative', my: 3 }}>
              <Divider>
                <Typography color="text.secondary">Já tem uma conta?</Typography>
              </Divider>
            </Box>

            <Button
              component={Link}
              href="/login"
              fullWidth
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{
                py: 1.5,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'rgba(79, 70, 229, 0.05)'
                }
              }}
            >
              Voltar para login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
