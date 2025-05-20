'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  TextField, 
  Typography, 
  alpha
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { ContactService } from '../../../../../lib/services/contact.service';
import { ContactFormData } from '../../../../../lib/types/contact.types';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  showTitle?: boolean;
}

const ContactForm = ({ showTitle = true }: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    setSubmissionError(null);
    
    try {
      console.log('Submitting contact form with data:', JSON.stringify(formData, null, 2));
      
      // Create contact service
      const contactService = new ContactService();
      
      // Prepare data for API
      const contactData: ContactFormData = {
        name: formData.name,
        email: formData.email,
        subject: 'Contato do Site', // Default subject
        message: formData.message
      };
      
      // Send to API
      await new Promise((resolve, reject) => {
        contactService.submitContactForm(contactData).subscribe({
          next: (response) => {
            console.log('Contact form submitted successfully:', response);
            resolve(response);
          },
          error: (error) => {
            console.error('Error submitting contact form:', error);
            reject(error);
          }
        });
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionError('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        p: { xs: 2.5, md: 4 },
        borderRadius: 3,
        backdropFilter: 'blur(20px)',
        backgroundColor: alpha('#ffffff', 0.1),
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        width: '100%'
      }}
    >
      {showTitle && (
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 3,
            color: 'white'
          }}
        >
          Entre em Contato
        </Typography>
      )}
      
      {submitted ? (
        <Box 
          textAlign="center" 
          py={4}
          sx={{
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
            Mensagem Enviada!
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Obrigado pelo seu contato. Responderei o mais breve possível.
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setSubmitted(false)}
            sx={{ 
              mt: 2,
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: 30,
              px: 3,
              py: 1,
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
              }
            }}
          >
            Enviar Outra Mensagem
          </Button>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          {submissionError && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 2,
                bgcolor: alpha('#ff0000', 0.1),
                p: 2,
                borderRadius: 1,
                color: '#f8d7da'
              }}
            >
              {submissionError}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Nome **"
                name="name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    borderRadius: 1.5,
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255,255,255,0.6)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    padding: '14px 16px',
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#f8d7da',
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Email **"
                name="email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    borderRadius: 1.5,
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255,255,255,0.6)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    padding: '14px 16px',
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#f8d7da',
                  },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Mensagem **"
              name="message"
              multiline
              rows={5}
              variant="outlined"
              value={formData.message}
              onChange={handleChange}
              error={!!errors.message}
              helperText={errors.message}
              disabled={loading}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  borderRadius: 1.5,
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255,255,255,0.6)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: '#f8d7da',
                },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{
                py: 1.2,
                px: 4,
                borderRadius: 30,
                transition: 'all 0.3s',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'medium',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 15px rgba(0,0,0,0.2)'
                }
              }}
            >
              {loading ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default ContactForm; 