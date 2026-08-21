import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://atihuzzhatkyrklglloc.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImNkY2QzMjEyLTE5ZmEtNGU2MS05OTk1LTg0NTQyY2I3OTM4YiJ9.eyJwcm9qZWN0SWQiOiJhdGlodXp6aGF0a3lya2xnbGxvYyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY1MTQ3MTQ0LCJleHAiOjIwODA1MDcxNDQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.Nnj6HOAkRabjM-Fj6ZnbtwaQANgjao5tBtfrQeRI6Jo';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };