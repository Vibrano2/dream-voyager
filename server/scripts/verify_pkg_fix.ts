
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const API_URL = 'http://localhost:5000/api';

async function runVerification() {
    const timestamp = Date.now();
    const email = `test_admin_${timestamp}@dreamvoyager.com`;
    const password = 'Password@123';

    console.log('--- Starting Verification ---');
    console.log(`Target: ${API_URL}`);

    try {
        // 1. Signup Temp Admin via Supabase Admin API (to skip email confirmation)
        console.log(`\n1. Registering Temp Admin (Pre-confirmed): ${email}`);

        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: adminUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: 'Test Admin',
                phone: '1234567890',
                role: 'admin'
            }
        });

        if (createError) {
            console.log('   ⚠️ Admin creation failed:', createError.message);
            console.log('   Proceeding to login (in case user exists)...');
        } else {
            // Create profile manually since auth trigger might not fire or we want to be sure
            await supabaseAdmin.from('profiles').insert({
                id: adminUser.user.id,
                email: email,
                full_name: 'Test Admin',
                phone: '1234567890',
                role: 'admin'
            });
            console.log('   ✅ Admin created & confirmed successfully');
        }

        // 2. Login
        console.log('\n2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        const { session, user } = loginRes.data;
        if (!session) {
            console.error('Session is missing in login response:', loginRes.data);
        }
        const token = session.access_token;
        console.log(`   ✅ Login successful. Role: ${user.role}`);

        if (user.role !== 'admin') {
            console.error('   ❌ FAILED: User is not an admin. Role is:', user.role);
            console.error('   Note: Signup usually limits role assignment. Check auth controller logic.');
            process.exit(1);
        }

        // 3. Create Package
        console.log('\n3. Creating Test Package...');
        const pkgData = {
            title: `Verification Package ${timestamp}`,
            description: 'This is a test package to verify RLS fixes.',
            price: 50000,
            duration: '5 Days',
            image_url: 'https://example.com/image.jpg',
            category: 'Honeymoon',
            location: 'Test City',
            available: true,
            // features: ['Test Feature 1', 'Test Feature 2'] // Column does not exist
        };

        const createRes = await axios.post(`${API_URL}/packages`, pkgData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('   ✅ Package creation successful!');
        console.log('   Package ID:', createRes.data.id || createRes.data._id || 'Created');

        console.log('\n--- VERIFICATION PASSED ✅ ---');

    } catch (error: any) {
        console.error('\n--- VERIFICATION FAILED ❌ ---');
        console.error('Step failed.');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
            console.error('Error Code:', error.code);
            console.error('Error Stack:', error.stack);
        }
        process.exit(1);
    }
}

runVerification();
