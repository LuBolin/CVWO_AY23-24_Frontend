// Separated from global.tsx because
// "Fast refresh only works when a file only exports components. 
// Use a new file to share constants or functions between components."
const FORUM_PAGE_CHUNK_SIZE = 3;

const apiUrl = import.meta.env.VITE_APP_API_URL;

export { apiUrl, FORUM_PAGE_CHUNK_SIZE }