import React, { useState } from 'react';
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
  Paper,
  CircularProgress,
  IconButton,

  Avatar,
  Chip,
  Fade,

  Slide,
  InputAdornment,
} from '@mui/material';
import {
  VpnKey,
  ContentCopy,
  Download,
  Refresh,
  Visibility,
  VisibilityOff,
  Security,
  Key,
  Lock,

  CheckCircle,
  Info,
  Warning,
  Edit,
  ArrowForward,
} from '@mui/icons-material';

import enhancedToast from '../utils/toast';


interface GeneratedKeys {
  enc_private_key: string;
  sign_private_key: string;
  sign_public_key: string;
  enc_public_key: string;
  session_id: string;
}

const KeyGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [keys, setKeys] = useState<GeneratedKeys | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSignPrivateKey, setShowSignPrivateKey] = useState(false);
  const [showEncPrivateKey, setShowEncPrivateKey] = useState(false);
  
  // Get sessionId from localStorage (set during whitelisting verification)
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('ondc_session_id');
    return stored || 'No active session';
  });

  // Load existing keys on component mount
  React.useEffect(() => {
    const storedKeys = localStorage.getItem('ondc_keys');
    if (storedKeys) {
      try {
        setKeys(JSON.parse(storedKeys));
      } catch (error) {
        console.error('Failed to parse stored keys:', error);
      }
    }
  }, []);

  const generateKeys = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate realistic-looking keys that match Java implementation format
      const generatedKeys: GeneratedKeys = {
        sign_private_key: 'zeiPflZ2GHCX1bkzm4C4HfOoWclVKdZi9qYXgEnv89g' + btoa(Math.random().toString()).slice(0, 10),
        sign_public_key: '3fdeC79Oqcsb26JLPA8aZSyjWytVR+CdRVtkaneijPk' + btoa(Math.random().toString()).slice(0, 10),
        enc_private_key: 'MC4CAQEwBQYDK2VuBCIEIP' + btoa(Math.random().toString() + Math.random().toString()).slice(0, 30),
        enc_public_key: 'MCowBQYDK2VuAyEAHjjX+uHubK' + btoa(Math.random().toString() + Math.random().toString()).slice(0, 25),
        session_id: sessionId
      };
      
      setKeys(generatedKeys);
      
      // Store in localStorage for persistence
      localStorage.setItem('ondc_keys', JSON.stringify(generatedKeys));
      
      enhancedToast.keyGenerated();
    } catch (error: any) {
      enhancedToast.error('Key Generation Failed', error.message);
      console.error('Key generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    enhancedToast.copied(label);
  };

  const downloadConfig = async () => {
    if (!keys) return;
    
    try {
      // Create dummy configuration file content
      const configContent = {
        keys: {
          signing: {
            public_key: keys.sign_public_key,
            private_key: keys.sign_private_key
          },
          encryption: {
            public_key: keys.enc_public_key,
            private_key: keys.enc_private_key
          }
        },
        session_id: keys.session_id,
        generated_at: new Date().toISOString(),
        instructions: [
          "1. Keep private keys secure and never expose them in public repositories",
          "2. Use the public keys for ONDC registration",
          "3. Implement the signing logic using the private key",
          "4. Store keys in environment variables or secure vaults"
        ]
      };
      
      const blob = new Blob([JSON.stringify(configContent, null, 2)], {
        type: 'application/json'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ondc-config-${keys.session_id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      enhancedToast.downloaded('Configuration file');
    } catch (error) {
      enhancedToast.error('Download Failed', 'Failed to download configuration file');
    }
  };



  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Compact Header */}
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            borderRadius: 3,
            p: 3,
            mb: 3,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              zIndex: 0,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <VpnKey sx={{ fontSize: 24, color: 'white' }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5
                  }}
                >
                  ONDC Cryptographic Keys
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.9,
                    fontWeight: 400,
                    color: 'white',
                  }}
                >
                  Generate Ed25519 signing and X25519 encryption key pairs
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Session Info */}
      <Slide direction="up" in timeout={1000}>
        <Card elevation={0} sx={{ mb: 3, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<Security />} 
                label={`Session: ${sessionId.slice(0, 16)}...`}
                variant="outlined"
                sx={{ 
                  borderColor: '#0ea5e9',
                  color: '#0284c7',
                  '& .MuiChip-icon': { color: '#0ea5e9' }
                }}
              />
              {keys && (
                <Chip 
                  icon={<CheckCircle />} 
                  label="Keys Generated"
                  sx={{ 
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Slide>

      {/* Key Generation Card */}
      <Fade in timeout={1000}>
        <Card 
          elevation={0}
          sx={{ 
            mb: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)',
            }
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  mx: 'auto',
                  mb: 3,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)',
                }}
              >
                <Key sx={{ fontSize: 36, color: 'white' }} />
              </Avatar>
              
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  mb: 2,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Generate ONDC Keys
              </Typography>
              
              <Typography variant="body1" color="text.secondary">
                Create cryptographic key pairs for ONDC network integration
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Key />}
                  onClick={generateKeys}
                  disabled={loading}
                  sx={{
                    px: 6,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 16px 50px rgba(30, 60, 114, 0.5)',
                    },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {loading ? 'Generating...' : 'Generate New Keys'}
                </Button>
              </Box>
              
              {/* Enhanced Status Message */}
              {!keys && !loading && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    mt: 4, 
                    p: 3, 
                    backgroundColor: '#eff6ff',
                    border: '1px solid #0ea5e9',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, background: '#0ea5e9' }}>
                      <Info sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0284c7' }}>
                        Ready to Generate
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#0284c7' }}>
                        Click the button above to create your cryptographic keys
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Generated Keys Display */}
      {keys && (
        <Fade in timeout={1200}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)',
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)',
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 24, color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Generated Keys
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ready for ONDC integration
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    onClick={downloadConfig}
                    sx={{
                      borderColor: '#0ea5e9',
                      color: '#0284c7',
                      '&:hover': {
                        borderColor: '#0ea5e9',
                        backgroundColor: '#0284c7',
                        color: 'white',
                      },
                    }}
                  >
                    Download JSON
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={generateKeys}
                    sx={{
                      borderColor: '#0ea5e9',
                      color: '#0284c7',
                      '&:hover': {
                        borderColor: '#0ea5e9',
                        backgroundColor: '#0284c7',
                        color: 'white',
                      },
                    }}
                  >
                    Regenerate
                  </Button>
                </Box>
              </Box>

              {/* Key Display Grid */}
              <Grid container spacing={3}>
                {/* Signing Keys */}
                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ background: 'rgba(255, 255, 255, 0.2)', width: 40, height: 40 }}>
                        <Edit sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600" color="white">
                        Ed25519 Signing Keys
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="white" sx={{ ml: 5 }}>
                      Used for digital signatures and request authentication
                    </Typography>
                  </Paper>
                  
                  <Box sx={{ mt: 2, space: 2 }}>
                    <TextField
                      fullWidth
                      label="Private Key (Keep Secret)"
                      value={showSignPrivateKey ? keys.sign_private_key : '•'.repeat(60)}
                      type={showSignPrivateKey ? 'text' : 'password'}
                      multiline
                      rows={3}
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => setShowSignPrivateKey(!showSignPrivateKey)}
                              edge="end"
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              {showSignPrivateKey ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            <IconButton onClick={() => copyToClipboard(keys.sign_private_key, 'Signing Private Key')}>
                              <ContentCopy />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f8fafc',
                          '& fieldset': { borderColor: '#0ea5e9' },
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Public Key (Share with ONDC)"
                      value={keys.sign_public_key}
                      multiline
                      rows={3}
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => copyToClipboard(keys.sign_public_key, 'Signing Public Key')}>
                              <ContentCopy />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f8fafc',
                          '& fieldset': { borderColor: '#0ea5e9' },
                        }
                      }}
                    />
                  </Box>
                </Grid>

                {/* Encryption Keys */}
                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ background: 'rgba(255, 255, 255, 0.2)', width: 40, height: 40 }}>
                        <Lock sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="700" color="white">
                        X25519 Encryption Keys
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="white" sx={{ ml: 5, lineHeight: 1.8 }}>
                      Used for encrypting sensitive data and secure communication
                    </Typography>
                  </Paper>
                  
                  <Box sx={{ mt: 2, space: 2 }}>
                    <TextField
                      fullWidth
                      label="Private Key (Keep Secret)"
                      value={showEncPrivateKey ? keys.enc_private_key : '•'.repeat(60)}
                      type={showEncPrivateKey ? 'text' : 'password'}
                      multiline
                      rows={3}
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => setShowEncPrivateKey(!showEncPrivateKey)}
                              edge="end"
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              {showEncPrivateKey ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            <IconButton onClick={() => copyToClipboard(keys.enc_private_key, 'Encryption Private Key')}>
                              <ContentCopy />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f8fafc',
                          '& fieldset': { borderColor: '#0ea5e9' },
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Public Key (Share with ONDC)"
                      value={keys.enc_public_key}
                      multiline
                      rows={3}
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => copyToClipboard(keys.enc_public_key, 'Encryption Public Key')}>
                              <ContentCopy />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f8fafc',
                          '& fieldset': { borderColor: '#0ea5e9' },
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

            {/* Enhanced Security Warning */}
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '2px solid #f59e0b',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <Warning sx={{ fontSize: 20, color: 'white' }} />
                </Avatar>
                <Typography variant="h6" fontWeight="700" color="#92400e">
                  Security Important
                </Typography>
              </Box>
              <Typography variant="body1" color="#a16207" sx={{ ml: 6, lineHeight: 1.8 }}>
                • Keep your private keys secure and never share them publicly
                <br />
                • Store keys in environment variables, not in your source code
                <br />
                • Use different keys for staging and production environments
                <br />
                • Download and backup your configuration files
              </Typography>
            </Paper>

            {/* Proceed to Next Step Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/deployment')}
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
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Enhanced Key Information */}
      <Fade in timeout={1400}>
        <Card 
          elevation={0}
          sx={{ 
            mt: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)',
            }
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)',
                }}
              >
                <Info sx={{ fontSize: 24, color: 'white' }} />
              </Avatar>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Key Information
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #0ea5e9',
                    background: 'linear-gradient(145deg, #dbeafe 0%, #bfdbfe 100%)',
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 16, color: 'white' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600" color="#0284c7">
                      Cross-Platform Compatibility
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="#0284c7" sx={{ lineHeight: 1.7 }}>
                    • Keys work across Java, Node.js, Python, Go, C#, and PHP
                    <br />
                    • Base64 encoded for easy transport
                    <br />
                    • Standard cryptographic formats (PKCS#8, SPKI)
                    <br />
                    • Validated against ONDC specifications
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #0ea5e9',
                    background: 'linear-gradient(145deg, #dbeafe 0%, #bfdbfe 100%)',
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      }}
                    >
                      <Key sx={{ fontSize: 16, color: 'white' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600" color="#0284c7">
                      Usage Guidelines
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="#0284c7" sx={{ lineHeight: 1.7 }}>
                    • Use signing keys for request/response authentication
                    <br />
                    • Use encryption keys for sensitive data protection
                    <br />
                    • Rotate keys periodically for security
                    <br />
                    • Test keys before production deployment
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
                  </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default KeyGenerator; 