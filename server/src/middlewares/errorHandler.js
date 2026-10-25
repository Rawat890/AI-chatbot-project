export const errorHandler = (err, req, res, next) => {
  console.error('[ERROR] Unhandled exception:', err);
  res.status(500).json({ error: 'Internal server error.' });
};