"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { PrismaClient } from '@prisma/client';
const mockPrisma_1 = require("./services/mockPrisma");
const scraper_1 = require("./services/scraper");
dotenv_1.default.config();
const app = (0, express_1.default)();
// @ts-ignore
const prisma = new mockPrisma_1.MockPrismaClient();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express_1.default.json());
// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Trigger scrape manually (for testing)
app.post('/api/scrape', async (req, res) => {
    try {
        await (0, scraper_1.scrapeEvents)(prisma);
        res.json({ message: 'Scraping triggered successfully' });
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
