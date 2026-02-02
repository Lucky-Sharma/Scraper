import React from 'react';
import type { Event } from '../types';

interface Props {
    event: Event;
}

const EventCard: React.FC<Props> = ({ event }) => {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-cyan-500/20 hover:border-cyan-500/30">
            {/* Image Section */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img 
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'} 
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80" />
                
                {/* Floating Date Badge */}
                <div className="absolute top-4 right-4 flex flex-col items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-2 text-white shadow-lg">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-black leading-none">
                        {new Date(event.date).getDate()}
                    </span>
                </div>

                {/* City Tag */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20">
                        📍 {event.city}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-6 z-10">
                <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                    <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest">Event</span>
                </div>

                <h3 className="mb-3 text-xl font-bold leading-tight text-white group-hover:text-cyan-300 transition-colors">
                    {event.title}
                </h3>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-3">
                    {event.description || 'Join us for an amazing experience. Click below to secure your spot and get more details.'}
                </p>

                {/* Footer / Action */}
                <div className="pt-4 mt-auto border-t border-white/10 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Venue</span>
                        <span className="text-xs font-medium text-gray-300 truncate max-w-[120px]" title={event.venue || 'TBA'}>
                            {event.venue || 'TBA'}
                        </span>
                    </div>

                    <a 
                        href={event.originalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative overflow-hidden rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-gray-900 transition-all duration-300 hover:bg-cyan-400 hover:text-gray-900 shadow-lg hover:shadow-cyan-500/50"
                    >
                        <span className="relative z-10">Get Tickets</span>
                    </a>
                </div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute -inset-1 z-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 blur transition duration-500 group-hover:opacity-20" />
        </div>
    );
};

export default EventCard;
