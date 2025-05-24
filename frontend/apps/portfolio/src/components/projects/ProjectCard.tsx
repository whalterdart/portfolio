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
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

// Helper function to validate image URLs - same as in TimelineComponent
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    // Check if it's a relative URL starting with "/"
    if (url.startsWith('/')) return true;
    
    // Check if it's an absolute URL (http:// or https://)
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

// Default fallback image - same as in TimelineComponent
const DEFAULT_IMAGE = '/project-placeholder.svg';

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
        image={isValidImageUrl(project.imageUrl) ? project.imageUrl : DEFAULT_IMAGE}
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
          <Link href={project.githubUrl} passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <ActionButton
                startIcon={<GitHubIcon />}
                size="small"
                variant="outlined"
                color="primary"
              >
                GitHub
              </ActionButton>
            </a>
          </Link>
        )}
        {project.liveUrl && (
          <Link href={project.liveUrl} passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', marginLeft: '8px' }}>
              <ActionButton
                startIcon={<LaunchIcon />}
                size="small"
                variant="contained"
                color="primary"
              >
                Demo
              </ActionButton>
            </a>
          </Link>
        )}
      </CardActions>
    </StyledCard>
  );
}
