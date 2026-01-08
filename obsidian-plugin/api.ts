import { request, Notice } from 'obsidian';

// --- Interfaces for API Data ---

export interface Article {
    id: number;
    title: string;
    url: string;
    published_at: string;
    feed_id: string;
    summary: string;
    author: string;
}

export interface ThemeDetail {
    id: number;
    title: string;
    summary: string;
    category: string;
    importance: number;
    impact: number;
    created_at: string;
    key_points: string[]; // Assuming key_points is a list of strings
    articles: Article[];
}

export interface ThemeSummary {
    id: number;
    title: string;
    summary: string;
    category: string;
    importance: number;
    impact: number;
    created_at: string;
}


// --- API Client Functions ---

/**
 * Fetches the list of analyzed themes from the TrendRadar backend.
 * @param apiUrl The base URL of the TrendRadar API server.
 * @param date Optional date in YYYY-MM-DD format.
 * @returns A promise that resolves to an array of ThemeSummary objects.
 */
export async function getThemes(apiUrl: string, date?: string): Promise<ThemeSummary[]> {
    if (!apiUrl) {
        new Notice('TrendRadar API URL is not configured.');
        return [];
    }

    const url = new URL(`${apiUrl}/api/themes`);
    if (date) {
        url.searchParams.append('date', date);
    }

    try {
        const response = await request({
            url: url.toString(),
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        return JSON.parse(response) as ThemeSummary[];

    } catch (error) {
        console.error('TrendRadar API Error (getThemes):', error);
        new Notice('Failed to fetch themes from TrendRadar API. See console for details.');
        return [];
    }
}

/**
 * Fetches the details for a single theme, including its associated articles.
 * @param apiUrl The base URL of the TrendRadar API server.
 * @param themeId The ID of the theme to fetch.
 * @param date Optional date in YYYY-MM-DD format.
 * @returns A promise that resolves to a ThemeDetail object.
 */
export async function getThemeDetails(apiUrl: string, themeId: number, date?: string): Promise<ThemeDetail | null> {
    if (!apiUrl) {
        new Notice('TrendRadar API URL is not configured.');
        return null;
    }

    const url = new URL(`${apiUrl}/api/themes/${themeId}`);
    if (date) {
        url.searchParams.append('date', date);
    }

    try {
        const response = await request({
            url: url.toString(),
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        return JSON.parse(response) as ThemeDetail;

    } catch (error) {
        console.error(`TrendRadar API Error (getThemeDetails for ID ${themeId}):`, error);
        new Notice(`Failed to fetch details for theme ${themeId}. See console for details.`);
        return null;
    }
}
