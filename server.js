// server.js
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import config from './src/config/config.js';

const { PORT } = config;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`--- Servidor escuchando en el puerto ${PORT} ---`);
    console.log(`--- Modo: ${config.MODE} ---`);
  });
};

startServer();