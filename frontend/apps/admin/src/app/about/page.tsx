"use client";

import { useEffect, useState } from 'react';
import { About } from '../../../../../lib/types/about.types';
import { AboutService } from '../../../../../lib/services/about.service';
import { Button, CircularProgress, Container, Typography, Paper, Box, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const emptyAbout: About = {
  title: '',
  description: '',
  skills: [],
  education: [],
  experience: []
};

export default function AboutPage() {
  const [abouts, setAbouts] = useState<About[]>([]);
  const [activeAbout, setActiveAbout] = useState<About | null>(null);
  const [selectedAbout, setSelectedAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activating, setActivating] = useState(false);

  const aboutService = new AboutService();
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação
    const authService = new (require('@lib/services/auth.service').AuthService)();
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    const fetchAbouts = async () => {
      try {
        setLoading(true);
        // Busca todos os registros about
        const allAbouts = await aboutService.findAll();
        setAbouts(allAbouts);
        
        // Identifica o about ativo
        const active = allAbouts.find(a => a.active === true);
        setActiveAbout(active || null);
        
        // Seleciona um about para edição (preferindo o ativo)
        if (active) {
          setSelectedAbout(active);
        } else if (allAbouts.length > 0) {
          setSelectedAbout(allAbouts[0]);
        } else {
          // Nenhum about encontrado, cria um vazio
          setSelectedAbout(emptyAbout);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError('Falha ao carregar dados do About');
        setSelectedAbout(emptyAbout);
      } finally {
        setLoading(false);
      }
    };

    fetchAbouts();
  }, []);

  const handleSetActive = async (aboutId: string) => {
    try {
      setActivating(true);
      setError('');
      
      await new Promise((resolve, reject) => {
        aboutService.setActive(aboutId).subscribe({
          next: (result) => {
            console.log('About ativado com sucesso:', result);
            
            // Atualiza todos os abouts para refletir o novo estado ativo
            setAbouts(prev => {
              // Mapeamento atualizado para garantir que apenas um about esteja ativo
              return prev.map(a => {
                const currentId = a.id || a._id as string;
                const resultId = result.id || result._id as string;
                
                if (currentId === resultId) {
                  // Este é o about que foi ativado, garantir que esteja com active: true
                  return { ...result, active: true };
                } else {
                  // Para outros abouts, garantir que estejam com active: false
                  return { ...a, active: false };
                }
              });
            });
            
            // Atualizar o about ativo global
            setActiveAbout(result);
            resolve(result);
          },
          error: (err) => {
            console.error('Error setting about as active:', err);
            setError('Falha ao definir about como ativo: ' + (err.response?.data?.message || err.message));
            reject(err);
          }
        });
      });
    } catch (err) {
      console.error('Error setting about as active:', err);
      setError('Ocorreu um erro ao definir o about como ativo');
    } finally {
      setActivating(false);
    }
  };
  
  const handleCreateNew = () => {
    router.push('/about/new');
  };
  
  const handleEditAbout = (about: About) => {
    const aboutId = about.id || about._id as string;
    router.push(`/about/edit/${aboutId}`);
  };

  const handleViewAbout = (about: About) => {
    const aboutId = about.id || about._id as string;
    router.push(`/about/view/${aboutId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', pt: 3, pb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: '#111827' }}>
            Gerenciar About (Sobre Mim)
          </Typography>
          
          {error && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: '#FEF2F2', 
                color: '#B91C1C',
                border: '1px solid #FCA5A5'
              }}
            >
              <Typography>{error}</Typography>
            </Paper>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              sx={{ 
                bgcolor: '#4F46E5', 
                '&:hover': { bgcolor: '#4338CA' },
                fontWeight: 'medium'
              }}
            >
              Novo About
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Lista de Abouts */}
              <Paper 
                elevation={0} 
                sx={{ 
                  width: { xs: '100%', md: '300px' }, 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#111827' }}>
                    Meus Abouts
                  </Typography>
                </Box>
                
                <List sx={{ p: 0 }}>
                  {abouts.length === 0 ? (
                    <ListItem>
                      <ListItemText 
                        primary="Nenhum about encontrado" 
                        secondary="Clique em 'Novo About' para criar"
                      />
                    </ListItem>
                  ) : (
                    abouts.map((about, index) => {
                      const isActive = about.active === true;
                      const aboutId = about.id || about._id as string;
                      
                      return (
                        <Box key={aboutId}>
                          {index > 0 && <Divider />}
                          <ListItem 
                            sx={{ 
                              cursor: 'pointer',
                              bgcolor: isActive ? '#F0F9FF' : 'transparent',
                              '&:hover': { bgcolor: isActive ? '#E0F2FE' : '#F9FAFB' }
                            }}
                          >
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ListItemText 
                                  primary={about.title} 
                                  secondary={isActive ? 'Ativo' : 'Inativo'}
                                  primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'regular' }}
                                  secondaryTypographyProps={{ 
                                    color: isActive ? 'primary' : 'textSecondary',
                                    fontWeight: isActive ? 'medium' : 'regular'
                                  }}
                                />
                                
                                {isActive && (
                                  <Chip 
                                    size="small" 
                                    color="primary" 
                                    label="Ativo" 
                                    sx={{ fontWeight: 'medium' }}
                                  />
                                )}
                              </Box>
                              
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button 
                                  size="small" 
                                  variant="outlined"
                                  onClick={() => handleViewAbout(about)}
                                  sx={{ 
                                    fontSize: '0.75rem',
                                    textTransform: 'none'
                                  }}
                                >
                                  Visualizar
                                </Button>
                                
                                <Button 
                                  size="small" 
                                  variant="outlined"
                                  startIcon={<EditIcon fontSize="small" />}
                                  onClick={() => handleEditAbout(about)}
                                  sx={{ 
                                    fontSize: '0.75rem',
                                    textTransform: 'none'
                                  }}
                                >
                                  Editar
                                </Button>
                                
                                {!isActive && (
                                  <Button 
                                    size="small" 
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CheckIcon fontSize="small" />}
                                    onClick={() => handleSetActive(aboutId)}
                                    disabled={activating}
                                    sx={{ 
                                      fontSize: '0.75rem',
                                      textTransform: 'none',
                                      ml: 'auto'
                                    }}
                                  >
                                    {activating ? 'Ativando...' : 'Definir como Ativo'}
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          </ListItem>
                        </Box>
                      );
                    })
                  )}
                </List>
              </Paper>
              
              {/* Info do About ativo */}
              <Paper 
                elevation={0} 
                sx={{ 
                  flexGrow: 1, 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#111827' }}>
                    About Ativo
                  </Typography>
                </Box>
                
                <Box sx={{ p: 3 }}>
                  {activeAbout ? (
                    <>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {activeAbout.title}
                      </Typography>
                      
                      <Typography variant="body1" sx={{ mb: 3, color: '#4B5563' }}>
                        {activeAbout.description}
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
                          Habilidades
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {activeAbout.skills.length > 0 ? (
                            activeAbout.skills.map((skill, index) => (
                              <Chip 
                                key={index} 
                                label={skill.name} 
                                size="small"
                                sx={{ bgcolor: '#F3F4F6' }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Nenhuma habilidade cadastrada
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="outlined" 
                          onClick={() => handleEditAbout(activeAbout)}
                          startIcon={<EditIcon />}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="contained"
                          onClick={() => handleViewAbout(activeAbout)}
                        >
                          Ver Detalhes
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography sx={{ mb: 2, color: '#6B7280' }}>
                        Nenhum about está definido como ativo
                      </Typography>
                      <Button 
                        variant="contained" 
                        onClick={handleCreateNew}
                        startIcon={<AddIcon />}
                      >
                        Criar Novo About
                      </Button>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}