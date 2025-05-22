'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { About, Skill, Education, Experience, SocialLinks } from '../../../../../../../lib/types/about.types';
import { AboutService } from '../../../../../../../lib/services/about.service';
import { AdminHeader } from '../../../../components/layout/AdminHeader';
import { 
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Chip,
  Slider,
  MenuItem,
  Switch
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  Edit as EditIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Language as LanguageIcon,
  Instagram as InstagramIcon
} from '@mui/icons-material';

// Experience interface with modified endDate type and _id field
interface ModifiedExperience extends Omit<Experience, 'endDate'> {
  endDate?: string | Date | null;
  _id?: string;
}

// Modified type for skills with _id
interface ModifiedSkill extends Skill {
  _id?: string;
}

// Modified type for education with _id
interface ModifiedEducation extends Education {
  _id?: string;
}

// Modified type for About with our custom types
interface ModifiedAbout extends Omit<About, 'skills' | 'education' | 'experience'> {
  skills: ModifiedSkill[];
  education: ModifiedEducation[];
  experience: ModifiedExperience[];
  _id?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`about-tabpanel-${index}`}
      aria-labelledby={`about-tab-${index}`}
      {...other}
      style={{ 
        padding: '24px 0',
        animation: value === index ? 'fadeIn 0.5s' : 'none'
      }}
    >
      {value === index && (
        <Box sx={{ 
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Styled tab components
const StyledTabs = ({ children, value, onChange, ...other }: any) => (
  <Tabs
    value={value}
    onChange={onChange}
    {...other}
    TabIndicatorProps={{
      sx: {
        height: 3,
        borderRadius: '3px',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      }
    }}
    sx={{
      '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 'medium',
        fontSize: '0.95rem',
        minWidth: 'auto',
        padding: '12px 16px',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderRadius: '8px 8px 0 0'
        }
      },
      '& .Mui-selected': {
        fontWeight: 'bold'
      }
    }}
  >
    {children}
  </Tabs>
);

const emptyAbout: About = {
  title: '',
  description: '',
  skills: [],
  education: [],
  experience: [],
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    instagram: ''
  }
};

export default function EditAboutPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newTech, setNewTech] = useState('');
  const [aboutData, setAboutData] = useState<ModifiedAbout>({
    title: '',
    description: '',
    skills: [],
    education: [],
    experience: [],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
      instagram: ''
    },
    active: false
  });

  const aboutService = new AboutService();

  // Buscar dados do About ao carregar a página
  useEffect(() => {
    // Verificar autenticação
    const authService = new (require('@lib/services/auth.service').AuthService)();
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError('');
        const about = await aboutService.findOne(id);
        if (about) {
          // Garantir que todos os campos existam, mesmo que vazios
          setAboutData({
            ...about,
            skills: about.skills || [],
            education: about.education || [],
            experience: about.experience || [],
            socialLinks: {
              github: about.socialLinks?.github || '',
              linkedin: about.socialLinks?.linkedin || '',
              twitter: about.socialLinks?.twitter || '',
              website: about.socialLinks?.website || '',
              instagram: about.socialLinks?.instagram || ''
            },
            active: about.active || false
          });
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

  // Handler for tabs
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handler para campos básicos
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handler para links sociais
  const handleSocialLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };
  
  // Manipuladores para habilidades
  const addSkill = () => {
    setAboutData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 50, category: '' }]
    }));
  };
  
  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    setAboutData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };
  
  const removeSkill = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };
  
  // Manipuladores para educação
  const addEducation = () => {
    setAboutData(prev => ({
      ...prev,
      education: [...prev.education, { 
        institution: '', 
        degree: '', 
        field: '', 
        startDate: '', 
        endDate: '', 
        description: '' 
      }]
    }));
  };
  
  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setAboutData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };
  
  const removeEducation = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };
  
  // Manipuladores para experiência
  const addExperience = () => {
    setAboutData(prev => ({
      ...prev,
      experience: [...prev.experience, { 
        company: '', 
        position: '', 
        startDate: '', 
        endDate: '', 
        description: '',
        technologies: []
      }]
    }));
  };
  
  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    setAboutData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => {
        if (i === index) {
          // Special handling for "current" field
          if (field === 'current' && value === true) {
            // If marking as current, set endDate to empty string (will be converted to null during save)
            return { ...exp, [field]: value, endDate: '' };
          }
          return { ...exp, [field]: value };
        }
        return exp;
      })
    }));
  };
  
  const removeExperience = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };
  
  const updateExperienceTechnologies = (index: number, technologies: string[]) => {
    setAboutData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, technologies } : exp
      )
    }));
  };
  
  // Manipulador para salvar os dados
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      console.log('Saving about data:', aboutData);

      // Validação básica
      if (!aboutData.title.trim()) {
        setError('O título é obrigatório');
        setSaving(false);
        return;
      }

      if (!aboutData.description.trim()) {
        setError('A descrição é obrigatória');
        setSaving(false);
        return;
      }

      // Filter out empty social links
      const socialLinks: Record<string, string> = {};
      if (aboutData.socialLinks) {
        Object.entries(aboutData.socialLinks).forEach(([key, value]) => {
          // Ignorar _id e valores vazios
          if (key !== '_id' && value && value.trim() !== '') {
            socialLinks[key] = value;
          }
        });
      }

      // Process experience data - ensure endDate is removed when current is true
      const processedExperience = aboutData.experience.map(exp => {
        // Remove _id from experience objects
        const { _id, ...expData } = exp;
        
        // Se for trabalho atual, remover completamente o endDate 
        if (exp.current) {
          const { endDate, ...currentExpData } = expData;
          return currentExpData;
        }
        
        return expData;
      });

      // Remove _id fields from skills and education
      const processedSkills = aboutData.skills.map(skill => {
        const { _id, ...skillData } = skill;
        return skillData;
      });
      
      const processedEducation = aboutData.education.map(edu => {
        const { _id, ...eduData } = edu;
        return eduData;
      });

      // Extract only the fields that should be sent to the backend
      // Explicitly remove MongoDB metadata fields
      const { 
        _id, 
        createdAt, 
        updatedAt, 
        __v, 
        ...aboutWithoutMetadata 
      } = aboutData;

      // Ensure arrays are initialized before saving
      const dataToSave = {
        title: aboutData.title,
        description: aboutData.description,
        skills: processedSkills,
        education: processedEducation,
        experience: processedExperience,
        socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
        avatar: aboutData.avatar,
        active: aboutData.active
      };

      console.log('Sending data to backend:', JSON.stringify(dataToSave, null, 2));

      await new Promise((resolve, reject) => {
        aboutService.update(id, dataToSave as any).subscribe({
          next: (result: About) => {
            console.log('About atualizado com sucesso:', result);
            setSuccessMessage('About atualizado com sucesso!');
            setShowSuccessMessage(true);
            resolve(result);
          },
          error: (err: any) => {
            console.error('Erro ao atualizar about:', err);
            
            let errorMessage = 'Falha ao atualizar about';
            if (err.response?.data?.message) {
              errorMessage += ': ' + err.response.data.message;
            } else if (err.message) {
              errorMessage += ': ' + err.message;
            }
            
            setError(errorMessage);
            reject(err);
          }
        });
      });
    } catch (err: any) {
      console.error('Erro ao atualizar about:', err);
      setError('Ocorreu um erro ao atualizar o about: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', pt: 3, pb: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 4,
            flexWrap: 'wrap',
            gap: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/about')}
                variant="outlined"
                sx={{ 
                  borderRadius: '8px',
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.24)'
                  }
                }}
              >
                Voltar
              </Button>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#111827' }}>
                Editar About
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                bgcolor: '#4F46E5',
                '&:hover': {
                  bgcolor: '#4338CA'
                }
              }}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Box>
          
          {/* Mensagem de erro */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}
          
          {/* Mensagem de sucesso */}
          <Snackbar
            open={showSuccessMessage}
            autoHideDuration={6000}
            onClose={() => setShowSuccessMessage(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setShowSuccessMessage(false)} 
              severity="success" 
              sx={{ width: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              {successMessage}
            </Alert>
          </Snackbar>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper elevation={0} sx={{ 
              p: 0, 
              border: '1px solid #E5E7EB', 
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="about tabs">
                  <Tab 
                    icon={<PersonIcon fontSize="small" />} 
                    iconPosition="start" 
                    label="Informações Básicas" 
                    id="about-tab-0" 
                    aria-controls="about-tabpanel-0" 
                  />
                  <Tab 
                    icon={<CodeIcon fontSize="small" />} 
                    iconPosition="start" 
                    label="Habilidades" 
                    id="about-tab-1" 
                    aria-controls="about-tabpanel-1" 
                  />
                  <Tab 
                    icon={<SchoolIcon fontSize="small" />} 
                    iconPosition="start" 
                    label="Educação" 
                    id="about-tab-2" 
                    aria-controls="about-tabpanel-2" 
                  />
                  <Tab 
                    icon={<WorkIcon fontSize="small" />} 
                    iconPosition="start" 
                    label="Experiência" 
                    id="about-tab-3" 
                    aria-controls="about-tabpanel-3" 
                  />
                  <Tab 
                    icon={<LinkIcon fontSize="small" />} 
                    iconPosition="start" 
                    label="Links Sociais" 
                    id="about-tab-4" 
                    aria-controls="about-tabpanel-4" 
                  />
                </StyledTabs>
              </Box>
              
              {/* Informações Básicas */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: '600', 
                      color: '#111827', 
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <PersonIcon color="primary" fontSize="small" />
                      Detalhes Pessoais
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Informações básicas para o seu perfil profissional.
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 3,
                    p: 3,
                    bgcolor: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                  }}>
                    <TextField
                      fullWidth
                      label="Título"
                      name="title"
                      value={aboutData.title}
                      onChange={handleBasicInfoChange}
                      required
                      helperText="Ex: Desenvolvedor Full Stack"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#6366F1',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                          }
                        }
                      }}
                    />
                  
                    <TextField
                      fullWidth
                      label="Descrição"
                      name="description"
                      value={aboutData.description}
                      onChange={handleBasicInfoChange}
                      multiline
                      rows={4}
                      required
                      helperText="Uma descrição detalhada sobre você e sua carreira"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#6366F1',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                          }
                        }
                      }}
                    />
                  
                    <TextField
                      fullWidth
                      label="URL da Foto/Avatar"
                      name="avatar"
                      value={aboutData.avatar || ''}
                      onChange={handleBasicInfoChange}
                      helperText="URL para sua foto de perfil (deixe em branco para usar uma letra)"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#6366F1',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                          }
                        }
                      }}
                    />
                  </Box>
                </Box>
              </TabPanel>
              
              {/* Habilidades */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: '600', 
                      color: '#111827', 
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <CodeIcon color="primary" fontSize="small" />
                      Habilidades Técnicas
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Adicione suas habilidades técnicas, linguagens de programação e ferramentas que você domina.
                    </Typography>
                  </Box>
                
                  <Button
                    variant="contained"
                    onClick={addSkill}
                    startIcon={<AddIcon />}
                    sx={{ 
                      mb: 3, 
                      alignSelf: 'flex-start',
                      borderRadius: '8px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      bgcolor: '#4F46E5',
                      '&:hover': {
                        bgcolor: '#4338CA'
                      }
                    }}
                  >
                    Adicionar Habilidade
                  </Button>
                  
                  {aboutData.skills.length === 0 ? (
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 4, 
                        borderRadius: '8px', 
                        bgcolor: '#F9FAFB',
                        border: '1px dashed #D1D5DB',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      <CodeIcon sx={{ fontSize: 40, color: '#9CA3AF' }} />
                      <Typography color="text.secondary">
                        Nenhuma habilidade cadastrada. Clique em "Adicionar Habilidade" para começar.
                      </Typography>
                    </Paper>
                  ) : (
                    aboutData.skills.map((skill, index) => (
                      <Paper 
                        key={index} 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          mb: 2, 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 'medium',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <Chip 
                                label={skill.category || 'Skill'} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                              {skill.name}
                            </Typography>
                            <Button 
                              color="error" 
                              onClick={() => removeSkill(index)}
                              size="small"
                              variant="text"
                              startIcon={<DeleteIcon fontSize="small" />}
                              sx={{ 
                                borderRadius: '8px', 
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' }
                              }}
                            >
                              Remover
                            </Button>
                          </Box>
                          
                          <Box sx={{ width: '100%' }}>
                            <TextField
                              fullWidth
                              label="Nome da Habilidade"
                              value={skill.name}
                              onChange={(e) => updateSkill(index, 'name', e.target.value)}
                              size="small"
                              sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px'
                                }
                              }}
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                              <Typography gutterBottom variant="body2" color="text.secondary">
                                Nível de experiência: {skill.level}%
                              </Typography>
                              <Slider
                                value={skill.level}
                                onChange={(_, value) => updateSkill(index, 'level', value as number)}
                                aria-labelledby="skill-level-slider"
                                valueLabelDisplay="auto"
                                sx={{
                                  '& .MuiSlider-thumb': {
                                    height: 20,
                                    width: 20,
                                    '&:hover, &.Mui-active': {
                                      boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)',
                                    }
                                  }
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                              <TextField
                                fullWidth
                                select
                                label="Categoria"
                                value={skill.category || ''}
                                onChange={(e) => updateSkill(index, 'category', e.target.value)}
                                size="small"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                  }
                                }}
                              >
                                <MenuItem value="Frontend">Frontend</MenuItem>
                                <MenuItem value="Backend">Backend</MenuItem>
                                <MenuItem value="Mobile">Mobile</MenuItem>
                                <MenuItem value="DevOps">DevOps</MenuItem>
                                <MenuItem value="Database">Banco de Dados</MenuItem>
                                <MenuItem value="Design">Design</MenuItem>
                                <MenuItem value="Outros">Outros</MenuItem>
                              </TextField>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))
                  )}
                </Box>
              </TabPanel>
              
              {/* Educação */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: '600', 
                      color: '#111827', 
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <SchoolIcon color="primary" fontSize="small" />
                      Formação Acadêmica
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Adicione suas formações acadêmicas, cursos e certificações.
                    </Typography>
                  </Box>
                
                  <Button
                    variant="contained"
                    onClick={addEducation}
                    startIcon={<AddIcon />}
                    sx={{ 
                      mb: 3, 
                      alignSelf: 'flex-start',
                      borderRadius: '8px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      bgcolor: '#4F46E5',
                      '&:hover': {
                        bgcolor: '#4338CA'
                      }
                    }}
                  >
                    Adicionar Formação
                  </Button>
                  
                  {aboutData.education.length === 0 ? (
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 4, 
                        borderRadius: '8px', 
                        bgcolor: '#F9FAFB',
                        border: '1px dashed #D1D5DB',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      <SchoolIcon sx={{ fontSize: 40, color: '#9CA3AF' }} />
                      <Typography color="text.secondary">
                        Nenhuma formação cadastrada. Clique em "Adicionar Formação" para começar.
                      </Typography>
                    </Paper>
                  ) : (
                    aboutData.education.map((edu, index) => (
                      <Paper 
                        key={index} 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          mb: 2, 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ fontWeight: 'medium' }}
                            >
                              {edu.degree || 'Nova Formação'} em {edu.field || '...'}
                            </Typography>
                            <Button 
                              color="error" 
                              onClick={() => removeEducation(index)}
                              size="small"
                              variant="text"
                              startIcon={<DeleteIcon fontSize="small" />}
                              sx={{ 
                                borderRadius: '8px', 
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' }
                              }}
                            >
                              Remover
                            </Button>
                          </Box>
                          
                          <Box sx={{ width: '100%' }}>
                            <TextField
                              fullWidth
                              label="Instituição"
                              value={edu.institution}
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                              size="small"
                              sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px'
                                }
                              }}
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                              <TextField
                                fullWidth
                                label="Título/Grau"
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                size="small"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                  }
                                }}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                              <TextField
                                fullWidth
                                label="Área"
                                value={edu.field}
                                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                size="small"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                              <TextField
                                fullWidth
                                label="Data de Início"
                                type="date"
                                value={typeof edu.startDate === 'string' ? edu.startDate.split('T')[0] : ''}
                                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                  }
                                }}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                              <TextField
                                fullWidth
                                label="Data de Término"
                                type="date"
                                value={typeof edu.endDate === 'string' ? edu.endDate.split('T')[0] : ''}
                                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                helperText="Deixe em branco se ainda não concluído"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                          
                          <Box sx={{ width: '100%' }}>
                            <TextField
                              fullWidth
                              label="Descrição"
                              value={edu.description || ''}
                              onChange={(e) => updateEducation(index, 'description', e.target.value)}
                              multiline
                              rows={2}
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px'
                                }
                              }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    ))
                  )}
                </Box>
              </TabPanel>
              
              {/* Experiência */}
              <TabPanel value={tabValue} index={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: '600', 
                      color: '#111827', 
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <WorkIcon color="primary" fontSize="small" />
                      Experiência Profissional
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Adicione suas experiências profissionais e projetos relevantes.
                    </Typography>
                  </Box>
                
                  <Button
                    variant="contained"
                    onClick={addExperience}
                    startIcon={<AddIcon />}
                    sx={{ 
                      mb: 3, 
                      alignSelf: 'flex-start',
                      borderRadius: '8px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      bgcolor: '#4F46E5',
                      '&:hover': {
                        bgcolor: '#4338CA'
                      }
                    }}
                  >
                    Adicionar Experiência
                  </Button>
                  
                  {aboutData.experience.length === 0 ? (
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 4, 
                        borderRadius: '8px', 
                        bgcolor: '#F9FAFB',
                        border: '1px dashed #D1D5DB',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      <WorkIcon sx={{ fontSize: 40, color: '#9CA3AF' }} />
                      <Typography color="text.secondary">
                        Nenhuma experiência cadastrada. Clique em "Adicionar Experiência" para começar.
                      </Typography>
                    </Paper>
                  ) : (
                    aboutData.experience.map((exp, index) => (
                      <Paper 
                        key={index} 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          mb: 2, 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <Box>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ fontWeight: 'medium' }}
                              >
                                {exp.position || 'Novo Cargo'}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                              >
                                {exp.company || 'Empresa'}
                                {exp.current && (
                                  <Chip 
                                    label="Atual" 
                                    size="small" 
                                    color="success" 
                                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                                  />
                                )}
                              </Typography>
                            </Box>
                            <Button 
                              color="error" 
                              onClick={() => removeExperience(index)}
                              size="small"
                              variant="text"
                              startIcon={<DeleteIcon fontSize="small" />}
                              sx={{ 
                                borderRadius: '8px', 
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' }
                              }}
                            >
                              Remover
                            </Button>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                              <TextField
                                fullWidth
                                label="Empresa"
                                value={exp.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                size="small"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                  }
                                }}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                              <TextField
                                fullWidth
                                label="Cargo"
                                value={exp.position}
                                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                size="small"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                              <TextField
                                fullWidth
                                label="Data de Início"
                                type="date"
                                value={typeof exp.startDate === 'string' ? exp.startDate.split('T')[0] : ''}
                                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                  }
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ 
                              width: { xs: '100%', sm: '50%' },
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2
                            }}>
                              <Box sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: { xs: 1, sm: 0 }
                              }}>
                                <Typography component="span" variant="body2">
                                  Emprego atual
                                </Typography>
                                <Switch
                                  checked={exp.current || false}
                                  onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                  size="small"
                                  color="success"
                                />
                              </Box>
                              
                              {!exp.current && (
                                <TextField
                                  fullWidth
                                  label="Data de Término"
                                  type="date"
                                  value={typeof exp.endDate === 'string' ? exp.endDate.split('T')[0] : ''}
                                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px'
                                    }
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                          
                          <Box sx={{ width: '100%' }}>
                            <TextField
                              fullWidth
                              label="Descrição"
                              value={exp.description}
                              onChange={(e) => updateExperience(index, 'description', e.target.value)}
                              multiline
                              rows={3}
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px'
                                }
                              }}
                            />
                          </Box>
                          
                          <Box sx={{ width: '100%' }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                              Tecnologias Utilizadas
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                              {Array.isArray(exp.technologies) && exp.technologies.map((tech, techIndex) => (
                                <Chip 
                                  key={techIndex} 
                                  label={tech} 
                                  size="small" 
                                  onDelete={() => {
                                    const newTechnologies = [...exp.technologies!].filter((_, i) => i !== techIndex);
                                    updateExperienceTechnologies(index, newTechnologies);
                                  }}
                                  sx={{
                                    borderRadius: '6px',
                                    '& .MuiChip-deleteIcon': {
                                      fontSize: '1rem'
                                    }
                                  }}
                                />
                              ))}
                              {(!exp.technologies || exp.technologies.length === 0) && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                  Nenhuma tecnologia adicionada
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <TextField
                                label="Adicionar tecnologia"
                                value={newTech}
                                onChange={(e) => setNewTech(e.target.value)}
                                size="small"
                                sx={{ 
                                  flexGrow: 1,
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newTech) {
                                    e.preventDefault();
                                    const techArray = [...(exp.technologies || []), newTech];
                                    updateExperienceTechnologies(index, techArray);
                                    setNewTech('');
                                  }
                                }}
                              />
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  if (newTech) {
                                    const techArray = [...(exp.technologies || []), newTech];
                                    updateExperienceTechnologies(index, techArray);
                                    setNewTech('');
                                  }
                                }}
                                disabled={!newTech}
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
                                Adicionar
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))
                  )}
                </Box>
              </TabPanel>
              
              {/* Links Sociais */}
              <TabPanel value={tabValue} index={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: '600', 
                      color: '#111827', 
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <LinkIcon color="primary" fontSize="small" />
                      Redes Sociais
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Adicione links para suas redes sociais e presença online.
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 3,
                    p: 3,
                    bgcolor: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                        <TextField
                          fullWidth
                          label="GitHub"
                          name="github"
                          value={aboutData.socialLinks?.github || ''}
                          onChange={handleSocialLinksChange}
                          placeholder="https://github.com/username"
                          InputProps={{
                            startAdornment: (
                              <GitHubIcon fontSize="small" sx={{ mr: 1, color: '#333' }} />
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: '#333', // GitHub color
                              },
                              '&.Mui-focused': {
                                borderColor: '#333',
                                boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.1)',
                              }
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                        <TextField
                          fullWidth
                          label="LinkedIn"
                          name="linkedin"
                          value={aboutData.socialLinks?.linkedin || ''}
                          onChange={handleSocialLinksChange}
                          placeholder="https://linkedin.com/in/username"
                          InputProps={{
                            startAdornment: (
                              <LinkedInIcon fontSize="small" sx={{ mr: 1, color: '#0077b5' }} />
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: '#0077b5', // LinkedIn color
                              },
                              '&.Mui-focused': {
                                borderColor: '#0077b5',
                                boxShadow: '0 0 0 3px rgba(0, 119, 181, 0.1)',
                              }
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                        <TextField
                          fullWidth
                          label="Twitter"
                          name="twitter"
                          value={aboutData.socialLinks?.twitter || ''}
                          onChange={handleSocialLinksChange}
                          placeholder="https://twitter.com/username"
                          InputProps={{
                            startAdornment: (
                              <TwitterIcon fontSize="small" sx={{ mr: 1, color: '#1da1f2' }} />
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: '#1da1f2', // Twitter color
                              },
                              '&.Mui-focused': {
                                borderColor: '#1da1f2',
                                boxShadow: '0 0 0 3px rgba(29, 161, 242, 0.1)',
                              }
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                        <TextField
                          fullWidth
                          label="Website Pessoal"
                          name="website"
                          value={aboutData.socialLinks?.website || ''}
                          onChange={handleSocialLinksChange}
                          placeholder="https://mywebsite.com"
                          InputProps={{
                            startAdornment: (
                              <LanguageIcon fontSize="small" sx={{ mr: 1, color: '#6366F1' }} />
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: '#6366F1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366F1',
                                boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                              }
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                      <TextField
                        fullWidth
                        label="Instagram"
                        name="instagram"
                        value={aboutData.socialLinks?.instagram || ''}
                        onChange={handleSocialLinksChange}
                        placeholder="https://instagram.com/username"
                        InputProps={{
                          startAdornment: (
                            <InstagramIcon fontSize="small" sx={{ mr: 1, color: '#e1306c' }} />
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: '#e1306c', // Instagram color
                            },
                            '&.Mui-focused': {
                              borderColor: '#e1306c',
                              boxShadow: '0 0 0 3px rgba(225, 48, 108, 0.1)',
                            }
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </TabPanel>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
}