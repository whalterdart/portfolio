import { useState, useEffect } from 'react';
import { About, Skill, Education, Experience, SocialLinks } from '@lib/types/about.types';
import { AboutService } from '@lib/services/about.service';
import { 
  Button, 
  CircularProgress, 
  Typography, 
  Paper, 
  Box, 
  TextField, 
  Divider,
  Tabs,
  Tab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Chip,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Save as SaveIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface AboutFormProps {
  aboutId?: string;
  onSuccess?: () => void;
}

const emptySkill: Skill = {
  name: '',
  level: 50,
  category: 'Frontend'
};

const emptyEducation: Education = {
  institution: '',
  degree: '',
  field: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  description: ''
};

const emptyExperience: Experience = {
  company: '',
  position: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  current: true,
  description: '',
  technologies: []
};

const emptySocialLinks: SocialLinks = {
  github: '',
  linkedin: '',
  twitter: '',
  website: '',
  instagram: ''
};

const emptyAbout: About = {
  title: '',
  description: '',
  skills: [],
  education: [],
  experience: [],
  socialLinks: emptySocialLinks,
  active: false
};

const steps = ['Informações Básicas', 'Habilidades', 'Educação', 'Experiência', 'Redes Sociais'];

export function AboutForm({ aboutId, onSuccess }: AboutFormProps) {
  const [aboutData, setAboutData] = useState<About>(emptyAbout);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Form state for new items
  const [newSkill, setNewSkill] = useState<Skill>(emptySkill);
  const [newEducation, setNewEducation] = useState<Education>(emptyEducation);
  const [newExperience, setNewExperience] = useState<Experience>(emptyExperience);
  const [newTech, setNewTech] = useState<string>('');

  const aboutService = new AboutService();

  useEffect(() => {
    if (aboutId) {
      loadAbout();
    }
  }, [aboutId]);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const about = await aboutService.findOne(aboutId!);
      if (about) {
        console.log('Loaded about data:', about);
        // Ensure arrays are initialized
        setAboutData({
          ...about,
          skills: about.skills || [],
          education: about.education || [],
          experience: about.experience || [],
          socialLinks: about.socialLinks || emptySocialLinks
        });
      }
    } catch (err) {
      console.error('Erro ao carregar about:', err);
      setError('Falha ao carregar dados do about');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  // Navigation functions
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Skill functions
  const handleSkillChange = (field: keyof Skill, value: any) => {
    setNewSkill(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (!newSkill.name) return;

    setAboutData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    setNewSkill(emptySkill);
  };

  const removeSkill = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Education functions
  const handleEducationChange = (field: keyof Education, value: any) => {
    setNewEducation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addEducation = () => {
    if (!newEducation.institution || !newEducation.degree || !newEducation.field) return;

    setAboutData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
    setNewEducation(emptyEducation);
  };

  const removeEducation = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Experience functions
  const handleExperienceChange = (field: keyof Experience, value: any) => {
    setNewExperience(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTechToExperience = () => {
    if (!newTech) return;
    setNewExperience(prev => ({
      ...prev,
      technologies: [...(prev.technologies || []), newTech]
    }));
    setNewTech('');
  };

  const removeTechFromExperience = (index: number) => {
    setNewExperience(prev => ({
      ...prev,
      technologies: prev.technologies?.filter((_, i) => i !== index) || []
    }));
  };

  const addExperience = () => {
    if (!newExperience.company || !newExperience.position) return;

    setAboutData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
    setNewExperience(emptyExperience);
  };

  const removeExperience = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

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
          if (value && value.trim() !== '') {
            socialLinks[key] = value;
          }
        });
      }

      // Process experience items to properly handle current/endDate values
      const processedExperience = aboutData.experience.map(exp => {
        // If current is true, ensure endDate is undefined (not null)
        if (exp.current) {
          return {
            ...exp,
            endDate: undefined
          };
        }
        // If endDate is null, convert it to undefined to match the type
        if (exp.endDate === null) {
          return {
            ...exp,
            endDate: undefined
          };
        }
        return exp;
      });

      const dataToSave: Partial<About> = {
        title: aboutData.title,
        description: aboutData.description,
        skills: aboutData.skills || [],
        education: aboutData.education || [],
        experience: processedExperience,
        socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined
      };

      console.log('Sending data to backend:', JSON.stringify(dataToSave, null, 2));

      if (aboutId) {
        // Update existing about
        await new Promise((resolve, reject) => {
          aboutService.update(aboutId, dataToSave).subscribe({
            next: (response) => {
              console.log('About atualizado com sucesso:', response);
              resolve(response);
            },
            error: (err) => {
              console.error('Erro ao atualizar about:', err);
              reject(err);
            }
          });
        });
      } else {
        // Create new about using standard approach
        await new Promise((resolve, reject) => {
          aboutService.create(dataToSave).subscribe({
            next: (response) => {
              console.log('About criado com sucesso:', response);
              resolve(response);
            },
            error: (err) => {
              console.error('Erro ao criar about:', err);
              reject(err);
            }
          });
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Erro ao salvar about:', err);
      
      let errorMessage = 'Falha ao salvar';
      if (err.response?.data?.error) {
        errorMessage += ': ' + err.response.data.error;
      } else if (err.message) {
        errorMessage += ': ' + err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Form content based on the active step
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'medium' }}>
              Informações Básicas
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Título"
                name="title"
                value={aboutData.title}
                onChange={handleChange}
                placeholder="Ex: Desenvolvedor Full Stack"
                variant="outlined"
                margin="normal"
                required
                helperText="Um título que represente sua carreira ou especialização"
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={aboutData.description}
                onChange={handleChange}
                placeholder="Descreva-se profissionalmente..."
                variant="outlined"
                margin="normal"
                required
                multiline
                rows={4}
                helperText="Uma breve descrição sobre você e sua carreira"
              />
            </Box>
          </>
        );
        
      case 1: // Skills
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'medium' }}>
              Habilidades
            </Typography>
            
            {/* Add new skill form */}
            <Box sx={{ mb: 3, p: 2, border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <Typography variant="subtitle1" gutterBottom>
                Adicionar nova habilidade
              </Typography>
              
              <TextField
                fullWidth
                label="Nome da Habilidade"
                value={newSkill.name}
                onChange={(e) => handleSkillChange('name', e.target.value)}
                margin="normal"
                required
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={newSkill.category || ''}
                  label="Categoria"
                  onChange={(e) => handleSkillChange('category', e.target.value)}
                >
                  <MenuItem value="Frontend">Frontend</MenuItem>
                  <MenuItem value="Backend">Backend</MenuItem>
                  <MenuItem value="Mobile">Mobile</MenuItem>
                  <MenuItem value="DevOps">DevOps</MenuItem>
                  <MenuItem value="Database">Database</MenuItem>
                  <MenuItem value="Other">Outro</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Nível: {newSkill.level}%</Typography>
                <Slider
                  value={newSkill.level}
                  onChange={(_, value) => handleSkillChange('level', value as number)}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={100}
                />
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addSkill}
                  disabled={!newSkill.name}
                >
                  Adicionar
                </Button>
              </Box>
            </Box>
            
            {/* List of skills */}
            <Typography variant="subtitle1" gutterBottom>
              Habilidades ({aboutData.skills.length})
            </Typography>
            
            {aboutData.skills.length === 0 ? (
              <Typography color="text.secondary">
                Nenhuma habilidade adicionada ainda.
              </Typography>
            ) : (
              <List>
                {aboutData.skills.map((skill, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => removeSkill(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{ 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '4px', 
                      mb: 1 
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {skill.name}
                          <Chip 
                            label={`${skill.level}%`} 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1 }}
                          />
                          {skill.category && (
                            <Chip 
                              label={skill.category} 
                              size="small" 
                              variant="outlined" 
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        );
        
      case 2: // Education
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'medium' }}>
              Educação
            </Typography>
            
            {/* Add new education form */}
            <Box sx={{ mb: 3, p: 2, border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <Typography variant="subtitle1" gutterBottom>
                Adicionar nova formação
              </Typography>
              
              <TextField
                fullWidth
                label="Instituição"
                value={newEducation.institution}
                onChange={(e) => handleEducationChange('institution', e.target.value)}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Grau/Título"
                value={newEducation.degree}
                onChange={(e) => handleEducationChange('degree', e.target.value)}
                margin="normal"
                required
                placeholder="Ex: Bacharelado, Mestrado, Certificação"
              />
              
              <TextField
                fullWidth
                label="Área de Estudo"
                value={newEducation.field}
                onChange={(e) => handleEducationChange('field', e.target.value)}
                margin="normal"
                required
                placeholder="Ex: Ciência da Computação, Design"
              />
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  label="Data de Início"
                  type="date"
                  value={typeof newEducation.startDate === 'string' ? newEducation.startDate.split('T')[0] : ''}
                  onChange={(e) => handleEducationChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  required
                />
                
                <TextField
                  label="Data de Término"
                  type="date"
                  value={typeof newEducation.endDate === 'string' ? newEducation.endDate.split('T')[0] : ''}
                  onChange={(e) => handleEducationChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                />
              </Box>
              
              <TextField
                fullWidth
                label="Descrição"
                value={newEducation.description || ''}
                onChange={(e) => handleEducationChange('description', e.target.value)}
                margin="normal"
                multiline
                rows={2}
                placeholder="Descreva brevemente este curso ou formação"
              />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addEducation}
                  disabled={!newEducation.institution || !newEducation.degree || !newEducation.field}
                >
                  Adicionar
                </Button>
              </Box>
            </Box>
            
            {/* List of education */}
            <Typography variant="subtitle1" gutterBottom>
              Formações ({aboutData.education.length})
            </Typography>
            
            {aboutData.education.length === 0 ? (
              <Typography color="text.secondary">
                Nenhuma formação adicionada ainda.
              </Typography>
            ) : (
              <List>
                {aboutData.education.map((edu, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {edu.degree} em {edu.field}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {edu.institution}
                          </Typography>
                          <Typography variant="body2">
                            {new Date(edu.startDate as string).getFullYear()} - 
                            {edu.endDate ? new Date(edu.endDate as string).getFullYear() : 'Atual'}
                          </Typography>
                          {edu.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {edu.description}
                            </Typography>
                          )}
                        </Box>
                        <IconButton color="error" onClick={() => removeEducation(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
          </>
        );
        
      case 3: // Experience
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'medium' }}>
              Experiência Profissional
            </Typography>
            
            {/* Add new experience form */}
            <Box sx={{ mb: 3, p: 2, border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <Typography variant="subtitle1" gutterBottom>
                Adicionar nova experiência
              </Typography>
              
              <TextField
                fullWidth
                label="Empresa"
                value={newExperience.company}
                onChange={(e) => handleExperienceChange('company', e.target.value)}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Cargo"
                value={newExperience.position}
                onChange={(e) => handleExperienceChange('position', e.target.value)}
                margin="normal"
                required
              />
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
                <TextField
                  label="Data de Início"
                  type="date"
                  value={typeof newExperience.startDate === 'string' ? newExperience.startDate.split('T')[0] : ''}
                  onChange={(e) => handleExperienceChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  required
                />
                
                <FormControl sx={{ mt: 2, minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newExperience.current ? 'current' : 'past'}
                    label="Status"
                    onChange={(e) => {
                      const isCurrent = e.target.value === 'current';
                      handleExperienceChange('current', isCurrent);
                      if (isCurrent) {
                        handleExperienceChange('endDate', '');
                      }
                    }}
                  >
                    <MenuItem value="current">Atual</MenuItem>
                    <MenuItem value="past">Finalizado</MenuItem>
                  </Select>
                </FormControl>
                
                {!newExperience.current && (
                  <TextField
                    label="Data de Término"
                    type="date"
                    value={typeof newExperience.endDate === 'string' ? newExperience.endDate.split('T')[0] : ''}
                    onChange={(e) => handleExperienceChange('endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    required={!newExperience.current}
                  />
                )}
              </Box>
              
              <TextField
                fullWidth
                label="Descrição"
                value={newExperience.description}
                onChange={(e) => handleExperienceChange('description', e.target.value)}
                margin="normal"
                multiline
                rows={3}
                required
                placeholder="Descreva suas responsabilidades e conquistas nesta posição"
              />
              
              {/* Technologies section */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tecnologias utilizadas
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Tecnologia"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={addTechToExperience}
                    disabled={!newTech}
                  >
                    Adicionar
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {newExperience.technologies?.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      onDelete={() => removeTechFromExperience(index)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addExperience}
                  disabled={!newExperience.company || !newExperience.position || !newExperience.description}
                >
                  Adicionar
                </Button>
              </Box>
            </Box>
            
            {/* List of experiences */}
            <Typography variant="subtitle1" gutterBottom>
              Experiências ({aboutData.experience.length})
            </Typography>
            
            {aboutData.experience.length === 0 ? (
              <Typography color="text.secondary">
                Nenhuma experiência adicionada ainda.
              </Typography>
            ) : (
              <List>
                {aboutData.experience.map((exp, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {exp.position}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exp.company}
                          </Typography>
                          <Typography variant="body2">
                            {new Date(exp.startDate as string).getFullYear()} - 
                            {exp.current ? 'Atual' : (exp.endDate ? new Date(exp.endDate as string).getFullYear() : '')}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {exp.description}
                          </Typography>
                          
                          {exp.technologies && exp.technologies.length > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {exp.technologies.map((tech, techIndex) => (
                                <Chip key={techIndex} label={tech} size="small" variant="outlined" />
                              ))}
                            </Box>
                          )}
                        </Box>
                        <IconButton color="error" onClick={() => removeExperience(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
          </>
        );
        
      case 4: // Social Links
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'medium' }}>
              Redes Sociais
            </Typography>
            
            <TextField
              fullWidth
              label="GitHub"
              name="github"
              value={aboutData.socialLinks?.github || ''}
              onChange={handleSocialLinksChange}
              placeholder="https://github.com/username"
              variant="outlined"
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="LinkedIn"
              name="linkedin"
              value={aboutData.socialLinks?.linkedin || ''}
              onChange={handleSocialLinksChange}
              placeholder="https://linkedin.com/in/username"
              variant="outlined"
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Twitter"
              name="twitter"
              value={aboutData.socialLinks?.twitter || ''}
              onChange={handleSocialLinksChange}
              placeholder="https://twitter.com/username"
              variant="outlined"
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Website Pessoal"
              name="website"
              value={aboutData.socialLinks?.website || ''}
              onChange={handleSocialLinksChange}
              placeholder="https://mywebsite.com"
              variant="outlined"
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Instagram"
              name="instagram"
              value={aboutData.socialLinks?.instagram || ''}
              onChange={handleSocialLinksChange}
              placeholder="https://instagram.com/username"
              variant="outlined"
              margin="normal"
            />
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box>
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
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: '8px' }}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Form content based on active step */}
        {getStepContent(activeStep)}
        
        <Divider sx={{ my: 3 }} />
        
        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={activeStep === 0 ? onSuccess : handleBack}
            startIcon={<BackIcon />}
          >
            {activeStep === 0 ? 'Cancelar' : 'Voltar'}
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{ 
                  bgcolor: '#4F46E5', 
                  '&:hover': { bgcolor: '#4338CA' },
                  color: 'white'
                }}
              >
                {saving ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
                sx={{ 
                  bgcolor: '#4F46E5', 
                  '&:hover': { bgcolor: '#4338CA' },
                  color: 'white'
                }}
              >
                Próximo
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
