import express from 'express';

export default (prisma) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        const concerts = await prisma.concert.findMany();
        res.json(concerts);
    });

    router.post('/', async (req, res) => {
        const { name, description, totalSeats } = req.body;
        if (!name || !totalSeats) return res.status(400).json({ error: 'Missing required fields' });
        const concert = await prisma.concert.create({ data: { name, description, totalSeats } });
        res.json(concert);
    });

    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        await prisma.concert.delete({ where: { id } });
        res.json({ message: 'Deleted' });
    });

    return router;
};
