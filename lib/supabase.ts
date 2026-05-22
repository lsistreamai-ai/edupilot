import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eqbbhfegbjchpcpbxycq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxYmJoZmVnYmpjaHBjcGJ4eWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzg3NTUsImV4cCI6MjA5NDc1NDc1NX0.Ofwwx4UuR-R9LfVPVMdC-iyAj5JQqvZgsoOYfgVa9y0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
