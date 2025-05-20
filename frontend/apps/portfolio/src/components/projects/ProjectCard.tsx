'use client';

import { Project } from '../../../../../lib/types/project.types';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  styled,
  alpha
} from '@mui/material';
import { GitHub as GitHubIcon, Launch as LaunchIcon } from '@mui/icons-material';

interface ProjectCardProps {
  project: Project;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 20px ${alpha(theme.palette.text.primary, 0.1)}`
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}));

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="200"
        image={project.imageUrl}
        alt={project.title}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
          {project.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          {project.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, mt: 3 }}>
          {project.technologies.map((tech, index) => (
            <Chip
              key={`${project.id}-${index}-${tech}`}
              label={tech}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {project.githubUrl && (
          <ActionButton
            href={project.githubUrl}
            rel="noopener noreferrer"
            startIcon={<GitHubIcon />}
            size="small"
            variant="outlined"
            color="primary"
          >
            GitHub
          </ActionButton>
        )}
        {project.liveUrl && (
          <ActionButton
            href={project.liveUrl}
            rel="noopener noreferrer"
            startIcon={<LaunchIcon />}
            size="small"
            variant="contained"
            color="primary"
            sx={{ ml: 1 }}
          >
            Demo
          </ActionButton>
        )}
      </CardActions>
    </StyledCard>
  );
}
