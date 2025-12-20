
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const API_URL = 'http://localhost:3000/api';

async function runVerification() {
    const timestamp = Date.now();
    const email = `test_admin_${timestamp}@dreamvoyager.com`;
    const password = 'Password@123';

    console.log('--- Starting Verification ---');
    console.log(`Target: ${API_URL}`);

    try {
        // 1. Signup Temp Admin
        console.log(`\n1. Registering Temp Admin: ${email}`);
        try {
            await axios.post(`${API_URL}/auth/signup`, {
                email,
                password,
                fullName: 'Test Admin',
                phone: '1234567890',
                role: 'admin' // Explicitly requesting admin role
            });
            console.log('   ✅ Signup successful');
        } catch (error: any) {
            console.log('   ⚠️ Signup failed:', error.response?.data || error.message);
            console.log('   Proceeding to login (in case user exists)...');
        }

        // 2. Login
        console.log('\n2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        const { session, user } = loginRes.data;
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
            imageUrl: 'https://example.com/image.jpg',
            category: 'Honeymoon',
            location: 'Test City',
            available: true,
            features: ['Test Feature 1', 'Test Feature 2']
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
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

runVerification();
