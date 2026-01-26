
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jqlwemunvpuubmyclluk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbHdlbXVudnB1dWJteWNsbHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMTA1NzgsImV4cCI6MjA4NDg4NjU3OH0.FunZUl8Idmu3ru02GFUhntppKVbYg0n0AOEAiQKg148'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAdmin() {
    console.log("Checking profiles...");

    // First, check simply for any profiles
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('email, role, full_name, id')

    if (error) {
        console.error('Error fetching profiles:', error)
        return
    }

    console.log("\n--- All Users ---")
    profiles.forEach(p => {
        console.log(`Email: ${p.email} | Role: ${p.role || 'null'} | Name: ${p.full_name}`)
    })

    const admins = profiles.filter(p => p.role === 'admin')
    console.log("\n--- ADMINS ---")
    if (admins.length === 0) {
        console.log("No admins found.")
    } else {
        admins.forEach(a => console.log(`[ADMIN] ${a.email}`))
    }
}

checkAdmin()
