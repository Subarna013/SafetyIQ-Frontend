// Configuration — update these URLs after deploying to Render/Railway
export const CONFIG = {
  // For local development
  // API_URL: 'http://localhost:8000',
  // WS_URL: 'ws://localhost:8000/ws',

  // For production (update with your Render URL after deploy)
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
};
