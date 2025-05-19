import jwt from 'jsonwebtoken';

export default async function (request, reply) {
    const auth = request.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'No token' });
    }
    const token = auth.replace('Bearer ', '');
    try {
        request.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return reply.code(401).send({ error: 'Invalid token' });
    }
}