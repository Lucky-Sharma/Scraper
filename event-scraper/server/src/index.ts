import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
// import { MockPrismaClient as PrismaClient } from './services/mockPrisma';
import { scrapeEvents } from './services/scraper';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Trigger scrape manually (for testing)
app.post('/api/scrape', async (req, res) => {
    try {
        await scrapeEvents(prisma);
        res.json({ message: 'Scraping triggered successfully' });
    } catch (error) {
        console.error('Scrape failed:', error);
        res.status(500).json({ error: 'Scraping failed' });
    }
});

// Get events
app.get('/api/events', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: { status: { not: 'INACTIVE' } },
            orderBy: { date: 'asc' }
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
