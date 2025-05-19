import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import auth from '../auth.js'; // путь укажи корректно!

export default async function (fastify, opts) {
  // Регистрация с автологином
  fastify.post('/register', async (request, reply) => {
    const { username, password } = request.body;
    if (!username || !password) {
      return reply.code(400).send({ error: 'Username and password are required' });
    }
    try {
      const existing = await fastify.pg.query('SELECT * FROM users WHERE username = $1', [username]);
      if (existing.rowCount > 0) {
        return reply.code(409).send({ error: 'User already exists' });
      }
      const hash = await bcrypt.hash(password, 10);
      const res = await fastify.pg.query(
          'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
          [username, hash]
      );
      const userId = res.rows[0].id;
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return reply.code(201).send({ token });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Вход с выдачей токена
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;
    const result = await fastify.pg.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { token };
  });

    // Получение информации о пользователе
  fastify.get('/me', { preHandler: auth }, async (request, reply) => {
    const result = await fastify.pg.query('SELECT id, username FROM users WHERE id = $1', [request.user.userId]);
    return result.rows[0];
  });
}