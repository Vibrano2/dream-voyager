
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Try standard load
dotenv.config();

console.log('--- ENV DIAGNOSTIC ---');
console.log('CWD:', process.cwd());
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Present' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'MISSING');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Present' : 'MISSING');

if (!process.env.SUPABASE_URL) {
    console.log('⚠️ Attempting explicit path load...');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const envPath = path.resolve(__dirname, '../.env');
    console.log('Loading from:', envPath);
    dotenv.config({ path: envPath });
    console.log('SUPABASE_URL (After explicit):', process.env.SUPABASE_URL ? 'Present' : 'MISSING');
}
