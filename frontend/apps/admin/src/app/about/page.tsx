"use client";

import { useEffect, useState } from 'react';
import { About } from '../../../../../lib/types/about.types';
import { AboutService } from '../../../../../lib/services/about.service';
import { Button, CircularProgress, Container, Typography, Paper, Box, List, ListItem, ListItemText, Divider, Chip, Tooltip, Alert } from '@mui/material';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon, Visibility as VisibilityIcon, Person as PersonIcon, Code as CodeIcon } from '@mui/icons-material';
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

  // Função para truncar texto com limite de caracteres
  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', pt: 3, pb: 6 }}>
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              mb: 4, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 'bold', 
              color: '#111827',
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}>
              Gerenciar About (Sobre Mim)
            </Typography>
            
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              sx={{ 
                bgcolor: '#4F46E5', 
                '&:hover': { bgcolor: '#4338CA' },
                fontWeight: 'medium',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              Novo About
            </Button>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: '8px',
                '& .MuiAlert-icon': {
                  color: '#DC2626'
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              my: 8,
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress sx={{ color: '#4F46E5' }} />
              <Typography color="text.secondary">Carregando informações...</Typography>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              gap: 3,
              alignItems: 'stretch',
              width: '100%'
            }}>
              {/* Lista de Abouts */}
              <Paper 
                elevation={0} 
                sx={{ 
                  width: { xs: '100%', md: '350px' }, 
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: 'fit-content',
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                  mb: { xs: 3, md: 0 }
                }}
              >
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#F9FAFB', 
                  borderBottom: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#111827' }}>
                    Meus Abouts
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      bgcolor: '#F3F4F6', 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: '6px',
                      fontWeight: 'medium' 
                    }}
                  >
                    Total: {abouts.length}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  overflow: 'auto',
                  maxHeight: { xs: '400px', md: '600px' },
                  flexGrow: 1
                }}>
                  <List sx={{ 
                    p: 0,
                    '& .MuiListItem-root': {
                      transition: 'background-color 0.2s ease'
                    }
                  }}>
                    {abouts.length === 0 ? (
                      <Box sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                      }}>
                        <Box 
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            borderRadius: '50%', 
                            bgcolor: '#F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 30, color: '#9CA3AF' }} />
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#6B7280' }}>
                          Nenhum about encontrado
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Clique em 'Novo About' para criar
                        </Typography>
                      </Box>
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
                                bgcolor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                                '&:hover': { 
                                  bgcolor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'rgba(0, 0, 0, 0.02)' 
                                },
                                p: 2
                              }}
                            >
                              <Box sx={{ 
                                width: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 1.5 
                              }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'flex-start', 
                                  width: '100%' 
                                }}>
                                  <Box sx={{ 
                                    maxWidth: 'calc(100% - 60px)',
                                    overflow: 'hidden'
                                  }}>
                                    <Tooltip title={about.title} placement="top">
                                      <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                          fontWeight: isActive ? 'bold' : 'medium',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          maxWidth: '100%',
                                          color: isActive ? '#3B82F6' : '#111827'
                                        }}
                                      >
                                        {about.title}
                                      </Typography>
                                    </Tooltip>
                                    <Box sx={{ 
                                      mt: 0.5, 
                                      display: 'flex', 
                                      alignItems: 'center',
                                      gap: 1
                                    }}>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          color: isActive ? 'primary.main' : 'text.secondary',
                                          fontWeight: isActive ? 'medium' : 'regular',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical'
                                        }}
                                      >
                                        {truncateText(about.description, 50)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  
                                  {isActive && (
                                    <Chip 
                                      size="small" 
                                      color="primary" 
                                      label="Ativo" 
                                      sx={{ 
                                        fontWeight: 'medium', 
                                        flexShrink: 0,
                                        bgcolor: '#3B82F6',
                                        mt: 0.5
                                      }}
                                    />
                                  )}
                                </Box>
                                
                                <Box sx={{ 
                                  display: 'flex', 
                                  gap: 1, 
                                  flexWrap: 'wrap',
                                  mt: 1,
                                  pt: 1,
                                  borderTop: '1px solid #F3F4F6',
                                  justifyContent: { xs: 'flex-start', sm: 'space-between' }
                                }}>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button 
                                      size="small" 
                                      variant="outlined"
                                      onClick={() => handleViewAbout(about)}
                                      startIcon={<VisibilityIcon fontSize="small" />}
                                      sx={{ 
                                        fontSize: '0.75rem',
                                        textTransform: 'none',
                                        borderRadius: '6px',
                                        borderColor: '#E5E7EB',
                                        color: '#6B7280',
                                        '&:hover': {
                                          borderColor: '#9CA3AF',
                                          bgcolor: 'rgba(156, 163, 175, 0.04)'
                                        }
                                      }}
                                    >
                                      Ver
                                    </Button>
                                    
                                    <Button 
                                      size="small" 
                                      variant="outlined"
                                      startIcon={<EditIcon fontSize="small" />}
                                      onClick={() => handleEditAbout(about)}
                                      sx={{ 
                                        fontSize: '0.75rem',
                                        textTransform: 'none',
                                        borderRadius: '6px',
                                        borderColor: '#E5E7EB',
                                        color: '#4F46E5',
                                        '&:hover': {
                                          borderColor: '#4F46E5',
                                          bgcolor: 'rgba(79, 70, 229, 0.04)'
                                        }
                                      }}
                                    >
                                      Editar
                                    </Button>
                                  </Box>
                                  
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
                                        borderRadius: '6px',
                                        bgcolor: '#4F46E5',
                                        '&:hover': {
                                          bgcolor: '#4338CA'
                                        }
                                      }}
                                    >
                                      {activating ? 'Ativando...' : 'Ativar'}
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
                </Box>
              </Paper>
              
              {/* Info do About ativo */}
              <Paper 
                elevation={0} 
                sx={{ 
                  flexGrow: 1, 
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: 'auto', md: '600px' }
                }}
              >
                <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#111827' }}>
                    About Ativo
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 0, 
                  overflow: 'auto',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {activeAbout ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%',
                      p: 3,
                    }}>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {activeAbout.title}
                      </Typography>
                      
                      <Box sx={{ 
                        mb: 3, 
                        flexShrink: 0, 
                        width: '100%', 
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            mb: 1, 
                            fontWeight: 'medium',
                            color: '#4B5563',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <PersonIcon fontSize="small" color="primary" />
                          Descrição
                        </Typography>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            height: '180px', 
                            maxHeight: '180px', 
                            overflow: 'auto',
                            bgcolor: '#F9FAFB',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px'
                          }}
                        >
                          <Typography variant="body1" sx={{ 
                            color: '#4B5563', 
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6,
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word'
                          }}>
                            {activeAbout.description}
                          </Typography>
                        </Paper>
                      </Box>
                      
                      <Box sx={{ 
                        mb: 3, 
                        flexShrink: 0, 
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            mb: 1, 
                            fontWeight: 'medium',
                            color: '#4B5563',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <CodeIcon fontSize="small" color="primary" />
                          Habilidades
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 1, 
                          p: 2,
                          bgcolor: '#F9FAFB',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          maxHeight: '120px',
                          overflow: 'auto'
                        }}>
                          {activeAbout.skills && activeAbout.skills.length > 0 ? (
                            activeAbout.skills.map((skill, index) => (
                              <Chip 
                                key={index} 
                                label={skill.name} 
                                size="small"
                                sx={{ 
                                  bgcolor: '#EEF2FF',
                                  color: '#4F46E5',
                                  border: '1px solid #E0E7FF',
                                  '&:hover': { bgcolor: '#E0E7FF' }
                                }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Nenhuma habilidade cadastrada
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #E5E7EB' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                          <Button 
                            variant="outlined" 
                            onClick={() => handleEditAbout(activeAbout)}
                            startIcon={<EditIcon />}
                            sx={{ 
                              borderRadius: '8px',
                              borderColor: '#E5E7EB',
                              color: '#4F46E5',
                              '&:hover': {
                                borderColor: '#4F46E5',
                                bgcolor: 'rgba(79, 70, 229, 0.04)'
                              }
                            }}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="contained"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewAbout(activeAbout)}
                            sx={{ 
                              borderRadius: '8px',
                              bgcolor: '#4F46E5',
                              '&:hover': {
                                bgcolor: '#4338CA'
                              }
                            }}
                          >
                            Ver Detalhes
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      p: 4, 
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      gap: 2
                    }}>
                      <Box 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: '50%', 
                          bgcolor: '#F3F4F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 40, color: '#9CA3AF' }} />
                      </Box>
                      <Typography sx={{ mb: 2, color: '#6B7280', fontWeight: 'medium' }}>
                        Nenhum about está definido como ativo
                      </Typography>
                      <Button 
                        variant="contained" 
                        onClick={handleCreateNew}
                        startIcon={<AddIcon />}
                        sx={{ 
                          borderRadius: '8px',
                          bgcolor: '#4F46E5',
                          '&:hover': {
                            bgcolor: '#4338CA'
                          }
                        }}
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