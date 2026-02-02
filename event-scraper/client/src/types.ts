export interface Event {
    id: string;
    title: string;
    description: string | null;
    date: string;
    venue: string | null;
    city: string;
    category: string | null;
    imageUrl: string | null;
    source: string;
    originalUrl: string;
    status: 'NEW' | 'UPDATED' | 'INACTIVE' | 'IMPORTED';
}
