export type TimeFrame = 'Last Month' | 'Last 90 Days' | 'Last Year';
export type ContentType = 'Top Artists' | 'Top Songs' | 'Top Albums';

// from backend
export interface ListeningItem {
    id: string;
    name: string;
    imageUrl: string;
    playCount: number;
    playTimeMinutes: number;
    playTimePercentage: number;
    rank: number;
}

export interface StatisticsProps {
    topX: number;
    topArtistsLastMonth: ListeningItem[];
    topArtistsLast90Days: ListeningItem[];
    topArtistsLastYear: ListeningItem[];
    topSongsLastMonth: ListeningItem[];
    topSongsLast90Days: ListeningItem[];
    topSongsLastYear: ListeningItem[];
    topAlbumsLastMonth: ListeningItem[];
    topAlbumsLast90Days: ListeningItem[];
    topAlbumsLastYear: ListeningItem[];
}

export const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FFC5C5',
    '#FF7700', '#5F4B8B', '#F15BB5', '#00BBF9', '#00F5D4'
];