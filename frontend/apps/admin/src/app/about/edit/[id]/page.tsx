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
  Grid as MuiGrid,
  Alert,
  Snackbar
} from '@mui/material';

// Wrapper para o componente Grid que lida com as props adequadamente
const Grid = MuiGrid;
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';

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
      style={{ padding: '20px 0' }}
    >
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
}

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
  
  const [aboutData, setAboutData] = useState<About>(emptyAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const aboutService = new AboutService();

  // Buscar dados do About ao carregar a pu00e1gina
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
            ...emptyAbout,
            ...about,
            socialLinks: {
              ...emptyAbout.socialLinks,
              ...(about.socialLinks || {})
            }
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
      
      console.log('Saving about data:', JSON.stringify(aboutData, null, 2));

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

      // Ensure arrays are initialized before saving
      const sanitizedData = {
        ...aboutData,
        skills: Array.isArray(aboutData.skills) ? aboutData.skills : [],
        education: Array.isArray(aboutData.education) ? aboutData.education : [],
        experience: Array.isArray(aboutData.experience) 
          ? aboutData.experience.map(exp => {
              // Process experience data - ensure endDate is null when current is true
              if (exp.current) {
                // Using type assertion to avoid TypeScript errors
                return { ...exp, endDate: null } as unknown as Experience;
              }
              return exp;
            })
          : [],
        socialLinks: aboutData.socialLinks || {}
      };

      // Filter out empty social links
      if (sanitizedData.socialLinks) {
        const filteredSocialLinks: Record<string, string> = {};
        
        Object.entries(sanitizedData.socialLinks).forEach(([key, value]) => {
          if (value && typeof value === 'string' && value.trim() !== '') {
            filteredSocialLinks[key] = value.trim();
          }
        });
        
        // Replace socialLinks with filtered version or set to empty object if empty
        if (Object.keys(filteredSocialLinks).length > 0) {
          sanitizedData.socialLinks = filteredSocialLinks as SocialLinks;
        } else {
          sanitizedData.socialLinks = {} as SocialLinks;
        }
      }
      
      // Create a clean data object for API - only include necessary fields
      const cleanDataForApi = {
        title: sanitizedData.title,
        description: sanitizedData.description,
        skills: sanitizedData.skills,
        education: sanitizedData.education,
        experience: sanitizedData.experience,
        avatar: sanitizedData.avatar,
        socialLinks: sanitizedData.socialLinks,
        active: sanitizedData.active
      };

      await new Promise((resolve, reject) => {
        aboutService.update(id, cleanDataForApi).subscribe({
          next: (result: About) => {
            console.log('About atualizado com sucesso:', result);
            setSuccessMessage('About atualizado com sucesso!');
            setShowSuccessMessage(true);
            resolve(result);
          },
          error: (err: any) => {
            console.error('Erro ao atualizar about:', err);
            setError('Falha ao atualizar about: ' + (err.response?.data?.message || err.message));
            reject(err);
          }
        });
      });
    } catch (err) {
      console.error('Erro ao atualizar about:', err);
      setError('Ocorreu um erro ao atualizar o about');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', pt: 3, pb: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/about')}
              sx={{ mr: 2 }}
            >
              Voltar
            </Button>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#111827' }}>
              Editar About
            </Typography>
          </Box>
          
          {/* Mensagem de erro */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
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
            <Alert onClose={() => setShowSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
              {successMessage}
            </Alert>
          </Snackbar>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="about tabs">
                  <Tab label="Informações Básicas" id="about-tab-0" aria-controls="about-tabpanel-0" />
                  <Tab label="Habilidades" id="about-tab-1" aria-controls="about-tabpanel-1" />
                  <Tab label="Educação" id="about-tab-2" aria-controls="about-tabpanel-2" />
                  <Tab label="Experiência" id="about-tab-3" aria-controls="about-tabpanel-3" />
                  <Tab label="Links Sociais" id="about-tab-4" aria-controls="about-tabpanel-4" />
                </Tabs>
              </Box>
              
              {/* Informações Básicas */}
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Título"
                      name="title"
                      value={aboutData.title}
                      onChange={handleBasicInfoChange}
                      required
                      helperText="Ex: Desenvolvedor Full Stack"
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="URL da Foto/Avatar"
                      name="avatar"
                      value={aboutData.avatar || ''}
                      onChange={handleBasicInfoChange}
                      helperText="URL para sua foto de perfil (deixe em branco para usar uma letra)"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              
              {/* Habilidades */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={addSkill}
                    sx={{ mb: 2 }}
                  >
                    Adicionar Habilidade
                  </Button>
                  
                  {aboutData.skills.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                      Nenhuma habilidade cadastrada. Clique em "Adicionar Habilidade" para começar.
                    </Typography>
                  ) : (
                    aboutData.skills.map((skill, index) => (
                      <Paper key={index} elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #E5E7EB' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Nome da Habilidade"
                              value={skill.name}
                              onChange={(e) => updateSkill(index, 'name', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Nível (1-100)"
                              type="number"
                              inputProps={{ min: 1, max: 100 }}
                              value={skill.level}
                              onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Categoria"
                              value={skill.category || ''}
                              onChange={(e) => updateSkill(index, 'category', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button 
                              color="error" 
                              onClick={() => removeSkill(index)}
                              size="small"
                            >
                              Remover
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))
                  )}
                </Box>
              </TabPanel>
              
              {/* Educação */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={addEducation}
                    sx={{ mb: 2 }}
                  >
                    Adicionar Educação
                  </Button>
                  
                  {aboutData.education.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                      Nenhuma formação cadastrada. Clique em "Adicionar Educação" para começar.
                    </Typography>
                  ) : (
                    aboutData.education.map((edu, index) => (
                      <Paper key={index} elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #E5E7EB' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Instituição"
                              value={edu.institution}
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Título/Grau"
                              value={edu.degree}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Área"
                              value={edu.field}
                              onChange={(e) => updateEducation(index, 'field', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Data de Início"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                              size="small"
                              helperText="Ex: 2018-01-15 (formato YYYY-MM-DD)"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Data de Término"
                              value={edu.endDate || ''}
                              onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                              size="small"
                              helperText="Deixe em branco se ainda não concluído"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Descrição"
                              value={edu.description || ''}
                              onChange={(e) => updateEducation(index, 'description', e.target.value)}
                              multiline
                              rows={2}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button 
                              color="error" 
                              onClick={() => removeEducation(index)}
                              size="small"
                            >
                              Remover
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))
                  )}
                </Box>
              </TabPanel>
              
              {/* Experiência */}
              <TabPanel value={tabValue} index={3}>
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={addExperience}
                    sx={{ mb: 2 }}
                  >
                    Adicionar Experiência
                  </Button>
                  
                  {aboutData.experience.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                      Nenhuma experiência cadastrada. Clique em "Adicionar Experiência" para começar.
                    </Typography>
                  ) : (
                    aboutData.experience.map((exp, index) => (
                      <Paper key={index} elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #E5E7EB' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Empresa"
                              value={exp.company}
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Cargo"
                              value={exp.position}
                              onChange={(e) => updateExperience(index, 'position', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Data de Início"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                              size="small"
                              helperText="Ex: 2018-01-15 (formato YYYY-MM-DD)"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Data de Término"
                              value={exp.endDate || ''}
                              onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                              size="small"
                              helperText="Deixe em branco se emprego atual"
                              disabled={exp.current}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Descrição"
                              value={exp.description}
                              onChange={(e) => updateExperience(index, 'description', e.target.value)}
                              multiline
                              rows={3}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Tecnologias (separadas por vírgula)"
                              value={Array.isArray(exp.technologies) ? exp.technologies.join(', ') : ''}
                              onChange={(e) => {
                                const techArray = e.target.value
                                  .split(',')
                                  .map(t => t.trim())
                                  .filter(t => t);
                                updateExperienceTechnologies(index, techArray);
                              }}
                              size="small"
                              helperText="Ex: React, Node.js, TypeScript"
                            />
                          </Grid>
                          <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button 
                              color="error" 
                              onClick={() => removeExperience(index)}
                              size="small"
                            >
                              Remover
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))
                  )}
                </Box>
              </TabPanel>
              
              {/* Links Sociais */}
              <TabPanel value={tabValue} index={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GitHub"
                      name="github"
                      value={aboutData.socialLinks?.github || ''}
                      onChange={handleSocialLinksChange}
                      helperText="Ex: https://github.com/seuusuario"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="LinkedIn"
                      name="linkedin"
                      value={aboutData.socialLinks?.linkedin || ''}
                      onChange={handleSocialLinksChange}
                      helperText="Ex: https://linkedin.com/in/seuusuario"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Twitter"
                      name="twitter"
                      value={aboutData.socialLinks?.twitter || ''}
                      onChange={handleSocialLinksChange}
                      helperText="Ex: https://twitter.com/seuusuario"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Site Pessoal"
                      name="website"
                      value={aboutData.socialLinks?.website || ''}
                      onChange={handleSocialLinksChange}
                      helperText="Ex: https://seusite.com"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Instagram"
                      name="instagram"
                      value={aboutData.socialLinks?.instagram || ''}
                      onChange={handleSocialLinksChange}
                      helperText="Ex: https://instagram.com/seuusuario"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/about')}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </Box>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
}