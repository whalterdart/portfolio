"use client";

import { useEffect, useState } from 'react';
import { Profile } from '../../../../../lib/types/profile.types';
import { ProfileService } from '../../../../../lib/services/profile.service';
import { Button, CircularProgress, Container, Typography, Paper, Box, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import ProfileForm from '../../components/profile/ProfileForm';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon } from '@mui/icons-material';

const emptyProfile: Profile = {
  name: '',
  highlightedText: '',
  description: '',
  socialLinks: []
};

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activating, setActivating] = useState(false);

  const profileService = new ProfileService();

  useEffect(() => {
    // Verificar autenticação
    const authService = new (require('@lib/services/auth.service').AuthService)();
    if (!authService.isAuthenticated()) {
      const { useRouter } = require('next/navigation');
      const router = useRouter();
      router.push('/login');
    }
    
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        // Busca todos os perfis
        const allProfiles = await profileService.findAll();
        setProfiles(allProfiles);
        
        // Identifica o perfil ativo
        const active = allProfiles.find(p => p.active === true);
        setActiveProfile(active || null);
        
        // Seleciona um perfil para edição (preferindo o ativo)
        if (active) {
          setSelectedProfile(active);
        } else if (allProfiles.length > 0) {
          setSelectedProfile(allProfiles[0]);
        } else {
          // Nenhum perfil encontrado, cria um vazio
          setSelectedProfile(emptyProfile);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profile data');
        setSelectedProfile(emptyProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSave = async (updatedProfile: Profile) => {
    try {
      setSaving(true);
      setError('');

      // Garantir que todos os campos obrigatórios estejam presentes
      const completeProfile = {
        ...updatedProfile,
        // Definir valores padrão para campos obrigatórios que possam estar ausentes
        name: updatedProfile.name || '',
        highlightedText: updatedProfile.highlightedText || '',
        description: updatedProfile.description || '',
        socialLinks: updatedProfile.socialLinks || [],
        // Se estiver criando um novo perfil, definir como inativo por padrão
        ...(!(selectedProfile?.id || selectedProfile?._id) ? { active: false } : {})
      };
      
      if (selectedProfile?.id || selectedProfile?._id) {
        // Atualizar perfil existente
        const id = selectedProfile.id || selectedProfile._id as string;
        console.log('Enviando dados para atualização de perfil:', completeProfile);
        await new Promise((resolve, reject) => {
          profileService.updateProfile(id, completeProfile).subscribe({
            next: (result) => {
              // Atualiza o perfil na lista
              setProfiles(prev => prev.map(p => 
                (p.id === result.id || p._id === result._id) ? result : p
              ));
              setSelectedProfile(result);
              if (result.active) {
                setActiveProfile(result);
              }
              resolve(result);
            },
            error: (err) => {
              console.error('Error updating profile:', err);
              setError('Failed to update profile: ' + (err.response?.data?.message || err.message));
              reject(err);
            }
          });
        });
      } else {
        // Criar novo perfil
        console.log('Criando novo perfil:', completeProfile);
        await new Promise((resolve, reject) => {
          profileService.create(completeProfile).subscribe({
            next: (result) => {
              // Adiciona o novo perfil na lista
              setProfiles(prev => [...prev, result]);
              setSelectedProfile(result);
              if (result.active) {
                setActiveProfile(result);
              }
              resolve(result);
            },
            error: (err) => {
              console.error('Error creating profile:', err);
              setError('Failed to create profile: ' + (err.response?.data?.message || err.message));
              reject(err);
            }
          });
        });
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('An error occurred while saving the profile');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSetActive = async (profileId: string) => {
    try {
      setActivating(true);
      setError('');
      
      await new Promise((resolve, reject) => {
        profileService.setActive(profileId).subscribe({
          next: (result) => {
            console.log('Perfil ativado com sucesso:', result);
            
            // Atualiza todos os perfis para refletir o novo estado ativo
            setProfiles(prev => {
              // Mapeamento atualizado para garantir que apenas um perfil esteja ativo
              return prev.map(p => {
                const profileId = p.id || p._id as string;
                const resultId = result.id || result._id as string;
                
                if (profileId === resultId) {
                  // Este u00e9 o perfil que foi ativado, garantir que esteja com active: true
                  return { ...result, active: true };
                } else {
                  // Para outros perfis, garantir que estejam com active: false
                  return { ...p, active: false };
                }
              });
            });
            
            // Atualizar o perfil ativo global
            setActiveProfile(result);
            resolve(result);
          },
          error: (err) => {
            console.error('Error setting profile as active:', err);
            setError('Failed to set profile as active: ' + (err.response?.data?.message || err.message));
            reject(err);
          }
        });
      });
    } catch (err) {
      console.error('Error setting profile as active:', err);
      setError('An error occurred while setting the profile as active');
    } finally {
      setActivating(false);
    }
  };
  
  const handleCreateNew = () => {
    setSelectedProfile(emptyProfile);
  };
  
  const handleSelectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', pt: 3, pb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: '#111827' }}>
            Gerenciamento de Perfis
          </Typography>
          
          {/* Lista de perfis */}
          <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight="600" color="primary.main">
                  Perfis Disponíveis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gerencie seus perfis e selecione qual estará ativo no site
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
                sx={{ borderRadius: 1.5, px: 3, py: 1 }}
              >
                Novo Perfil
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {error && (
                  <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                
                {profiles.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <AddIcon fontSize="large" color="action" />
                    </Box>
                    <Typography sx={{ mb: 1, fontWeight: 500 }}>
                      Nenhum perfil encontrado
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                      Crie seu primeiro perfil para exibir no seu site
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleCreateNew}
                      size="small"
                    >
                      Criar perfil
                    </Button>
                  </Box>
                ) : (
                  <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, mb: 1 }}>
                    {profiles.map((profile) => (
                      <ListItem 
                        key={profile.id || profile._id as string}
                        secondaryAction={
                          <Box>
                            {profile.active ? (
                              <Button 
                                variant="contained" 
                                size="small" 
                                color="success" 
                                startIcon={<CheckIcon />}
                                disabled
                                sx={{ mr: 1, borderRadius: 1.5 }}
                              >
                                Ativo
                              </Button>
                            ) : (
                              <Button 
                                variant="outlined" 
                                size="small" 
                                color="primary" 
                                onClick={() => handleSetActive(profile.id || profile._id as string)}
                                disabled={activating}
                                sx={{ mr: 1, borderRadius: 1.5 }}
                              >
                                Definir como Ativo
                              </Button>
                            )}
                            <Button 
                              variant="outlined" 
                              size="small" 
                              color="primary" 
                              onClick={() => handleSelectProfile(profile)}
                              startIcon={<EditIcon />}
                              sx={{ mr: 1, borderRadius: 1.5 }}
                            >
                              Editar
                            </Button>
                          </Box>
                        }
                        sx={{ 
                          bgcolor: (profile.id === selectedProfile?.id || profile._id === selectedProfile?._id) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                          borderRadius: 1.5,
                          mb: 1,
                          border: '1px solid',
                          borderColor: (profile.id === selectedProfile?.id || profile._id === selectedProfile?._id) ? 'primary.main' : 'transparent',
                          '&:hover': {
                            bgcolor: 'rgba(25, 118, 210, 0.04)'
                          }
                        }}
                      >
                        <ListItemText
                          primary={<Typography fontWeight={500}>{profile.name}</Typography>}
                          secondary={
                            <Typography component="div" variant="body2" color="textSecondary">
                              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  size="small" 
                                  label={`${profile.socialLinks?.length || 0} links`} 
                                  color="default" 
                                  variant="outlined"
                                />
                                {profile.active && <Chip size="small" label="Ativo" color="success" />}
                              </Box>
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            )}
          </Paper>
          
          {/* Formulário de edição */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight="600" color="primary.main">
                  {selectedProfile?.id || selectedProfile?._id ? 'Editar Perfil' : 'Novo Perfil'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProfile?.id || selectedProfile?._id ? 'Modifique os dados do perfil selecionado' : 'Preencha os dados para criar um novo perfil'}
                </Typography>
              </Box>
              {selectedProfile?.id && selectedProfile?.active && (
                <Chip 
                  color="success" 
                  label="Perfil Ativo" 
                  icon={<CheckIcon />} 
                  sx={{ fontWeight: 500 }}
                />
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <ProfileForm 
                  profile={selectedProfile || emptyProfile} 
                  onSave={handleSave} 
                  isSaving={saving} 
                />
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
