import React, { useEffect, useState } from 'react';
import { fetchEvents, triggerScrape } from '../services/api';
import type { Event } from '../types';
import EventCard from '../components/EventCard';

const PublicEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [scraping, setScraping] = useState(false);

    const loadEvents = async () => {
        try {
            const data = await fetchEvents();
            setEvents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleScrape = async () => {
        setScraping(true);
        try {
            await triggerScrape();
            // Refresh after short delay to allow scraper to run
            // (In real app, use websockets or polling)
            setTimeout(loadEvents, 5000); 
        } catch (err) {
            console.error(err);
        } finally {
            setScraping(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center bg-transparent py-12 px-4">
            <div className="w-full max-w-3xl space-y-12">
                {/* Header Section */}
                <div className="relative flex flex-col items-center text-center">
                    <div className="absolute top-1/2 left-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[80px]"></div>
                    
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400 ring-1 ring-inset ring-cyan-500/20 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        Live Feed
                    </span>
                
                <h1 className="mb-6 text-6xl font-black tracking-tight text-white md:text-7xl">
                    What's On <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Sydney</span>
                </h1>
                
                <p className="mb-10 max-w-2xl text-lg text-gray-400">
                    Discover and track the latest concerts, markets, and cultural events happening across the city in real-time.
                </p>

                <button
                    onClick={handleScrape}
                    disabled={scraping}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-[0_0_40px_-10px_rgba(34,211,238,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(34,211,238,0.8)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                     {scraping ? (
                         <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
                    ) : (
                        <svg className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
                    )}
                    <span>{scraping ? 'Scanning for Events...' : 'Refresh Feed'}</span>
                </button>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse border border-white/5"></div>
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl bg-white/5 border border-white/10 py-32 text-center backdrop-blur-sm">
                    <div className="mb-6 rounded-full bg-white/10 p-6">
                        <svg className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">No Events Found</h3>
                    <p className="text-gray-400 mt-2 max-w-sm">It looks quiet right now. Hit the refresh button to trigger a fresh scrape.</p>
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 perspective-1000">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
            </div>
        </div>
    );
};

export default PublicEvents;
