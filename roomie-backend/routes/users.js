
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function (fastify, opts) {
  fastify.post('/register', async (request, reply) => {
    const { username, password } = request.body;
    if (!username || !password) {
      return reply.code(400).send({ error: 'Username and password required' });
    }

    const existing = await fastify.pg.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existing.rowCount > 0) {
      return reply.code(409).send({ error: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    await fastify.pg.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
      [username, hash]
    );
    return { status: 'registered' };
  });

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
}
