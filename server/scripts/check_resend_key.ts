import dotenv from 'dotenv';
import path from 'path';

// Force load .env from current directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('Checking RESEND_API_KEY...');
if (process.env.RESEND_API_KEY) {
    console.log('✅ RESEND_API_KEY is present (Length: ' + process.env.RESEND_API_KEY.length + ')');
    // Basic format check (starts with 're_')
    if (process.env.RESEND_API_KEY.startsWith('re_')) {
        console.log('✅ Key format looks correct (starts with re_)');
    } else {
        console.log('⚠️ Key format might be incorrect (should verify)');
    }
} else {
    console.log('❌ RESEND_API_KEY is MISSING in process.env');
}
