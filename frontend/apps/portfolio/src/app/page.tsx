'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Avatar, Box, Button, Container, Divider, IconButton, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ChevronRight, GitHub, LinkedIn, Twitter, Instagram, Language } from '@mui/icons-material';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import dynamic from 'next/dynamic';
import { Project } from '../../../../lib/types/project.types';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectService } from '../../../../lib/services/project.service';
import { ProfileService } from '../../../../lib/services/profile.service';
import ContactSection from '../components/contact/ContactSection';
import { About } from '../../../../lib/types/about.types';

const TimelineComponent = dynamic(() => import('../components/projects/TimelineComponent'), { ssr: false });
const AboutMeSection = dynamic(() => import('../components/about/AboutMeSection'), { ssr: false });

const Particle = styled(Box)(() => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  animation: 'floatParticle 15s infinite ease-in-out',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  transition: 'transform 0.3s ease-out, opacity 0.5s ease-out'
}));

const InteractiveParticle = styled(Box)(() => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.3), 0 5px 15px rgba(0,0,0,0.15)',
  transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease',
  '&:hover': {
    opacity: '0.8 !important',
    transform: 'scale(1.1) !important'
  }
}));

const InteractiveSquare = styled(Box)(() => ({
  position: 'absolute',
  background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.3), 0 5px 15px rgba(0,0,0,0.15)',
  transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease',
  '&:hover': {
    opacity: '0.8 !important',
    transform: 'scale(1.1) rotate(45deg) !important'
  }
}));

const GlowingOrb = styled(Box)(() => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))',
  filter: 'blur(30px)',
  opacity: 0.7,
  animation: 'pulse 8s infinite alternate',
  transition: 'transform 0.3s ease-out'
}));

const PrimaryButton = styled(Button)(() => ({
  borderRadius: '30px',
  padding: '10px 25px',
  backgroundColor: '#38bdf8',
  color: '#fff',
  fontWeight: 'bold',
  transition: 'all 0.3s',
  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
  '&:hover': {
    backgroundColor: '#0ea5e9',
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
  }
}));

const SecondaryButton = styled(Button)(() => ({
  borderRadius: '30px',
  padding: '10px 25px',
  border: '2px solid #a5f3fc',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  color: '#ffffff',
  fontWeight: 'bold',
  backdropFilter: 'blur(4px)',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: '#ffffff',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.15)'
  }
}));

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados para armazenar dados
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<{
    name: string;
    highlightedText: string;
    description: string;
    socialLinks: Array<{platform: string; url: string}>;
  }>({
    name: '',
    highlightedText: '',
    description: '',
    socialLinks: []
  });
  const [aboutData, setAboutData] = useState<About | null>(null);
  
  // Estado de carregamento global
  const [isLoading, setIsLoading] = useState(true);
  
  // Mouse tracking optimization - use refs instead of state
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  const heroRef = useRef<HTMLDivElement>(null);
  const isMouseMoving = useRef(false);
  const lastMoveTime = useRef(0);
  const rafId = useRef<number | null>(null);
  
  // Use um ID único de cliente para evitar problemas de hydration
  const clientId = useRef(`client-${Date.now()}`).current;
  
  // Reference to the interactive elements
  const interactiveElementsRef = useRef<Array<{ 
    x: number, 
    y: number, 
    size: number,
    factor: number,
    color: string,
    duration: number,
    delay: number
  }>>([
    // Circles
    { x: 15, y: 25, size: 70, factor: 0.08, color: 'rgba(255,255,255,0.6)', duration: 15, delay: 0 },
    { x: 85, y: 15, size: 60, factor: 0.12, color: 'rgba(255,255,255,0.5)', duration: 18, delay: 2 },
    { x: 20, y: 70, size: 90, factor: 0.09, color: 'rgba(255,255,255,0.7)', duration: 20, delay: 1 },
    { x: 65, y: 60, size: 75, factor: 0.10, color: 'rgba(255,255,255,0.5)', duration: 17, delay: 3 },
    { x: 35, y: 85, size: 55, factor: 0.11, color: 'rgba(255,255,255,0.4)', duration: 22, delay: 4 },
    { x: 80, y: 80, size: 80, factor: 0.07, color: 'rgba(255,255,255,0.6)', duration: 19, delay: 0.5 },
    // Squares
    { x: 30, y: 20, size: 65, factor: 0.09, color: 'rgba(255,255,255,0.6)', duration: 18, delay: 1.5 },
    { x: 70, y: 30, size: 60, factor: 0.08, color: 'rgba(255,255,255,0.5)', duration: 16, delay: 3.5 },
    { x: 40, y: 50, size: 75, factor: 0.11, color: 'rgba(255,255,255,0.7)', duration: 21, delay: 0 },
    { x: 75, y: 75, size: 60, factor: 0.10, color: 'rgba(255,255,255,0.5)', duration: 19, delay: 2.5 },
    { x: 25, y: 60, size: 70, factor: 0.12, color: 'rgba(255,255,255,0.4)', duration: 23, delay: 1 },
    { x: 60, y: 10, size: 50, factor: 0.07, color: 'rgba(255,255,255,0.6)', duration: 17, delay: 3 }
  ]);
  
  // Optimized mouse movement handler with better throttling
  const updateMousePosition = (clientX: number, clientY: number) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      if (
        clientX >= rect.left && 
        clientX <= rect.right && 
        clientY >= rect.top && 
        clientY <= rect.bottom
      ) {
        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        
        // Store values in ref to avoid state updates
        mousePosition.current = { x, y };
        
        // Set CSS variables directly on hero element for better performance
        if (heroRef.current) {
          heroRef.current.style.setProperty('--mouse-x', x.toString());
          heroRef.current.style.setProperty('--mouse-y', y.toString());
        }
        
        isMouseMoving.current = true;
        lastMoveTime.current = Date.now();
        
        // Only schedule animation frame if not already scheduled
        if (rafId.current === null) {
          rafId.current = requestAnimationFrame(updateElements);
        }
      }
    }
  };
  
  // Optimized function to update elements based on mouse position
  const updateElements = () => {
    rafId.current = null;
    
    // If it's been more than 100ms since last mouse movement, consider it stopped
    if (Date.now() - lastMoveTime.current > 100) {
      isMouseMoving.current = false;
    }
    
    // If still moving, request another frame
    if (isMouseMoving.current) {
      rafId.current = requestAnimationFrame(updateElements);
    }
  };
  
  // Set up global mouse move handler with passive event
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };
    
    // Using passive event listener for better performance
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);
  
  // Direct mouse event handler for hero section
  const handleMouseMove = (e: React.MouseEvent) => {
    updateMousePosition(e.clientX, e.clientY);
  };
  
  // Optimized offset calculation using CSS variables
  const getCalcOffset = (factor = 1) => {
    return {
      x: `calc((var(--mouse-x, 0.5) - 0.5) * ${15 * factor}px)`,
      y: `calc((var(--mouse-y, 0.5) - 0.5) * ${15 * factor}px)`
    };
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize CSS variables
    if (heroRef.current) {
      heroRef.current.style.setProperty('--mouse-x', '0.5');
      heroRef.current.style.setProperty('--mouse-y', '0.5');
    }

    // Função para carregar todos os dados necessários
    const loadAllData = async () => {
      // Começamos com o estado de carregamento
      setIsLoading(true);
      
      try {
        console.log('Iniciando carregamento de dados...');
        
        // Preparar as promises para todos os carregamentos de dados
        const promises = [];
        let fetchedProfile = null;
        let fetchedProjects = [];
        let fetchedAbout = null;
        
        // 1. Promise para buscar o perfil
        const fetchProfilePromise = async () => {
          try {
            console.log('Buscando perfil via ProfileService...');
            const profileService = new ProfileService();
            const activeProfile = await profileService.findActive();
            
            if (activeProfile) {
              console.log('Perfil ativo encontrado');
              fetchedProfile = {
                name: activeProfile.name || '',
                highlightedText: activeProfile.highlightedText || '',
                description: activeProfile.description || '',
                socialLinks: activeProfile.socialLinks || []
              };
            } else {
              console.log('Nenhum perfil ativo encontrado, usando dados padrão');
              fetchedProfile = {
                name: 'Desenvolvedor',
                highlightedText: 'Portfólio Demo',
                description: 'React, Next.js e Node.js',
                socialLinks: [
                  { platform: 'github', url: 'https://github.com' }
                ]
              };
            }
          } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            fetchedProfile = {
              name: 'Desenvolvedor',
              highlightedText: 'Portfólio Demo',
              description: 'React, Next.js e Node.js',
              socialLinks: [
                { platform: 'github', url: 'https://github.com' }
              ]
            };
          }
        };
        promises.push(fetchProfilePromise());
        
        // 2. Promise para buscar projetos
        const fetchProjectsPromise = async () => {
          try {
            console.log('Buscando projetos via ProjectService...');
            const projectService = new ProjectService();
            const projects = await projectService.findAll();
            
            console.log(`Projetos obtidos com sucesso: ${projects.length}`);
            if (projects.length === 0) {
              console.log('Nenhum projeto retornado pela API');
              fetchedProjects = [];
            } else {
              fetchedProjects = projects.map((project: any) => {
                // Validation to ensure data is properly formatted
                return {
                  id: project._id || project.id || `temp-${Date.now()}`,
                  title: project.title || 'Projeto sem título',
                  description: project.description || 'Sem descrição disponível',
                  imageUrl: project.imageUrl || '',
                  technologies: Array.isArray(project.technologies) ? project.technologies : [],
                  createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
                  updatedAt: project.updatedAt ? new Date(project.updatedAt) : new Date(),
                  githubUrl: project.githubUrl || '',
                  liveUrl: project.liveUrl || ''
                };
              });
            }
          } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            fetchedProjects = [];
          }
        };
        promises.push(fetchProjectsPromise());
        
        // 3. Promise para buscar dados do About
        const fetchAboutPromise = async () => {
          try {
            console.log('Pré-carregando dados do About...');
            const { AboutService } = await import('../../../../lib/services/about.service');
            const aboutService = new AboutService();
            
            // Buscar realmente os dados do about
            const about = await aboutService.findOne('current');
            if (about) {
              console.log('Dados do About carregados com sucesso');
              fetchedAbout = about;
            } else {
              console.log('Nenhum dado do About encontrado');
              fetchedAbout = null;
            }
          } catch (error) {
            console.error('Erro ao buscar dados do About:', error);
            fetchedAbout = null;
          }
        };
        promises.push(fetchAboutPromise());
        
        // 4. Pré-carregamento dos componentes dinâmicos
        const preloadComponents = async () => {
          try {
            console.log('Pré-carregando componentes dinâmicos...');
            // Forçar carregamento dos componentes dinâmicos
            await Promise.all([
              import('../components/projects/TimelineComponent'),
              import('../components/about/AboutMeSection'),
              import('../components/contact/ContactForm')
            ]);
            console.log('Componentes dinâmicos carregados com sucesso');
          } catch (error) {
            console.error('Erro ao pré-carregar componentes:', error);
          }
        };
        promises.push(preloadComponents());
        
        // Aguardar todas as promises terminarem
        await Promise.all(promises);
        
        // Depois de todas as promises serem resolvidas, atualizamos os estados
        setProfile(fetchedProfile);
        setProjects(fetchedProjects);
        setAboutData(fetchedAbout);
        
        // Adicionar um pequeno delay para garantir que tudo foi renderizado
        setTimeout(() => {
          console.log('Todos os dados carregados, exibindo página...');
          setIsLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Componente de loading global
  if (isLoading) {
    const loadingOrbs = [
      { width: 180, height: 180, left: '10%', top: '10%', opacity: 0.15, delay: '0s', duration: '4s' },
      { width: 210, height: 210, left: '20%', top: '20%', opacity: 0.20, delay: '0.5s', duration: '5s' },
      { width: 240, height: 240, left: '30%', top: '30%', opacity: 0.25, delay: '1s', duration: '6s' },
      { width: 270, height: 270, left: '40%', top: '40%', opacity: 0.30, delay: '1.5s', duration: '7s' },
      { width: 300, height: 300, left: '50%', top: '50%', opacity: 0.35, delay: '2s', duration: '8s' },
      { width: 330, height: 330, left: '60%', top: '60%', opacity: 0.40, delay: '2.5s', duration: '9s' },
      { width: 360, height: 360, left: '70%', top: '70%', opacity: 0.45, delay: '3s', duration: '10s' },
      { width: 390, height: 390, left: '80%', top: '80%', opacity: 0.50, delay: '3.5s', duration: '11s' }
    ];

    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #5b21b6 0%, #1e40af 100%)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0
          }}
        >
          {/* Partículas de fundo com valores determinísticos para evitar discrepâncias de hydration */}
          {loadingOrbs.map((orb, i) => (
            <GlowingOrb
              key={`loading-orb-${i}`}
              sx={{
                width: orb.width,
                height: orb.height,
                left: orb.left,
                top: orb.top,
                opacity: orb.opacity,
                animation: `pulse ${orb.duration} infinite alternate ease-in-out`,
                animationDelay: orb.delay
              }}
            />
          ))}
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              fontSize: '3rem',
              mb: 4,
              border: '4px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              animation: 'pulse 2s infinite ease-in-out'
            }}
          >
            W
          </Avatar>
          
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              mb: 2
            }}
          >
            Carregando Portfólio
          </Typography>
          
          <Box
            sx={{
              width: 200,
              height: 6,
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              mt: 2
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '30%',
                borderRadius: 3,
                background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.7), rgba(129, 140, 248, 0.7))',
                animation: 'loadingProgress 1.5s infinite ease-in-out alternate'
              }}
            />
          </Box>
        </Box>
        
        <style jsx global>{`
          @keyframes loadingProgress {
            0% { transform: translateX(0%); width: 30%; }
            100% { transform: translateX(233.33%); width: 30%; }
          }
          @keyframes pulse {
            0% { opacity: 0.5; transform: scale(0.95); }
            50% { opacity: 0.8; transform: scale(1); }
            100% { opacity: 0.5; transform: scale(0.95); }
          }
        `}</style>
      </Box>
    );
  }

  return (
    <Box sx={{ overflow: 'hidden' }} key={clientId}>
      <Navigation />
      <Box
        ref={heroRef}
        onMouseMove={handleMouseMove}
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #5b21b6 0%, #1e40af 100%)',
          willChange: 'transform', // Hint to browser to optimize transformations
          '& .parallax-element': {
            transition: 'transform 0.2s ease-out'
          }
        }}
      >
        {/* Animated gradient orb backgrounds - using CSS variables instead of style props for better performance */}
        <GlowingOrb 
          className="parallax-element"
          sx={{ 
            width: '600px', 
            height: '600px',
            left: '10%', 
            top: '10%',
            background: 'radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.5), rgba(139, 92, 246, 0))',
            transform: `translate3d(
              calc((var(--mouse-x, 0.5) - 0.5) * ${12 * 15}px),
              calc((var(--mouse-y, 0.5) - 0.5) * ${12 * 15}px),
              0
            )`,
            willChange: 'transform',
            transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }} 
        />
        
        <GlowingOrb 
          className="parallax-element"
          sx={{ 
            width: '500px', 
            height: '500px',
            right: '0%', 
            bottom: '0%',
            background: 'radial-gradient(circle at 30% 30%, rgba(96, 165, 250, 0.5), rgba(59, 130, 246, 0))',
            transform: `translate3d(
              calc((var(--mouse-x, 0.5) - 0.5) * ${-10 * 15}px),
              calc((var(--mouse-y, 0.5) - 0.5) * ${-10 * 15}px),
              0
            )`,
            willChange: 'transform',
            transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
            animationDelay: '2s'
          }} 
        />
        
        {/* Reduce number of Interactive Particles for better performance */}
        {interactiveElementsRef.current.slice(0, 4).map((el, index) => (
          <InteractiveParticle
            key={`particle-${index}`}
            className="parallax-element"
            sx={{
              width: el.size,
              height: el.size,
              left: `${el.x}%`,
              top: `${el.y}%`,
              opacity: 0.4,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), rgba(255,255,255,0.08))',
              boxShadow: 'inset 0 0 15px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.2)',
              transform: `translate3d(
                calc((var(--mouse-x, 0.5) - 0.5) * ${20 * el.factor}px),
                calc((var(--mouse-y, 0.5) - 0.5) * ${20 * el.factor}px),
                0
              )`,
              transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              willChange: 'transform',
              zIndex: 1,
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))',
              animation: `growAndMove ${el.duration}s infinite alternate ease-in-out`,
              animationDelay: `${el.delay}s`
            }}
          />
        ))}
        
        {/* Reduce number of Interactive Squares for better performance */}
        {interactiveElementsRef.current.slice(6, 8).map((el, index) => (
          <InteractiveSquare
            key={`square-${index}`}
            className="parallax-element"
            sx={{
              width: el.size,
              height: el.size,
              borderRadius: '10px',
              left: `${el.x}%`,
              top: `${el.y}%`,
              opacity: 0.4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))',
              boxShadow: 'inset 0 0 15px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.2)',
              transform: `translate3d(
                calc((var(--mouse-x, 0.5) - 0.5) * ${15 * el.factor}px),
                calc((var(--mouse-y, 0.5) - 0.5) * ${15 * el.factor}px),
                0
              )`,
              transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              willChange: 'transform',
              zIndex: 1,
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))',
              animation: `squareGrowAndRotate ${el.duration}s infinite alternate ease-in-out`,
              animationDelay: `${el.delay}s`
            }}
          />
        ))}
        
        {/* Reduce number of larger particles */}
        <Particle
          className="parallax-element"
          sx={{
            width: 300,
            height: 300,
            top: '10%',
            left: '5%',
            opacity: 0.15,
            animationDelay: '0s',
            transform: `translate3d(
              calc((var(--mouse-x, 0.5) - 0.5) * ${8 * 15}px),
              calc((var(--mouse-y, 0.5) - 0.5) * ${8 * 15}px),
              0
            ) rotate(calc(var(--mouse-x, 0.5) * 10deg))`,
            willChange: 'transform',
            transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        />
        
        <Particle
          className="parallax-element"
          sx={{
            width: 200,
            height: 200,
            bottom: '15%',
            right: '10%',
            opacity: 0.2,
            animationDelay: '2s',
            transform: `translate3d(
              calc((var(--mouse-x, 0.5) - 0.5) * ${-6 * 15}px),
              calc((var(--mouse-y, 0.5) - 0.5) * ${-6 * 15}px),
              0
            ) rotate(calc(var(--mouse-y, 0.5) * 10deg))`,
            willChange: 'transform',
            transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        />
        
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            alignItems: 'center',
            zIndex: 2,
            py: 8,
            position: 'relative'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 4,
              width: '100%'
            }}
          >
            <Box 
              className="parallax-element"
              sx={{ 
                flex: 1, 
                color: 'white', 
                textAlign: { xs: 'center', md: 'left' },
                transform: `translate3d(
                  calc((var(--mouse-x, 0.5) - 0.5) * ${2 * 15}px),
                  calc((var(--mouse-y, 0.5) - 0.5) * ${2 * 15}px),
                  0
                )`,
                transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                willChange: 'transform'
              }}
            >
              {/* Conteúdo quando os dados do perfil estiverem carregados */}
              <>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    fontWeight: 'bold',
                    mb: 1,
                    lineHeight: 1.2,
                    background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '60px',
                      height: '4px',
                      background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                      bottom: '-15px',
                      left: { xs: '50%', md: 0 },
                      transform: { xs: 'translateX(-50%)', md: 'none' },
                      borderRadius: '2px',
                    }
                  }}
                >
                  Olá, meu nome é{' '}
                  <Box
                    component="span"
                    sx={{
                      color: '#38bdf8',
                      display: 'inline-block',
                      position: 'relative',
                      background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {profile.name}
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mt: 4,
                    mb: 4,
                    fontWeight: 'normal',
                    opacity: 0.9,
                    maxWidth: '600px',
                    mx: { xs: 'auto', md: 0 },
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  {profile.highlightedText}{' '}
                  <Box component="span" sx={{ fontWeight: 'bold' }}>
                    {profile.description}
                  </Box>
                </Typography>
              </>
              {!isLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    mt: 3
                  }}
                >
                  <PrimaryButton
                    variant="contained"
                    href="/projects"
                    endIcon={<ChevronRight />}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/projects';
                    }}
                  >
                    Ver Projetos
                  </PrimaryButton>
                  <SecondaryButton
                    variant="outlined"
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/contact';
                    }}
                  >
                    Entre em Contato
                  </SecondaryButton>
                </Box>
              )}
              {!isLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mt: 5,
                    justifyContent: { xs: 'center', md: 'flex-start' }
                  }}
                >
                  {profile.socialLinks && profile.socialLinks.length > 0 ? (
                    profile.socialLinks.map((link, index) => {
                      // Determinar o ícone correto com base na plataforma
                      let Icon = GitHub; // Padrão para fallback
                      
                      // Converter para minúsculas e remover espaços para comparação segura
                      const platform = link.platform.toLowerCase().trim();
                      
                      if (platform === 'linkedin') {
                        Icon = LinkedIn;
                      } else if (platform === 'twitter') {
                        Icon = Twitter;
                      } else if (platform === 'instagram') {
                        Icon = Instagram;
                      } else if (platform === 'website' || platform === 'site') {
                        Icon = Language;
                      }

                      return (
                        <IconButton
                          key={index}
                          component="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${link.platform}`}
                          sx={{
                            color: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(5px)',
                            '&:hover': { 
                              color: '#38bdf8', 
                              transform: 'translateY(-3px)',
                              bgcolor: 'rgba(255,255,255,0.2)',
                            },
                            transition: 'all 0.3s'
                          }}
                        >
                          <Icon />
                        </IconButton>
                      );
                    })
                  ) : (
                    // Se não houver links sociais, não exibimos nada
                    <Box sx={{ display: 'none' }} />
                  )}
                </Box>
              )}
            </Box>
            <Box
              className="parallax-element"
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                transform: `translate3d(
                  calc((var(--mouse-x, 0.5) - 0.5) * ${-2 * 15}px),
                  calc((var(--mouse-y, 0.5) - 0.5) * ${-2 * 15}px),
                  0
                )`,
                transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                willChange: 'transform'
              }}
            >
              <Box
                sx={{
                  width: { xs: 250, md: 350, lg: 400 },
                  height: { xs: 250, md: 350, lg: 400 },
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 25px 45px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.2)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -10,
                    borderRadius: '50%',
                    border: '2px dashed rgba(255, 255, 255, 0.4)',
                    animation: 'spin 30s linear infinite'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -20,
                    borderRadius: '50%',
                    border: '3px solid rgba(255, 255, 255, 0.1)',
                    animation: 'spin 50s linear infinite reverse'
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: '100%',
                    height: '100%',
                    border: '4px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: '#60a5fa',
                    fontSize: { xs: '5rem', md: '8rem' },
                    boxShadow: '0 0 30px rgba(0,0,0,0.3)',
                    animation: 'pulse 5s infinite alternate'
                  }}
                >
                  W
                </Avatar>
                
                {/* Add more orbiting particles */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    animation: 'spin 25s linear infinite',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '45%',
                      right: '5%',
                      width: '25px',
                      height: '25px',
                      borderRadius: '50%',
                      background: '#f472b6',
                      boxShadow: '0 0 15px #f472b6',
                    }}
                  />
                </Box>
                
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    animation: 'spin 18s linear infinite reverse',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '25%',
                      right: '8%',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#fb923c',
                      boxShadow: '0 0 12px #fb923c',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Divider sx={{ flexGrow: 1, mr: 2 }} />
            <Typography variant="h4" component="h2" color="primary" fontWeight="bold">
              Projetos Destaque
            </Typography>
            <Divider sx={{ flexGrow: 1, ml: 2 }} />
          </Box>
          {projects.length > 0 ? (
            <Box sx={{ mt: 4, mb: 6 }}>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TimelineComponent projects={projects.slice(0, 2)} />
              </Box>
              <Box
                sx={{
                  display: { xs: 'grid', md: 'none' },
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 4,
                  mt: 4
                }}
              >
                {projects.slice(0, 2).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Button
                  component={Link}
                  href="/projects"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: '30px', px: 4 }}
                >
                  Ver Todos os Projetos
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                Nenhum projeto encontrado.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
                Os projetos adicionados pelo painel administrativo aparecerão aqui.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      <Box
        sx={{
          position: 'relative',
          py: 8,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8faff 0%, #e0e8ff 100%)'
        }}
      >
        {/* Background animado para seção Sobre Mim */}
        {interactiveElementsRef.current.slice(0, 3).map((el, index) => (
          <InteractiveParticle
            key={`about-particle-${index}`}
            sx={{
              width: el.size * 0.7,
              height: el.size * 0.7,
              left: `${(el.x + 10) % 100}%`,
              top: `${(el.y + 30) % 100}%`,
              opacity: 0.25,
              background: 'radial-gradient(circle at 30% 30%, rgba(91, 33, 182, 0.15), rgba(30, 64, 175, 0.05))',
              boxShadow: 'inset 0 0 15px rgba(255,255,255,0.4), 0 0 20px rgba(120,120,255,0.1)',
              zIndex: 0,
              animation: `growAndMove ${el.duration * 1.2}s infinite alternate ease-in-out`,
              animationDelay: `${el.delay + 2}s`
            }}
          />
        ))}
        
        {interactiveElementsRef.current.slice(6, 9).map((el, index) => (
          <InteractiveSquare
            key={`about-square-${index}`}
            sx={{
              width: el.size * 0.6,
              height: el.size * 0.6,
              borderRadius: '10px',
              left: `${(el.x + 20) % 100}%`,
              top: `${(el.y + 40) % 100}%`,
              opacity: 0.2,
              background: 'linear-gradient(135deg, rgba(91, 33, 182, 0.15), rgba(30, 64, 175, 0.05))',
              boxShadow: 'inset 0 0 15px rgba(255,255,255,0.4), 0 0 20px rgba(120,120,255,0.1)',
              zIndex: 0,
              animation: `squareGrowAndRotate ${el.duration * 1.1}s infinite alternate ease-in-out`,
              animationDelay: `${el.delay + 1}s`
            }}
          />
        ))}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Divider sx={{ flexGrow: 1, mr: 2 }} />
            <Typography variant="h4" component="h2" color="primary" fontWeight="bold">
              Sobre Mim
            </Typography>
            <Divider sx={{ flexGrow: 1, ml: 2 }} />
          </Box>

          <AboutMeSection preloadedData={aboutData} />
        </Container>
      </Box>
      
      {/* Contact Section */}
      <Box 
        id="contact"
        sx={{ 
          position: 'relative',
          py: 12,
          backgroundColor: 'rgba(67, 56, 202, 0.9)',
          backgroundImage: 'linear-gradient(135deg, rgba(79, 70, 229, 0.95) 0%, rgba(67, 56, 202, 0.95) 100%)',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            opacity: 0.1,
            background: 'url(/images/pattern-dot.svg) repeat',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -150,
            right: -150,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Divider sx={{ flexGrow: 1, mr: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
            <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
              Entre em Contato
            </Typography>
            <Divider sx={{ flexGrow: 1, ml: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
          </Box>
          
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              color: 'rgba(255,255,255,0.8)', 
              mb: 5, 
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Tem um projeto em mente ou gostaria de discutir oportunidades de colaboração? 
            Entre em contato preenchendo o formulário abaixo.
          </Typography>
          
          <ContactSection containerMaxWidth="lg" />
        </Container>
      </Box>
      
      <Footer />
      
      <style jsx global>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes floatSquare {
          0%, 100% { transform: translateY(0) translateX(0) rotate(10deg); }
          25% { transform: translateY(-15px) translateX(15px) rotate(15deg); }
          50% { transform: translateY(-30px) translateX(5px) rotate(10deg); }
          75% { transform: translateY(-15px) translateX(-5px) rotate(5deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0.5; transform: scale(0.95); }
        }
        @keyframes floatInSpace {
          0% { transform: translateY(0) translateX(0) scale(1); filter: brightness(1); }
          25% { transform: translateY(-15px) translateX(10px) scale(1.03); filter: brightness(1.2); }
          50% { transform: translateY(-25px) translateX(-5px) scale(1.05); filter: brightness(1.3); }
          75% { transform: translateY(-10px) translateX(-15px) scale(1.03); filter: brightness(1.1); }
          100% { transform: translateY(0) translateX(0) scale(1); filter: brightness(1); }
        }
        @keyframes spinFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); filter: brightness(1); }
          25% { transform: translateY(-15px) translateX(15px) rotate(5deg) scale(1.05); filter: brightness(1.2); }
          50% { transform: translateY(-20px) translateX(5px) rotate(10deg) scale(1.1); filter: brightness(1.3); }
          75% { transform: translateY(-5px) translateX(-10px) rotate(15deg) scale(1.05); filter: brightness(1.2); }
          100% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); filter: brightness(1); }
        }
        @keyframes fadeGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.3), 0 0 20px currentColor; }
          50% { box-shadow: 0 0 20px rgba(255,255,255,0.5), 0 0 30px currentColor; }
        }
        @keyframes growAndMove {
          0% { transform: translateY(0) translateX(0) scale(0.9); }
          25% { transform: translateY(-30px) translateX(20px) scale(1.1); }
          50% { transform: translateY(-5px) translateX(35px) scale(1); }
          75% { transform: translateY(-25px) translateX(-15px) scale(1.15); }
          100% { transform: translateY(0) translateX(0) scale(0.9); }
        }
        @keyframes squareGrowAndRotate {
          0% { transform: translateY(0) translateX(0) scale(0.85) rotate(0deg); }
          20% { transform: translateY(-25px) translateX(20px) scale(1.05) rotate(10deg); }
          40% { transform: translateY(-10px) translateX(40px) scale(0.95) rotate(20deg); }
          60% { transform: translateY(-30px) translateX(10px) scale(1.1) rotate(5deg); }
          80% { transform: translateY(-20px) translateX(-20px) scale(1) rotate(15deg); }
          100% { transform: translateY(0) translateX(0) scale(0.85) rotate(0deg); }
        }
      `}</style>
    </Box>
  );
}
