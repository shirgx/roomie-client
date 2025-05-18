import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function (fastify, opts) {
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

      const passwordHash = await bcrypt.hash(password, 10);
      const insertResult = await fastify.pg.query(
          'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
          [username, passwordHash]
      );

      const userId = insertResult.rows[0].id;
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

      return reply.code(201).send({ token });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}