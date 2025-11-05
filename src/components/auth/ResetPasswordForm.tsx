// src/components/auth/ResetPasswordForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number')
    .regex(/(?=.*[@$!%*?&])/, 'Password must contain at least one special character (@$!%*?&)'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onSuccess: () => void;
  onBackToLogin?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSuccess, onBackToLogin }) => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await resetPassword(data.password);
      setSuccessMessage('Password reset successful! You are now logged in.');

      // Wait a moment to show the success message, then call onSuccess
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = (password: string) => {
    if (!password) return 'bg-gray-200';
    const hasLength = password.length >= 8;
    const hasLower = /(?=.*[a-z])/.test(password);
    const hasUpper = /(?=.*[A-Z])/.test(password);
    const hasNumber = /(?=.*\d)/.test(password);
    const hasSpecial = /(?=.*[@$!%*?&])/.test(password);

    const strength = [hasLength, hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Enter your new password below.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start dark:bg-red-900/20 dark:border-red-500/50">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start dark:bg-green-900/20 dark:border-green-500/50">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
          <p className="text-green-700 dark:text-green-300 text-sm font-medium">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New Password Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="Enter your new password"
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 text-gray-900 placeholder-gray-400 dark:bg-dark-200 dark:border-dark-300 dark:text-gray-100 dark:placeholder-gray-500 ${
                errors.password
                  ? 'border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-900/20'
                  : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white dark:focus:bg-dark-100'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.password.message}
            </p>
          )}

          {/* Password Strength Indicator */}
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-dark-300 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getPasswordStrengthColor(
                    register('password').value || ''
                  )}`}
                  style={{
                    width: `${
                      ((register('password').value || '').length >= 8 ? 20 : 0) +
                      (/(?=.*[a-z])/.test(register('password').value || '') ? 20 : 0) +
                      (/(?=.*[A-Z])/.test(register('password').value || '') ? 20 : 0) +
                      (/(?=.*\d)/.test(register('password').value || '') ? 20 : 0) +
                      (/(?=.*[@$!%*?&])/.test(register('password').value || '') ? 20 : 0)
                    }%`,
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Password strength: {
                [
                  (register('password').value || '').length >= 8,
                  /(?=.*[a-z])/.test(register('password').value || ''),
                  /(?=.*[A-Z])/.test(register('password').value || ''),
                  /(?=.*\d)/.test(register('password').value || ''),
                  /(?=.*[@$!%*?&])/.test(register('password').value || '')
                ].filter(Boolean).length === 5 ? 'Strong' :
                [
                  (register('password').value || '').length >= 8,
                  /(?=.*[a-z])/.test(register('password').value || ''),
                  /(?=.*[A-Z])/.test(register('password').value || ''),
                  /(?=.*\d)/.test(register('password').value || ''),
                  /(?=.*[@$!%*?&])/.test(register('password').value || '')
                ].filter(Boolean).length >= 3 ? 'Medium' : 'Weak'
              }
            </p>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="Confirm your new password"
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 text-gray-900 placeholder-gray-400 dark:bg-dark-200 dark:border-dark-300 dark:text-gray-100 dark:placeholder-gray-500 ${
                errors.confirmPassword
                  ? 'border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-900/20'
                  : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white dark:focus:bg-dark-100'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Password Requirements:
          </p>
          <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
            <li className="flex items-center">
              <span className="mr-2">•</span>
              At least 8 characters long
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Contains uppercase and lowercase letters
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Contains at least one number
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Contains at least one special character (@$!%*?&)
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 active:scale-[0.98] shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Resetting Password...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Reset Password</span>
            </>
          )}
        </button>
      </form>

      {onBackToLogin && (
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
      )}
    </div>
  );
};
