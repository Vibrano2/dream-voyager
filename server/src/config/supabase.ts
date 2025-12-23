import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
// Use Service Role Key for backend operations to bypass RLS
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey || supabaseKey.startsWith('your_') || supabaseKey === 'placeholder-key') {
    console.warn('Invalid SUPABASE_SERVICE_ROLE_KEY detected. Falling back to SUPABASE_ANON_KEY.');
    supabaseKey = process.env.SUPABASE_ANON_KEY;
}
supabaseKey = supabaseKey || 'placeholder-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('WARNING: Supabase Service Role Key missing. Database operations may fail due to RLS.');
}

console.log('Supabase Config Check:');
console.log('URL Present:', !!process.env.SUPABASE_URL);
console.log('Service Key Present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('Anon Key Present:', !!process.env.SUPABASE_ANON_KEY);
if (process.env.SUPABASE_SERVICE_ROLE_KEY) console.log('Service Key Prefix:', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5));
if (process.env.SUPABASE_ANON_KEY) console.log('Anon Key Prefix:', process.env.SUPABASE_ANON_KEY.substring(0, 5));

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
