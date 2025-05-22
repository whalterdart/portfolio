'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { About } from '../../../../../../../lib/types/about.types';
import { AboutService } from '../../../../../../../lib/services/about.service';
import { AdminHeader } from '../../../../components/layout/AdminHeader';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Divider, 
  CircularProgress, 
  Chip,
  Avatar,
  LinearProgress,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Edit as EditIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Language as LanguageIcon,
  Instagram as InstagramIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';

export default function ViewAboutPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const aboutService = new AboutService();

  // Carregar dados do About
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError('');
        const about = await aboutService.findOne(id);
        
        if (about) {
          setAboutData(about);
        } else {
          setError('About não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar about:', err);
        setError('Falha ao carregar dados do About');
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, [id]);

  const handleEdit = () => {
    router.push(`/about/edit/${id}`);
  };

  const handleGoBack = () => {
    router.push('/about');
  };

  // Funções de renderização
  const renderSocialLinks = () => {
    if (!aboutData?.socialLinks) return null;
    
    const links = aboutData.socialLinks;
    const socialIcons = [];
    
    if (links.github) {
      socialIcons.push(
        <Tooltip key="github" title="GitHub">
          <IconButton 
            href={links.github} 
            target="_blank" 
            color="default"
            sx={{ '&:hover': { color: '#333' } }}
          >
            <GitHubIcon />
          </IconButton>
        </Tooltip>
      );
    }
    
    if (links.linkedin) {
      socialIcons.push(
        <Tooltip key="linkedin" title="LinkedIn">
          <IconButton 
            href={links.linkedin} 
            target="_blank" 
            color="primary"
            sx={{ '&:hover': { color: '#0077b5' } }}
          >
            <LinkedInIcon />
          </IconButton>
        </Tooltip>
      );
    }
    
    if (links.twitter) {
      socialIcons.push(
        <Tooltip key="twitter" title="Twitter">
          <IconButton 
            href={links.twitter} 
            target="_blank" 
            color="info"
            sx={{ '&:hover': { color: '#1da1f2' } }}
          >
            <TwitterIcon />
          </IconButton>
        </Tooltip>
      );
    }
    
    if (links.website) {
      socialIcons.push(
        <Tooltip key="website" title="Website">
          <IconButton 
            href={links.website} 
            target="_blank" 
            color="secondary"
            sx={{ '&:hover': { color: '#9333ea' } }}
          >
            <LanguageIcon />
          </IconButton>
        </Tooltip>
      );
    }
    
    if (links.instagram) {
      socialIcons.push(
        <Tooltip key="instagram" title="Instagram">
          <IconButton 
            href={links.instagram} 
            target="_blank" 
            color="error"
            sx={{ '&:hover': { color: '#e1306c' } }}
          >
            <InstagramIcon />
          </IconButton>
        </Tooltip>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {socialIcons}
      </Box>
    );
  };

  // Ordenar habilidades por nível (decrescente)
  const sortedSkills = aboutData?.skills 
    ? [...aboutData.skills].sort((a, b) => b.level - a.level) 
    : [];
  
  // Agrupar habilidades por categoria
  const skillsByCategory = sortedSkills.reduce((acc: Record<string, typeof sortedSkills>, skill) => {
    const category = skill.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', pt: 3, pb: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            justifyContent: 'space-between',
            gap: 2,
            mb: 4,
            flexWrap: 'wrap'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                variant="outlined"
              >
                Voltar
              </Button>
              
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#111827' }}>
                Detalhes do About
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Editar
            </Button>
          </Box>
          
          {/* Loading state */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {/* Error state */}
          {error && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                bgcolor: '#FEF2F2', 
                color: '#B91C1C',
                border: '1px solid #FCA5A5',
                borderRadius: '8px'
              }}
            >
              <Typography>{error}</Typography>
            </Paper>
          )}
          
          {/* About content */}
          {!loading && aboutData && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Coluna da esquerda */}
              <Box sx={{ width: { xs: '100%', md: '350px' } }}>
                <Card elevation={0} sx={{ mb: 3, border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                  <CardHeader
                    title="Perfil"
                    sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={aboutData.avatar}
                      sx={{ 
                        width: 120, 
                        height: 120,
                        fontSize: '3rem',
                        bgcolor: 'primary.main',
                        border: '4px solid #F3F4F6',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      {aboutData.title?.[0] || 'A'}
                    </Avatar>
                    
                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mt: 1 }}>
                      {aboutData.title}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      {renderSocialLinks()}
                    </Box>
                    
                    <Chip 
                      label={aboutData.active ? "Ativo" : "Inativo"} 
                      color={aboutData.active ? "success" : "default"}
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
                
                {/* Habilidades */}
                <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                  <CardHeader
                    title="Habilidades"
                    avatar={<CodeIcon color="primary" />}
                    sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}
                  />
                  <CardContent sx={{ maxHeight: '400px', overflow: 'auto', px: 1 }}>
                    {sortedSkills.length === 0 ? (
                      <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                        Nenhuma habilidade cadastrada
                      </Typography>
                    ) : (
                      <Box>
                        {Object.entries(skillsByCategory).map(([category, skills]) => (
                          <Box key={category} sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, px: 2 }}>
                              {category}
                            </Typography>
                            
                            {skills.map((skill, index) => (
                              <Box key={index} sx={{ mb: 1.5, px: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2" fontWeight="medium">
                                    {skill.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {skill.level}%
                                  </Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={skill.level} 
                                  sx={{ 
                                    height: 7,
                                    borderRadius: 2,
                                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 2,
                                      background: skill.level > 80
                                        ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                                        : '#3b82f6'
                                    }
                                  }} 
                                />
                              </Box>
                            ))}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
              
              {/* Coluna da direita */}
              <Box sx={{ flexGrow: 1 }}>
                <Card elevation={0} sx={{ mb: 3, border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                  <CardHeader
                    title="Sobre Mim"
                    sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}
                  />
                  <CardContent>
                    <Paper elevation={0} sx={{ 
                      p: 3, 
                      maxHeight: '250px', 
                      overflowY: 'auto',
                      bgcolor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px'
                    }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {aboutData.description}
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
                
                {/* Experiência */}
                <Card elevation={0} sx={{ mb: 3, border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                  <CardHeader
                    title="Experiência Profissional"
                    avatar={<WorkIcon color="primary" />}
                    sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}
                  />
                  <CardContent sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {!aboutData.experience || aboutData.experience.length === 0 ? (
                      <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                        Nenhuma experiência cadastrada
                      </Typography>
                    ) : (
                      <List sx={{ pt: 0 }}>
                        {aboutData.experience.map((exp, index) => (
                          <Box key={index}>
                            {index > 0 && <Divider sx={{ my: 2 }} />}
                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                                    <Typography variant="h6">{exp.position}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <DateRangeIcon fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary">
                                        {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Atual' : new Date(exp.endDate as string).getFullYear()}
                                      </Typography>
                                    </Box>
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Typography variant="subtitle1" color="text.primary">
                                      {exp.company}
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      color="text.secondary" 
                                      sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
                                    >
                                      {exp.description}
                                    </Typography>
                                    
                                    {exp.technologies && exp.technologies.length > 0 && (
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7, mt: 2 }}>
                                        {exp.technologies.map((tech, i) => (
                                          <Chip
                                            key={i}
                                            label={tech}
                                            size="small"
                                            sx={{ bgcolor: '#F3F4F6' }}
                                          />
                                        ))}
                                      </Box>
                                    )}
                                  </>
                                }
                              />
                            </ListItem>
                          </Box>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
                
                {/* Educação */}
                <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                  <CardHeader
                    title="Educação"
                    avatar={<SchoolIcon color="primary" />}
                    sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}
                  />
                  <CardContent sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {!aboutData.education || aboutData.education.length === 0 ? (
                      <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                        Nenhuma formação cadastrada
                      </Typography>
                    ) : (
                      <List sx={{ pt: 0 }}>
                        {aboutData.education.map((edu, index) => (
                          <Box key={index}>
                            {index > 0 && <Divider sx={{ my: 2 }} />}
                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                                    <Typography variant="h6">{edu.degree} em {edu.field}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <DateRangeIcon fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary">
                                        {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate as string).getFullYear()}
                                      </Typography>
                                    </Box>
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Typography variant="subtitle1" color="text.primary">
                                      {edu.institution}
                                    </Typography>
                                    
                                    {edu.description && (
                                      <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
                                      >
                                        {edu.description}
                                      </Typography>
                                    )}
                                  </>
                                }
                              />
                            </ListItem>
                          </Box>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
} 