import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  Paper,
  CircularProgress,
  Avatar,
  Fade,
  Alert,
  Chip,
} from '@mui/material';
import {
  VerifiedUser,
  CheckCircle,
  Info,
  ArrowForward,
} from '@mui/icons-material';
import enhancedToast from '../utils/toast';

const WhitelistVerification: React.FC = () => {
  const navigate = useNavigate();
  const [subscriberId, setSubscriberId] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    message: string;
    details?: string;
  } | null>(null);

  useEffect(() => {
    const isVerified = localStorage.getItem('ondc_whitelist_verified') === 'true';
    const storedSubscriberId = localStorage.getItem('ondc_subscriber_id');
    
    if (isVerified && storedSubscriberId) {
      setSubscriberId(storedSubscriberId);
      setVerificationResult({
        verified: true,
        message: 'Subscriber ID verified successfully!',
        details: 'Your subscriber ID is whitelisted and approved for ONDC integration.'
      });
    }
  }, []);

  const verifyWhitelist = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Accept any subscriber ID - no validation
      localStorage.setItem('ondc_whitelist_verified', 'true');
      localStorage.setItem('ondc_subscriber_id', subscriberId);
      
      // Create session ID when whitelisting is verified
      const sessionId = `ondc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ondc_session_id', sessionId);
      
      setVerificationResult({
        verified: true,
        message: 'Subscriber ID verified successfully!',
        details: 'Your subscriber ID is whitelisted and approved for ONDC integration.'
      });
      
      enhancedToast.success('Verification Successful!', 'You can now proceed to the next step.');
    } catch (error: any) {
      enhancedToast.error('Verification Error', error.message || 'Failed to verify subscriber ID');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubscriberId('');
    setVerificationResult(null);
    localStorage.removeItem('ondc_whitelist_verified');
    localStorage.removeItem('ondc_subscriber_id');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            borderRadius: 3,
            p: 3,
            mb: 3,
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <VerifiedUser sx={{ fontSize: 24, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
                Whitelisting Verification
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, color: 'white' }}>
                Verify your ONDC subscriber ID status
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>

      <Fade in timeout={1000}>
        <Card elevation={0} sx={{ mb: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  mx: 'auto',
                  mb: 3,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                }}
              >
                <VerifiedUser sx={{ fontSize: 36, color: 'white' }} />
              </Avatar>
              
              <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 700 }}>
                Verify Subscriber ID
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Enter your ONDC subscriber ID to verify whitelisting status
              </Typography>

              <Box sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
                <TextField
                  fullWidth
                  label="Subscriber ID"
                  value={subscriberId}
                  onChange={(e) => setSubscriberId(e.target.value)}
                  placeholder="Enter your ONDC subscriber ID"
                  disabled={loading || (verificationResult?.verified)}
                  sx={{ mb: 3 }}
                />

                {!verificationResult?.verified ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={verifyWhitelist}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VerifiedUser />}
                    sx={{
                      px: 6,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      textTransform: 'none',
                    }}
                  >
                    {loading ? 'Verifying...' : 'Verify Whitelisting Status'}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleReset}
                    sx={{ px: 4, py: 1.5, borderRadius: 3, textTransform: 'none' }}
                  >
                    Verify Different ID
                  </Button>
                )}
              </Box>
            </Box>

            {verificationResult && (
              <Box sx={{ mt: 4 }}>
                <Alert severity={verificationResult.verified ? 'success' : 'error'} sx={{ mb: 3 }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                    {verificationResult.message}
                  </Typography>
                  <Typography variant="body2">
                    {verificationResult.details}
                  </Typography>
                </Alert>

                {verificationResult.verified && (
                  <>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                        border: '2px solid #10b981',
                        mb: 3,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, background: '#10b981' }}>
                          <CheckCircle sx={{ fontSize: 20, color: 'white' }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight="700" color="#065f46">
                          Verification Complete
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="#047857">
                        <strong>Subscriber ID:</strong> {subscriberId}
                        <br />
                        <strong>Status:</strong> <Chip label="Verified" color="success" size="small" sx={{ ml: 1 }} />
                      </Typography>
                    </Paper>

                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/keys')}
                        endIcon={<ArrowForward />}
                        sx={{
                          px: 6,
                          py: 1.5,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        Proceed to Next Step
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Fade>

      <Fade in timeout={1200}>
        <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 48, height: 48, background: '#0ea5e9' }}>
                <Info sx={{ fontSize: 24, color: 'white' }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Whitelisting Information
              </Typography>
            </Box>
            
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
              <strong>What is whitelisting?</strong>
              <br />
              ONDC maintains a whitelist of approved subscriber IDs to ensure network security and compliance. 
              Only whitelisted subscribers can integrate with the ONDC network.
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
              <strong>How to get whitelisted?</strong>
              <br />
              • Contact ONDC support with your business details
              <br />
              • Complete the registration and approval process
              <br />
              • Receive your approved subscriber ID
              <br />
              • Use this tool to verify your whitelist status
            </Typography>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Any subscriber ID will be accepted for verification in this demo version.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default WhitelistVerification;
