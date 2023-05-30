import 'dotenv/config';

type Config = {
  OPENAI_BYPASS_URL: string;
  LOCALE: string;
  SOCKET_API_URL: string;
  SOCKET_API_KEY: string;
  OPENAI_ACCESS_TOKEN?: string;
};

export const config: Config = {
  LOCALE: process.env.LOCALE || 'pt_BR',
  SOCKET_API_URL: process.env.SOCKET_API_URL,
  SOCKET_API_KEY: process.env.SOCKET_API_KEY,
  OPENAI_ACCESS_TOKEN: process.env.OPENAI_ACCESS_TOKEN,
  OPENAI_BYPASS_URL: process.env.OPENAI_BYPASS_URL,
};

if (!config.SOCKET_API_URL || !config.SOCKET_API_KEY) {
  throw new Error('Missing SOCKET_API_URL or SOCKET_API_KEY environment variables.');
}

if (!config.OPENAI_ACCESS_TOKEN || !config.OPENAI_BYPASS_URL) {
  console.warn('Missing OPENAI_ACCESS_TOKEN environment variables.');
  console.warn('Missing OPENAI_BYPASS_URL environment variables.');
}
