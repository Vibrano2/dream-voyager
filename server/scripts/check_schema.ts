
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkSchema() {
    console.log('--- Checking Packages Schema ---');
    // Using a trick: Select one row (or empty) and looking at keys? 
    // Or better, Supabase returns error on select of non-existent column?
    // Actually, we can query information_schema if we have access via SQL?
    // Via client is harder.
    // Let's try to insert a dummy row with ALL fields and see which one fails?
    // No, cleaner to just try to select * limit 1 and print keys.

    const { data, error } = await supabase.from('packages').select('*').limit(1);

    if (error) {
        console.error('Error fetching packages:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Existing Columns:', Object.keys(data[0]));
    } else {
        console.log('No data found, cannot infer schema easily via JS client.');
        // Try creating with just one 'suspect' field to fail it
    }
}

checkSchema();
