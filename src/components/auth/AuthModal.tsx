// src/components/auth/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { useAuth } from '../../contexts/AuthContext';

type AuthView = 'login' | 'signup' | 'forgot-password' | 'success' | 'postSignupPrompt' | 'reset_password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
  onProfileFillRequest?: (mode?: 'profile' | 'wallet') => void;
  onPromptDismissed?: () => void;
  isRecoveryMode?: boolean; // NEW: Add recovery mode flag
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = 'login',
  onProfileFillRequest = () => {},
  onPromptDismissed = () => {},
  isRecoveryMode = false // NEW: Default to false
}) => {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>(initialView);
  const [signupEmail, setSignupEmail] = useState<string>('');

  useEffect(() => {
    console.log('AuthModal isOpen prop changed:', isOpen, 'initialView:', initialView, 'isRecoveryMode:', isRecoveryMode);
    
    // Update currentView when initialView changes and modal opens
    if (isOpen && initialView !== currentView) {
      setCurrentView(initialView);
    }
    
    if (!isOpen && currentView === 'postSignupPrompt') {
      onPromptDismissed();
      setCurrentView('login');
    }
    // When the modal closes, reset the view to login (unless in recovery mode)
    if (!isOpen && !isRecoveryMode) {
      setCurrentView('login');
    }
  }, [isOpen, initialView, currentView, onPromptDismissed, isRecoveryMode]);

  useEffect(() => {
    console.log('AuthModal useEffect: Running. isAuthenticated:', isAuthenticated, 'user:', user, 'isOpen:', isOpen, 'currentView:', currentView, 'isRecoveryMode:', isRecoveryMode);

    // MODIFIED: Skip auto-close logic if in recovery mode showing reset password
    if (isRecoveryMode && currentView === 'reset_password') {
      console.log('AuthModal useEffect: In recovery mode with reset_password view, skipping auto-close logic.');
      return;
    }

    // Wait until authentication state and user profile are fully loaded
    if (isAuthenticated && user && (user.hasSeenProfilePrompt === null || user.hasSeenProfilePrompt === undefined)) {
      console.log('AuthModal useEffect: User authenticated, but profile prompt status not yet loaded. Waiting...');
      return;
    }

    // If user is authenticated and profile is incomplete (hasSeenProfilePrompt is false)
    if (isAuthenticated && user && user.hasSeenProfilePrompt === false && isOpen) {
      console.log('AuthModal useEffect: User authenticated and profile incomplete, opening UserProfileManagement.');
      onProfileFillRequest('profile');
      onClose();
    } else if (isAuthenticated && user && user.hasSeenProfilePrompt === true && isOpen && !isRecoveryMode) {
      console.log('AuthModal useEffect: User authenticated and profile complete, ensuring AuthModal is closed.');
      onClose();
    } else if (!isAuthenticated && isOpen) {
      console.log('AuthModal useEffect: User not authenticated and modal is open. Ensuring login/signup view.');
    }
  }, [isAuthenticated, user, isOpen, onClose, onProfileFillRequest, currentView, isRecoveryMode]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (currentView) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Join Resume Optimizer';
      case 'forgot-password': return 'Reset Password';
      case 'reset_password': return 'Reset Your Password';
      case 'success': return 'Success!';
      case 'postSignupPrompt': return 'Account Created!';
      default: return 'Authentication';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm dark:bg-black/80">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 flex flex-col dark:bg-dark-100 dark:border-dark-300">
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-100 dark:from-dark-200 dark:to-dark-300">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-white/50 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-dark-300/50"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="bg-gradient-to-br from-neon-cyan-500 to-neon-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {getTitle()}
            </h1>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {currentView === 'login' && (
            <LoginForm
              onSwitchToSignup={() => setCurrentView('signup')}
              onForgotPassword={() => setCurrentView('forgot-password')}
            />
          )}

          {currentView === 'signup' && (
            <SignupForm
              onSwitchToLogin={() => setCurrentView('login')}
              onSignupSuccess={(needsVerification: boolean, email: string) => {
                setSignupEmail(email);
                if (needsVerification) {
                  setCurrentView('success');
                } else {
                  setCurrentView('postSignupPrompt');
                }
              }}
            />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPasswordForm
              onBackToLogin={() => setCurrentView('login')}
              onSuccess={() => {
                setCurrentView('success');
                setTimeout(() => {
                  onClose();
                  setCurrentView('login');
                }, 2500);
              }}
            />
          )}

          {currentView === 'reset_password' && (
            <ResetPasswordForm
              onSuccess={() => {
                setCurrentView('login');
                setSignupEmail('');
                // Close the modal after password reset success
                setTimeout(() => {
                  onClose();
                }, 1500);
              }}
              onBackToLogin={() => {
                setCurrentView('login');
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
