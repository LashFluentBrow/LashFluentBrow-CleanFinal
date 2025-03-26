import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sziagnnmbycaovvlossg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6aWFnbm5tYnljYW92dmxvc3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NDY5MzQsImV4cCI6MjA1ODUyMjkzNH0.PQPgbMdeHWko156_jbsULOBdPdXOk73uoKe8XsesNKI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
