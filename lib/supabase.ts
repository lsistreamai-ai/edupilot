import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zpyglubdgpecdfsrnirz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpweWdsdWJkZ3BlY2Rmc3JuaXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTYxNTksImV4cCI6MjA5NDMzMjE1OX0.IEBm33tSXSS7p1ivjXGNowAbyk7uYQTBCSrZJZ68maU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
