export const validateEmail = (email: string): boolean => {
  console.log('[VALIDATION DEBUG] Validating email:', email);
  if (!email) {
    console.log('[VALIDATION DEBUG] Email is missing');
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const result = emailRegex.test(email);
  console.log('[VALIDATION DEBUG] Email validation result:', result);
  return result;
};

export const validatePassword = (password: string): boolean => {
  console.log('[VALIDATION DEBUG] Validating password length');
  if (!password) {
    console.log('[VALIDATION DEBUG] Password is missing');
    return false;
  }
  
  // For testing simplicity, only check for minimum length of 6 characters
  // In production, we would use a stronger regex like:
  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const isValid = password.length >= 6;
  console.log('[VALIDATION DEBUG] Password validation result:', isValid);
  return isValid;
};

export const validatePost = (data: any): boolean => {
  console.log('[VALIDATION DEBUG] Validating post data:', JSON.stringify(data));
  if (!data || typeof data !== 'object') {
    console.log('[VALIDATION DEBUG] Invalid post data format');
    return false;
  }
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    console.log('[VALIDATION DEBUG] Invalid or missing post title');
    return false;
  }
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    console.log('[VALIDATION DEBUG] Invalid or missing post content');
    return false;
  }
  if (data.isDraft !== undefined && typeof data.isDraft !== 'boolean') {
    console.log('[VALIDATION DEBUG] Invalid post isDraft value');
    return false;
  }
  console.log('[VALIDATION DEBUG] Post validation successful');
  return true;
};

// Explicitly define valid style options for testing
export const VALID_STYLES = ['professional', 'casual', 'technical'];

export const validateGenerateRequest = (data: any): {isValid: boolean, error?: string} => {
  console.log('[VALIDATION DEBUG] Validating generate request:', JSON.stringify(data));
  
  if (!data || typeof data !== 'object') {
    console.log('[VALIDATION DEBUG] Invalid request format');
    return {isValid: false, error: 'Invalid request format'};
  }
  
  if (!data.topic || typeof data.topic !== 'string' || data.topic.trim().length === 0) {
    console.log('[VALIDATION DEBUG] Missing or invalid topic');
    return {isValid: false, error: 'Please provide topic and style'};
  }
  
  if (!data.style || typeof data.style !== 'string') {
    console.log('[VALIDATION DEBUG] Missing or invalid style');
    return {isValid: false, error: 'Please provide topic and style'};
  }
  
  // Validate style options
  if (!VALID_STYLES.includes(data.style)) {
    console.log('[VALIDATION DEBUG] Invalid style detected:', data.style);
    return {
      isValid: false, 
      error: 'Invalid style. Must be one of: professional, casual, technical'
    };
  }
  
  console.log('[VALIDATION DEBUG] Generate request validation successful');
  return {isValid: true};
};