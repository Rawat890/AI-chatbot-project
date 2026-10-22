import env from './src/config/env.js';
import connectDB from './src/config/db.js';
import app from './app.js';

await connectDB();

app.listen(env.PORT, () => {
  console.log('=======================================================');
  console.log(` NEXACHAT-BOT IS LIVE ON PORT ${env.PORT}`);
  console.log(' Running API server and loading static assets...');
  console.log('=======================================================');
});