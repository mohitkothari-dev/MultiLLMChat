interface EnvConfig {
  GROQ_API_KEY: string;
  GEMINI_API_KEY: string;
}

export const env: EnvConfig = {
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY,
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
};

// Validate environment variables
const validateEnv = () => {
  const required = ['GROQ_API_KEY', 'GEMINI_API_KEY'];
  const missing = required.filter(key => !env[key as keyof EnvConfig]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
};

// Run validation
validateEnv();