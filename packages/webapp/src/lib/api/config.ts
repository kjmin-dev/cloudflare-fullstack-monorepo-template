type Environment = 'development' | 'staging' | 'production';

interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

const API_CONFIG: Record<Environment, ApiConfig> = {
  development: {
    baseUrl: import.meta.env.VITE_API_HOST ?? 'http://localhost:8787',
    timeout: 30000,
  },
  staging: {
    // @TODO: change to staging api
    baseUrl: import.meta.env.VITE_API_HOST ?? 'https://api.kjmin-dev-cf-playground.workers.dev',
    timeout: 15000,
  },
  production: {
    baseUrl: import.meta.env.VITE_API_HOST ?? 'https://api.kjmin-dev-cf-playground.workers.dev',
    timeout: 10000,
  },
};

function getEnvironment(): Environment {
  const env = import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE;

  if (env === 'staging') return 'staging';
  if (env === 'production') return 'production';
  return 'development';
}

export function getApiConfig(): ApiConfig {
  return API_CONFIG[getEnvironment()];
}

export function getApiBaseUrl(): string {
  return getApiConfig().baseUrl;
}

export { type ApiConfig, type Environment };
