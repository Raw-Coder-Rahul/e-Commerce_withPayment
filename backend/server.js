import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
dotenv.config({ path: 'backend/config/.env' });
const PORT = process.env.PORT || 3000;

connectDB();

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception`);
  process.exit(1);
})

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});

export default server;