
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
// Load env vars
dotenv.config(); // Defaults to .env in cwd (which is server/)

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const API_URL = 'http://localhost:3000/api';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Missing SUPABASE vars in .env');
    process.exit(1);
}

// Service Client (Admin Power)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runTest() {
    const timestamp = Date.now();
    const email = `super_test_${timestamp}@dreamvoyager.com`;
    const password = 'Password@123';

    console.log('--- STARTING ROBUST VERIFICATION ---');
    console.log(`Target: ${API_URL}`);

    try {
        // 1. Create User via Supabase Admin (Bypassing API restrictions)
        console.log(`\n1. creating Admin User via Service Key: ${email}`);
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm!
            user_metadata: { role: 'admin', full_name: 'Super Test' }
        });

        if (authError) {
            console.error('   ❌ Supabase Admin Create Failed:', authError.message);
            process.exit(1);
        }

        const userId = authData.user.id;
        console.log('   ✅ Auth User Created:', userId);

        // 2. Ensure Profile Exists & Is Admin
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: email,
                role: 'admin',
                full_name: 'Super Test'
            });

        if (profileError) {
            console.error('   ❌ Profile Setup Failed:', profileError.message);
            process.exit(1);
        }
        console.log('   ✅ Profile Synced as Admin');

        // 3. Login via API (Testing the actual Auth Controller logic)
        console.log('\n2. Logging in via API...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        const { session, user } = loginRes.data;
        const token = session.access_token;
        console.log(`   ✅ API Login Success. Returned Role: ${user.role}`);

        if (user.role !== 'admin') {
            console.error('   ❌ FAILED: User is not an admin in API response.');
            process.exit(1);
        }

        // 4. Create Package (The Real Test)
        console.log('\n3. Creating Test Package...');
        const pkgData = {
            title: `Bypass Test Package ${timestamp}`,
            description: 'Verifying RLS via Service Key Setup',
            price: 99999,
            duration: '1 Day',
            imageUrl: 'https://example.com/test.jpg',
            category: 'Test',
            location: 'Supabase',
            available: true,
            features: ['RLS Verified']
        };

        const createRes = await axios.post(`${API_URL}/packages`, pkgData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('   ✅ Package creation successful!');
        console.log('   Package ID:', createRes.data.id || createRes.data._id);

        // 5. Cleanup
        console.log('\n4. Cleaning up...');
        await supabase.auth.admin.deleteUser(userId);
        console.log('   ✅ Test User Deleted');

        console.log('\n--- VERIFICATION PASSED ✅ ---');

    } catch (error: any) {
        console.error('\n--- VERIFICATION FAILED ❌ ---');
        console.error(error.message);
        if (error.response) {
            console.error('API Status:', error.response.status);
            console.error('API Data:', error.response.data);
        }
        process.exit(1);
    }
}

runTest();
