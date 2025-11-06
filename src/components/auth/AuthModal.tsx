// src/components/auth/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { useAuth } from '../../contexts/AuthContext';

type AuthView =
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'success'
  | 'postSignupPrompt'
  | 'reset_password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
  onProfileFillRequest?: (mode?: 'profile' | 'wallet') => void;
  onPromptDismissed?: () => void;
  isRecoveryMode?: boolean; // NEW
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = 'login',
  onProfileFillRequest = () => {},
  onPromptDismissed = () => {},
  isRecoveryMode = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>(initialView);
  const [signupEmail, setSignupEmail] = useState<string>('');

  useEffect(() => {
    console.log(
      'AuthModal isOpen changed:',
      isOpen,
      'initialView:',
      initialView,
      'isRecoveryMode:',
      isRecoveryMode
    );

    if (isOpen && initialView !== currentView) {
      setCurrentView(initialView);
    }

    if (!isOpen && currentView === 'postSignupPrompt') {
      onPromptDismissed();
      setCurrentView('login');
    }

    // Reset view only if modal closes normally (not during recovery)
    if (!isOpen && !isRecoveryMode) {
      setCurrentView('login');
    }
  }, [isOpen, initialView, currentView, onPromptDismissed, isRecoveryMode]);

  // ✅ FIXED useEffect to prevent modal closure during recovery flow
  useEffect(() => {
    console.log(
      'AuthModal useEffect running:',
      'isAuthenticated:',
      isAuthenticated,
      'user:',
      user,
      'isOpen:',
      isOpen,
      'currentView:',
      currentView,
      'isRecoveryMode:',
      isRecoveryMode
    );

    // Skip auto-close logic for password recovery views
    if (['forgot-password', 'reset_password', 'success'].includes(currentView)) {
      console.log('Skipping auto-close logic for recovery flow.');
      return;
    }

    // Skip auto-close in recovery mode reset flow
    if (isRecoveryMode && currentView === 'reset_password') {
      console.log('In recovery mode, skipping auto-close logic.');
      return;
    }

    // Wait for user profile prompt flag
    if (
      isAuthenticated &&
      user &&
      (user.hasSeenProfilePrompt === null ||
        user.hasSeenProfilePrompt === undefined)
    ) {
      console.log('Waiting for user profile prompt info...');
      return;
    }

    // User authenticated but profile incomplete
    if (isAuthenticated && user && user.hasSeenProfilePrompt === false && isOpen) {
      console.log('Opening profile management...');
      onProfileFillRequest('profile');
      onClose();
    }

    // User authenticated and profile complete
    else if (
      isAuthenticated &&
      user &&
      user.hasSeenProfilePrompt === true &&
      isOpen &&
      !isRecoveryMode
    ) {
      console.log('Closing AuthModal after login...');
      onClose();
    }
  }, [
    isAuthenticated,
    user,
    isOpen,
    onClose,
    onProfileFillRequest,
    currentView,
    isRecoveryMode
  ]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (currentView) {
      case 'login':
        return 'Welcome Back';
      case 'signup':
        return 'Join Resume Optimizer';
      case 'forgot-password':
        return 'Reset Password';
      case 'reset_password':
        return 'Reset Your Password';
      case 'success':
        return 'Success!';
      case 'postSignupPrompt':
        return 'Account Created!';
      default:
        return 'Authentication';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm dark:bg-black/80">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 flex flex-col dark:bg-dark-100 dark:border-dark-300">
        {/* Header */}
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

        {/* Body */}
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
