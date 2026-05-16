import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and Anon Key when ready
// For standalone mode without real backend connection yet, we will
// conditionally mock these or use placeholders to avoid crashing.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ymxebjrixiymaraklnfy.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteGVianJpeGl5bWFyYWtsbmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTIyODQsImV4cCI6MjA5Mjg4ODI4NH0.Ji7wHjbm8tEB_FW3V0XuR_O34mmK2c8MuOGVPO50R-0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
