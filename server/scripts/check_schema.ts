import supabase from '../src/config/supabase';

async function checkSchema() {
    console.log('Checking bookings table schema...');

    // Insert a dummy row to see if it accepts booking_type, or just check columns via select
    // Since we can't easily query schema info from client, we will try to select * limit 1
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error selecting:', error);
    } else {
        if (data && data.length > 0) {
            console.log('Columns found:', Object.keys(data[0]));
        } else {
            console.log('No data found to infer columns.');
            // Try to dummy insert with booking_type? No, safe to assume we can add it if missing?
            // Actually, if we are in development, we can probably just assume we need to handle it.
        }
    }
    process.exit(0);
}

checkSchema();
