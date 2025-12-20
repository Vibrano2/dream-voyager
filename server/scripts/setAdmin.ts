import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setAdmin(email: string) {
    console.log(`Attempting to promote ${email} to admin...`);

    // 1. Find user in Auth (Authoritative source)
    // Note: listUsers is paginated, but for a specific email search we might need to filter manually or use listUsers({ query: email }) if supported, 
    // or just list and find. Currently Supabase Admin API doesn't have a direct 'getUserByEmail'.
    // We'll iterate or just assume if we can't find in profile, we check auth. 

    // Actually, listUsers() is the best way.
    let users;
    try {
        const result = await supabase.auth.admin.listUsers();
        if (result.error) throw result.error;
        users = result.data.users;
    } catch (err: any) {
        console.error('CRITICAL ERROR listing auth users:', err.message || err);
        console.error('Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env');
        process.exit(1);
    }

    // const { data: { users }, error: authSearchError } = await supabase.auth.admin.listUsers();

    const authUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!authUser) {
        console.error(`Error: User with email ${email} not found in Supabase Auth.`);
        console.error('Please sign up first.');
        process.exit(1);
    }

    console.log(`Found Auth User: ${authUser.id}`);

    // 2. Check/Create Profile
    const { data: profile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (!profile) {
        console.log('Profile missing. Creating profile...');
        const { error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: authUser.id,
                email: authUser.email,
                full_name: authUser.user_metadata?.full_name || 'Admin User',
                role: 'admin' // Create directly as admin
            });

        if (insertError) {
            console.error('Failed to create missing profile:', insertError);
            process.exit(1);
        }
        console.log('✅ Created missing profile as admin.');
    } else {
        // 3. Update existing profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', authUser.id);

        if (updateError) {
            console.error('Error updating profile role:', updateError);
            process.exit(1);
        }
        console.log('✅ Profile role updated to admin.');
    }

    // 4. Update Auth Metadata
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
        authUser.id,
        { user_metadata: { role: 'admin' } }
    );

    if (authUpdateError) {
        console.warn('⚠️ Warning: Failed to update auth metadata:', authUpdateError.message);
    } else {
        console.log('✅ Auth metadata updated.');
    }

    console.log(`\n🎉 Success! User ${email} is now an Admin.`);
    console.log('You can now log in at /admin/login');
}

const email = process.argv[2];

if (!email) {
    console.log('Usage: npx tsx scripts/setAdmin.ts <email>');
    process.exit(1);
}

setAdmin(email);
