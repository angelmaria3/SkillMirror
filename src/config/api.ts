// API Configuration
export const API_CONFIG = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-3.5-turbo'
  },
  groq: {
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
    model: 'llama3-70b-8192'
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-pro'
  }
};

export const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'openai';

export const getAPIConfig = () => {
  const config = API_CONFIG[AI_PROVIDER as keyof typeof API_CONFIG];
  
  if (!config?.apiKey) {
    throw new Error(`API key not found for provider: ${AI_PROVIDER}. Please check your .env file.`);
  }
  
  return config;
};