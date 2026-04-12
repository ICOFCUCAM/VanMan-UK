import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://bsrwqhxcrnxjiuyrevtb.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImU3MDRmNWNkLWViYjUtNDc5Zi04NjBhLTczOWNiMGFlMWMzNSJ9.eyJwcm9qZWN0SWQiOiJic3J3cWh4Y3JueGppdXlyZXZ0YiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzczMDAxOTk1LCJleHAiOjIwODgzNjE5OTUsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.Eqwigo2fnkDmlE_JWRO5ccH4NRAO6IW08aMcdeMTNUk';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
