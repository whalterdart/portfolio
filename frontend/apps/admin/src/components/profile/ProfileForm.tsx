"use client";

import { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Profile, SocialLink } from '../../../../../lib/types/profile.types';

interface ProfileFormProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
  isSaving: boolean;
}

const socialPlatforms = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'medium', label: 'Medium' },
  { value: 'dev', label: 'Dev.to' },
  { value: 'website', label: 'Personal Website' }
];

export default function ProfileForm({ profile, onSave, isSaving }: ProfileFormProps) {
  const [formData, setFormData] = useState<Profile>(profile);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editSocialUrl, setEditSocialUrl] = useState('');

  useEffect(() => {
    // Update form data when profile changes
    setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Profile) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (e: SelectChangeEvent) => {
    setNewSocialPlatform(e.target.value);
  };

  const handleAddSocialLink = () => {
    if (!newSocialPlatform || !newSocialUrl) return;

    const newSocialLink: SocialLink = {
      platform: newSocialPlatform,
      url: newSocialUrl,
      active: true
    };

    setFormData((prev: Profile) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newSocialLink]
    }));

    // Reset inputs
    setNewSocialPlatform('');
    setNewSocialUrl('');
  };

  const handleRemoveSocialLink = (index: number) => {
    setFormData((prev: Profile) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_: SocialLink, i: number) => i !== index)
    }));
  };

  const handleEditSocialLink = (index: number) => {
    if (editingIndex === index) {
      // Save changes
      if (editSocialUrl) {
        const updatedLinks = [...formData.socialLinks];
        updatedLinks[index] = {
          ...updatedLinks[index],
          url: editSocialUrl
        };

        setFormData((prev: Profile) => ({
          ...prev,
          socialLinks: updatedLinks
        }));
      }

      setEditingIndex(null);
      setEditSocialUrl('');
    } else {
      // Start editing
      setEditingIndex(index);
      setEditSocialUrl(formData.socialLinks[index].url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
        </Box>

        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
          <Box>
            <TextField
              required
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              variant="outlined"
              helperText="Your full name as displayed on the homepage"
            />
          </Box>

          <Box>
            <TextField
              required
              fullWidth
              label="Highlighted Text"
              name="highlightedText"
              value={formData.highlightedText || ''}
              onChange={handleChange}
              variant="outlined"
              helperText="The highlighted word at the end of the greeting (e.g., 'Whalter')"
            />
          </Box>
        </Box>

        <Box>
          <TextField
            required
            fullWidth
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={2}
            helperText="Brief professional description (e.g., 'Full Stack Developer specialized in React, Next.js and Node.js')"
          />
        </Box>

        <Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Social Media Links
          </Typography>
        </Box>

        <Box>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="flex-end" mb={2}>
              <FormControl sx={{ mr: 2, minWidth: 200 }}>
                <InputLabel id="social-platform-label">Platform</InputLabel>
                <Select
                  labelId="social-platform-label"
                  value={newSocialPlatform}
                  onChange={handleSelectChange}
                  label="Platform"
                >
                  <MenuItem value=""><em>Select a platform</em></MenuItem>
                  {socialPlatforms.map(platform => (
                    <MenuItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="URL"
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                sx={{ flexGrow: 1, mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddSocialLink}
                disabled={!newSocialPlatform || !newSocialUrl}
              >
                Add
              </Button>
            </Box>

            <List>
              {formData.socialLinks && formData.socialLinks.length > 0 ? (
                formData.socialLinks.map((link: SocialLink, index: number) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          aria-label="edit" 
                          onClick={() => handleEditSocialLink(index)}
                          color={editingIndex === index ? "primary" : "default"}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => handleRemoveSocialLink(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        socialPlatforms.find(p => p.value === link.platform)?.label || link.platform
                      }
                      secondary={
                        editingIndex === index ? (
                          <TextField
                            value={editSocialUrl}
                            onChange={(e) => setEditSocialUrl(e.target.value)}
                            size="small"
                            fullWidth
                            autoFocus
                          />
                        ) : link.url
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No social links added yet" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Box>

        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSaving}
            sx={{ mt: 3, px: 4 }}
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </Box>
      </Box>
    </form>
  );
}