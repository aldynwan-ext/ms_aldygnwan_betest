import express, { Application } from 'express';
import userRoutes from './routes/userRoutes';
import { connectToDatabase } from './database';
import { corsMiddleware } from '../corsMiddleware';

const app: Application = express();

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    app.use(express.json());
    app.use(corsMiddleware);
  })
  .then(() => {
    // Routes
    app.use('/users', userRoutes);
  })
  .then(() => {
    // Running port
    const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });

  export default app;