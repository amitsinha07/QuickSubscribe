// Toast Examples - How to use the enhanced toast system
// Import this in any component where you want to use toasts

import enhancedToast from './toast';

// Basic toast types
export const showToastExamples = () => {
  
  // Basic success toast
  enhancedToast.success('Operation Successful!');
  
  // Success with message
  enhancedToast.success('Data Saved', 'Your changes have been saved successfully');
  
  // Error toast
  enhancedToast.error('Something went wrong!');
  
  // Error with details
  enhancedToast.error('Network Error', 'Unable to connect to the server. Please try again.');
  
  // Warning toast
  enhancedToast.warning('Missing Information', 'Please fill in all required fields');
  
  // Info toast
  enhancedToast.info('Pro Tip', 'You can use keyboard shortcuts to speed up your workflow');
  
  // Loading toast
  const loadingToastId = enhancedToast.loading('Processing', 'Please wait while we process your request...');
  
  // Specialized ONDC toasts
  enhancedToast.keyGenerated();
  enhancedToast.copied('Private Key');
  enhancedToast.downloaded('Configuration File');
  enhancedToast.deployed();
  enhancedToast.subscribed();
  enhancedToast.secured();
  
  // Promise toast for async operations
  const asyncOperation = new Promise((resolve) => {
    setTimeout(() => resolve('Success!'), 2000);
  });
  
  enhancedToast.promise(asyncOperation, {
    loading: 'Processing your request...',
    success: 'Operation completed successfully!',
    error: 'Something went wrong!'
  });
};

// Usage examples in components:

/*
// Import in your component
import enhancedToast from '../utils/toast';

// In your component functions:
const handleSave = async () => {
  try {
    enhancedToast.loading('Saving data...');
    await saveData();
    enhancedToast.success('Saved!', 'Your data has been saved successfully');
  } catch (error) {
    enhancedToast.error('Save Failed', 'Unable to save your data. Please try again.');
  }
};

const handleCopy = () => {
  navigator.clipboard.writeText(someText);
  enhancedToast.copied('Text');
};

const handleKeyGeneration = async () => {
  const keys = await generateKeys();
  enhancedToast.keyGenerated();
};
*/ 