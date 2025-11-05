// src/components/auth/ForgotPasswordForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle, CheckCircle, Loader2, ArrowLeft, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin, onSuccess }) => {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Countdown effect for rate limit
  useEffect(() => {
    if (retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => {
          if (prev <= 1) {
            setIsRateLimited(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  const onSubmit = async (data: ForgotPasswordData) => {
    if (isRateLimited) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await forgotPassword({ email: data.email });
      setSuccessMessage('Password reset email sent! Please check your inbox and spam folder.');
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong.';

      // Check if it's a rate limit error
      if (errorMessage.includes('Too many password reset attempts')) {
        setIsRateLimited(true);
        // Extract minutes from error message
        const match = errorMessage.match(/(\d+) minute/);
        if (match) {
          const minutes = parseInt(match[1]);
          setRetryAfter(minutes * 60);
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Enter your email to receive a reset link.</p>
      </div>

      {/* Security info box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start dark:bg-blue-900/20 dark:border-blue-500/30">
        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium mb-1">Secure Password Reset</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            The reset link will expire in 1 hour. For security, you can only request 3 resets per 15 minutes.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start dark:bg-red-900/20 dark:border-red-500/50">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      {isRateLimited && retryAfter > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start dark:bg-yellow-900/20 dark:border-yellow-500/30">
          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-yellow-700 dark:text-yellow-300 font-medium mb-1">Rate limit reached</p>
            <p className="text-yellow-600 dark:text-yellow-400 text-xs">
              Please wait {formatTime(retryAfter)} before requesting another reset.
            </p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-start dark:bg-green-900/20 dark:border-green-500/50">
          <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium dark:text-green-300">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 text-gray-900 placeholder-gray-400 dark:bg-dark-200 dark:border-dark-300 dark:text-gray-100 dark:placeholder-gray-500 ${
                errors.email ? 'border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-900/20' : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white dark:focus:bg-dark-100'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || isRateLimited}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            isLoading || isRateLimited
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 active:scale-[0.98] shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : isRateLimited ? (
            <>
              <Clock className="w-5 h-5" />
              <span>Wait {formatTime(retryAfter)}</span>
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              <span>Send Reset Link</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-6 border-t border-gray-100 dark:border-dark-300">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline flex items-center justify-center mx-auto dark:text-neon-cyan-400 dark:hover:text-neon-cyan-300"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Sign In
        </button>
      </div>
    </div>
  );
};