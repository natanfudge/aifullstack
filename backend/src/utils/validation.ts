export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  if (!password) return false;
  return password.length >= 6;
};

export const validatePost = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) return false;
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) return false;
  if (data.isDraft !== undefined && typeof data.isDraft !== 'boolean') return false;
  return true;
};

export const validateGenerateRequest = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (!data.topic || typeof data.topic !== 'string' || data.topic.trim().length === 0) return false;
  if (data.style && typeof data.style !== 'string') return false;
  return true;
}; 