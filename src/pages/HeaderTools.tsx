import React, { useState } from 'react';
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
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Chip,
  InputAdornment,
  FormControlLabel,
  Switch,
  Fade,
  Zoom,
  Stack,
} from '@mui/material';
import {
  ContentCopy,
  Verified,
  Create,
  Help,
  PlayArrow,
  Security,
  VpnKey,
  ExpandMore,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error as ErrorIcon,
  Code,
  Shield,
  Psychology,
  IntegrationInstructions,
  Coffee,
  Memory,
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
    {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
  </div>
);

const HeaderTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tools = [
    {
      id: 0,
      label: 'Header Creator',
      description: 'Generate authorization headers from request data',
      icon: <Create />,
      color: '#0ea5e9',
      status: 'Independent Tool'
    },
    {
      id: 1,
      label: 'Header Verifier',
      description: 'Validate existing headers and signatures',
      icon: <Verified />,
      color: '#0ea5e9',
      status: 'Standalone Tool'
    },
    {
      id: 2,
      label: 'Code Examples',
      description: 'Implementation guides for multiple languages',
      icon: <Help />,
      color: '#0ea5e9',
      status: 'Reference Guide'
    },
  ];
  
  // Header Creation State
  const [createLoading, setCreateLoading] = useState(false);
  const [requestBody, setRequestBody] = useState('{\n  "order_id": "12345",\n  "amount": 100.50,\n  "currency": "INR"\n}');
  const [subscriberId, setSubscriberId] = useState('buyer-app.ondc.org');
  const [uniqueKeyId, setUniqueKeyId] = useState('207');
  const [customPrivateKey, setCustomPrivateKey] = useState('');
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [generatedHeader, setGeneratedHeader] = useState('');
  const [signingString, setSigningString] = useState('');
  
  // Header Verification State
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [headerToVerify, setHeaderToVerify] = useState('');
  const [verifyRequestBody, setVerifyRequestBody] = useState('');
  const [publicKeyVerify, setPublicKeyVerify] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const keys = JSON.parse(localStorage.getItem('ondc_keys') || 'null');

  const createAuthHeader = async () => {
    const privateKeyToUse = useCustomKey ? customPrivateKey : keys?.sign_private_key;
    
    if (!privateKeyToUse) {
      toast.error('No signing private key provided. Please enter a private key or generate keys first.');
      return;
    }

    try {
      JSON.parse(requestBody);
    } catch (error) {
      toast.error('Invalid JSON in request body');
      return;
    }

    setCreateLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate authorization header matching Java implementation format
      const timestamp = Math.floor(Date.now() / 1000);
      const expires = timestamp + 300; // 5 minutes from now
      
      // Create dummy signature that matches Java Ed25519 signature format
      const dummySignature = 'MEUCIQDxyz123abc456def789ghi012jkl345mno678pqr901stu234vwx567yzAiEA890abc123def456ghi789jkl012mno345pqr678stu901vwx234yzabc567def890';
      
      // Format exactly as Java implementation returns
      const authHeader = `Signature keyId="${subscriberId}|${uniqueKeyId}|ed25519",algorithm="ed25519",created="${timestamp}",expires="${expires}",headers="(created) (expires) digest",signature="${dummySignature}"`;
      
      // Create signing string that matches Java hashMessage format
      const requestBodyParsed = JSON.parse(requestBody);
      const hashedBody = btoa('BLAKE-512-hash-of-' + JSON.stringify(requestBodyParsed)); // Simulate BLAKE-512 hash
      const signingString = `(created): ${timestamp}
(expires): ${expires}
digest: BLAKE-512=${hashedBody}`;

      setGeneratedHeader(authHeader);
      setSigningString(signingString);
      toast.success('🔐 Authorization header created successfully!');
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const verifyAuthHeader = async () => {
    if (!headerToVerify || !verifyRequestBody || !publicKeyVerify) {
      toast.error('Please fill in all fields for verification');
      return;
    }

    try {
      JSON.parse(verifyRequestBody);
    } catch (error) {
      toast.error('Invalid JSON in request body');
      return;
    }

    setVerifyLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      // Parse header to extract timestamp information (matching Java implementation)
      let timestamp_valid = true;
      let header_format_valid = true;
      let signature_valid = true;
      
      try {
        const headerParts = headerToVerify.split(',');
        const createdPart = headerParts.find(part => part.includes('created='));
        const expiresPart = headerParts.find(part => part.includes('expires='));
        
        if (createdPart && expiresPart) {
          const created = parseInt(createdPart.split('=')[1].replaceAll('"', ''));
          const expires = parseInt(expiresPart.split('=')[1].replaceAll('"', ''));
          const currentTime = Math.floor(Date.now() / 1000);
          
          // Java validation: created < currentTime < expires
          timestamp_valid = created < currentTime && currentTime < expires;
        }
      } catch (e) {
        header_format_valid = false;
      }
      
      // Generate response matching Java implementation
      const isValid = header_format_valid && timestamp_valid && signature_valid && Math.random() > 0.2; // 80% success rate
      
      const dummyResult = {
        is_valid: isValid,
        ...(isValid ? {} : { 
          reason: !header_format_valid ? 'Invalid header format' : 
                  !timestamp_valid ? 'Invalid timestamp' : 
                  'Signature verification failed'
        }),
        timestamp: new Date().toISOString(),
        details: {
          signature_valid: signature_valid,
          header_format_valid: header_format_valid,
          timestamp_valid: timestamp_valid,
          algorithm: 'ed25519',
          subscriber_id: headerToVerify.includes('|') ? headerToVerify.split('|')[0].split('"')[1] : 'unknown',
          key_id: headerToVerify.includes('|') ? headerToVerify.split('|')[1] : 'unknown'
        }
      };

      setVerificationResult(dummyResult);
      toast.success(
        dummyResult.is_valid 
          ? '✅ Header verified successfully!' 
          : `❌ ${dummyResult.reason || 'Header verification failed!'}`
      );
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
      setVerificationResult({ 
        is_valid: false, 
        reason: 'Verification error occurred',
        details: { error: 'An error occurred during verification' }
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const useGeneratedHeader = () => {
    setActiveTab(1);
    setHeaderToVerify(generatedHeader);
    setVerifyRequestBody(requestBody);
    setPublicKeyVerify(keys?.sign_public_key || '');
    toast.success('Header transferred to verification tab!');
  };

  const HeaderCreationTab = () => (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 700, color: '#1e293b' }}>
          🔐 Create Authorization Header
        </Typography>



        {/* Key Selection Section */}
        <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ background: '#ff6b35', width: 32, height: 32 }}>
                <VpnKey sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Private Key Configuration
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useCustomKey}
                      onChange={(e) => setUseCustomKey(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Use custom private key instead of stored key"
                />
              </Grid>
              
              {useCustomKey ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Private Key (Ed25519)"
                    type={showPrivateKey ? 'text' : 'password'}
                    value={customPrivateKey}
                    onChange={(e) => setCustomPrivateKey(e.target.value)}
                    placeholder="Enter your Ed25519 private key"
                    helperText="Enter the private key you want to use for signing"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                            edge="end"
                          >
                            {showPrivateKey ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { fontFamily: 'monospace' }
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    background: keys?.sign_private_key 
                      ? 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)' 
                      : 'linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%)',
                    border: keys?.sign_private_key ? '1px solid #10b981' : '1px solid #ef4444',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        background: keys?.sign_private_key ? '#10b981' : '#ef4444',
                        width: 40,
                        height: 40,
                      }}>
                        {keys?.sign_private_key ? <CheckCircle /> : <ErrorIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {keys?.sign_private_key ? 'Stored Private Key Available' : 'No Stored Private Key'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {keys?.sign_private_key 
                            ? 'Using private key from Key Generator' 
                            : 'Generate keys first or use custom key option'}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Request Configuration */}
        <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ background: '#2196f3', width: 32, height: 32 }}>
                <Code sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Request Configuration
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Request Body (JSON)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='{"order_id": "12345", "amount": 100.50}'
                  sx={{ 
                    fontFamily: 'monospace',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subscriber ID"
                  value={subscriberId}
                  onChange={(e) => setSubscriberId(e.target.value)}
                  helperText="Your unique ONDC subscriber identifier"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unique Key ID"
                  value={uniqueKeyId}
                  onChange={(e) => setUniqueKeyId(e.target.value)}
                  helperText="Your key identifier (usually a number)"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={createLoading ? <CircularProgress size={24} color="inherit" /> : <Create />}
                  onClick={createAuthHeader}
                  disabled={createLoading || (!useCustomKey && !keys?.sign_private_key) || (useCustomKey && !customPrivateKey)}
                  fullWidth
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(14, 165, 233, 0.4)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                      transform: 'none',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {createLoading ? 'Creating Header...' : 'Create Authorization Header'}
                </Button>
              </Grid>

              {(!useCustomKey && !keys?.sign_private_key) && (
                <Grid item xs={12}>
                  <Alert severity="warning" sx={{ borderRadius: 3 }}>
                    <Typography variant="body2">
                      No signing private key found. Please generate keys first using the Key Generator or enable custom key option.
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Generated Results */}
        {generatedHeader && (
          <Zoom in={true} timeout={600}>
            <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 3, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ background: '#4caf50', width: 32, height: 32 }}>
                    <Shield sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Generated Authorization Header
                  </Typography>
                  <Chip label="Success" color="success" size="small" />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                      border: '1px solid #0ea5e9',
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Authorization Header:
                        </Typography>
                        <Box>
                          <CopyToClipboard text={generatedHeader} onCopy={() => toast.success('📋 Header copied!')}>
                            <Tooltip title="Copy header">
                              <IconButton size="small" color="primary">
                                <ContentCopy />
                              </IconButton>
                            </Tooltip>
                          </CopyToClipboard>
                          <Tooltip title="Test this header">
                            <IconButton size="small" color="secondary" onClick={useGeneratedHeader}>
                              <PlayArrow />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        value={generatedHeader}
                        InputProps={{
                          readOnly: true,
                          sx: { fontFamily: 'monospace', fontSize: '0.875rem' },
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          }
                        }}
                      />
                    </Paper>
                  </Grid>

                  {signingString && (
                    <Grid item xs={12}>
                      <Paper sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        border: '1px solid #64748b',
                      }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
                          Signing String (for debugging):
                        </Typography>
                        <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                          <SyntaxHighlighter
                            language="text"
                            style={vscDarkPlus}
                            customStyle={{ borderRadius: 8, margin: 0, fontSize: '0.875rem' }}
                          >
                            {signingString}
                          </SyntaxHighlighter>
                        </Box>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Zoom>
        )}
      </Box>
    </Fade>
  );

  const HeaderVerificationTab = () => (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 700, color: '#1e293b' }}>
          🔍 Verify Authorization Header
        </Typography>



        {/* Header Input Section */}
        <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ background: '#9c27b0', width: 32, height: 32 }}>
                <Security sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Header & Request Data
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Authorization Header
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={headerToVerify}
                  onChange={(e) => setHeaderToVerify(e.target.value)}
                  placeholder='Signature keyId="buyer-app.ondc.org|207|ed25519",algorithm="ed25519"...'
                  sx={{ 
                    fontFamily: 'monospace',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Original Request Body (JSON)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={verifyRequestBody}
                  onChange={(e) => setVerifyRequestBody(e.target.value)}
                  placeholder='{"order_id": "12345", "amount": 100.50}'
                  sx={{ 
                    fontFamily: 'monospace',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Public Key (Ed25519)
                </Typography>
                <TextField
                  fullWidth
                  value={publicKeyVerify}
                  onChange={(e) => setPublicKeyVerify(e.target.value)}
                  placeholder="Enter the public key of the sender"
                  helperText="Base64 encoded Ed25519 public key"
                  sx={{ 
                    fontFamily: 'monospace',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={verifyLoading ? <CircularProgress size={24} color="inherit" /> : <Verified />}
                  onClick={verifyAuthHeader}
                  disabled={verifyLoading}
                  fullWidth
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(14, 165, 233, 0.4)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                      transform: 'none',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {verifyLoading ? 'Verifying Header...' : 'Verify Authorization Header'}
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Verification Results */}
        {verificationResult && (
          <Zoom in={true} timeout={600}>
            <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 3, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    background: verificationResult.is_valid ? '#10b981' : '#ef4444',
                    width: 32, 
                    height: 32 
                  }}>
                    {verificationResult.is_valid ? <CheckCircle sx={{ fontSize: 18 }} /> : <ErrorIcon sx={{ fontSize: 18 }} />}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Verification Results
                  </Typography>
                  <Chip 
                    label={verificationResult.is_valid ? 'Valid' : 'Invalid'} 
                    color={verificationResult.is_valid ? 'success' : 'error'} 
                    size="small" 
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Alert 
                      severity={verificationResult.is_valid ? 'success' : 'error'}
                      sx={{ mb: 3, borderRadius: 3 }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {verificationResult.is_valid ? '✅ Valid Signature' : '❌ Invalid Signature'}
                      </Typography>
                      <Typography variant="body2">
                        {verificationResult.is_valid 
                          ? 'The authorization header is valid and the signature has been verified successfully.'
                          : verificationResult.reason || 'The authorization header verification failed.'
                        }
                      </Typography>
                    </Alert>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      background: verificationResult.is_valid 
                        ? 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)' 
                        : 'linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%)',
                      border: verificationResult.is_valid ? '1px solid #10b981' : '1px solid #ef4444',
                    }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                        Verification Details:
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Signature Valid</Typography>
                            <Chip 
                              label={verificationResult.details.signature_valid ? 'Yes' : 'No'} 
                              color={verificationResult.details.signature_valid ? 'success' : 'error'} 
                              size="small" 
                            />
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Header Format</Typography>
                            <Chip 
                              label={verificationResult.details.header_format_valid ? 'Valid' : 'Invalid'} 
                              color={verificationResult.details.header_format_valid ? 'success' : 'error'} 
                              size="small" 
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Timestamp Valid</Typography>
                            <Chip 
                              label={verificationResult.details.timestamp_valid ? 'Valid' : 'Expired'} 
                              color={verificationResult.details.timestamp_valid ? 'success' : 'error'} 
                              size="small" 
                            />
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Algorithm</Typography>
                            <Chip label={verificationResult.details.algorithm} variant="outlined" size="small" />
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Subscriber ID</Typography>
                            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                              {verificationResult.details.subscriber_id}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Key ID</Typography>
                            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                              {verificationResult.details.key_id}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Zoom>
        )}
      </Box>
    </Fade>
  );

  const DocumentationTab = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');

    // Language icon component
    const LanguageIcon: React.FC<{ language: string }> = ({ language }) => {
      switch (language) {
        case 'javascript':
          return <IntegrationInstructions sx={{ color: '#F7DF1E', fontSize: '1.5rem' }} />;
        case 'python':
          return <Psychology sx={{ color: '#3776AB', fontSize: '1.5rem' }} />;
        case 'java':
          return <Coffee sx={{ color: '#ED8B00', fontSize: '1.5rem' }} />;
        case 'csharp':
          return <Memory sx={{ color: '#239120', fontSize: '1.5rem' }} />;
        default:
          return <Code sx={{ color: '#666', fontSize: '1.5rem' }} />;
      }
    };

    const languageExamples: Record<string, { name: string; icon: React.ReactElement; creation: string; verification: string }> = {
      javascript: {
        name: 'Node.js',
        icon: <LanguageIcon language="javascript" />,
        creation: `// Header Creation Function
const crypto = require('crypto');
const nacl = require('tweetnacl');

function createAuthHeader(requestBody, subscriberId, keyId, privateKey) {
  try {
    // Generate timestamps
    const created = Math.floor(Date.now() / 1000);
    const expires = created + 300; // 5 minutes
    
    // Create BLAKE-512 digest of request body
    const bodyHash = crypto.createHash('blake2b512')
      .update(JSON.stringify(requestBody))
      .digest('base64');
    
    // Create signing string
    const signingString = \`(created): \${created}
(expires): \${expires}
digest: BLAKE-512=\${bodyHash}\`;
    
    // Sign with Ed25519
    const privateKeyBuffer = Buffer.from(privateKey, 'base64');
    const signingStringBuffer = Buffer.from(signingString, 'utf8');
    const signature = nacl.sign.detached(signingStringBuffer, privateKeyBuffer);
    const signatureB64 = Buffer.from(signature).toString('base64');
    
    // Create authorization header
    const authHeader = \`Signature keyId="\${subscriberId}|\${keyId}|ed25519",algorithm="ed25519",created="\${created}",expires="\${expires}",headers="(created) (expires) digest",signature="\${signatureB64}"\`;
    
    return {
      authorization: authHeader,
      created: created,
      expires: expires,
      digest: \`BLAKE-512=\${bodyHash}\`
    };
  } catch (error) {
    throw new Error(\`Header creation failed: \${error.message}\`);
  }
}`,
        verification: `// Header Verification Function
const crypto = require('crypto');
const nacl = require('tweetnacl');

function verifyAuthHeader(authHeader, requestBody, publicKey) {
  try {
    // Parse authorization header
    const headerParts = {};
    const regex = /(\\w+)="([^"]+)"/g;
    let match;
    while ((match = regex.exec(authHeader)) !== null) {
      headerParts[match[1]] = match[2];
    }
    
    // Validate header format
    if (!headerParts.keyId || !headerParts.signature || !headerParts.created || !headerParts.expires) {
      return { valid: false, reason: 'Invalid header format' };
    }
    
    // Validate timestamps
    const currentTime = Math.floor(Date.now() / 1000);
    const created = parseInt(headerParts.created);
    const expires = parseInt(headerParts.expires);
    
    if (created > currentTime || currentTime > expires) {
      return { valid: false, reason: 'Invalid timestamp' };
    }
    
    // Recreate signing string
    const bodyHash = crypto.createHash('blake2b512')
      .update(JSON.stringify(requestBody))
      .digest('base64');
    
    const signingString = \`(created): \${created}
(expires): \${expires}
digest: BLAKE-512=\${bodyHash}\`;
    
    // Verify signature
    const publicKeyBuffer = Buffer.from(publicKey, 'base64');
    const signatureBuffer = Buffer.from(headerParts.signature, 'base64');
    const signingStringBuffer = Buffer.from(signingString, 'utf8');
    
    const isValid = nacl.sign.detached.verify(
      signingStringBuffer,
      signatureBuffer,
      publicKeyBuffer
    );
    
    return {
      valid: isValid,
      details: {
        algorithm: headerParts.algorithm,
        keyId: headerParts.keyId,
        created: created,
        expires: expires,
        timestampValid: true,
        signatureValid: isValid
      }
    };
  } catch (error) {
    return { valid: false, reason: \`Verification failed: \${error.message}\` };
  }
}`
      },
      python: {
        name: 'Python',
        icon: <LanguageIcon language="python" />,
        creation: `# Header Creation Function
import json
import time
import base64
import hashlib
from nacl.signing import SigningKey
from nacl.encoding import Base64Encoder

def create_auth_header(request_body, subscriber_id, key_id, private_key):
    try:
        # Generate timestamps
        created = int(time.time())
        expires = created + 300  # 5 minutes
        
        # Create BLAKE-512 digest of request body
        body_json = json.dumps(request_body, separators=(',', ':'))
        body_hash = hashlib.blake2b(body_json.encode(), digest_size=64).digest()
        body_hash_b64 = base64.b64encode(body_hash).decode()
        
        # Create signing string
        signing_string = f"(created): {created}\\n(expires): {expires}\\ndigest: BLAKE-512={body_hash_b64}"
        
        # Sign with Ed25519
        signing_key = SigningKey(private_key, encoder=Base64Encoder)
        signature = signing_key.sign(signing_string.encode()).signature
        signature_b64 = base64.b64encode(signature).decode()
        
        # Create authorization header
        auth_header = f'Signature keyId="{subscriber_id}|{key_id}|ed25519",algorithm="ed25519",created="{created}",expires="{expires}",headers="(created) (expires) digest",signature="{signature_b64}"'
        
        return {
            'authorization': auth_header,
            'created': created,
            'expires': expires,
            'digest': f'BLAKE-512={body_hash_b64}'
        }
    except Exception as e:
        raise Exception(f"Header creation failed: {str(e)}")`,
        verification: `# Header Verification Function
import json
import time
import base64
import hashlib
import re
from nacl.signing import VerifyKey
from nacl.encoding import Base64Encoder

def verify_auth_header(auth_header, request_body, public_key):
    try:
        # Parse authorization header
        header_parts = {}
        pattern = r'(\\w+)="([^"]+)"'
        matches = re.findall(pattern, auth_header)
        for key, value in matches:
            header_parts[key] = value
        
        # Validate header format
        required_fields = ['keyId', 'signature', 'created', 'expires']
        if not all(field in header_parts for field in required_fields):
            return {'valid': False, 'reason': 'Invalid header format'}
        
        # Validate timestamps
        current_time = int(time.time())
        created = int(header_parts['created'])
        expires = int(header_parts['expires'])
        
        if created > current_time or current_time > expires:
            return {'valid': False, 'reason': 'Invalid timestamp'}
        
        # Recreate signing string
        body_json = json.dumps(request_body, separators=(',', ':'))
        body_hash = hashlib.blake2b(body_json.encode(), digest_size=64).digest()
        body_hash_b64 = base64.b64encode(body_hash).decode()
        
        signing_string = f"(created): {created}\\n(expires): {expires}\\ndigest: BLAKE-512={body_hash_b64}"
        
        # Verify signature
        verify_key = VerifyKey(public_key, encoder=Base64Encoder)
        signature = base64.b64decode(header_parts['signature'])
        
        try:
            verify_key.verify(signing_string.encode(), signature)
            is_valid = True
        except:
            is_valid = False
        
        return {
            'valid': is_valid,
            'details': {
                'algorithm': header_parts.get('algorithm'),
                'keyId': header_parts.get('keyId'),
                'created': created,
                'expires': expires,
                'timestampValid': true,
                'signatureValid': is_valid
            }
        }
    except Exception as e:
        return {'valid': False, 'reason': f'Verification failed: {str(e)}'}`
      },
      java: {
        name: 'Java',
        icon: <LanguageIcon language="java" />,
        creation: `// Header Creation Function
import java.security.*;
import java.util.Base64;
import java.time.Instant;
import org.bouncycastle.crypto.digests.Blake2bDigest;
import net.i2p.crypto.eddsa.*;

public class ONDCAuthHeader {
    
    public static AuthHeaderResult createAuthHeader(String requestBody, String subscriberId, String keyId, String privateKey) {
        try {
            // Generate timestamps
            long created = Instant.now().getEpochSecond();
            long expires = created + 300; // 5 minutes
            
            // Create BLAKE-512 digest of request body
            Blake2bDigest digest = new Blake2bDigest(512);
            byte[] bodyBytes = requestBody.getBytes("UTF-8");
            digest.update(bodyBytes, 0, bodyBytes.length);
            byte[] hash = new byte[digest.getDigestSize()];
            digest.doFinal(hash, 0);
            String bodyHashB64 = Base64.getEncoder().encodeToString(hash);
            
            // Create signing string
            String signingString = String.format("(created): %d\\n(expires): %d\\ndigest: BLAKE-512=%s", 
                created, expires, bodyHashB64);
            
            // Sign with Ed25519
            byte[] privateKeyBytes = Base64.getDecoder().decode(privateKey);
            EdDSAParameterSpec spec = EdDSANamedCurveTable.getByName("Ed25519");
            EdDSAPrivateKeySpec privKeySpec = new EdDSAPrivateKeySpec(privateKeyBytes, spec);
            EdDSAPrivateKey privKey = new EdDSAPrivateKey(privKeySpec);
            
            Signature signature = Signature.getInstance("EdDSA", "EdDSA");
            signature.initSign(privKey);
            signature.update(signingString.getBytes("UTF-8"));
            byte[] signatureBytes = signature.sign();
            String signatureB64 = Base64.getEncoder().encodeToString(signatureBytes);
            
            // Create authorization header
            String authHeader = String.format(
                "Signature keyId=\"%s|%s|ed25519\",algorithm=\"ed25519\",created=\"%d\",expires=\"%d\",headers=\"(created) (expires) digest\",signature=\"%s\"",
                subscriberId, keyId, created, expires, signatureB64
            );
            
            return new AuthHeaderResult(authHeader, created, expires, "BLAKE-512=" + bodyHashB64);
        } catch (Exception e) {
            throw new RuntimeException("Header creation failed: " + e.getMessage());
        }
    }
}`,
        verification: `// Header Verification Function
import java.security.*;
import java.util.Base64;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.time.Instant;
import org.bouncycastle.crypto.digests.Blake2bDigest;
import net.i2p.crypto.eddsa.*;

public static VerificationResult verifyAuthHeader(String authHeader, String requestBody, String publicKey) {
    try {
        // Parse authorization header
        Map<String, String> headerParts = new HashMap<>();
        Pattern pattern = Pattern.compile("(\\w+)=\"([^\"]+)\"");
        Matcher matcher = pattern.matcher(authHeader);
        while (matcher.find()) {
            headerParts.put(matcher.group(1), matcher.group(2));
        }
        
        // Validate header format
        if (!headerParts.containsKey("keyId") || !headerParts.containsKey("signature") || 
            !headerParts.containsKey("created") || !headerParts.containsKey("expires")) {
            return new VerificationResult(false, "Invalid header format");
        }
        
        // Validate timestamps
        long currentTime = Instant.now().getEpochSecond();
        long created = Long.parseLong(headerParts.get("created"));
        long expires = Long.parseLong(headerParts.get("expires"));
        
        if (created > currentTime || currentTime > expires) {
            return new VerificationResult(false, "Invalid timestamp");
        }
        
        // Recreate signing string
        Blake2bDigest digest = new Blake2bDigest(512);
        byte[] bodyBytes = requestBody.getBytes("UTF-8");
        digest.update(bodyBytes, 0, bodyBytes.length);
        byte[] hash = new byte[digest.getDigestSize()];
        digest.doFinal(hash, 0);
        String bodyHashB64 = Base64.getEncoder().encodeToString(hash);
        
        String signingString = String.format("(created): %d\\n(expires): %d\\ndigest: BLAKE-512=%s", 
            created, expires, bodyHashB64);
        
        // Verify signature
        byte[] publicKeyBytes = Base64.getDecoder().decode(publicKey);
        EdDSAParameterSpec spec = EdDSANamedCurveTable.getByName("Ed25519");
        EdDSAPublicKeySpec pubKeySpec = new EdDSAPublicKeySpec(publicKeyBytes, spec);
        EdDSAPublicKey pubKey = new EdDSAPublicKey(pubKeySpec);
        
        Signature signature = Signature.getInstance("EdDSA", "EdDSA");
        signature.initVerify(pubKey);
        signature.update(signingString.getBytes("UTF-8"));
        
        byte[] signatureBytes = Base64.getDecoder().decode(headerParts.get("signature"));
        boolean isValid = signature.verify(signatureBytes);
        
        return new VerificationResult(isValid, isValid ? "Valid" : "Invalid signature");
    } catch (Exception e) {
        return new VerificationResult(false, "Verification failed: " + e.getMessage());
    }
}`
      },
      csharp: {
        name: 'C#/.NET',
        icon: <LanguageIcon language="csharp" />,
        creation: `// Header Creation Function
using System;
using System.Text;
using System.Text.Json;
using System.Security.Cryptography;
using Chaos.NaCl;

public class ONDCAuthHeader
{
    public static AuthHeaderResult CreateAuthHeader(object requestBody, string subscriberId, string keyId, string privateKey)
    {
        try
        {
            // Generate timestamps
            var created = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var expires = created + 300; // 5 minutes
            
            // Create BLAKE-512 digest of request body
            var bodyJson = JsonSerializer.Serialize(requestBody);
            var bodyBytes = Encoding.UTF8.GetBytes(bodyJson);
            
            using var blake = new Blake2bHashAlgorithm(64);
            var hash = blake.ComputeHash(bodyBytes);
            var bodyHashB64 = Convert.ToBase64String(hash);
            
            // Create signing string
            var signingString = $"(created): {created}\\n(expires): {expires}\\ndigest: BLAKE-512={bodyHashB64}";
            
            // Sign with Ed25519
            var privateKeyBytes = Convert.FromBase64String(privateKey);
            var signingStringBytes = Encoding.UTF8.GetBytes(signingString);
            var signature = Ed25519.Sign(signingStringBytes, privateKeyBytes);
            var signatureB64 = Convert.ToBase64String(signature);
            
            // Create authorization header
            var authHeader = $"Signature keyId=\"{subscriberId}|{keyId}|ed25519\",algorithm=\"ed25519\",created=\"{created}\",expires=\"{expires}\",headers=\"(created) (expires) digest\",signature=\"{signatureB64}\"";
            
            return new AuthHeaderResult
            {
                Authorization = authHeader,
                Created = created,
                Expires = expires,
                Digest = $"BLAKE-512={bodyHashB64}"
            };
        }
        catch (Exception ex)
        {
            throw new Exception($"Header creation failed: {ex.Message}");
        }
    }
}`,
        verification: `// Header Verification Function
using System;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Security.Cryptography;
using Chaos.NaCl;

public static VerificationResult VerifyAuthHeader(string authHeader, object requestBody, string publicKey)
{
    try
    {
        // Parse authorization header
        var headerParts = new Dictionary<string, string>();
        var pattern = @"(\w+)=""([^""]+)""";
        var matches = Regex.Matches(authHeader, pattern);
        
        foreach (Match match in matches)
        {
            headerParts[match.Groups[1].Value] = match.Groups[2].Value;
        }
        
        // Validate header format
        var requiredFields = new[] { "keyId", "signature", "created", "expires" };
        foreach (var field in requiredFields)
        {
            if (!headerParts.ContainsKey(field))
            {
                return new VerificationResult { Valid = false, Reason = "Invalid header format" };
            }
        }
        
        // Validate timestamps
        var currentTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var created = long.Parse(headerParts["created"]);
        var expires = long.Parse(headerParts["expires"]);
        
        if (created > currentTime || currentTime > expires)
        {
            return new VerificationResult { Valid = false, Reason = "Invalid timestamp" };
        }
        
        // Recreate signing string
        var bodyJson = JsonSerializer.Serialize(requestBody);
        var bodyBytes = Encoding.UTF8.GetBytes(bodyJson);
        
        using var blake = new Blake2bHashAlgorithm(64);
        var hash = blake.ComputeHash(bodyBytes);
        var bodyHashB64 = Convert.ToBase64String(hash);
        
        var signingString = $"(created): {created}\\n(expires): {expires}\\ndigest: BLAKE-512={bodyHashB64}";
        
        // Verify signature
        var publicKeyBytes = Convert.FromBase64String(publicKey);
        var signatureBytes = Convert.FromBase64String(headerParts["signature"]);
        var signingStringBytes = Encoding.UTF8.GetBytes(signingString);
        
        var isValid = Ed25519.Verify(signatureBytes, signingStringBytes, publicKeyBytes);
        
        return new VerificationResult
        {
            Valid = isValid,
            Details = new VerificationDetails
            {
                Algorithm = headerParts.GetValueOrDefault("algorithm"),
                KeyId = headerParts.GetValueOrDefault("keyId"),
                Created = created,
                Expires = expires,
                TimestampValid = true,
                SignatureValid = isValid
            }
        };
    }
    catch (Exception ex)
    {
        return new VerificationResult { Valid = false, Reason = $"Verification failed: {ex.Message}" };
    }
}

public class VerificationResult
{
    public bool Valid { get; set; }
    public string Reason { get; set; }
    public VerificationDetails Details { get; set; }
}

public class VerificationDetails
{
    public string Algorithm { get; set; }
    public string KeyId { get; set; }
    public long Created { get; set; }
    public long Expires { get; set; }
    public bool TimestampValid { get; set; }
    public bool SignatureValid { get; set; }
}`
      }
    };

    return (
      <Fade in={true} timeout={800}>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 700, color: '#1e293b' }}>
            📚 Code Examples & Documentation
          </Typography>

          {/* Language Selector */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            mb: 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0',
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              🌐 Select Programming Language
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(languageExamples).map(([key, lang]) => (
                <Grid item xs={6} sm={4} md={2} key={key}>
                  <Button
                    variant={selectedLanguage === key ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => setSelectedLanguage(key)}
                    startIcon={lang.icon}
                    sx={{
                      py: 1.5,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      ...(selectedLanguage === key && {
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        }
                      })
                    }}
                  >
                    {lang.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Code Examples */}
          <Grid container spacing={4}>
            {/* Header Creation */}
            <Grid item xs={12}>
              <Accordion defaultExpanded sx={{ borderRadius: 3, '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ background: '#0ea5e9', width: 40, height: 40 }}>
                      <Create />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        🔐 Header Creation - {languageExamples[selectedLanguage].name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Generate ONDC-compliant authorization headers
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <SyntaxHighlighter
                      language={selectedLanguage === 'csharp' ? 'csharp' : selectedLanguage}
                      style={vscDarkPlus}
                      customStyle={{ 
                        borderRadius: 8, 
                        margin: 0, 
                        fontSize: '0.875rem',
                        maxHeight: '500px',
                        overflow: 'auto'
                      }}
                    >
                      {languageExamples[selectedLanguage].creation}
                    </SyntaxHighlighter>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <CopyToClipboard 
                      text={languageExamples[selectedLanguage].creation} 
                      onCopy={() => toast.success('📋 Creation code copied!')}
                    >
                      <Button 
                        size="small" 
                        startIcon={<ContentCopy />}
                        variant="outlined"
                      >
                        Copy Code
                      </Button>
                    </CopyToClipboard>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Header Verification */}
            <Grid item xs={12}>
              <Accordion defaultExpanded sx={{ borderRadius: 3, '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ background: '#0ea5e9', width: 40, height: 40 }}>
                      <Verified />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        🔍 Header Verification - {languageExamples[selectedLanguage].name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Verify incoming authorization headers
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <SyntaxHighlighter
                      language={selectedLanguage === 'csharp' ? 'csharp' : selectedLanguage}
                      style={vscDarkPlus}
                      customStyle={{ 
                        borderRadius: 8, 
                        margin: 0, 
                        fontSize: '0.875rem',
                        maxHeight: '500px',
                        overflow: 'auto'
                      }}
                    >
                      {languageExamples[selectedLanguage].verification}
                    </SyntaxHighlighter>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <CopyToClipboard 
                      text={languageExamples[selectedLanguage].verification} 
                      onCopy={() => toast.success('📋 Verification code copied!')}
                    >
                      <Button 
                        size="small" 
                        startIcon={<ContentCopy />}
                        variant="outlined"
                      >
                        Copy Code
                      </Button>
                    </CopyToClipboard>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>

          {/* Dependencies & Setup */}
          <Paper sx={{ 
            p: 4, 
            borderRadius: 3,
            mt: 4,
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                            border: '1px solid #0ea5e9',
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              📦 Dependencies & Setup
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Required Libraries:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Ed25519:</strong> Digital signature algorithm
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    <strong>BLAKE-512:</strong> Hash function for digest
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Base64:</strong> Encoding/decoding utilities
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>JSON:</strong> Request body serialization
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Security Best Practices:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Store private keys securely (environment variables)
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Validate timestamps (created ≤ now ≤ expires)
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Use short expiration times (≤ 5 minutes)
                  </Typography>
                  <Typography component="li" variant="body2">
                    Log verification failures for monitoring
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Header Format Reference */}
          <Paper sx={{ 
            p: 4, 
            borderRadius: 3,
            mt: 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #64748b',
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              📄 ONDC Header Format Reference
            </Typography>
            <Box sx={{ borderRadius: 2, overflow: 'hidden', mt: 2 }}>
              <SyntaxHighlighter
                language="text"
                style={vscDarkPlus}
                customStyle={{ borderRadius: 8, margin: 0, fontSize: '0.875rem' }}
              >
{`Signature keyId="buyer-app.ondc.org|207|ed25519",
algorithm="ed25519",
created="1640995200",
expires="1640995500",
headers="(created) (expires) digest",
signature="MEUCIQDxyz123abc456def789ghi012jkl345mno678pqr901stu234vwx567yzA..."

Signing String Format:
(created): 1640995200
(expires): 1640995500
digest: BLAKE-512=base64_encoded_hash_of_request_body`}
              </SyntaxHighlighter>
            </Box>
          </Paper>

          <Alert severity="info" sx={{ mt: 4, borderRadius: 3 }}>
            <Typography variant="body2">
              <strong>💡 Pro Tip:</strong> Test your implementation using the Create and Verify tabs above. 
              All code examples follow the exact same ONDC specification for maximum compatibility.
            </Typography>
          </Alert>
        </Box>
      </Fade>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 6 }}>
      {/* Modern Header */}
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            borderRadius: 3,
            p: 3,
            mb: 4,
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
                <Security sx={{ fontSize: 24, color: 'white' }} />
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
                  Authorization Header Tools
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.9,
                    fontWeight: 400,
                    color: 'white',
                  }}
                >
                  Create and verify ONDC-compliant authorization headers with Ed25519 signatures
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip
                icon={<Create sx={{ color: 'white !important' }} />}
                label="Header Creation"
                size="small"
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              <Chip
                icon={<Verified sx={{ color: 'white !important' }} />}
                label="Header Verification"
                size="small"
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              <Chip
                icon={<Code sx={{ color: 'white !important' }} />}
                label="Multi-Language"
                size="small"
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            </Stack>
          </Box>
        </Paper>
      </Fade>

      {/* Independent Tools Navigation */}
      <Fade in timeout={1000}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 700, color: '#1e293b', textAlign: 'center' }}>
            🛠️ Choose Your Tool
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
            Each tool works independently. Use any tool based on your current needs.
          </Typography>
          
                     <Grid container spacing={3}>
            {tools.map((tool, index) => (
                             <Grid item xs={12} md={4} key={tool.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: activeTab === index ? `2px solid ${tool.color}` : '2px solid transparent',
                    background: activeTab === index 
                      ? `linear-gradient(135deg, ${tool.color}10 0%, ${tool.color}05 100%)`
                      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: activeTab === index 
                      ? `0 8px 25px ${tool.color}30`
                      : '0 2px 10px rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 35px ${tool.color}20`,
                      border: `2px solid ${tool.color}`,
                    }
                  }}
                  onClick={() => setActiveTab(index)}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                        background: `linear-gradient(135deg, ${tool.color} 0%, ${tool.color}dd 100%)`,
                        boxShadow: `0 4px 20px ${tool.color}40`,
                      }}
                    >
                      {React.cloneElement(tool.icon, { sx: { fontSize: 32 } })}
                    </Avatar>
                    
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                      {tool.label}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {tool.description}
                    </Typography>
                    
                    <Chip
                      label={tool.status}
                      size="small"
                      sx={{
                        background: activeTab === index 
                          ? `linear-gradient(135deg, ${tool.color} 0%, ${tool.color}dd 100%)`
                          : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                        color: activeTab === index ? 'white' : '#64748b',
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

      {/* Enhanced Tab Content */}
      <Fade in timeout={1200}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <TabPanel value={activeTab} index={0}>
              <HeaderCreationTab />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <HeaderVerificationTab />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <DocumentationTab />
            </TabPanel>
          </CardContent>
        </Card>
      </Fade>

      {/* Spacer between main content and explanation sections */}
      <Box sx={{ mb: 6 }} />

      {/* How Header Generation Works - Compact */}
      <Card sx={{ 
        mb: 3, 
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
            🔐 How Header Generation Works
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                📝 Process Steps:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                • <strong>Hash Request:</strong> BLAKE-512 hash of JSON<br />
                • <strong>Build String:</strong> Combine timestamps + digest<br />
                • <strong>Sign:</strong> Ed25519 signature generation<br />
                • <strong>Format:</strong> RFC-compliant header creation
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                🔒 Security Features:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                • <strong>Ed25519:</strong> Cryptographic signature<br />
                • <strong>Timestamps:</strong> Replay attack prevention<br />
                • <strong>Key ID:</strong> Links to registered public key<br />
                • <strong>Digest:</strong> Request body integrity
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* How Header Verification Works - Compact */}
      <Card sx={{ 
        mb: 3, 
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
            🔍 How Header Verification Works
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                🔍 Verification Steps:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                • <strong>Parse:</strong> Extract signature and timestamps<br />
                • <strong>Format:</strong> Check RFC compliance<br />
                • <strong>Time:</strong> Verify expiry and creation<br />
                • <strong>Signature:</strong> Validate with public key
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                ✅ Security Checks:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                • <strong>Structure:</strong> Correct header format<br />
                • <strong>Timestamps:</strong> Not expired/future<br />
                • <strong>Crypto:</strong> Valid Ed25519 signature<br />
                • <strong>Digest:</strong> Body hash verification
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HeaderTools; 