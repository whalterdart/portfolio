'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@lib/types/project.types';
import { ProjectService } from '@lib/services/project.service';
import { 
  TextField, 
  Button, 
  Stack, 
  Box, 
  Typography, 
  Alert, 
  Grid,
  InputAdornment,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  FormHelperText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Card,
  Avatar,
  CardMedia,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Title as TitleIcon, 
  Description as DescriptionIcon, 
  Image as ImageIcon, 
  Code as CodeIcon, 
  GitHub as GitHubIcon, 
  Launch as LaunchIcon,
  Save as SaveIcon,
  DateRange as DateIcon,
  Preview as PreviewIcon,
  FormatListNumbered as ListIcon,
  Add as AddIcon,
  Link as LinkIcon
} from '@mui/icons-material';

const projectService = new ProjectService();

interface ProjectFormProps {
  projectId?: string;
  onSuccess?: () => void;
}

const defaultProject: Partial<Project> = {
  title: '',
  description: '',
  imageUrl: '',
  technologies: [],
  githubUrl: '',
  liveUrl: ''
};

export function ProjectForm({ projectId, onSuccess }: ProjectFormProps) {
  const router = useRouter();
  const theme = useTheme();
  const [project, setProject] = useState<Partial<Project>>(defaultProject);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // For technology input
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);
  
  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await projectService.findOne(projectId!);
      if (data) {
        setProject(data);
      } else {
        setError('Projeto não encontrado');
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Falha ao carregar dados do projeto');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addTechnology = () => {
    if (!newTech.trim()) return;
    
    const tech = newTech.trim();
    const technologies = project.technologies || [];
    
    if (!technologies.includes(tech)) {
      setProject(prev => ({
        ...prev,
        technologies: [...technologies, tech]
      }));
    }
    
    setNewTech('');
  };
  
  const removeTechnology = (techToRemove: string) => {
    const technologies = project.technologies || [];
    setProject(prev => ({
      ...prev,
      technologies: technologies.filter(tech => tech !== techToRemove)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      if (!project.title) {
        setError('Título é obrigatório');
        setSaving(false);
        return;
      }
      
      if (!project.description) {
        setError('Descrição é obrigatória');
        setSaving(false);
        return;
      }
      
      if (projectId) {
        // Update existing project
        await projectService.update(projectId, project);
        setSuccess('Projeto atualizado com sucesso!');
      } else {
        // Create new project
        await projectService.create(project);
        setSuccess('Projeto criado com sucesso!');
        setProject(defaultProject);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Falha ao salvar projeto. Tente novamente mais tarde.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            name="title"
            label="Título do Projeto"
            value={project.title || ''}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            placeholder="Ex: Portfólio Pessoal"
          />
          
          <TextField
            name="description"
            label="Descrição"
            value={project.description || ''}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            multiline
            rows={4}
            placeholder="Descreva seu projeto, incluindo suas funcionalidades e propósito"
          />
          
          <Box>
            <TextField
              name="imageUrl"
              label="URL da Imagem"
              value={project.imageUrl || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="https://exemplo.com/imagem.jpg"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            {project.imageUrl && (
              <Card sx={{ mt: 2, maxWidth: 300 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={project.imageUrl}
                  alt={project.title || 'Preview da imagem'}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x140?text=Imagem+Inválida';
                  }}
                />
              </Card>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="githubUrl"
              label="URL do GitHub"
              value={project.githubUrl || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="https://github.com/username/repository"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GitHubIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              name="liveUrl"
              label="URL do Projeto"
              value={project.liveUrl || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="https://project-demo.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Tecnologias Utilizadas
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Adicionar Tecnologia"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mr: 2, flexGrow: 1 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addTechnology}
                disabled={!newTech.trim()}
              >
                Adicionar
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(project.technologies || []).map((tech, index) => (
                <Chip
                  key={index}
                  label={tech}
                  onDelete={() => removeTechnology(tech)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              
              {(project.technologies || []).length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma tecnologia adicionada ainda
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={() => router.push('/projects')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Salvando...' : (projectId ? 'Atualizar Projeto' : 'Criar Projeto')}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
