// Utility to test API key configurations
import { supabase } from '@/lib/supabase';
import { geminiModel } from '@/lib/gemini';

export const testSupabaseConnection = async () => {
  try {
    // Test basic connection first
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message.includes('Invalid API key')) {
      return { success: false, message: 'Invalid Supabase credentials' };
    }

    // Test if users table exists
    const { data: tableData, error: tableError } = await supabase.from('users').select('count').limit(1);
    if (tableError) {
      if (tableError.message.includes('relation "public.users" does not exist')) {
        return { success: false, message: 'Connected but database tables not set up. See SUPABASE_SETUP.md' };
      }
      return { success: false, message: `Database error: ${tableError.message}` };
    }
    
    return { success: true, message: 'Supabase fully configured and ready' };
  } catch (error: any) {
    return { success: false, message: `Connection failed: ${error.message}` };
  }
};

export const testGeminiConnection = async () => {
  try {
    const result = await geminiModel.generateContent(['Hello, are you working?']);
    const response = result.response.text();
    return { success: true, message: 'Gemini AI connected successfully', response };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gemini connection failed' };
  }
};

export const checkEnvironmentVariables = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const checks = {
    supabaseUrl: !!supabaseUrl && supabaseUrl !== 'your_supabase_project_url_here',
    supabaseKey: !!supabaseKey && supabaseKey !== 'your_supabase_anon_key_here',
    geminiKey: !!geminiKey && geminiKey !== 'your_gemini_api_key_here',
  };

  return {
    supabase: checks.supabaseUrl && checks.supabaseKey,
    gemini: checks.geminiKey,
    all: checks.supabaseUrl && checks.supabaseKey && checks.geminiKey
  };
};