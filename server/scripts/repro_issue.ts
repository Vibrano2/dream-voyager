
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const API_URL = 'http://localhost:3000/api';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Missing SUPABASE vars in .env');
    process.exit(1);
}

// Service Client to create Admin User
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runTest() {
    const timestamp = Date.now();
    const email = `repro_test_${timestamp}@dreamvoyager.com`;
    const password = 'Password@123';

    console.log('--- STARTING REPRO ---');
    console.log(`Target: ${API_URL}`);

    try {
        // 1. Create Admin User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'admin', full_name: 'Repro Admin' }
        });

        if (authError) throw new Error(`Auth Create Failed: ${authError.message}`);
        const userId = authData.user.id;

        // 2. Sync Profile
        await supabase.from('profiles').upsert({
            id: userId,
            email: email,
            role: 'admin',
            full_name: 'Repro Admin'
        });

        // 3. Login to get JWT
        const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
        const token = loginRes.data.session.access_token;

        // 4. Attempt Create Package (This should fail and show us why)
        console.log('\nAttempting Create Package...');
        const pkgData = {
            title: `Repro Package ${timestamp}`,
            description: 'Testing save failure',
            destination: 'Test City',
            duration: 5,
            price: 50000,
            category: 'vacation',
            image_url: 'https://example.com/img.jpg',
            available: true,
            // These might be the new fields causing issues?
            universities: ['Uni A'],
            countries: ['Country B'],
            requirements: 'None',
            processing_time: '2 weeks',
            success_rate: 90
        };

        const createRes = await axios.post(`${API_URL}/packages`, pkgData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Package created successfully!');

        // Cleanup
        await supabase.auth.admin.deleteUser(userId);

    } catch (error: any) {
        console.error('\n❌ REPRO CAUGHT ERROR:');
        if (error.response) {
            console.error('Status:', error.response.status);
            // This is what we need to see!
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

runTest();
