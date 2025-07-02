import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  TextField,
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Fade,
  Zoom,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  ContentCopy,
  Check,
  Error as ErrorIcon,
  PlayArrow,
  ExpandMore,
  Rocket,
  CloudUpload,
  Code,
  Speed,
  Settings,
  IntegrationInstructions,
  Psychology,
  Coffee,
  Memory,
  Terminal,
  Storage,
  ArrowForward,
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const DeploymentHelper: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [serverUrl, setServerUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [deploymentCode, setDeploymentCode] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('node');


  const keys = JSON.parse(localStorage.getItem('ondc_keys') || 'null');
  const whitelistVerified = localStorage.getItem('ondc_whitelist_verified') === 'true';

  // Language icon component
  const LanguageIcon: React.FC<{ language: string }> = ({ language }) => {
    switch (language) {
      case 'node':
        return <IntegrationInstructions sx={{ color: '#68A063' }} />;
      case 'python':
        return <Psychology sx={{ color: '#3776AB' }} />;
      case 'java':
        return <Coffee sx={{ color: '#ED8B00' }} />;
      case 'dotnet':
        return <Memory sx={{ color: '#239120' }} />;
      case 'go':
        return <Terminal sx={{ color: '#00ADD8' }} />;
      case 'php':
        return <Storage sx={{ color: '#777BB4' }} />;
      default:
        return <Code sx={{ color: '#666' }} />;
    }
  };

  const languages = [
    { value: 'node', label: 'Node.js', icon: <LanguageIcon language="node" /> },
    { value: 'java', label: 'Java', icon: <LanguageIcon language="java" /> },
    { value: 'python', label: 'Python', icon: <LanguageIcon language="python" /> },
    { value: 'dotnet', label: 'C#/.NET', icon: <LanguageIcon language="dotnet" /> },
    { value: 'go', label: 'Go', icon: <LanguageIcon language="go" /> },
    { value: 'php', label: 'PHP', icon: <LanguageIcon language="php" /> },
  ];

  const deploymentTabs = [
    { label: 'Docker', value: 'docker', icon: <Storage />, color: '#2496ED' },
    { label: 'Manual', value: 'manual', icon: <Terminal />, color: '#64748b' },
    { label: 'Kubernetes', value: 'kubernetes', icon: <CloudUpload />, color: '#326CE5' },
    { label: 'Environment', value: 'env', icon: <Settings />, color: '#10b981' },
  ];

  const generateDeploymentCode = useCallback(async (language: string) => {
    if (!whitelistVerified) {
      toast.error('Please verify your whitelisting status first.');
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate dummy deployment code based on language
      const dummyDeploymentCode = {
        docker: `version: '3.8'
services:
  ondc-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ONDC_SIGNING_PRIVATE_KEY=\${ONDC_SIGNING_PRIVATE_KEY}
      - ONDC_SIGNING_PUBLIC_KEY=\${ONDC_SIGNING_PUBLIC_KEY}
      - ONDC_ENCRYPTION_PRIVATE_KEY=\${ONDC_ENCRYPTION_PRIVATE_KEY}
      - ONDC_ENCRYPTION_PUBLIC_KEY=\${ONDC_ENCRYPTION_PUBLIC_KEY}
      - NODE_ENV=production
    restart: unless-stopped`,
        
        manual: `# Manual Deployment Instructions for ${language.toUpperCase()}

# 1. Install dependencies
${language === 'node' ? 'npm install' : 
  language === 'python' ? 'pip install -r requirements.txt' :
  language === 'java' ? 'mvn clean install' :
  language === 'go' ? 'go mod download' :
  language === 'dotnet' ? 'dotnet restore' :
  'composer install'}

# 2. Set environment variables
export ONDC_SIGNING_PRIVATE_KEY="${keys?.sign_private_key || 'your_signing_private_key'}"
export ONDC_SIGNING_PUBLIC_KEY="${keys?.sign_public_key || 'your_signing_public_key'}"
export ONDC_ENCRYPTION_PRIVATE_KEY="${keys?.enc_private_key || 'your_encryption_private_key'}"
export ONDC_ENCRYPTION_PUBLIC_KEY="${keys?.enc_public_key || 'your_encryption_public_key'}"

# 3. Start the application
${language === 'node' ? 'npm start' :
  language === 'python' ? 'python app.py' :
  language === 'java' ? 'java -jar target/app.jar' :
  language === 'go' ? './ondc-app' :
  language === 'dotnet' ? 'dotnet run' :
  'php -S localhost:3000'}

# 4. Verify endpoints
curl http://localhost:3000/ondc-site-verification.html
curl -X POST http://localhost:3000/on_subscribe`,

        kubernetes: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ondc-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ondc-app
  template:
    metadata:
      labels:
        app: ondc-app
    spec:
      containers:
      - name: ondc-app
        image: your-registry/ondc-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: ONDC_SIGNING_PRIVATE_KEY
          valueFrom:
            secretKeyRef:
              name: ondc-secrets
              key: signing-private-key
        - name: ONDC_SIGNING_PUBLIC_KEY
          valueFrom:
            secretKeyRef:
              name: ondc-secrets
              key: signing-public-key
---
apiVersion: v1
kind: Service
metadata:
  name: ondc-service
spec:
  selector:
    app: ondc-app
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer`,

        env: `# Environment Variables (.env file)
ONDC_SIGNING_PRIVATE_KEY=${keys?.sign_private_key || 'your_signing_private_key'}
ONDC_SIGNING_PUBLIC_KEY=${keys?.sign_public_key || 'your_signing_public_key'}
ONDC_ENCRYPTION_PRIVATE_KEY=${keys?.enc_private_key || 'your_encryption_private_key'}
ONDC_ENCRYPTION_PUBLIC_KEY=${keys?.enc_public_key || 'your_encryption_public_key'}
NODE_ENV=production
PORT=3000

# Database Configuration (if needed)
DATABASE_URL=postgresql://user:password@localhost:5432/ondc_db

# ONDC Configuration
ONDC_ENVIRONMENT=staging
ONDC_REGISTRY_URL=https://staging.registry.ondc.org`
      };
      
      setDeploymentCode(dummyDeploymentCode);
    } catch (error: any) {
      toast.error('Failed to generate deployment code');
    }
  }, [whitelistVerified, keys]);

  useEffect(() => {
    if (whitelistVerified) {
      generateDeploymentCode(selectedLanguage);
    }
  }, [whitelistVerified, selectedLanguage, generateDeploymentCode]);

  const testEndpoints = async () => {
    if (!serverUrl) {
      toast.error('Please enter your server URL');
      return;
    }

    setTesting(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate dummy test results
      const dummyResults = {
        overall_success: Math.random() > 0.3, // 70% success rate for demo
        tested_url: serverUrl.replace(/\/$/, ''),
        timestamp: new Date().toISOString(),
        results: [
          {
            name: 'Site Verification',
            endpoint: '/ondc-site-verification.html',
            success: true,
            status_code: 200,
            response_time: '45ms',
            message: 'Site verification endpoint is accessible'
          },
          {
            name: 'On Subscribe Endpoint',
            endpoint: '/on_subscribe',
            success: Math.random() > 0.2, // 80% success rate
            status_code: Math.random() > 0.2 ? 200 : 404,
            response_time: '123ms',
            message: Math.random() > 0.2 ? 'Endpoint is working correctly' : 'Endpoint not found or not responding'
          },
          {
            name: 'Health Check',
            endpoint: '/health',
            success: true,
            status_code: 200,
            response_time: '12ms',
            message: 'Server is healthy and responding'
          },
          {
            name: 'SSL Certificate',
            endpoint: 'SSL Check',
            success: serverUrl.startsWith('https://'),
            status_code: serverUrl.startsWith('https://') ? 200 : 0,
            response_time: 'N/A',
            message: serverUrl.startsWith('https://') ? 'SSL certificate is valid' : 'No SSL certificate detected - use HTTPS for production'
          }
        ]
      };
      
      // Calculate overall success
      dummyResults.overall_success = dummyResults.results.every(r => r.success);
      
      setTestResults(dummyResults);
      
      if (dummyResults.overall_success) {
        // Mark deployment as completed in localStorage
        localStorage.setItem('ondc_deployment_completed', 'true');
        toast.success('🎉 All endpoints are working correctly! Deployment step completed.');
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('ondc_deployment_completed'));
        
        // Show success message with next step guidance
        setTimeout(() => {
          toast.success('✅ You can now proceed to ONDC Network Registration from the dashboard!', {
            duration: 6000,
          });
        }, 2000);
      } else {
        // Remove deployment completion status if tests fail
        localStorage.removeItem('ondc_deployment_completed');
        toast.error('❌ Some endpoints failed the test');
      }
    } catch (error: any) {
      toast.error('Failed to test endpoints');
      setTestResults({
        overall_success: false,
        tested_url: serverUrl,
        timestamp: new Date().toISOString(),
        results: [{ 
          name: 'Connection', 
          endpoint: '/',
          success: false, 
          status_code: 0,
          response_time: 'Timeout',
          message: 'Failed to connect to server' 
        }],
      });
    } finally {
      setTesting(false);
    }
  };

  const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => (
    <Box sx={{ position: 'relative' }}>
      <CopyToClipboard text={code} onCopy={() => toast.success('📋 Code copied!')}>
        <Button
          size="small"
          startIcon={<ContentCopy />}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
          }}
        >
          Copy
        </Button>
      </CopyToClipboard>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ borderRadius: 8, margin: 0 }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Modern Header */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 24px -6px rgba(30, 60, 114, 0.25)',
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ 
                  width: 48, 
                  height: 48, 
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}>
                  <Rocket sx={{ fontSize: 24 }} />
                </Avatar>
                
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    textShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    color: 'white',
                  }}
                >
                  Deployment Helper
                </Typography>
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  opacity: 0.9,
                  maxWidth: 500,
                  mx: 'auto',
                  lineHeight: 1.5,
                  fontWeight: 400,
                  color: 'white',
                }}
              >
                Deploy your ONDC endpoints with auto-generated configuration and testing
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Enhanced Session Check */}
      {!whitelistVerified && (
        <Zoom in={true} timeout={600}>
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 4,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              🔑 No active session found. Please verify your whitelisting status first to access deployment configurations.
            </Typography>
          </Alert>
        </Zoom>
      )}

      {/* Enhanced Language Selection */}
      {whitelistVerified && (
        <Fade in={true} timeout={1000}>
          <Card sx={{ 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid rgba(30, 60, 114, 0.1)',
            background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  mr: 2,
                  width: 48,
                  height: 48,
                }}>
                  <Settings />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Select Your Technology Stack
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose your programming language to generate deployment configurations
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                {languages.map((lang) => (
                  <Grid item key={lang.value}>
                    <Tooltip title={`Generate ${lang.label} deployment configuration`}>
                      <Chip
                        icon={lang.icon}
                        label={lang.label}
                        onClick={() => {
                          setSelectedLanguage(lang.value);
                          generateDeploymentCode(lang.value);
                        }}
                        sx={{
                          py: 1,
                          px: 2,
                          height: 'auto',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          ...(selectedLanguage === lang.value ? {
                            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(30, 60, 114, 0.3)',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(30, 60, 114, 0.4)',
                              transform: 'translateY(-1px)',
                            }
                          } : {
                            backgroundColor: '#ffffff',
                            border: '2px solid #e2e8f0',
                            color: '#64748b',
                            '&:hover': {
                              borderColor: '#1e3c72',
                              backgroundColor: 'rgba(30, 60, 114, 0.04)',
                              transform: 'translateY(-1px)',
                            }
                          }),
                          '& .MuiChip-icon': {
                            fontSize: '1.2rem',
                            marginLeft: 1,
                          }
                        }}
                      />
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Enhanced Deployment Code */}
      {deploymentCode && (
        <Zoom in={true} timeout={800}>
          <Card sx={{ 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid rgba(30, 60, 114, 0.1)',
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  mr: 2,
                  width: 48,
                  height: 48,
                }}>
                  <Code />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Deployment Configuration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Auto-generated deployment scripts for {selectedLanguage.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
              
              <Tabs 
                value={activeTab} 
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    height: 3,
                    borderRadius: 1.5,
                  },
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: 56,
                    '&.Mui-selected': {
                      color: '#667eea',
                    }
                  }
                }}
              >
                {deploymentTabs.map((tab, index) => (
                  <Tab 
                    key={tab.value} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: tab.color }}>{tab.icon}</Box>
                        {tab.label}
                      </Box>
                    } 
                  />
                ))}
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
                  border: '1px solid rgba(37, 99, 235, 0.1)',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ background: '#2496ED', width: 32, height: 32 }}>
                      <Storage sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Docker Deployment
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Use Docker Compose for easy containerized deployment
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <CodeBlock code={deploymentCode.docker} language="yaml" />
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '1px solid rgba(100, 116, 139, 0.1)',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ background: '#64748b', width: 32, height: 32 }}>
                      <Terminal sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Manual Deployment
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Step-by-step manual deployment instructions
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <CodeBlock code={deploymentCode.manual} language="bash" />
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  border: '1px solid rgba(50, 108, 229, 0.1)',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ background: '#326CE5', width: 32, height: 32 }}>
                      <CloudUpload sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Kubernetes Deployment
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Production-ready Kubernetes configuration
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <CodeBlock code={deploymentCode.kubernetes} language="yaml" />
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ background: '#10b981', width: 32, height: 32 }}>
                      <Settings sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Environment File
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Environment variables for your application
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <CodeBlock code={deploymentCode.env} language="bash" />
              </TabPanel>
                      </CardContent>
          </Card>
        </Zoom>
      )}

      {/* Enhanced Endpoint Testing */}
      <Fade in={true} timeout={1200}>
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                mr: 2,
                width: 48,
                height: 48,
              }}>
                <Speed />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Test Your Endpoints
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Validate your deployed ONDC endpoints for production readiness
                </Typography>
              </Box>
            </Box>
          
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Server URL"
                  placeholder="https://your-app.herokuapp.com"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  helperText="Enter your deployed application URL"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={testing ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                  onClick={testEndpoints}
                  disabled={testing || !serverUrl}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
                    },
                    '&:disabled': {
                      background: '#e0e7ff',
                      color: '#94a3b8',
                    }
                  }}
                >
                  {testing ? 'Testing...' : 'Test Endpoints'}
                </Button>
              </Grid>
            </Grid>

            {/* Progress Bar */}
            {testing && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Testing Endpoints...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please wait
                  </Typography>
                </Box>
                <LinearProgress 
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                      borderRadius: 3,
                    }
                  }}
                />
              </Box>
            )}

          {/* Test Results */}
          {testResults && (
            <Box sx={{ mt: 3 }}>
              <Alert 
                severity={testResults.overall_success ? 'success' : 'error'}
                sx={{ mb: 2 }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {testResults.overall_success ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
                </Typography>
              </Alert>
              
              <Grid container spacing={2}>
                {testResults.results.map((result: any, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {result.success ? (
                          <Check color="success" sx={{ mr: 1 }} />
                        ) : (
                          <ErrorIcon color="error" sx={{ mr: 1 }} />
                        )}
                        <Typography variant="subtitle2" fontWeight="bold">
                          {result.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Status: {result.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {result.message}
                      </Typography>
                      {result.responseTime && (
                        <Typography variant="caption" color="text.secondary">
                          Response Time: {result.responseTime}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Proceed to Next Step Button - only show when deployment tests pass */}
              {testResults.overall_success && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/subscribe')}
                    endIcon={<ArrowForward />}
                    sx={{
                      px: 6,
                      py: 1.5,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(14, 165, 233, 0.4)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Proceed to Next Step
                  </Button>
                </Box>
              )}
            </Box>
          )}
          </CardContent>
        </Card>
      </Fade>

      {/* Enhanced Deployment Guide */}
      <Zoom in={true} timeout={1000}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📋 Deployment Guide
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">🔧 Required Endpoints</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    GET /health
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Health check endpoint that returns status information.
                    Should return HTTP 200 with a simple success message.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    GET /ondc-site-verification.html
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Site verification page with signed REQUEST_ID in meta tag.
                    Required for ONDC registry validation.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    POST /on_subscribe
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Subscription endpoint that handles challenge-response mechanism.
                    Receives encrypted challenge and returns decrypted answer.
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">🐳 Docker Deployment Steps</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" component="div">
                <ol>
                  <li>Copy the generated docker-compose.yml to your project</li>
                  <li>Create .env file with your configuration</li>
                  <li>Build and start containers: <code>docker-compose up -d</code></li>
                  <li>Check logs: <code>docker-compose logs</code></li>
                  <li>Test endpoints using the testing tool above</li>
                </ol>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">☁️ Cloud Platform Deployment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Heroku
                  </Typography>
                  <Typography variant="body2">
                    • Use Config Vars for environment variables
                    <br />
                    • Set PORT to process.env.PORT
                    <br />
                    • Use heroku/nodejs buildpack
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Vercel
                  </Typography>
                  <Typography variant="body2">
                    • Configure environment variables in dashboard
                    <br />
                    • Use serverless functions for APIs
                    <br />
                    • Set up custom domains if needed
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    AWS/GCP
                  </Typography>
                  <Typography variant="body2">
                    • Use Elastic Beanstalk or App Engine
                    <br />
                    • Configure load balancers for HTTPS
                    <br />
                    • Set up monitoring and logging
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">⚠️ Important Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Security:</strong> Never commit private keys to version control.
                  Always use environment variables for sensitive data.
                </Typography>
              </Alert>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>HTTPS Required:</strong> ONDC requires HTTPS endpoints for production.
                  Ensure your deployment has valid SSL certificates.
                </Typography>
              </Alert>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
      </Zoom>
    </Container>
  );
};

export default DeploymentHelper; 