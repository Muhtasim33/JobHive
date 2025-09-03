// src/config.ts

export const API_BASE = import.meta.env.VITE_API_BASE;

// Utility function to construct API URLs
export const apiUrl = (endpoint: string) => `${API_BASE}${endpoint}`;
