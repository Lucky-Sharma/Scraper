import axios from 'axios';
import * as cheerio from 'cheerio';
// import { PrismaClient } from '@prisma/client';

const TARGET_URL = 'https://whatson.cityofsydney.nsw.gov.au';

export async function scrapeEvents(prisma: any) {
    console.log(`Starting scrape of ${TARGET_URL}...`);
    try {
        const { data } = await axios.get(TARGET_URL);
        const $ = cheerio.load(data);
        const eventLinks = new Set<string>();

        // Find all event links
        $('a[href^="/events/"]').each((_: any, element: any) => {
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
            } catch (err) {
                console.error(`Failed to scrape ${url}:`, err);
            }
        }
        console.log('Scrape complete.');
    } catch (error) {
        console.error('Error in main scrape loop:', error);
        throw error;
    }
}

async function scrapeEventDetails(url: string, prisma: any) {
    console.log(`Scraping event: ${url}`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract details (Selectors are estimates based on standard semantic HTML or common classes)
    // Adjust selectors based on actual site structure if needed.
    // For What's On Sydney, they usually use generic heavy markup.
    
    // Title is usually h1
    const title = $('h1').first().text().trim();
    
    // Description: first paragraph of content, or meta description
    let description = $('div[class*="description"] p').first().text().trim();
    if (!description) description = $('meta[name="description"]').attr('content') || '';

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
