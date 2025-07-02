import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  LinearProgress,
  Chip,
  Paper,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Zoom,
} from '@mui/material';
import {
  VpnKey,
  Rocket,
  Subscriptions,
  CheckCircle,
  PlayArrow,
  ExpandMore,
  Schedule,
  Security,
  Cloud,
  ArrowForward,
  TrendingUp,
  Verified,
  MenuBook,
  AutoAwesome,
  VerifiedUser,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import enhancedToast from '../utils/toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [animateCards, setAnimateCards] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);

  

  const keys = JSON.parse(localStorage.getItem('ondc_keys') || 'null');
  const whitelistVerified = localStorage.getItem('ondc_whitelist_verified') === 'true';
  const deploymentCompleted = localStorage.getItem('ondc_deployment_completed') === 'true';
  const subscriptionCompleted = localStorage.getItem('ondc_subscription_completed') === 'true';


  useEffect(() => {
    // Trigger card animations on mount
    setTimeout(() => setAnimateCards(true), 300);
    
    // Initialize deployment status
    setDeploymentStatus(deploymentCompleted);
    
    // Initialize subscription status
    setSubscriptionStatus(subscriptionCompleted);
    
    // Listen for deployment completion events
    const handleDeploymentCompleted = () => {
      setDeploymentStatus(true);
      localStorage.setItem('ondc_deployment_completed', 'true');
    };
    
    // Listen for subscription completion events
    const handleSubscriptionCompleted = () => {
      setSubscriptionStatus(true);
      localStorage.setItem('ondc_subscription_completed', 'true');
    };
    
    window.addEventListener('ondc_deployment_completed', handleDeploymentCompleted);
    window.addEventListener('ondc_subscription_completed', handleSubscriptionCompleted);
    
    return () => {
      window.removeEventListener('ondc_deployment_completed', handleDeploymentCompleted);
      window.removeEventListener('ondc_subscription_completed', handleSubscriptionCompleted);
    };
  }, [deploymentCompleted, subscriptionCompleted]);

  const steps = useMemo(() => [
    {
      id: 1,
      title: 'Verify Whitelisting Status',
      subtitle: 'ONDC Subscriber Verification',
      description: 'Verify your subscriber ID is whitelisted on the ONDC network',
      detailedDescription: 'Before proceeding with integration, verify that your subscriber ID is approved and whitelisted by ONDC. This ensures you have the necessary permissions to integrate with the network and prevents issues during the subscription process.',
      action: 'Verify Whitelisting',
      path: '/whitelist',
      icon: <VerifiedUser sx={{ fontSize: 32 }} />,
      primaryColor: whitelistVerified ? '#10b981' : '#0ea5e9',
      secondaryColor: whitelistVerified ? '#059669' : '#0284c7',
      bgGradient: whitelistVerified ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      isCompleted: whitelistVerified,
      estimatedTime: '1-2 minutes',
      requirements: ['Valid subscriber ID', 'ONDC approval'],
      benefits: ['Verified network access', 'Approved integration', 'Compliance confirmed'],
      status: whitelistVerified ? 'completed' : 'pending',
    },
    {
      id: 2,
      title: 'Generate Cryptographic Keys',
      subtitle: 'Ed25519 & X25519 Key Pairs',
      description: 'Create secure signing and encryption keys compatible with all ONDC implementations',
      detailedDescription: 'Generate industry-standard Ed25519 signing keys for digital signatures and X25519 encryption keys for secure challenge-response handling. These keys are cross-platform compatible and work seamlessly with Java, Node.js, Python, Go, C#, and PHP implementations.',
      action: 'Generate Keys',
      path: '/keys',
      icon: <VpnKey sx={{ fontSize: 32 }} />,
      primaryColor: !!keys ? '#10b981' : '#0ea5e9',
      secondaryColor: !!keys ? '#059669' : '#0284c7',
      bgGradient: !!keys ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      isCompleted: !!keys,
      estimatedTime: '2-3 minutes',
      requirements: ['Browser with crypto support', 'Secure connection'],
      benefits: ['Cross-platform compatibility', 'Industry-standard encryption', 'Secure key generation'],
      status: !!keys ? 'completed' : 'pending',
    },
    {
      id: 3,
      title: 'Deploy ONDC Endpoints',
      subtitle: 'Server Configuration & Deployment',
      description: 'Set up required endpoints and deploy your ONDC-compliant application',
      detailedDescription: 'Deploy the mandatory ONDC endpoints including site verification pages and subscription callbacks. Get platform-specific deployment configurations for Docker, Kubernetes, and major cloud providers.',
      action: 'Setup Deployment',
      path: '/deployment',
      icon: <Rocket sx={{ fontSize: 32 }} />,
      primaryColor: (deploymentStatus || deploymentCompleted) ? '#10b981' : '#0ea5e9',
      secondaryColor: (deploymentStatus || deploymentCompleted) ? '#059669' : '#0284c7',
      bgGradient: (deploymentStatus || deploymentCompleted) ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      isCompleted: deploymentStatus || deploymentCompleted,
      estimatedTime: '10-15 minutes',
      requirements: ['Server/Cloud platform', 'Domain name', 'SSL certificate'],
      benefits: ['Auto-generated configs', 'Multi-platform support', 'Production-ready setup'],
      status: (deploymentStatus || deploymentCompleted) ? 'completed' : 'pending',
    },
    {
      id: 4,
      title: 'Subscribe to ONDC',
      subtitle: 'ONDC Network Subscription',
      description: 'Subscribe your application to the ONDC network',
      detailedDescription: 'Submit comprehensive business details including GST information, PAN details, and authorized signatory information. Complete the official ONDC subscription process with automated compliance checking.',
      action: 'Subscribe to ONDC',
      path: '/subscribe',
      icon: <Subscriptions sx={{ fontSize: 32 }} />,
      primaryColor: (subscriptionStatus || subscriptionCompleted) ? '#10b981' : '#0ea5e9',
      secondaryColor: (subscriptionStatus || subscriptionCompleted) ? '#059669' : '#0284c7',
      bgGradient: (subscriptionStatus || subscriptionCompleted) ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      isCompleted: subscriptionStatus || subscriptionCompleted,
      estimatedTime: '5-10 minutes',
      requirements: ['GST certificate', 'PAN details', 'Business documents'],
      benefits: ['Official ONDC registration', 'Network access', 'Compliance verification'],
      status: (subscriptionStatus || subscriptionCompleted) ? 'completed' : 'pending',
    },
  ], [whitelistVerified, keys, deploymentStatus, deploymentCompleted, subscriptionStatus, subscriptionCompleted]);

  const getOverallProgress = () => {
    const completedSteps = steps.filter(step => step.isCompleted).length;
    return (completedSteps / steps.length) * 100;
  };

  const getNextStep = () => {
    return steps.find(step => !step.isCompleted);
  };

  const resetProgress = () => {
    // Clear all completion flags from localStorage
    localStorage.removeItem('ondc_whitelist_verified');
    localStorage.removeItem('ondc_keys');
    localStorage.removeItem('ondc_deployment_completed');
    localStorage.removeItem('ondc_subscription_completed');
    localStorage.removeItem('ondc_session_id');
    
    // Show success message
    enhancedToast.success('Progress Reset Successfully!', 'Dashboard will refresh in a moment...');
    
    // Refresh the page after a short delay to show the toast
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const nextStep = getNextStep();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Compact Modern Header */}
      <Box sx={{ mb: 4 }}>
        {/* Main Header Section */}
        <Box sx={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          borderRadius: 3,
          p: { xs: 4, md: 6 },
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}>
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                mb: 1,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              ONDC QuickSubscribe
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' },
                opacity: 0.9,
                maxWidth: 400,
                mx: 'auto',
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              Automated ONDC onboarding in 1-2 hours
            </Typography>
          </Box>
        </Box>

        {/* Compact Progress Card */}
        <Box sx={{ 
          mt: -2, 
          px: 2, 
          position: 'relative', 
          zIndex: 2 
        }}>
          <Paper sx={{ 
            p: 4,
            borderRadius: 3,
            background: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0',
            maxWidth: 700,
            mx: 'auto',
          }}>
            {/* Compact Progress Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              mb: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  width: 40,
                  height: 40,
                  background: '#0ea5e9',
                  color: '#ffffff',
                }}>
                  <TrendingUp sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: '#1e293b',
                    fontSize: '1.1rem',
                  }}>
                    Integration Progress
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#64748b',
                    fontSize: '0.85rem',
                  }}>
                    Track your ONDC onboarding
                  </Typography>
                </Box>
              </Box>
              
              <Chip 
                label={`${Math.round(getOverallProgress())}% Complete`}
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  height: 32,
                  px: 1.5,
                  background: '#0ea5e9',
                  color: 'white',
                }}
              />
            </Box>
            
            {/* Enhanced Progress Bar */}
            <Box sx={{ mb: 3 }}>
              {/* Progress Bar Container */}
              <Box sx={{ position: 'relative', mb: 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={getOverallProgress()}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#f1f5f9',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: '#0ea5e9',
                    },
                  }}
                />
                
                {/* Progress Percentage Text */}
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}>
                  <Typography variant="caption" sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: getOverallProgress() > 50 ? 'white' : '#374151',
                    textShadow: getOverallProgress() > 50 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                  }}>
                    {Math.round(getOverallProgress())}%
                  </Typography>
                </Box>
              </Box>
              
              {/* Step Indicators */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}>
                {steps.map((step, index) => (
                  <Box key={step.id} sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    flex: 1,
                    position: 'relative',
                  }}>
                    {/* Step Circle */}
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: step.isCompleted ? step.primaryColor : '#e2e8f0',
                      border: `3px solid ${step.isCompleted ? step.primaryColor : '#cbd5e1'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: step.isCompleted 
                        ? `0 4px 12px ${step.primaryColor}40, 0 0 0 4px ${step.primaryColor}20` 
                        : '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: step.isCompleted ? 'scale(1.1)' : 'scale(1)',
                      zIndex: 1,
                    }}>
                      {step.isCompleted ? (
                        <CheckCircle sx={{ fontSize: 16, color: 'white' }} />
                      ) : (
                        <Typography variant="caption" sx={{ 
                          fontWeight: 700, 
                          fontSize: '0.7rem',
                          color: '#6b7280'
                        }}>
                          {index + 1}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Step Label */}
                    <Typography variant="caption" sx={{
                      mt: 1,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: step.isCompleted ? step.primaryColor : '#6b7280',
                      textAlign: 'center',
                      maxWidth: 80,
                      lineHeight: 1.2,
                    }}>
                      {step.title.split(' ').slice(0, 2).join(' ')}
                    </Typography>
                    
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <Box sx={{
                        position: 'absolute',
                        top: 16,
                        left: '50%',
                        width: 'calc(100% - 32px)',
                        height: 2,
                        backgroundColor: step.isCompleted && steps[index + 1]?.isCompleted 
                          ? '#10b981' 
                          : '#e2e8f0',
                        zIndex: 0,
                        transition: 'all 0.3s ease',
                      }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            
            {/* Compact Progress Stats */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pt: 2,
              borderTop: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: 2,
            }}>
              <Box>
                <Typography variant="body1" sx={{ 
                  fontWeight: 600, 
                  color: '#1e293b',
                  fontSize: '0.95rem',
                }}>
                  {steps.filter(s => s.isCompleted).length} of {steps.length} steps completed
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                }}>
                  {getOverallProgress() === 100 
                    ? '🎉 Complete!' 
                    : `${4 - steps.filter(s => s.isCompleted).length} remaining`
                  }
                </Typography>
              </Box>
              
              {/* Reset Progress Button */}
              <Button
                variant="outlined"
                size="small"
                onClick={resetProgress}
                sx={{
                  fontSize: '0.75rem',
                  height: 28,
                  px: 2,
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    backgroundColor: '#f8fafc',
                  },
                }}
                                 startIcon={<ArrowForward sx={{ fontSize: 14 }} />}
               >
                 Reset Progress
               </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Enhanced Session Status */}
      {whitelistVerified && (
        <Fade in={true} timeout={1000}>
          <Paper 
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Box sx={{ p: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 3,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar sx={{ 
                    width: 56,
                    height: 56,
                    background: '#059669',
                    color: '#ffffff',
                  }}>
                    <Verified sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700,
                      color: '#1e293b',
                      mb: 0.5,
                      fontSize: '1.25rem',
                    }}>
                      Active Session
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: '#64748b',
                      fontWeight: 500,
                      mb: 1,
                      fontSize: '1rem',
                    }}>
                      Subscriber ID: {localStorage.getItem('ondc_subscriber_id') || 'Not set'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ 
                        color: whitelistVerified ? '#059669' : '#d97706',
                        fontWeight: 500,
                      }}>
                        {whitelistVerified ? 'Whitelisting verified and session active' : 'Whitelisting pending'}
                      </Typography>
                      {whitelistVerified && (
                        <Chip 
                          label="Verified"
                          size="small"
                          sx={{
                            backgroundColor: '#059669',
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
                
                {nextStep ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ArrowForward />}
                    onClick={() => navigate(nextStep.path)}
                    sx={{ 
                      background: '#0ea5e9',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        background: '#0284c7',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    Continue to {nextStep.title}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Security />}
                    onClick={() => navigate('/headers')}
                    sx={{ 
                      background: '#059669',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        background: '#047857',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    Manage Headers
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Fade>
      )}

      {/* Modern Step Cards */}
      {/* Enhanced Section Header */}
      <Fade in timeout={1000}>
        <Box sx={{ 
          textAlign: 'center', 
          mb: 5,
          position: 'relative',
        }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            p: 4,
            borderRadius: 3,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}>
            <Avatar sx={{
              width: 48,
              height: 48,
              background: '#0ea5e9',
              color: '#ffffff',
            }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>O</Typography>
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
                              <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1e293b',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    mb: 0.5,
                  }}
                >
                  ONDC QuickSubscribe Journey
                </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  opacity: 0.8,
                }}
              >
                Automated onboarding - complete in 1-2 hours
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        {steps.map((step, index) => (
          <Grid item xs={12} lg={6} key={step.id}>
            <Zoom in={animateCards} timeout={600 + index * 200}>
              <Card sx={{
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: step.isCompleted ? `3px solid ${step.primaryColor}` : '1px solid rgba(0,0,0,0.1)',
                transform: animateCards ? 'translateY(0)' : 'translateY(20px)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px ${step.primaryColor}20`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: step.bgGradient,
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Avatar sx={{
                      width: 64,
                      height: 64,
                      background: step.bgGradient,
                      mr: 3,
                      boxShadow: `0 8px 24px ${step.primaryColor}40`,
                    }}>
                      {step.icon}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {step.title}
                        </Typography>
                        {step.isCompleted && (
                          <Chip
                            icon={<CheckCircle />}
                            label="Completed"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Box>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
                        {step.subtitle}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quick Info */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Schedule />}
                      label={step.estimatedTime}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      icon={<Security />}
                      label={step.status === 'completed' ? 'Verified' : 'Pending'}
                      variant="outlined"
                      size="small"
                      color={step.status === 'completed' ? 'success' : 'default'}
                    />
                  </Box>

                  {/* Expandable Details */}
                  <Accordion 
                    expanded={expandedStep === step.id}
                    onChange={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                    sx={{ 
                      boxShadow: 'none',
                      '&:before': { display: 'none' },
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderRadius: 2,
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        View Details & Requirements
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph sx={{ color: 'text.secondary' }}>
                        {step.detailedDescription}
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                            Requirements
                          </Typography>
                          {step.requirements.map((req, idx) => (
                            <Typography key={idx} variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, color: '#64748b' }}>
                              • {req}
                            </Typography>
                          ))}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                            Benefits
                          </Typography>
                          {step.benefits.map((benefit, idx) => (
                            <Typography key={idx} variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, color: '#64748b' }}>
                              • {benefit}
                            </Typography>
                          ))}
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  {/* Action Button */}
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant={step.isCompleted ? 'outlined' : 'contained'}
                      fullWidth
                      size="large"
                      startIcon={step.isCompleted ? <CheckCircle /> : <PlayArrow />}
                      onClick={() => navigate(step.path)}
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        fontSize: '1rem',
                        background: step.isCompleted ? 'transparent' : step.bgGradient,
                        borderColor: step.primaryColor,
                        color: step.isCompleted ? step.primaryColor : 'white',
                        '&:hover': {
                          background: step.bgGradient,
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 24px ${step.primaryColor}40`,
                        },
                      }}
                    >
                      {step.isCompleted ? `Review ${step.title}` : step.action}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Quick Tools Section */}
      <Card sx={{ mt: 6, borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{
          background: '#0ea5e9',
          p: 4,
          color: 'white'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
            Additional Tools & Resources
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, color: 'white' }}>
            Automated tools for instant ONDC onboarding
          </Typography>
        </Box>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#0ea5e9',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }
              }} onClick={() => navigate('/how-to-use')}>
                <MenuBook sx={{ fontSize: 40, color: '#0ea5e9', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#1e293b', fontWeight: 600 }}>How to Use</Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Complete guide to the 4-step integration process
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#0ea5e9',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }
              }} onClick={() => navigate('/headers')}>
                <Security sx={{ fontSize: 40, color: '#0ea5e9', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#1e293b', fontWeight: 600 }}>Authorization Headers</Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Create and verify ONDC-compliant authorization headers
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#0ea5e9',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }
              }} onClick={() => navigate('/deployment')}>
                <Cloud sx={{ fontSize: 40, color: '#0ea5e9', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#1e293b', fontWeight: 600 }}>Deployment Helper</Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Generate deployment configs for multiple platforms
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#0ea5e9',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }
              }} onClick={() => navigate('/deployment')}>
                <AutoAwesome sx={{ fontSize: 40, color: '#0ea5e9', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#1e293b', fontWeight: 600 }}>Integration Guide</Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Advanced integration documentation and examples
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>


    </Container>
  );
};

export default Dashboard; 