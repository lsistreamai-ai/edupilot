-- Demo Account Setup
-- Run in Supabase SQL Editor after you register

-- Option 1: Make yourself admin
UPDATE profiles SET role = 'admin' WHERE email = 'lsistreamai@gmail.com';
