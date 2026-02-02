"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeEvents = scrapeEvents;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
// import { PrismaClient } from '@prisma/client';
const TARGET_URL = 'https://whatson.cityofsydney.nsw.gov.au';
async function scrapeEvents(prisma) {
    console.log(`Starting scrape of ${TARGET_URL}...`);
    try {
        const { data } = await axios_1.default.get(TARGET_URL);
        const $ = cheerio.load(data);
        const eventLinks = new Set();
        // Find all event links
        $('a[href^="/events/"]').each((_, element) => {
            const href = $(element).attr('href');
            if (href) {
                eventLinks.add(TARGET_URL + href);
            }
        });
        console.log(`Found ${eventLinks.size} potential event links.`);
        // Limit to 10 for performance/demo
        const linksToScrape = Array.from(eventLinks).slice(0, 10);
        for (const url of linksToScrape) {
            try {
                await scrapeEventDetails(url, prisma);
            }
            catch (err) {
                console.error(`Failed to scrape ${url}:`, err);
            }
        }
        console.log('Scrape complete.');
    }
    catch (error) {
        console.error('Error in main scrape loop:', error);
        throw error;
    }
}
async function scrapeEventDetails(url, prisma) {
    console.log(`Scraping event: ${url}`);
    const { data } = await axios_1.default.get(url);
    const $ = cheerio.load(data);
    // Extract details (Selectors are estimates based on standard semantic HTML or common classes)
    // Adjust selectors based on actual site structure if needed.
    // For What's On Sydney, they usually use generic heavy markup.
    // Title is usually h1
    const title = $('h1').first().text().trim();
    // Description: first paragraph of content, or meta description
    let description = $('div[class*="description"] p').first().text().trim();
    if (!description)
        description = $('meta[name="description"]').attr('content') || '';
    // Date/Time: Look for time structures
    const dateText = $('time').first().text().trim() || $('div[class*="date"]').first().text().trim() || new Date().toISOString();
    // Venue
    const venue = $('address').first().text().trim() || $('div[class*="location"]').first().text().trim() || 'Sydney, Australia';
    // Image
    let imageUrl = $('figure img').first().attr('src') || $('meta[property="og:image"]').attr('content');
    // Fallback date handling (very rough parsing)
    // specific to assignment: "Detect updated events"
    // We'll trust the string for now or store current date if parsing fails.
    let eventDate = new Date();
    // Try to parse dateText if it looks like a date? 
    // For MVP, just use current date + random offset if invalid, or try valid parse.
    const parsedDate = new Date(dateText);
    if (!isNaN(parsedDate.getTime())) {
        eventDate = parsedDate;
    }
    if (!title) {
        console.warn(`Skipping ${url} - No title found`);
        return;
    }
    // Upsert
    await prisma.event.upsert({
        where: { originalUrl: url },
        create: {
            title,
            description,
            date: eventDate,
            venue,
            city: 'Sydney',
            source: 'WhatsOnSydney',
            originalUrl: url,
            imageUrl,
            status: 'NEW'
        },
        update: {
            title,
            description,
            date: eventDate,
            venue,
            imageUrl,
            lastScraped: new Date(),
            status: 'UPDATED' // Simple logic: always mark updated on rescrape
        }
    });
    console.log(`Saved event: ${title}`);
}
