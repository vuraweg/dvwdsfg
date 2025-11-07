async forgotPassword(email: string): Promise<void> {
  console.log('AuthService: Starting forgotPassword for email:', email);

  if (!this.isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }

  // Check rate limit before sending reset email
  try {
    const { data: rateLimitCheck, error: rateLimitError } = await supabase.rpc(
      'check_password_reset_rate_limit',
      { p_email: email }
    );

    if (rateLimitError) {
      console.error('AuthService: Rate limit check error:', rateLimitError);
      // Continue even if rate limit check fails
    } else if (rateLimitCheck && !rateLimitCheck.allowed) {
      const minutes = Math.ceil(rateLimitCheck.retry_after_seconds / 60);
      throw new Error(
        `Too many password reset attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }

  // FIXED: Construct full reset password URL
  const redirectUrl = `${window.location.origin}/reset-password`;

  console.log('AuthService: Password reset redirect URL:', redirectUrl);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  // Log the attempt
  try {
    await supabase.rpc('log_password_reset_attempt', {
      p_email: email,
      p_ip_address: null,
      p_user_agent: navigator.userAgent,
      p_success: !error
    });
  } catch (logError) {
    console.warn('AuthService: Failed to log password reset attempt:', logError);
  }

  if (error) {
    console.error('AuthService: resetPasswordForEmail error:', error);
    throw new Error(error.message);
  }

  console.log('AuthService: Password reset email sent successfully to:', email);
}
