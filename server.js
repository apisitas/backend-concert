import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import concertsRouter from './routes/concerts.js';
import reservationsRouter from './routes/reservations.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/concerts', concertsRouter(prisma));
app.use('/reservations', reservationsRouter(prisma));

app.listen(3001, () => console.log('Backend running on port 3001'));
