import React from 'react';
import toast from 'react-hot-toast';
import { 
  CheckCircle, 
  Error, 
  Warning, 
  Info, 
  ContentCopy,
  Download,
  Upload,
  Security,
  Key,
  Refresh
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

// Custom toast component with icon and styling
const CustomToast: React.FC<{
  icon: React.ReactNode;
  title: string;
  message?: string;
  gradient: string;
}> = ({ icon, title, message, gradient }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 2,
      minWidth: '300px',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${gradient})`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        flexShrink: 0,
      }}
    >
      {React.cloneElement(icon as React.ReactElement, {
        sx: { fontSize: 20, color: 'white' }
      })}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: 1.4,
          mb: message ? 0.5 : 0,
          color: 'white',
        }}
      >
        {title}
      </Typography>
      {message && (
        <Typography
          variant="body2"
          sx={{
            fontSize: '13px',
            opacity: 0.8,
            lineHeight: 1.3,
            color: 'white',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  </Box>
);

// Enhanced toast utilities
export const enhancedToast = {
  // Success toasts
  success: (title: string, message?: string) => {
    return toast(
      <CustomToast
        icon={<CheckCircle />}
        title={title}
        message={message}
        gradient="#10b981, #059669"
      />,
      {
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
          padding: '16px',
        },
      }
    );
  },

  // Error toasts
  error: (title: string, message?: string) => {
    return toast.error(
      <CustomToast
        icon={<Error />}
        title={title}
        message={message}
        gradient="#ef4444, #dc2626"
      />,
      {
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#ffffff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
          padding: '16px',
        },
      }
    );
  },

  // Warning toasts
  warning: (title: string, message?: string) => {
    return toast(
      <CustomToast
        icon={<Warning />}
        title={title}
        message={message}
        gradient="#f59e0b, #d97706"
      />,
      {
        style: {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
          padding: '16px',
        },
      }
    );
  },

  // Info toasts
  info: (title: string, message?: string) => {
    return toast(
      <CustomToast
        icon={<Info />}
        title={title}
        message={message}
        gradient="#3b82f6, #1d4ed8"
      />,
      {
        style: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: '#ffffff',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
          padding: '16px',
        },
      }
    );
  },

  // Loading toasts
  loading: (title: string, message?: string) => {
    return toast.loading(
      <CustomToast
        icon={<Refresh />}
        title={title}
        message={message}
        gradient="#6366f1, #4f46e5"
      />,
      {
        style: {
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#ffffff',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
          padding: '16px',
        },
      }
    );
  },

  // Specialized toasts for ONDC app
  keyGenerated: () => {
    return toast(
      <CustomToast
        icon={<Key />}
        title="Keys Generated Successfully!"
        message="Cryptographic keys are ready for ONDC integration"
        gradient="#10b981, #059669"
      />,
      {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          padding: '16px',
        },
      }
    );
  },

  copied: (item: string) => {
    return toast(
      <CustomToast
        icon={<ContentCopy />}
        title={`${item} Copied!`}
        message="Successfully copied to clipboard"
        gradient="#10b981, #059669"
      />,
      {
        duration: 2000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          padding: '16px',
        },
      }
    );
  },

  downloaded: (item: string) => {
    return toast(
      <CustomToast
        icon={<Download />}
        title={`${item} Downloaded!`}
        message="File saved successfully"
        gradient="#10b981, #059669"
      />,
      {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          padding: '16px',
        },
      }
    );
  },

  deployed: () => {
    return toast(
      <CustomToast
        icon={<Upload />}
        title="Deployment Successful!"
        message="Your ONDC endpoints are now live"
        gradient="#10b981, #059669"
      />,
      {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          padding: '16px',
        },
      }
    );
  },

  subscribed: () => {
    return toast(
      <CustomToast
        icon={<CheckCircle />}
        title="ONDC Subscription Complete!"
        message="You're now registered with ONDC network"
        gradient="#10b981, #059669"
      />,
      {
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          padding: '16px',
        },
      }
    );
  },

  secured: () => {
    return toast(
      <CustomToast
        icon={<Security />}
        title="Security Validated!"
        message="All tests passed successfully"
        gradient="#10b981, #059669"
      />,
      {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          padding: '16px',
        },
      }
    );
  },

  // Promise toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: (
        <CustomToast
          icon={<Refresh />}
          title={loading}
          gradient="#6366f1, #4f46e5"
        />
      ),
      success: (
        <CustomToast
          icon={<CheckCircle />}
          title={success}
          gradient="#10b981, #059669"
        />
      ),
      error: (
        <CustomToast
          icon={<Error />}
          title={error}
          gradient="#ef4444, #dc2626"
        />
      ),
    }, {
      style: {
        padding: '16px',
      }
    });
  },
};

// Re-export the original toast for backward compatibility
export { toast };

// Default export
export default enhancedToast; 