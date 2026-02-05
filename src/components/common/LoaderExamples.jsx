// USAGE EXAMPLES - How to use CommonLoader.jsx

import React, { useState, useEffect } from 'react';
import CommonLoader from './CommonLoader';

// ============================================
// EXAMPLE 1: Email Sync Loader (Most Common)
// ============================================

export const EmailSyncExample = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      // Your API call
      await fetch('/api/emails/sync', { method: 'POST' });
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div>
      <button onClick={handleSync}>
        Sync Emails
      </button>

      <CommonLoader
        isVisible={isSyncing}
        type="email"
        message="Syncing emails..."
        subtitle="Please wait while we fetch your emails"
      />
    </div>
  );
};

// ============================================
// EXAMPLE 2: Progress Bar for Bulk Operations
// ============================================

export const BulkSendExample = () => {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(0);
  const [total, setTotal] = useState(0);

  const sendBulkEmails = async (emails) => {
    setIsSending(true);
    setTotal(emails.length);
    setSent(0);

    for (let i = 0; i < emails.length; i++) {
      await sendEmail(emails[i]);
      setSent(i + 1);
    }

    setIsSending(false);
  };

  return (
    <div>
      <button onClick={() => sendBulkEmails([1, 2, 3, 4, 5])}>
        Send 5 Emails
      </button>

      <CommonLoader
        isVisible={isSending}
        type="progress"
        message="Sending emails..."
        current={sent}
        total={total}
      />
    </div>
  );
};

// ============================================
// EXAMPLE 3: Multi-Step Process
// ============================================

export const MailboxSetupExample = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const connectMailbox = async () => {
    setIsConnecting(true);

    const steps = [
      'Validating credentials',
      'Connecting to IMAP server',
      'Testing SMTP connection',
      'Finalizing setup'
    ];

    for (let i = 1; i <= steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setIsConnecting(false);
  };

  return (
    <div>
      <button onClick={connectMailbox}>
        Connect Mailbox
      </button>

      <CommonLoader
        isVisible={isConnecting}
        type="steps"
        currentStep={currentStep}
        steps={[
          'Validating credentials',
          'Connecting to IMAP server',
          'Testing SMTP connection',
          'Finalizing setup'
        ]}
      />
    </div>
  );
};

// ============================================
// EXAMPLE 4: Simple Loader for Page Load
// ============================================

export const PageLoadExample = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <CommonLoader
        isVisible={isLoading}
        type="simple"
        message="Loading..."
      />

      {!isLoading && (
        <div>Your content here</div>
      )}
    </>
  );
};

// ============================================
// EXAMPLE 5: All Loader Types Demo
// ============================================

export const AllLoadersDemo = () => {
  const [activeLoader, setActiveLoader] = useState(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);

  const showLoader = (type) => {
    setActiveLoader(type);
    setProgress(0);
    setStep(1);

    // Simulate progress
    if (type === 'progress') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setActiveLoader(null), 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } else if (type === 'steps') {
      const interval = setInterval(() => {
        setStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            setTimeout(() => setActiveLoader(null), 1000);
            return 4;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setTimeout(() => setActiveLoader(null), 3000);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Full Page Syncing Loaders</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <button 
          onClick={() => showLoader('email')}
          style={buttonStyle}
        >
          Email Sync Loader
        </button>

        <button 
          onClick={() => showLoader('minimal')}
          style={buttonStyle}
        >
          Minimal Loader
        </button>

        <button 
          onClick={() => showLoader('progress')}
          style={buttonStyle}
        >
          Progress Bar
        </button>

        <button 
          onClick={() => showLoader('cloud')}
          style={buttonStyle}
        >
          Cloud Loader
        </button>

        <button 
          onClick={() => showLoader('dots')}
          style={buttonStyle}
        >
          Dots Wave
        </button>

        <button 
          onClick={() => showLoader('glass')}
          style={buttonStyle}
        >
          Glassmorphism
        </button>

        <button 
          onClick={() => showLoader('simple')}
          style={buttonStyle}
        >
          Simple Loader
        </button>

        <button 
          onClick={() => showLoader('steps')}
          style={buttonStyle}
        >
          Multi-Step
        </button>
      </div>

      {/* All Loaders */}
      <CommonLoader
        isVisible={activeLoader === 'email'}
        type="email"
        message="Syncing emails..."
        subtitle="Fetching from all mailboxes"
      />

      <CommonLoader
        isVisible={activeLoader === 'minimal'}
        type="minimal"
        message="Syncing..."
      />

      <CommonLoader
        isVisible={activeLoader === 'progress'}
        type="progress"
        message="Processing emails..."
        current={progress}
        total={100}
      />

      <CommonLoader
        isVisible={activeLoader === 'cloud'}
        type="cloud"
        message="Syncing to cloud..."
      />

      <CommonLoader
        isVisible={activeLoader === 'dots'}
        type="dots"
        message="Please wait..."
      />

      <CommonLoader
        isVisible={activeLoader === 'glass'}
        type="glass"
        message="Syncing emails..."
        subtitle="This won't take long"
      />

      <CommonLoader
        isVisible={activeLoader === 'simple'}
        type="simple"
        message="Loading..."
      />

      <CommonLoader
        isVisible={activeLoader === 'steps'}
        type="steps"
        currentStep={step}
        steps={[
          'Connecting to servers',
          'Fetching emails',
          'Processing data',
          'Almost done'
        ]}
      />
    </div>
  );
};

const buttonStyle = {
  padding: '1rem',
  background: '#10B981',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: '600',
  transition: 'all 0.3s ease'
};

// Helper function to simulate API call
const sendEmail = (email) => {
  return new Promise(resolve => setTimeout(resolve, 500));
};

// ============================================
// QUICK REFERENCE
// ============================================

/*

AVAILABLE LOADER TYPES:
------------------------
1. 'email'    - Email sync with animated envelope
2. 'minimal'  - Dark minimal spinner
3. 'progress' - Progress bar with percentage
4. 'cloud'    - Cloud upload animation
5. 'dots'     - Wave dots animation
6. 'glass'    - Glassmorphism effect
7. 'simple'   - Basic spinner
8. 'steps'    - Multi-step progress

PROPS:
------
isVisible: boolean (required)
type: string (required) - see types above
message: string (default: 'Syncing emails...')
subtitle: string (optional)
current: number (for 'progress' type)
total: number (for 'progress' type)
currentStep: number (for 'steps' type)
steps: array of strings (for 'steps' type)

*/