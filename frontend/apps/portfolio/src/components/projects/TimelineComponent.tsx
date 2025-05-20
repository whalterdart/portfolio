'use client';

import React from 'react';
import { Project } from '../../../../../lib/types/project.types';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Box, Typography, Chip, Button, useTheme, alpha } from '@mui/material';
import { GitHub as GitHubIcon, Launch as LaunchIcon, Code as CodeIcon } from '@mui/icons-material';

interface TimelineComponentProps {
  projects: Project[];
}

export default function TimelineComponent({ projects }: TimelineComponentProps) {
  const theme = useTheme();

  const sortedProjects = [...projects].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      <VerticalTimeline animate={true} lineColor={theme.palette.primary.main}>
        {sortedProjects.map((project) => (
          <VerticalTimelineElement
            key={project.id}
            date={new Date(project.createdAt || Date.now()).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long'
            })}
            iconStyle={{
              background: theme.palette.primary.main,
              color: '#fff',
              boxShadow: `0 0 0 4px ${theme.palette.primary.main}, inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05)`
            }}
            contentStyle={{
              background: alpha(theme.palette.background.paper, 0.8),
              boxShadow: theme.shadows[4],
              borderRadius: theme.shape.borderRadius * 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
            contentArrowStyle={{ borderRight: `7px solid ${alpha(theme.palette.primary.main, 0.2)}` }}
            icon={<CodeIcon />}
          >
            <Box sx={{ position: 'relative', mb: 2, overflow: 'hidden', borderRadius: 1 }}>
              <img
                src={project.imageUrl}
                alt={project.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  py: 2,
                  px: 2,
                }}
              >
                <Typography variant="h6" component="h3" color="white" fontWeight="bold">
                  {project.title}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" paragraph>
              {project.description}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 2 }}>
              {project.technologies.map((tech, techIndex) => (
                <Chip
                  key={`${project.id}-tech-${techIndex}-${tech}`}
                  label={tech}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
              {project.githubUrl && (
                <Button
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GitHubIcon />}
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  Código
                </Button>
              )}
              {project.liveUrl && (
                <Button
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LaunchIcon />}
                  size="small"
                  variant="contained"
                  color="primary"
                >
                  Demo
                </Button>
              )}
            </Box>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </Box>
  );
}
