import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import db from './db.js';

dotenv.config();
const fastify = Fastify();

await fastify.register(cors, { origin: true });
fastify.decorate('pg', db);
await fastify.register(userRoutes);

fastify.get('/', async () => ({ status: 'OK' }));

fastify.listen({ port: process.env.PORT });
