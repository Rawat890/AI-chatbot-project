import helmet from 'helmet';
import cors from 'cors';

// Helmet with frame embedding allowed (chatbot is loaded inside an iframe on other sites)
export const securityHeaders = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
  frameguard: false,
});

export const corsMiddleware = cors();