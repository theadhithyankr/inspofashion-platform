
import { createClient } from '@supabase/supabase-js'

// Using the keys from your environment
const supabaseUrl = 'https://jqlwemunvpuubmyclluk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbHdlbXVudnB1dWJteWNsbHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMTA1NzgsImV4cCI6MjA4NDg4NjU3OH0.FunZUl8Idmu3ru02GFUhntppKVbYg0n0AOEAiQKg148'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupAdmin() {
    const email = 'admin@inspofashions.com'
    const password = 'securepassword123'

    console.log(`Setting up admin user: ${email}...`)

    // 1. Sign In
    let { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (signInError) {
        console.log('Sign in failed, attempting to create user...')
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: 'Admin User',
                    role: 'admin'
                }
            }
        });

        if (signUpError) {
            console.error('Sign up error:', signUpError.message);
            // If checking user existence failed but might exist, we can't proceed easily without service role
            return;
        }
        
        user = signUpData.user;
        if (user) console.log('Sign up successful.');
        else console.log('Sign up initiated (check email for confirmation link if not auto-confirmed).');
    } else {
        console.log('Signed in successfully.');
    }

    if (!user) {
        // Try getting user if session exists
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        user = currentUser;
    }

    if (!user) {
        console.error('No authenticated user found. Exiting.');
        return;
    }

    console.log(`User ID: ${user.id}`);

    // 2. Check/Create Profile
    // Try to get profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError.message);
    }

    if (profile) {
        console.log(`Profile found. Current Role: ${profile.role}`);
        if (profile.role !== 'admin') {
            console.log('Updating role to ADMIN...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', user.id);
            
            if (updateError) {
                console.error('Error updating role:', updateError.message);
            } else {
                console.log('Successfully promoted to admin via update.');
            }
        } else {
             console.log('User is already an admin.');
        }
    } else {
        console.log('Profile not found. Creating manually as ADMIN...');
        const { error: insertError } = await supabase
            .from('profiles')
            .insert([{
                id: user.id,
                email: user.email,
                full_name: 'Admin User',
                role: 'admin',
                updated_at: new Date().toISOString()
            }]);
            
        if (insertError) {
            console.error('Error creating profile as admin:', insertError.message);
        } else {
            console.log('Successfully created admin profile.');
        }
    }
    
    // 3. Verify Products Access
    console.log('\n--- Verifying Permissions ---');
    console.log('Attempting to create a test product...');

    const testProduct = {
        title: 'Test Permission Check',
        slug: 'test-permission-check',
        sku: 'TEST-SKU-001',
        price: 10,
        stock_quantity: 1,
        status: 'draft',
        category: 'System Check'
    };
    
    const { data: insertedProduct, error: insertProdError } = await supabase
        .from('products')
        .insert([testProduct])
        .select()
        .single();
        
    if (insertProdError) {
        console.error('FAILED to insert product:', insertProdError.message);
        console.error('Details:', insertProdError);
        console.log('\nPossible reasons:');
        console.log('1. RLS Policy is blocking insert (user role not recognized)');
        console.log('2. Table structure mismatch');
    } else {
        console.log('SUCCESS! Can insert products.');
        if (insertedProduct) {
             console.log('Created product ID:', insertedProduct.id);
             // Cleanup
             await supabase.from('products').delete().eq('id', insertedProduct.id);
             console.log('Cleaned up test product.');
        }
    }
}

setupAdmin()
