'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Material UI imports
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  styled,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';

import {
  Menu as MenuIcon,
  KeyboardArrowDown,
  GitHub,
  LinkedIn,
  Twitter,
  Close,
  ChevronRight
} from '@mui/icons-material';

// Lista de links do menu
const menuLinks = [
  { title: 'Início', path: '/' },
  { title: 'Projetos', path: '/projects' },
  { title: 'Sobre', path: '/about' },
  { title: 'Contato', path: '/contact' }
];

// Botão Principal Estilizado
export const PrimaryButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '10px 25px',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  fontWeight: 'bold',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
  }
}));

// Botão Secundário Estilizado
export const SecondaryButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '10px 25px',
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-3px)'
  }
}));

// Novo NavLink estilizado com efeito de underline
const NavLink = styled(Button)<{ selected: boolean }>(({ theme, selected }) => ({
  color: 'inherit',
  fontWeight: 600,
  position: 'relative',
  padding: '6px 16px',
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.2s ease-in-out',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: selected ? '80%' : '0%',
    height: '3px',
    bottom: '-2px',
    left: '10%',
    transition: 'all 0.3s ease-in-out',
    borderRadius: '4px',
  },
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#38bdf8',
    '&::after': {
      width: '80%',
      backgroundColor: '#38bdf8',
    }
  }
}));

// Mobile Nav Link estilizado
const MobileNavLink = styled(ListItemButton)<{ selected: boolean }>(({ theme, selected }) => ({
  borderRadius: '8px',
  marginBottom: '8px',
  backgroundColor: selected ? alpha('#38bdf8', 0.1) : 'transparent',
  borderLeft: selected ? '4px solid #38bdf8' : '4px solid transparent',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha('#38bdf8', 0.1),
  }
}));

export function Navigation() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Efeito para mudar o header ao scrollar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer para menu mobile
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Whalter Duarte
        </Typography>
        <IconButton>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <List sx={{ width: '100%' }}>
        {menuLinks.map((item) => (
          <ListItem key={item.title} disablePadding>
            <MobileNavLink
              selected={isActive(item.path)}
              onClick={() => window.location.href = item.path}
            >
              <ListItemText 
                primary={item.title} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(item.path) ? 600 : 500,
                  color: isActive(item.path) ? '#38bdf8' : 'inherit'
                }}
              />
              {isActive(item.path) && <ChevronRight sx={{ color: '#38bdf8' }} />}
            </MobileNavLink>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', py: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton sx={{ 
          color: '#6366f1',
          '&:hover': { backgroundColor: alpha('#6366f1', 0.1) }
        }}>
          <GitHub />
        </IconButton>
        <IconButton sx={{ 
          color: '#0ea5e9',
          '&:hover': { backgroundColor: alpha('#0ea5e9', 0.1) } 
        }}>
          <LinkedIn />
        </IconButton>
        <IconButton sx={{ 
          color: '#38bdf8',
          '&:hover': { backgroundColor: alpha('#38bdf8', 0.1) } 
        }}>
          <Twitter />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Header/Navbar */}
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          bgcolor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
          transition: 'all 0.3s',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', p: { xs: 1, md: '12px 16px' } }}>
            {/* Logo */}
            <Typography 
              variant="h6" 
              onClick={() => window.location.href = '/'}
              sx={{ 
                fontWeight: 'bold', 
                color: scrolled ? '#38bdf8' : 'white',
                textDecoration: 'none',
                letterSpacing: '0.5px',
                transition: 'color 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              Whalter Duarte
            </Typography>

            {/* Desktop Menu */}
            {!isMobile && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  backgroundColor: scrolled ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
                  borderRadius: scrolled ? '0' : '40px',
                  padding: scrolled ? '4px 0' : '4px 8px',
                  backdropFilter: scrolled ? 'none' : 'blur(8px)',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                {menuLinks.map((link) => (
                  <NavLink
                    key={link.title}
                    onClick={() => window.location.href = link.path}
                    selected={isActive(link.path)}
                    sx={{
                      color: scrolled ? (isActive(link.path) ? '#38bdf8' : 'text.primary') : 'white',
                      '&::after': {
                        backgroundColor: isActive(link.path) 
                          ? '#38bdf8' 
                          : scrolled ? 'transparent' : 'white',
                      }
                    }}
                  >
                    {link.title}
                  </NavLink>
                ))}
              </Box>
            )}

            {/* Contact Button */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile && (
                <Button
                  onClick={() => window.location.href = '/contact'}
                  variant="contained"
                  sx={{
                    borderRadius: '30px',
                    px: 3,
                    py: 1,
                    fontWeight: 'bold',
                    backgroundColor: '#38bdf8',
                    boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
                    '&:hover': {
                      backgroundColor: '#0ea5e9',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(56, 189, 248, 0.5)',
                    }
                  }}
                >
                  Entre em contato
                </Button>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  edge="start"
                  aria-label="menu"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: scrolled ? '#38bdf8' : 'white',
                    backgroundColor: scrolled ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: scrolled ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            borderRadius: '0 16px 16px 0',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
