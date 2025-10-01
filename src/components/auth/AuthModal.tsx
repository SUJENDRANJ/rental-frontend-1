import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);

  // Update mode when defaultMode changes
  React.useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleClose = () => {
    onClose();
    // Don't reset mode immediately to avoid flicker
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogTitle className="sr-only">
          {mode === 'login' ? 'Login to RentHub' : 'Sign up for RentHub'}
        </DialogTitle>
        {mode === 'login' ? (
          <LoginForm
            onSwitchToSignup={() => setMode('signup')}
            onClose={handleClose}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => setMode('login')}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};