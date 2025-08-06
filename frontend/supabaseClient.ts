// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ewfmdflrswjdyeddtyio.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3Zm1kZmxyc3dqZHllZGR0eWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyODgzMjcsImV4cCI6MjA2OTg2NDMyN30.jFDuMedIr9NLtsl5bzzpMIjDmjOcLq7V_7ATN1lRwic'; // Replace with your anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
