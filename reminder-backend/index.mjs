import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';


dotenv.config();
const app = express();
console.log('OpenRouter Key:', process.env.OPENROUTER_API_KEY ? 'Loaded' : 'Missing');
app.use(cors());
app.use(express.json());


import router from './routes/reminders.mjs';
app.use('/api/reminders', router);
app.use(morgan('dev')); 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
