// =====================================================
// SUPABASE CLIENT — Conexión a EnglishAppDB
// =====================================================

const SUPABASE_URL = 'https://tisehdhofpqkajokbzrx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpc2VoZGhvZnBxa2Fqb2tienJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjM4NDUsImV4cCI6MjA5MTE5OTg0NX0.1XNzB6asgdDQsBhv2m9v9k0DU1zoGWAv2h7vUvUbtU0';

// Cliente Supabase (CDN cargado en index.html)
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
