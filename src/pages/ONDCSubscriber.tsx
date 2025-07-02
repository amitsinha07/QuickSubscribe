import React, { useState, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  ArrowForward,
  ArrowBack,
  Business,
  Security,
  Assignment,
  Send,
  ExpandMore,
  Verified,
  Warning,
  Info,
  Subscriptions,
  Shield,
  Add,
  Delete,
  Store,
  ShoppingCart,
  CorporateFare,
} from '@mui/icons-material';
import enhancedToast from '../utils/toast';
import { useNavigate } from 'react-router-dom';

interface NetworkParticipant {
  subscriber_url: string;
  domain: string;
  type: 'buyerApp' | 'sellerApp';
  msn: boolean;
  city_code: string[];
}

interface SubscriptionFormData {
  // Operation context
  ops_no: number; // 1=buyer, 2=seller, 4=both
  
  // Entity details
  legal_entity_name: string;
  business_address: string;
  city_code: string[];
  gst_no: string;
  name_as_per_pan: string;
  pan_no: string;
  date_of_incorporation: string;
  name_of_authorised_signatory: string;
  address_of_authorised_signatory: string;
  email_id: string;
  mobile_no: string;
  country: string;
  subscriber_id: string;
  callback_url: string;
  
  // Network participants
  network_participant: NetworkParticipant[];
}

const ONDCSubscriber: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subscriptionResult, setSubscriptionResult] = useState<any>(null);
  
  const [formData, setFormData] = useState<SubscriptionFormData>({
    ops_no: 1, // Default to buyer
    legal_entity_name: '',
    business_address: '',
    city_code: ['std:01662'],
    gst_no: '',
    name_as_per_pan: '',
    pan_no: '',
    date_of_incorporation: '',
    name_of_authorised_signatory: '',
    address_of_authorised_signatory: '',
    email_id: '',
    mobile_no: '',
    country: 'IND',
    subscriber_id: '',
    callback_url: '/',
    network_participant: [
      {
        subscriber_url: '/bap/retails/protocol/v1',
        domain: 'ONDC:RET10',
        type: 'buyerApp',
        msn: false,
        city_code: ['*']
      }
    ]
  });

  const sessionId = localStorage.getItem('ondc_session_id');
  const keys = JSON.parse(localStorage.getItem('ondc_keys') || 'null');

  // Operation types
  const operationTypes = useMemo(() => [
    { 
      value: 1, 
      label: 'Buyer Application', 
      description: 'Consumer-facing platform for purchasing',
      icon: <ShoppingCart />,
            color: '#0ea5e9'
      },
    { 
      value: 2, 
      label: 'Seller Application', 
      description: 'Merchant platform for selling products',
      icon: <Store />,
      color: '#10b981'
    },
    { 
      value: 4, 
      label: 'Both Buyer & Seller', 
      description: 'Marketplace supporting both buying and selling',
      icon: <CorporateFare />,
      color: '#8b5cf6'
    }
  ], []);

  // Common ONDC domains
  const ondcDomains = useMemo(() => [
    'ONDC:RET10', 'ONDC:RET11', 'ONDC:RET12', 'ONDC:RET13', 'ONDC:RET14',
    'ONDC:RET15', 'ONDC:RET16', 'ONDC:RET18', 'ONDC:AGR10', 'nic2004:60232'
  ], []);

  // Common city codes
  const cityCodes = useMemo(() => [
    { value: 'std:01662', label: 'Hisar (01662)' },
    { value: 'std:011', label: 'Delhi (011)' },
    { value: 'std:022', label: 'Mumbai (022)' },
    { value: 'std:080', label: 'Bangalore (080)' },
    { value: 'std:040', label: 'Hyderabad (040)' },
    { value: 'std:033', label: 'Kolkata (033)' },
    { value: 'std:044', label: 'Chennai (044)' },
    { value: 'std:020', label: 'Pune (020)' },
    { value: '*', label: 'All Cities (*)' }
  ], []);

  const steps = [
    {
      id: 0,
      label: 'Prerequisites',
      description: 'Verify system readiness',
      icon: <Security />,
      color: '#ff6b35',
    },
    {
      id: 1,
      label: 'Operation Type',
      description: 'Select your business model',
      icon: <Business />,
                color: '#0ea5e9',
    },
    {
      id: 2,
      label: 'Business Details',
      description: 'GST & PAN information',
      icon: <Assignment />,
      color: '#10b981',
    },
    {
      id: 3,
      label: 'Network Configuration',
      description: 'Configure participants',
      icon: <Shield />,
      color: '#8b5cf6',
    },
    {
      id: 4,
      label: 'Review & Submit',
      description: 'Complete subscription',
      icon: <Send />,
      color: '#4caf50',
    },
  ];

  const handleInputChange = useCallback((field: keyof SubscriptionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle operation type change and update network participants accordingly
  const handleOperationTypeChange = useCallback((ops_no: number) => {
    setFormData(prev => {
      const newNetworkParticipants: NetworkParticipant[] = [];
      
      if (ops_no === 1 || ops_no === 4) { // Buyer or Both
        ondcDomains.forEach(domain => {
          newNetworkParticipants.push({
            subscriber_url: '/bap/retails/protocol/v1',
            domain,
            type: 'buyerApp',
            msn: false,
            city_code: ['*']
          });
        });
      }
      
      if (ops_no === 2 || ops_no === 4) { // Seller or Both
        ondcDomains.forEach(domain => {
          newNetworkParticipants.push({
            subscriber_url: '/bpp/retails/protocol/v1',
            domain,
            type: 'sellerApp',
            msn: false,
            city_code: ['*']
          });
        });
      }

             return {
         ...prev,
         ops_no,
         network_participant: newNetworkParticipants
       };
     });
   }, [ondcDomains]);

  const addNetworkParticipant = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      network_participant: [
        ...prev.network_participant,
        {
          subscriber_url: '/bap/retails/protocol/v1',
          domain: 'ONDC:RET10',
          type: 'buyerApp',
          msn: false,
          city_code: ['*']
        }
      ]
    }));
  }, []);

  const removeNetworkParticipant = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      network_participant: prev.network_participant.filter((_, i) => i !== index)
    }));
  }, []);

  const updateNetworkParticipant = useCallback((index: number, field: keyof NetworkParticipant, value: any) => {
    setFormData(prev => ({
      ...prev,
      network_participant: prev.network_participant.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant
      )
    }));
  }, []);

  // 🚨 TEMPORARY: Validation function commented out for testing - UNCOMMENT BEFORE PRODUCTION
  // const validateForm = useCallback((): string | null => {
  //   // Basic fields
  //   if (!formData.subscriber_id) return 'Subscriber ID is required';
  //   if (!formData.email_id) return 'Email ID is required';
  //   if (!formData.legal_entity_name) return 'Legal Entity Name is required';
  //   if (!formData.business_address) return 'Business Address is required';
  //   if (!formData.gst_no) return 'GST Number is required';
  //   if (!formData.name_as_per_pan) return 'Name as per PAN is required';
  //   if (!formData.pan_no) return 'PAN Number is required';
  //   if (!formData.date_of_incorporation) return 'Date of Incorporation is required';
  //   if (!formData.name_of_authorised_signatory) return 'Authorized Signatory Name is required';
  //   if (!formData.address_of_authorised_signatory) return 'Authorized Signatory Address is required';
  //   if (!formData.mobile_no) return 'Mobile Number is required';
  //   
  //   // Validate email format
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(formData.email_id)) {
  //     return 'Invalid email format';
  //   }
  //   
  //   // Validate subscriber ID format
  //   if (!formData.subscriber_id.includes('.')) {
  //     return 'Subscriber ID should follow domain format (e.g., protocol.company.com)';
  //   }
  //   
  //   // Validate GST number format (15 characters)
  //   const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  //   if (!gstRegex.test(formData.gst_no)) {
  //     return 'Please enter a valid GST number (15 characters)';
  //   }
  //   
  //   // Validate PAN number format (10 characters)
  //   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  //   if (!panRegex.test(formData.pan_no)) {
  //     return 'Please enter a valid PAN number (10 characters)';
  //   }
  //   
  //   // Validate mobile number format (10 digits)
  //   const mobileRegex = /^[0-9]{10}$/;
  //   if (!mobileRegex.test(formData.mobile_no)) {
  //     return 'Please enter a valid 10-digit mobile number';
  //   }
  //   
  //   // Validate date format (DD/MM/YYYY)
  //   const dateRegex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  //   if (!dateRegex.test(formData.date_of_incorporation)) {
  //     return 'Please enter date in DD/MM/YYYY format';
  //   }

  //   // Validate network participants
  //   if (formData.network_participant.length === 0) {
  //     return 'At least one network participant is required';
  //   }
  //   
  //   return null;
  // }, [formData]);

  const handleNext = useCallback(() => {
    // 🚨 TEMPORARY: Skip all validation for testing - REMOVE BEFORE PRODUCTION
    // if (activeStep === 4) {
    //   const error = validateForm();
    //   if (error) {
    //     enhancedToast.error('Validation Error', error);
    //     return;
    //   }
    // }
    setActiveStep(prev => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep(prev => prev - 1);
  }, []);

  const subscribeToONDC = useCallback(async () => {
    if (!sessionId) {
      enhancedToast.error('Session Error', 'No session found. Please generate keys first.');
      return;
    }

    if (!keys) {
      enhancedToast.error('Keys Error', 'No cryptographic keys found. Please generate keys first.');
      return;
    }

    setLoading(true);
    try {
      // Create the exact payload structure as provided
      const subscriptionPayload = {
        context: {
          operation: {
            ops_no: formData.ops_no
          }
        },
        message: {
          request_id: sessionId,
          timestamp: new Date().toISOString(),
          entity: {
            gst: {
              legal_entity_name: formData.legal_entity_name,
              business_address: formData.business_address,
              city_code: formData.city_code,
              gst_no: formData.gst_no
            },
            pan: {
              name_as_per_pan: formData.name_as_per_pan,
              pan_no: formData.pan_no,
              date_of_incorporation: formData.date_of_incorporation
            },
            name_of_authorised_signatory: formData.name_of_authorised_signatory,
            address_of_authorised_signatory: formData.address_of_authorised_signatory,
            email_id: formData.email_id,
            mobile_no: parseInt(formData.mobile_no),
            country: formData.country,
            subscriber_id: formData.subscriber_id,
            unique_key_id: sessionId,
            callback_url: formData.callback_url,
            key_pair: {
              signing_public_key: keys.sign_public_key,
              encryption_public_key: keys.enc_public_key,
              valid_from: new Date().toISOString(),
              valid_until: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString() // 10 years
            }
          },
          network_participant: formData.network_participant
        }
      };
      
      console.log('ONDC Subscription Payload:', JSON.stringify(subscriptionPayload, null, 2));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful subscription
      const result = {
        status: 'success',
        message: 'Successfully subscribed to ONDC network',
        subscription_id: `ondc-sub-${Date.now()}`,
        subscriber_id: formData.subscriber_id,
        operation_type: operationTypes.find(op => op.value === formData.ops_no)?.label,
        registered_at: new Date().toISOString(),
        verification_status: 'pending',
        payload: subscriptionPayload,
        next_steps: [
          'ONDC will verify your endpoints within 24-48 hours',
          'You will receive confirmation email once verification is complete',
          'Monitor your application logs for challenge requests',
          'Manage authorization headers for secure communication'
        ]
      };
      
      setSubscriptionResult(result);
      
      // Mark subscription as completed in localStorage
      localStorage.setItem('ondc_subscription_completed', 'true');
      
      // Dispatch custom event to notify dashboard
      window.dispatchEvent(new CustomEvent('ondc_subscription_completed'));
      
      enhancedToast.subscribed();
      
    } catch (error: any) {
      enhancedToast.error('Subscription Failed', error.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId, keys, formData, operationTypes]);

  const PrerequisitesStep = useMemo(() => (
    <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 700, color: '#1e293b' }}>
          🔐 System Prerequisites
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: 3,
              border: sessionId ? '2px solid #10b981' : '2px solid #ef4444',
              background: sessionId 
                ? 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)' 
                : 'linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%)',
              boxShadow: sessionId 
                ? '0 8px 25px rgba(16, 185, 129, 0.15)' 
                : '0 8px 25px rgba(239, 68, 68, 0.15)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  background: sessionId ? '#10b981' : '#ef4444',
                }}>
                  {sessionId ? <CheckCircle /> : <ErrorIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Cryptographic Keys
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ed25519 & X25519 key pairs
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={sessionId ? 'Keys Generated ✓' : 'Keys Required'}
                color={sessionId ? 'success' : 'error'}
                sx={{ fontWeight: 600 }}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: 3,
              border: keys ? '2px solid #10b981' : '2px solid #ef4444',
              background: keys 
                ? 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)' 
                : 'linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%)',
              boxShadow: keys 
                ? '0 8px 25px rgba(16, 185, 129, 0.15)' 
                : '0 8px 25px rgba(239, 68, 68, 0.15)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  background: keys ? '#10b981' : '#ef4444',
                }}>
                  {keys ? <Verified /> : <Warning />}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Key Storage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Secure key management
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={keys ? 'Keys Available ✓' : 'Keys Missing'}
                color={keys ? 'success' : 'error'}
                sx={{ fontWeight: 600 }}
              />
            </Paper>
          </Grid>
        </Grid>

        {(!sessionId || !keys) && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 4, 
              borderRadius: 3,
              '& .MuiAlert-icon': { fontSize: 28 }
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Missing Prerequisites
            </Typography>
            <Typography variant="body2">
              Please generate cryptographic keys first before proceeding with ONDC subscription.
              Keys are required for secure communication with the ONDC network.
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/keys')}
              sx={{ mt: 2 }}
            >
              Generate Keys Now
            </Button>
          </Alert>
        )}

        <Paper sx={{ 
          mt: 4, 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
          border: '1px solid #0ea5e9',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar sx={{ background: '#0ea5e9', width: 40, height: 40 }}>
              <Info />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0284c7' }}>
                Before Proceeding
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Ensure your endpoints are deployed and accessible
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Test your endpoints using the Deployment Helper
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Have your organization and GST details ready
                </Typography>
                <Typography component="li" variant="body2">
                  Prepare authorized signatory information
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>


      </Box>
  ), [sessionId, keys, navigate]);

  const OperationTypeStep = useMemo(() => (
    <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 700, color: '#1e293b' }}>
          🏢 Business Information
        </Typography>

        {/* Operation Type */}
        <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ background: '#ff6b35', width: 32, height: 32 }}>
                <Security sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Operation Type
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth required>
              <InputLabel>Operation Type</InputLabel>
              <Select
                value={formData.ops_no}
                label="Operation Type"
                onChange={(e) => handleOperationTypeChange(parseInt(e.target.value as string))}
                sx={{ borderRadius: 2 }}
              >
                {operationTypes.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{op.icon}</span>
                      <Box>
                        <Typography>{op.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {op.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Alert severity="info" sx={{ mt: 3, borderRadius: 3 }}>
          <Typography variant="body2">
            <strong>Network Participants:</strong> Network participants will be automatically configured in the next step based on your operation type selection.
          </Typography>
        </Alert>

             </Box>
   ), [formData, operationTypes, handleOperationTypeChange]);

   const NetworkConfigurationStep = useMemo(() => (
     <Box>
         <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 700, color: '#1e293b' }}>
           🌐 Network Configuration
         </Typography>
         
         <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
           <Typography variant="body2">
             <strong>Network Participants:</strong> These are automatically configured based on your selected operation type. 
             You can add custom participants or modify the defaults.
           </Typography>
         </Alert>

         {/* Network Participants */}
         <Paper sx={{ 
           p: 4, 
           borderRadius: 3,
           background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
           border: '1px solid #e2e8f0',
           mb: 3,
         }}>
           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
             <Typography variant="h6" sx={{ fontWeight: 600 }}>
               Network Participants ({formData.network_participant.length})
             </Typography>
             <Button
               variant="outlined"
               startIcon={<Add />}
               onClick={addNetworkParticipant}
               sx={{ borderRadius: 2 }}
             >
               Add Participant
             </Button>
           </Box>
           
           <Grid container spacing={3}>
             {formData.network_participant.map((participant, index) => (
               <Grid item xs={12} key={index}>
                 <Paper sx={{ 
                   p: 3, 
                   borderRadius: 2, 
                   border: '1px solid #e2e8f0',
                   background: 'white',
                   position: 'relative',
                 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                     <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151' }}>
                       Participant {index + 1}
                     </Typography>
                     {formData.network_participant.length > 1 && (
                       <Tooltip title="Remove Participant">
                         <IconButton
                           onClick={() => removeNetworkParticipant(index)}
                           color="error"
                           size="small"
                         >
                           <Delete />
                         </IconButton>
                       </Tooltip>
                     )}
                   </Box>
                   
                   <Grid container spacing={3}>
                     <Grid item xs={12}>
                       <TextField
                         fullWidth
                         label="Subscriber URL"
                         placeholder="/bap/retails/protocol/v1"
                         value={participant.subscriber_url}
                         onChange={(e) => updateNetworkParticipant(index, 'subscriber_url', e.target.value)}
                         helperText="API endpoint for this participant"
                         required
                         sx={{ 
                           '& .MuiOutlinedInput-root': {
                             borderRadius: 2,
                           }
                         }}
                       />
                     </Grid>
                     
                     <Grid item xs={12} md={6}>
                       <FormControl fullWidth required>
                         <InputLabel>Domain</InputLabel>
                         <Select
                           value={participant.domain}
                           label="Domain"
                           onChange={(e) => updateNetworkParticipant(index, 'domain', e.target.value)}
                           sx={{ borderRadius: 2 }}
                         >
                           {ondcDomains.map((domain) => (
                             <MenuItem key={domain} value={domain}>
                               {domain}
                             </MenuItem>
                           ))}
                         </Select>
                       </FormControl>
                     </Grid>
                     
                     <Grid item xs={12} md={6}>
                       <FormControl fullWidth required>
                         <InputLabel>Type</InputLabel>
                         <Select
                           value={participant.type}
                           label="Type"
                           onChange={(e) => updateNetworkParticipant(index, 'type', e.target.value as 'buyerApp' | 'sellerApp')}
                           sx={{ borderRadius: 2 }}
                         >
                           <MenuItem value="buyerApp">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <ShoppingCart sx={{ fontSize: 20 }} />
                               Buyer App
                             </Box>
                           </MenuItem>
                           <MenuItem value="sellerApp">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <Store sx={{ fontSize: 20 }} />
                               Seller App
                             </Box>
                           </MenuItem>
                         </Select>
                       </FormControl>
                     </Grid>
                     
                     <Grid item xs={12} md={6}>
                       <FormControl fullWidth>
                         <InputLabel>MSN (Multi-Seller Network)</InputLabel>
                         <Select
                           value={participant.msn ? 'true' : 'false'}
                           label="MSN (Multi-Seller Network)"
                           onChange={(e) => updateNetworkParticipant(index, 'msn', e.target.value === 'true')}
                           sx={{ borderRadius: 2 }}
                         >
                           <MenuItem value="false">No</MenuItem>
                           <MenuItem value="true">Yes</MenuItem>
                         </Select>
                       </FormControl>
                     </Grid>
                     
                     <Grid item xs={12} md={6}>
                       <FormControl fullWidth>
                         <InputLabel>City Code</InputLabel>
                         <Select
                           multiple
                           value={participant.city_code}
                           label="City Code"
                           onChange={(e) => updateNetworkParticipant(index, 'city_code', e.target.value as string[])}
                           sx={{ borderRadius: 2 }}
                         >
                           {cityCodes.map((city) => (
                             <MenuItem key={city.value} value={city.value}>
                               {city.label}
                             </MenuItem>
                           ))}
                         </Select>
                       </FormControl>
                     </Grid>
                   </Grid>
                 </Paper>
               </Grid>
             ))}
           </Grid>
         </Paper>

       </Box>
   ), [formData.network_participant, ondcDomains, cityCodes, addNetworkParticipant, removeNetworkParticipant, updateNetworkParticipant]);

  const BusinessDetailsStep = useMemo(() => (
    <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 700, color: '#1e293b' }}>
          🏢 Business Information
        </Typography>

        {/* Basic Information */}
        <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                width: 40, 
                height: 40, 
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              }}>
                <Business />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Basic Information
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subscriber ID"
                  placeholder="protocol.shopneo.in"
                  value={formData.subscriber_id}
                  onChange={(e) => handleInputChange('subscriber_id', e.target.value)}
                  helperText="Unique identifier for your ONDC application"
                  required
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
                  label="Email ID"
                  placeholder="Yashsihag@gmail.com"
                  value={formData.email_id}
                  onChange={(e) => handleInputChange('email_id', e.target.value)}
                  helperText="Primary contact email for ONDC communications"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Callback URL"
                  placeholder="/"
                  value={formData.callback_url}
                  onChange={(e) => handleInputChange('callback_url', e.target.value)}
                  helperText="Callback URL for ONDC notifications"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* GST Information */}
        <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                width: 40, 
                height: 40, 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              }}>
                <Assignment />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                GST Information
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Legal Entity Name"
                  placeholder="MODISH SERVICES PRIVATE LIMITED"
                  value={formData.legal_entity_name}
                  onChange={(e) => handleInputChange('legal_entity_name', e.target.value)}
                  helperText="Legal name as per GST registration"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Address"
                  placeholder="7P, Sector 16-17, Near Veda Hospital, Hisar -125001"
                  value={formData.business_address}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                  helperText="Complete business address as per GST"
                  required
                  multiline
                  rows={3}
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
                  label="GST Number"
                  placeholder="06AAJCM8460E2ZC"
                  value={formData.gst_no}
                  onChange={(e) => handleInputChange('gst_no', e.target.value)}
                  helperText="15-character GST identification number"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>City Code</InputLabel>
                  <Select
                    multiple
                    value={formData.city_code}
                    label="City Code"
                    onChange={(e) => handleInputChange('city_code', e.target.value as string[])}
                    sx={{ borderRadius: 2 }}
                  >
                    {cityCodes.map((city) => (
                      <MenuItem key={city.value} value={city.value}>
                        {city.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* PAN Information */}
        <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                width: 40, 
                height: 40, 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              }}>
                <Verified />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                PAN Information
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name as per PAN"
                  placeholder="MODISH SERVICES PRIVATE LIMITED"
                  value={formData.name_as_per_pan}
                  onChange={(e) => handleInputChange('name_as_per_pan', e.target.value)}
                  helperText="Name exactly as on PAN card"
                  required
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
                  label="PAN Number"
                  placeholder="AAJCM8460E"
                  value={formData.pan_no}
                  onChange={(e) => handleInputChange('pan_no', e.target.value)}
                  helperText="10-character PAN number"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date of Incorporation"
                  placeholder="28/07/2015"
                  value={formData.date_of_incorporation}
                  onChange={(e) => handleInputChange('date_of_incorporation', e.target.value)}
                  helperText="Date in DD/MM/YYYY format"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Authorized Signatory */}
        <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                width: 40, 
                height: 40, 
                background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
              }}>
                <Security />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Authorized Signatory
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name of Authorized Signatory"
                  placeholder="Yespal Singh"
                  value={formData.name_of_authorised_signatory}
                  onChange={(e) => handleInputChange('name_of_authorised_signatory', e.target.value)}
                  helperText="Full name of the authorized person"
                  required
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
                  label="Mobile Number"
                  placeholder="9991777717"
                  value={formData.mobile_no}
                  onChange={(e) => handleInputChange('mobile_no', e.target.value)}
                  helperText="10-digit mobile number"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address of Authorized Signatory"
                  placeholder="7P, Sector 16-17, Near Veda Hospital, Hisar -125001"
                  value={formData.address_of_authorised_signatory}
                  onChange={(e) => handleInputChange('address_of_authorised_signatory', e.target.value)}
                  helperText="Complete address of the authorized person"
                  required
                  multiline
                  rows={3}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={formData.country}
                    label="Country"
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="IND">India (IND)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

      </Box>
  ), [formData, cityCodes, handleInputChange]);

  // Generate the exact payload structure for preview
  const generatePayloadPreview = useCallback(() => {
    return {
      context: {
        operation: {
          ops_no: formData.ops_no
        }
      },
      message: {
        request_id: sessionId || "{{session_id}}",
        timestamp: "{{$isoTimestamp}}",
        entity: {
          gst: {
            legal_entity_name: formData.legal_entity_name || "{{legal_entity_name}}",
            business_address: formData.business_address || "{{business_address}}",
            city_code: formData.city_code.length > 0 ? formData.city_code : ["{{city_code}}"],
            gst_no: formData.gst_no || "{{gst_no}}"
          },
          pan: {
            name_as_per_pan: formData.name_as_per_pan || "{{name_as_per_pan}}",
            pan_no: formData.pan_no || "{{pan_no}}",
            date_of_incorporation: formData.date_of_incorporation || "{{date_of_incorporation}}"
          },
          name_of_authorised_signatory: formData.name_of_authorised_signatory || "{{name_of_authorised_signatory}}",
          address_of_authorised_signatory: formData.address_of_authorised_signatory || "{{address_of_authorised_signatory}}",
          email_id: formData.email_id || "{{email_id}}",
          mobile_no: formData.mobile_no ? parseInt(formData.mobile_no) : "{{mobile_no}}",
          country: formData.country || "{{country}}",
          subscriber_id: formData.subscriber_id || "{{subscriber_id}}",
          unique_key_id: sessionId || "{{unique_key_id}}",
          callback_url: formData.callback_url || "{{callback_url}}",
          key_pair: {
            signing_public_key: keys?.sign_public_key || "{{signing_public_key}}",
            encryption_public_key: keys?.enc_public_key || "{{encryption_public_key}}",
            valid_from: "{{$isoTimestamp}}",
            valid_until: "{{valid_until}}"
          }
        },
        network_participant: formData.network_participant.length > 0 
          ? formData.network_participant 
          : [
              {
                subscriber_url: "{{subscriber_url}}",
                domain: "{{domain}}",
                type: "{{type}}",
                msn: "{{msn}}",
                city_code: ["{{city_code}}"]
              }
            ]
      }
    };
  }, [formData, sessionId, keys]);

  const ReviewStep = useMemo(() => (
    <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 700, color: '#1e293b' }}>
          📋 Review Subscription Payload
        </Typography>
        
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          mb: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
              📄 ONDC Subscription Payload
            </Typography>
            <Chip 
              label={`Operation: ${operationTypes.find(op => op.value === formData.ops_no)?.label || 'Not Selected'}`}
              size="small"
              sx={{ 
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
          
                     <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
             <Typography variant="body2">
               <strong>JSON Preview:</strong> This shows the exact payload structure that will be sent to ONDC. 
               Empty fields are shown as placeholders with double curly brace notation.
             </Typography>
           </Alert>

          <Paper sx={{ 
            p: 3, 
            borderRadius: 2,
            background: '#1e293b',
            border: '1px solid #374151',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <Box sx={{ 
              position: 'absolute',
              top: 8,
              right: 12,
              zIndex: 2,
            }}>
              <Chip
                label="JSON"
                size="small"
                sx={{
                  background: 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              />
            </Box>
            
            <Box sx={{ 
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: '#e5e7eb',
              overflow: 'auto',
              maxHeight: '500px',
            }}>
              <pre style={{ 
                margin: 0, 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word',
                color: '#e5e7eb'
              }}>
                {JSON.stringify(generatePayloadPreview(), null, 2)}
              </pre>
            </Box>
          </Paper>
        </Paper>

        {/* Validation Status */}
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
          border: '1px solid #10b981',
          mb: 3,
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#059669' }}>
            ✅ Payload Validation Status
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, background: '#10b981' }}>
                  {formData.ops_no ? <CheckCircle sx={{ fontSize: 18 }} /> : <ErrorIcon sx={{ fontSize: 18 }} />}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Operation Type</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.ops_no ? 'Selected' : 'Required'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, background: keys ? '#10b981' : '#ef4444' }}>
                  {keys ? <CheckCircle sx={{ fontSize: 18 }} /> : <ErrorIcon sx={{ fontSize: 18 }} />}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Cryptographic Keys</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {keys ? 'Available' : 'Missing'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, background: formData.network_participant.length > 0 ? '#10b981' : '#ef4444' }}>
                  {formData.network_participant.length > 0 ? <CheckCircle sx={{ fontSize: 18 }} /> : <ErrorIcon sx={{ fontSize: 18 }} />}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Network Participants</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.network_participant.length} configured
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

                 <Alert severity="warning" sx={{ mt: 3, borderRadius: 3 }}>
           <Typography variant="body2">
             <strong>Review Carefully:</strong> The JSON payload above shows the exact structure that will be sent to ONDC. 
             Placeholder values with double curly braces indicate missing or empty fields. 
             Ensure all required fields are properly filled before submission.
           </Typography>
         </Alert>

      </Box>
  ), [formData, operationTypes, keys, generatePayloadPreview]);

  const SubmissionStep = useMemo(() => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
        <Avatar sx={{ 
          width: 80, 
          height: 80, 
          mx: 'auto', 
          mb: 3,
          background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
        }}>
          <Send sx={{ fontSize: 40 }} />
        </Avatar>
        
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          Ready to Submit
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
          Your ONDC subscription request is ready to be submitted. 
          This will register your application with the ONDC network.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={subscribeToONDC}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <Send />}
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 700,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(76, 175, 80, 0.4)',
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
              transform: 'none',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {loading ? 'Submitting...' : 'Submit to ONDC'}
        </Button>
      </Box>
  ), [loading, subscribeToONDC]);

  const SuccessStep = useMemo(() => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
        <Avatar sx={{ 
          width: 120, 
          height: 120, 
          mx: 'auto', 
          mb: 3,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
        }}>
          <CheckCircle sx={{ fontSize: 70 }} />
        </Avatar>
        
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#10b981', mb: 2 }}>
          🎉 Subscription Successful!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                          Your application has been successfully subscribed to the ONDC network. You can now manage your authorization headers.
        </Typography>

        {subscriptionResult && (
          <Paper sx={{ 
            p: 5, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
            border: '2px solid #10b981',
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#059669', mb: 3, textAlign: 'center' }}>
              📋 Subscription Details
            </Typography>
            
            <Grid container spacing={3} sx={{ textAlign: 'left' }}>
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Subscription ID
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', fontFamily: 'monospace' }}>
                    {subscriptionResult.subscription_id}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Status
                  </Typography>
                  <Chip 
                    label="✅ Subscribed" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      height: 32,
                      '& .MuiChip-label': { px: 2 }
                    }} 
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Environment
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#374151', textTransform: 'capitalize' }}>
                    {subscriptionResult.environment}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Registered At
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#374151' }}>
                    {new Date(subscriptionResult.registered_at).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
                )}

        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/headers')}
            startIcon={<Assignment />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Manage Headers
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              borderColor: '#10b981',
              color: '#10b981',
              '&:hover': {
                borderColor: '#059669',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
  ), [subscriptionResult, navigate]);

  const renderStepContent = useMemo(() => {
    if (subscriptionResult) {
      return SuccessStep;
    }
    
    switch (activeStep) {
      case 0:
        return PrerequisitesStep;
      case 1:
        return OperationTypeStep;
      case 2:
        return BusinessDetailsStep;
      case 3:
        return NetworkConfigurationStep;
      case 4:
        return ReviewStep;
      case 5:
        return SubmissionStep;
      default:
        return PrerequisitesStep;
    }
  }, [activeStep, subscriptionResult, PrerequisitesStep, OperationTypeStep, BusinessDetailsStep, NetworkConfigurationStep, ReviewStep, SubmissionStep, SuccessStep]);

  return (
    <Fade in timeout={600}>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 6 }}>
        
        {/* 🚨 TEMPORARY TESTING MODE BANNER */}
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
            border: '2px solid #ffc107',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            🧪 TESTING MODE ACTIVE
          </Typography>
          <Typography variant="body2">
            <strong>All form validation is currently DISABLED</strong> for testing purposes. 
            You can navigate through all steps without filling any data. 
            <strong style={{ color: '#d97706' }}> Remember to re-enable validation before production!</strong>
          </Typography>
        </Alert>

      {/* Modern Header */}
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
                <Subscriptions sx={{ fontSize: 24, color: 'white' }} />
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
                  ONDC Network Subscription
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.9,
                    fontWeight: 400,
                    color: 'white',
                  }}
                >
                  Register your application with the Open Network for Digital Commerce
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

      {/* Enhanced Step Navigation */}
      <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: 4,
            mb: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid',
            borderColor: 'divider',
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
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.id}>
                <StepLabel
                  StepIconComponent={() => (
                    <Avatar 
                      sx={{ 
                        width: 48, 
                        height: 48,
                        background: index <= activeStep 
                          ? `linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)`
                          : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                        color: 'white',
                        boxShadow: index <= activeStep 
                          ? `0 4px 20px ${step.color}40`
                          : '0 2px 10px rgba(148, 163, 184, 0.3)',
                        transform: index === activeStep ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      {index < activeStep ? (
                        <CheckCircle sx={{ fontSize: 24 }} />
                      ) : (
                        React.cloneElement(step.icon, { sx: { fontSize: 24 } })
                      )}
                    </Avatar>
                  )}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      color: index <= activeStep ? 'text.primary' : 'text.secondary',
                      mt: 1,
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      display: 'block',
                    }}
                  >
                    {step.description}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

      {/* Enhanced Step Content */}
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
            {renderStepContent}
          </CardContent>
                </Card>

      {/* Enhanced Navigation Buttons */}
      {activeStep <= 4 && !subscriptionResult && (
        <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
            }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
                sx={{ 
                  px: 6,
                  py: 1.5,
                  borderRadius: 3,
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    color: 'text.disabled',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Back
              </Button>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* 🚨 TEMPORARY: Hide key requirement warning for testing - REMOVE BEFORE PRODUCTION */}
                {/* {activeStep === 0 && (!sessionId || !keys) && (
                  <Chip
                    icon={<Warning />}
                    label="Generate keys first"
                    color="warning"
                    size="small"
                  />
                )} */}
                
                {activeStep < 4 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={false} // 🚨 TEMPORARY: Disable validation for testing - REMOVE BEFORE PRODUCTION
                    // disabled={activeStep === 0 && (!sessionId || !keys)}
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
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                        transform: 'none',
                        boxShadow: '0 4px 15px rgba(30, 60, 114, 0.2)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={subscribeToONDC}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    sx={{ 
                      px: 8,
                      py: 2,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                        transform: 'none',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {loading ? 'Subscribing to ONDC...' : 'Subscribe to ONDC Network'}
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
      )}
      </Container>
    </Fade>
  );
  };

export default ONDCSubscriber; 