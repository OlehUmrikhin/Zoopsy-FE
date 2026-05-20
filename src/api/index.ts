// Allow folder to be committed to git and export API calls.

export const API_URL = import.meta.env.VITE_API_URL as string;

export * from './user';
export * from './owner';
export * from './sitter';
export * from './admin';
