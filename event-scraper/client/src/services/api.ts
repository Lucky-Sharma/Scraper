const API_URL = 'http://localhost:5000/api';

export async function fetchEvents(): Promise<any[]> {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
}

export async function triggerScrape(): Promise<void> {
    const res = await fetch(`${API_URL}/scrape`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to trigger scrape');
}
