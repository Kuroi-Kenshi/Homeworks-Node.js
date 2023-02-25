import express from 'express';
import cookeParser from 'cookie-parser';
import * as dotenv from 'dotenv'
import cors from 'cors';
import { connectToMongoDB } from './mongoose.js'
import rootRouter from './api/index.js';

const app = express();
connectToMongoDB()
dotenv.config()

app.use(express.json());
app.use(cookeParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use('/api', rootRouter);


const PORT = process.env.PORT || 5000;

const startApp = () => {
  try {
    app.listen(PORT, () => console.log(`Express server listening on ${PORT}`));
  } catch (error) {
    console.log(error)
  }
}

startApp();


