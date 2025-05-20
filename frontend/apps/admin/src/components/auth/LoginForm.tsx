'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '../../../../../lib/services/auth.service';

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
  ArrowForward as ArrowForwardIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

const authService = new AuthService();

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Registro realizado com sucesso! Por favor, faça login.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await authService.login({ email, password });
      // Removida a verificação de role para permitir qualquer usuário logado
      // Usar uma abordagem mais forçada para redirecionamento
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Erro de login:', err);
      setError('Credenciais inválidas ou acesso não autorizado');
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
            Painel Admin
          </Typography>
          <Typography variant="h6" sx={{ color: '#bfdbfe' }}>
            Gerencie seu portfólio com facilidade
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

            {success && (
              <Alert severity="success" sx={{ mb: 2, animation: 'fadeIn 0.3s' }}>
                {success}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
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
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowForwardIcon sx={{ ml: 1 }} />
                </>
              )}
            </Button>

            <Box sx={{ position: 'relative', my: 3 }}>
              <Divider>
                <Typography color="text.secondary">Ou</Typography>
              </Divider>
            </Box>

            <Button
              component={Link}
              href="/register"
              fullWidth
              variant="outlined"
              startIcon={<PersonAddIcon />}
              sx={{
                py: 1.5,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'rgba(79, 70, 229, 0.05)'
                }
              }}
            >
              Criar uma nova conta
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
