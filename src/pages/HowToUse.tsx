import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Paper,
  Avatar,
  Fade,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MenuBook,
  VerifiedUser,
  VpnKey,
  Rocket,
  Subscriptions,
  ArrowForward,
  CheckCircle,
  Info,
  PlayArrow,
  Timeline,
} from '@mui/icons-material';

const HowToUse: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      title: 'Verify Whitelisting Status',
      subtitle: 'ONDC Subscriber Verification',
      icon: <VerifiedUser sx={{ fontSize: 24 }} />,
      color: '#0ea5e9',
      duration: '1-2 minutes',
      description: 'Verify that your subscriber ID is approved and whitelisted by ONDC',
      details: [
        'Enter your ONDC subscriber ID in the verification form',
        'Click "Verify Whitelisting Status" to check approval',
        'System validates your ID against ONDC whitelist',
        'Receive confirmation of whitelisting status',
        'Proceed to key generation once verified'
      ],
      requirements: [
        'Valid ONDC subscriber ID',
        'ONDC approval and whitelisting'
      ],
      path: '/whitelist'
    },
    {
      id: 2,
      title: 'Generate Cryptographic Keys',
      subtitle: 'Ed25519 & X25519 Key Pairs',
      icon: <VpnKey sx={{ fontSize: 24 }} />,
      color: '#0ea5e9',
      duration: '2-3 minutes',
      description: 'Create secure signing and encryption keys for ONDC integration',
      details: [
        'Generate Ed25519 signing keys for digital signatures',
        'Create X25519 encryption keys for secure communication',
        'Keys are cross-platform compatible (Java, Node.js, Python, Go, C#, PHP)',
        'Download configuration files for your implementation',
        'Store keys securely in environment variables'
      ],
      requirements: [
        'Browser with crypto support',
        'Secure internet connection'
      ],
      path: '/keys'
    },
    {
      id: 3,
      title: 'Deploy ONDC Endpoints',
      subtitle: 'Server Configuration & Deployment',
      icon: <Rocket sx={{ fontSize: 24 }} />,
      color: '#0ea5e9',
      duration: '10-15 minutes',
      description: 'Set up required endpoints and deploy your ONDC-compliant application',
      details: [
        'Configure mandatory ONDC endpoints (/health, /ondc-site-verification.html, /on_subscribe)',
        'Generate deployment configurations for multiple platforms',
        'Test endpoints for compliance and functionality',
        'Deploy to your preferred cloud platform',
        'Verify SSL certificate and HTTPS requirements'
      ],
      requirements: [
        'Server or cloud platform',
        'Domain name with SSL certificate',
        'Deployment environment setup'
      ],
      path: '/deployment'
    },
    {
      id: 4,
      title: 'Subscribe to ONDC',
      subtitle: 'Network Registration & Subscription',
      icon: <Subscriptions sx={{ fontSize: 24 }} />,
      color: '#0ea5e9',
      duration: '5-10 minutes',
      description: 'Complete the official ONDC network subscription process',
      details: [
        'Submit comprehensive business details and documentation',
        'Provide GST certificate and PAN information',
        'Configure network participant details and domains',
        'Complete authorized signatory verification',
        'Receive official ONDC network access credentials'
      ],
      requirements: [
        'GST certificate',
        'PAN details',
        'Business registration documents',
        'Authorized signatory information'
      ],
      path: '/subscribe'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Header */}
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            borderRadius: 3,
            p: 4,
            mb: 4,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <MenuBook sx={{ fontSize: 32, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  color: 'white',
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }
                }}
              >
                How to Use This Application
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.9,
                  color: 'white',
                  fontWeight: 400
                }}
              >
                Complete ONDC QuickSubscribe guide - automated onboarding in 4 simple steps
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Overview Section */}
      <Fade in timeout={1000}>
        <Card elevation={0} sx={{ mb: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 48, height: 48, background: '#0ea5e9' }}>
                <Timeline sx={{ fontSize: 24, color: 'white' }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Integration Overview
              </Typography>
            </Box>
            
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
              This application guides you through the complete ONDC (Open Network for Digital Commerce) 
              integration process. Follow these four sequential steps to successfully join the ONDC network 
              and start participating in India's digital commerce ecosystem.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                    🎯 What You'll Achieve
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
                      </ListItemIcon>
                      <ListItemText primary="Verified ONDC network access" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
                      </ListItemIcon>
                      <ListItemText primary="Secure cryptographic keys" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
                      </ListItemIcon>
                      <ListItemText primary="Production-ready deployment" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
                      </ListItemIcon>
                      <ListItemText primary="Official ONDC subscription" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                    ⏱️ Total Time Required
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip label="18-30 minutes" color="primary" sx={{ fontWeight: 600 }} />
                    <Typography variant="body2" color="text.secondary">
                      (depending on deployment complexity)
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    The process is designed to be completed in a single session. 
                    Each step builds upon the previous one, ensuring a smooth integration experience.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Step-by-Step Guide */}
      <Fade in timeout={1200}>
        <Card elevation={0} sx={{ mb: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar sx={{ width: 48, height: 48, background: '#0ea5e9' }}>
                <PlayArrow sx={{ fontSize: 24, color: 'white' }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Step-by-Step Process
              </Typography>
            </Box>

            <Stepper orientation="vertical" sx={{ '& .MuiStepConnector-line': { minHeight: 40 } }}>
              {steps.map((step, index) => (
                <Step key={step.id} active={true} completed={false}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: step.color,
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        {step.id}
                      </Avatar>
                    )}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                        {step.subtitle}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip size="small" label={step.duration} color="primary" variant="outlined" />
                      </Box>
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ ml: 7, pb: 3 }}>
                      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                        {step.description}
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            What You'll Do:
                          </Typography>
                          <List dense>
                            {step.details.map((detail, idx) => (
                              <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Box
                                    sx={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      background: step.color,
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={detail} 
                                  primaryTypographyProps={{ variant: 'body2', sx: { lineHeight: 1.5 } }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Requirements:
                          </Typography>
                          {step.requirements.map((req, idx) => (
                            <Chip
                              key={idx}
                              label={req}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                          <Box sx={{ mt: 3 }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => navigate(step.path)}
                              endIcon={<ArrowForward />}
                              sx={{
                                background: step.color,
                                textTransform: 'none',
                                '&:hover': { background: '#0284c7' }
                              }}
                            >
                              Start Step {step.id}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </Fade>

      {/* Important Notes */}
      <Fade in timeout={1400}>
        <Card elevation={0} sx={{ mb: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 48, height: 48, background: '#f59e0b' }}>
                <Info sx={{ fontSize: 24, color: 'white' }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Important Notes
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Sequential Process
                  </Typography>
                  <Typography variant="body2">
                    Steps must be completed in order. Each step depends on the successful completion of the previous one.
                  </Typography>
                </Alert>

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Data Persistence
                  </Typography>
                  <Typography variant="body2">
                    Your progress is automatically saved. You can close the browser and return to continue where you left off.
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={6}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Security Best Practices
                  </Typography>
                  <Typography variant="body2">
                    Never share your private keys. Always use HTTPS in production. Store sensitive data in environment variables.
                  </Typography>
                </Alert>

                <Alert severity="success">
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Support Available
                  </Typography>
                  <Typography variant="body2">
                    Each step includes detailed instructions and help documentation to guide you through the process.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Get Started */}
      <Fade in timeout={1600}>
        <Card 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            border: '2px solid #0ea5e9',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              }}
            >
              <Rocket sx={{ fontSize: 40, color: 'white' }} />
            </Avatar>
            
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Ready to Get Started?
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Begin your ONDC integration journey now. The process is straightforward, 
              well-documented, and designed to get you connected to the network quickly and securely.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/whitelist')}
                startIcon={<VerifiedUser />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Start Integration Process
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/')}
                startIcon={<MenuBook />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  borderColor: '#0ea5e9',
                  color: '#0284c7',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                View Dashboard
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default HowToUse;
