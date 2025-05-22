'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Chip, Divider, LinearProgress, Stack, Paper, List, ListItem, ListItemIcon, ListItemText, IconButton, useTheme, useMediaQuery, alpha, CircularProgress } from '@mui/material';
// O Material UI v7 renomeou o Grid e mudou sua API
import { Grid } from '@mui/material';
import { School, Work, Code, DateRange, GitHub, LinkedIn, Twitter, Language, Instagram } from '@mui/icons-material';
// Import using relative paths instead of alias
import type { About } from '../../../../../lib/types/about.types';

interface AboutMeSectionProps {
  preloadedData?: About | null;
  onLoadingComplete?: () => void;
}

export default function AboutMeSection({ preloadedData, onLoadingComplete }: AboutMeSectionProps) {
  const [about, setAbout] = useState<About | null>(preloadedData || null);
  const [loading, setLoading] = useState(!preloadedData);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    // Se já tivermos dados pré-carregados, não precisamos buscar novamente
    if (preloadedData) {
      setAbout(preloadedData);
      setLoading(false);
      if (onLoadingComplete) onLoadingComplete();
      return;
    }
    
    const fetchAboutInfo = async () => {
      try {
        console.log('Buscando informações sobre mim...');
        
        // Importar dinamicamente o AboutService para evitar problemas com SSR
        const { AboutService } = await import('../../../../../lib/services/about.service');
        const aboutService = new AboutService();
        
        // Buscar o about ativo atual
        const aboutData = await aboutService.findOne('current');
        
        if (aboutData) {
          console.log('Dados do about carregados com sucesso:', aboutData);
          setAbout(aboutData);
        } else {
          console.warn('Nenhum about ativo encontrado');
          setError('Nenhuma informação disponível no momento.');
        }
      } catch (error) {
        console.error('Erro ao buscar informações de about:', error);
        setError('Falha ao carregar informações');
      } finally {
        setLoading(false);
        if (onLoadingComplete) onLoadingComplete();
      }
    };

    fetchAboutInfo();
  }, [preloadedData, onLoadingComplete]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!about) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Nenhuma informação encontrada.</Typography>
      </Box>
    );
  }

  // Função para dividir habilidades em múltiplas colunas de forma mais inteligente
  const getSkillColumns = () => {
    const skills = [...about.skills];
    
    // Se mobile, retorne 1 coluna
    if (isMobile) {
      return [skills];
    }
    
    // Para tablet e desktop, divida em 2 colunas balanceadas por nível
    // Ordene as habilidades por nível para distribuir uniformemente
    skills.sort((a, b) => b.level - a.level);
    
    const column1: typeof skills = [];
    const column2: typeof skills = [];
    
    skills.forEach((skill, index) => {
      if (index % 2 === 0) {
        column1.push(skill);
      } else {
        column2.push(skill);
      }
    });
    
    return [column1, column2];
  };

  const skillColumns = getSkillColumns();

  return (
    <Box sx={{ py: 4 }}>
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr',
            md: 'minmax(300px, 1fr) 2fr',
            lg: 'minmax(300px, 1fr) 2fr'
          },
          gap: 4,
          mb: 4
        }}
      >
        {/* Perfil e foto */}
        <Card 
          elevation={3}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'visible',
            borderRadius: 2,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6]
            }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              pt: 8,
              pb: 4,
              px: 3,
              position: 'relative',
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`
            }}
          >
            <Avatar
              src={about.avatar}
              alt="Foto de perfil"
              sx={{
                width: { xs: 100, sm: 120, md: 130 },
                height: { xs: 100, sm: 120, md: 130 },
                border: '4px solid white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                position: 'absolute',
                top: -65,
                bgcolor: theme.palette.primary.main,
                fontSize: '3.5rem',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              {!about.avatar && (about.title?.charAt(0) || 'D')}
            </Avatar>
            <Typography variant="h5" component="h3" fontWeight="bold" mt={5} align="center">
              {about.title}
            </Typography>
            
            <Box sx={{ mt: 2, mb: 3, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              {Array.isArray(about.socialLinks) ? (
                // Renderizar links sociais do formato de array
                about.socialLinks.map((link, index) => {
                  // Determinar o ícone correto com base na plataforma
                  let Icon = GitHub; // Padrão para fallback
                  let iconColor = 'inherit';
                  
                  // Converter para minúsculas e remover espaços para comparação segura
                  const platform = link.platform.toLowerCase().trim();
                  
                  if (platform === 'linkedin') {
                    Icon = LinkedIn;
                    iconColor = 'primary';
                  } else if (platform === 'twitter') {
                    Icon = Twitter;
                    iconColor = 'info';
                  } else if (platform === 'instagram') {
                    Icon = Instagram;
                    iconColor = 'error';
                  } else if (platform === 'website' || platform === 'site') {
                    Icon = Language;
                    iconColor = 'secondary';
                  }
                  
                  return (
                    <IconButton 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      color={iconColor as any}
                      sx={{
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.15)'
                        }
                      }}
                    >
                      <Icon />
                    </IconButton>
                  );
                })
              ) : (
                // Fallback para o formato de objeto antigo
                <>
                  {about.socialLinks?.github && (
                    <IconButton href={about.socialLinks.github} target="_blank" color="inherit">
                      <GitHub />
                    </IconButton>
                  )}
                  {about.socialLinks?.linkedin && (
                    <IconButton href={about.socialLinks.linkedin} target="_blank" color="primary">
                      <LinkedIn />
                    </IconButton>
                  )}
                  {about.socialLinks?.twitter && (
                    <IconButton href={about.socialLinks.twitter} target="_blank" color="info">
                      <Twitter />
                    </IconButton>
                  )}
                  {about.socialLinks?.website && (
                    <IconButton href={about.socialLinks.website} target="_blank" color="secondary">
                      <Language />
                    </IconButton>
                  )}
                </>
              )}
            </Box>
            <Box sx={{ maxHeight: '200px', overflowY: 'auto', width: '100%', px: 1 }} className="dark-scroll">
              <Typography 
                variant="body1" 
                color="text.secondary" 
                textAlign="center"
                sx={{ 
                  maxWidth: '100%',
                  wordBreak: 'break-word'
                }}
              >
                {about.description}
              </Typography>
            </Box>
          </Box>
        </Card>
        
        {/* Habilidades */}
        <Card 
          elevation={3}
          sx={{ 
            borderRadius: 2,
            height: '100%',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6]
            }
          }}
        >
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom 
              fontWeight="bold" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: theme.palette.primary.main,
                mb: 3,
                pb: 1,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <Code sx={{ mr: 1 }} /> Habilidades
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 4 }}>
              {skillColumns.map((column, colIndex) => (
                <Box key={colIndex}>
                  {column.map((skill, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        mb: 2.5,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          sx={{ 
                            color: skill.level > 80 
                              ? theme.palette.primary.main 
                              : theme.palette.text.primary 
                          }}
                        >
                          {skill.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontWeight: skill.level > 80 ? 'bold' : 'normal'
                          }}
                        >
                          {skill.level}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={skill.level} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: skill.level > 80
                              ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                              : theme.palette.primary.main
                          }
                        }} 
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr',
            md: 'repeat(2, 1fr)'
          },
          gap: 4
        }}
      >
        {/* Experiência */}
        <Card 
          elevation={3}
          sx={{ 
            borderRadius: 2,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6]
            }
          }}
        >
          <CardContent sx={{ height: '100%' }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              fontWeight="bold" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: theme.palette.primary.main,
                mb: 3,
                pb: 1,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <Work sx={{ mr: 1 }} /> Experiência Profissional
            </Typography>
            
            <Box 
              sx={{ 
                mt: 2, 
                maxHeight: { xs: '400px', sm: '500px' }, 
                overflowY: 'auto',
                pr: 1
              }}
              className="dark-scroll"
            >
              {about.experience.map((exp, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: index !== about.experience.length - 1 ? 4 : 0,
                    pb: index !== about.experience.length - 1 ? 3 : 0,
                    borderBottom: index !== about.experience.length - 1 
                      ? `1px dashed ${alpha(theme.palette.divider, 0.5)}` 
                      : 'none',
                    position: 'relative',
                    '&::before': index !== about.experience.length - 1 ? {
                      content: '""',
                      position: 'absolute',
                      left: '-10px',
                      top: '0',
                      bottom: '0',
                      width: '2px',
                      background: `linear-gradient(to bottom, transparent, ${theme.palette.primary.main}, transparent)`,
                      display: { xs: 'none', sm: 'block' }
                    } : {}
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: 1
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold"
                      sx={{
                        color: theme.palette.primary.main
                      }}
                    >
                      {exp.position}
                    </Typography>
                    <Chip 
                      icon={<DateRange fontSize="small" />}
                      label={`${new Date(exp.startDate).getFullYear()} - ${exp.current ? 'Atual' : new Date(exp.endDate as string).getFullYear()}`}
                      size="small"
                      color="primary"
                      sx={{ 
                        height: 24,
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontWeight: 'medium', mt: 1 }}
                  >
                    {exp.company}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    paragraph
                    sx={{ 
                      textAlign: 'justify',
                      hyphens: 'auto',
                      mt: 1
                    }}
                  >
                    {exp.description}
                  </Typography>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                      {exp.technologies.map((tech, idx) => (
                        <Chip 
                          key={idx} 
                          label={tech} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            height: 24,
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              borderColor: theme.palette.primary.main
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
        
        {/* Educação */}
        <Card 
          elevation={3}
          sx={{ 
            borderRadius: 2,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6]
            }
          }}
        >
          <CardContent sx={{ height: '100%' }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              fontWeight="bold" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: theme.palette.secondary.main,
                mb: 3,
                pb: 1,
                borderBottom: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`
              }}
            >
              <School sx={{ mr: 1 }} /> Educação
            </Typography>
            
            <Box 
              sx={{ 
                mt: 2, 
                maxHeight: { xs: '400px', sm: '500px' }, 
                overflowY: 'auto',
                pr: 1
              }}
              className="secondary-scroll"
            >
              {about.education.map((edu, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: index !== about.education.length - 1 ? 4 : 0,
                    pb: index !== about.education.length - 1 ? 3 : 0,
                    borderBottom: index !== about.education.length - 1 
                      ? `1px dashed ${alpha(theme.palette.divider, 0.5)}` 
                      : 'none',
                    position: 'relative',
                    '&::before': index !== about.education.length - 1 ? {
                      content: '""',
                      position: 'absolute',
                      left: '-10px',
                      top: '0',
                      bottom: '0',
                      width: '2px',
                      background: `linear-gradient(to bottom, transparent, ${theme.palette.secondary.main}, transparent)`,
                      display: { xs: 'none', sm: 'block' }
                    } : {}
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: 1
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold"
                      sx={{
                        color: theme.palette.secondary.main
                      }}
                    >
                      {edu.degree} em {edu.field}
                    </Typography>
                    <Chip 
                      icon={<DateRange fontSize="small" />}
                      label={`${new Date(edu.startDate).getFullYear()} - ${new Date(edu.endDate as string).getFullYear()}`}
                      size="small"
                      color="secondary"
                      sx={{ 
                        height: 24,
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontWeight: 'medium', mt: 1 }}
                  >
                    {edu.institution}
                  </Typography>
                  {edu.description && (
                    <Typography 
                      variant="body2"
                      sx={{ 
                        textAlign: 'justify',
                        hyphens: 'auto',
                        mt: 1
                      }}
                    >
                      {edu.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
