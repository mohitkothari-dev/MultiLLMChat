import { env } from '../config/env';
import { ModelType } from '../types/chat';

interface ApiResponse {
  content: string;
}

interface GroqErrorResponse {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

export async function sendMessage(model: ModelType, message: string): Promise<ApiResponse> {
  switch (model) {
    case 'llama':
      return sendGroqMessage(message, 'llama3-70b-8192');
    case 'mixtral':
      return sendGroqMessage(message, 'mixtral-8x7b-32768');
    case 'gemini':
      return sendGeminiMessage(message);
    default:
      throw new Error(`Unsupported model: ${model}`);
  }
}

async function sendGroqMessage(message: string, modelName: string): Promise<ApiResponse> {
  if (!env.GROQ_API_KEY) {
    throw new Error('Groq API key is not configured');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json() as GroqErrorResponse;
      const errorMessage = errorData.error?.message || 
                          errorData.error?.type || 
                          errorData.error?.code || 
                          response.statusText;
      throw new Error(`API error: ${errorMessage}`);
    }

    const data = await response.json();
    
    if (!data?.choices?.[0]?.message?.content) {
      console.error('Invalid response:', data);
      throw new Error('Invalid response format from API');
    }

    return { content: data.choices[0].message.content };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unexpected error from API');
  }
}

async function sendGeminiMessage(message: string): Promise<ApiResponse> {
  if (!env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid Gemini response:', data);
      throw new Error('Invalid response format from Gemini API');
    }

    return { content: data.candidates[0].content.parts[0].text };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unexpected error from Gemini API');
  }
}