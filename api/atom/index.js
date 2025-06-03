import serverless from 'serverless-http';
import app from '../src/app.js'; // ✅ Importa tu app Express

export const handler = serverless(app);