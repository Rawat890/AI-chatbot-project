import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { securityHeaders, corsMiddleware } from './src/middlewares/security.js';
import { apiLimiter } from './src/services/rateLimiter.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import routes from './src/routes/index.js';

// __dirname does not exist in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & middleware
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(express.json());
app.use('/api/', apiLimiter);

// Static assets (widget.js)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', routes);

// SPA frontend (served when built)
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendBuildPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('NexaChat-Bot Backend running. Frontend dist not detected. Use npm run dev for dev environments.');
    }
  });
});

app.use(errorHandler);

export default app;