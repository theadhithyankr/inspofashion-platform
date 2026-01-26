// Custom async storage adapter for Supabase
// This ensures localStorage works reliably for session persistence

export const browserLocalStorage = {
    async getItem(key: string): Promise<string | null> {
        try {
            const val = window.localStorage.getItem(key);
            console.log(`[Storage] GET ${key}:`, val ? '(found)' : '(null)');
            return val;
        } catch (error) {
            console.error('[Storage] GET Error:', error);
            return null;
        }
    },

    async setItem(key: string, value: string): Promise<void> {
        try {
            console.log(`[Storage] SET ${key}`);
            window.localStorage.setItem(key, value);
        } catch (error) {
            console.error('[Storage] SET Error:', error);
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            console.log(`[Storage] REMOVE ${key}`);
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error('[Storage] REMOVE Error:', error);
        }
    }
};
