const DEFAULT_API_BASE_URL = '/api';
const NETWORK_ERROR_MESSAGE = 'Cannot reach the backend. Make sure VITE_API_BASE_URL is correct or that your deployment keeps the /api proxy or rewrite configured.';

const normalizeApiBaseUrl = (value) => {
    if (!value) return DEFAULT_API_BASE_URL;
    return value.endsWith('/') ? value.slice(0, -1) : value;
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const buildApiUrl = (path) => {
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const isNetworkError = (err) => {
    const message = err?.message ?? '';
    return err instanceof TypeError || /Failed to fetch|NetworkError|Load failed/i.test(message);
};

export const apiFetch = async (path, options) => {
    try {
        return await fetch(buildApiUrl(path), options);
    } catch (err) {
        if (isNetworkError(err)) {
            throw new Error(NETWORK_ERROR_MESSAGE);
        }
        throw err;
    }
};

export const readErrorMessage = async (res, fallbackMessage) => {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        try {
            const data = await res.json();
            if (typeof data?.error === 'string' && data.error.trim()) return data.error;
            if (typeof data?.message === 'string' && data.message.trim()) return data.message;
        } catch {
            return fallbackMessage;
        }
    }

    try {
        const text = await res.text();
        return text || fallbackMessage;
    } catch {
        return fallbackMessage;
    }
};
