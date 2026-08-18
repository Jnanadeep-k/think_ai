export function getLoginErrorMessage(message) {
  if (!message) return null;

  const lower = message.toLowerCase();

  if (lower.includes('invalid email or password')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (lower.includes('valid email')) {
    return 'Please enter a valid email address.';
  }
  if (lower.includes('password') && lower.includes('required')) {
    return 'Please enter your password.';
  }
  if (lower.includes('email') && lower.includes('required')) {
    return 'Please enter your email.';
  }
  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return 'Unable to reach the server. Please check your connection and try again.';
  }

  // Fallback: show the backend's message as-is, cleaned up
  return message;
}

export function getRegisterErrorMessage(message) {
  if (!message) return null;

  const lower = message.toLowerCase();

  if (lower.includes('already registered')) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (lower.includes('valid email')) {
    return 'Please enter a valid email address.';
  }
  if (lower.includes('password must be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (lower.includes('name') && lower.includes('required')) {
    return 'Please enter your full name.';
  }
  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return 'Unable to reach the server. Please check your connection and try again.';
  }

  return message;
}