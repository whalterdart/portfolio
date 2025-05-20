'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@lib/types/project.types';
import { ProjectService } from '@lib/services/project.service';
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Visibility as ViewIcon,
  GitHub as GitHubIcon,
  Link as LinkIcon
} from '@mui/icons-material';

const projectService = new ProjectService();

export function ProjectList() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.findAll();
      setProjects(data);
      setError('');
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Falha ao carregar projetos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      setDeleteLoading(true);
      await projectService.remove(projectToDelete);
      setProjects(projects.filter(p => p.id !== projectToDelete && p._id !== projectToDelete));
      closeDeleteDialog();
      setError('');
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Falha ao excluir projeto. Tente novamente mais tarde.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/projects/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/projects/${id}`);
  };

  const navigateToCreate = () => {
    router.push('/projects/new');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Helper function to safely get project ID
  const getProjectId = (project: Project): string => {
    return project.id || project._id || "";
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Projetos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={navigateToCreate}
          sx={{ 
            bgcolor: '#4F46E5', 
            '&:hover': { bgcolor: '#4338CA' },
            color: 'white'
          }}
        >
          Novo Projeto
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Nenhum projeto encontrado.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={navigateToCreate}
          >
            Criar Primeiro Projeto
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell><strong>Imagem</strong></TableCell>
                <TableCell><strong>Título</strong></TableCell>
                <TableCell><strong>Descrição</strong></TableCell>
                <TableCell><strong>Tecnologias</strong></TableCell>
                <TableCell><strong>Links</strong></TableCell>
                <TableCell><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={getProjectId(project)} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                  <TableCell width={100}>
                    {project.imageUrl ? (
                      <Box 
                        component="img" 
                        src={project.imageUrl} 
                        alt={project.title}
                        sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }}
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          width: 80, 
                          height: 60, 
                          bgcolor: 'grey.200', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: 1
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Sem imagem
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {project.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 150 }}>
                      {project.technologies && project.technologies.slice(0, 3).map((tech, index) => (
                        <Chip 
                          key={index} 
                          label={tech} 
                          size="small" 
                          sx={{ fontSize: '0.7rem' }} 
                        />
                      ))}
                      {project.technologies && project.technologies.length > 3 && (
                        <Chip 
                          label={`+${project.technologies.length - 3}`} 
                          size="small" 
                          sx={{ fontSize: '0.7rem' }} 
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {project.githubUrl && (
                        <IconButton 
                          size="small" 
                          href={project.githubUrl} 
                          target="_blank"
                          aria-label="GitHub"
                        >
                          <GitHubIcon fontSize="small" />
                        </IconButton>
                      )}
                      {project.liveUrl && (
                        <IconButton 
                          size="small" 
                          href={project.liveUrl} 
                          target="_blank"
                          aria-label="Live demo"
                          color="primary"
                        >
                          <LinkIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(getProjectId(project))}
                        color="primary"
                        aria-label="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => openDeleteDialog(getProjectId(project))} 
                        color="error"
                        aria-label="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleteLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
