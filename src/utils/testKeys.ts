// Utility to test API key configurations
import { supabase } from '@/lib/supabase';
import { geminiModel } from '@/lib/gemini';

export const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test basic connection first
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message.includes('Invalid API key')) {
      return { success: false, message: 'Invalid Supabase credentials' };
    }

    // Test if we can make a simple query
    const { data: tableData, error: tableError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
      
    if (tableError) {
      if (tableError.message.includes('relation "public.users" does not exist')) {
        console.log('⚠️ Supabase connected but tables not set up');
        return { 
          success: true, 
          message: 'Connected - Demo mode (tables not set up, using fallback auth)' 
        };
      }
      console.log('⚠️ Supabase database error:', tableError.message);
      return { 
        success: true, 
        message: `Connected - Demo mode (${tableError.message.substring(0, 50)}...)` 
      };
    }
    
    console.log('✅ Supabase fully connected with database');
    return { success: true, message: 'Supabase fully configured and ready' };
  } catch (error: any) {
    console.error('❌ Supabase connection failed:', error);
    return { success: false, message: `Connection failed: ${error.message}` };
  }
};

export const testGeminiConnection = async () => {
  try {
    console.log('🧪 Testing Gemini API connection...');
    
    if (!geminiModel) {
      return { success: false, message: 'Gemini model not initialized' };
    }
    
    const result = await Promise.race([
      geminiModel.generateContent('Hello, respond with "API working"'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
    ]);
    
    if (!result || !result.response) {
      return { success: false, message: 'Invalid response from Gemini API' };
    }
    
    const response = result.response.text();
    console.log('✅ Gemini API test successful:', response);
    
    return { success: true, message: 'Gemini AI connected and working', response };
  } catch (error: any) {
    console.error('❌ Gemini API test failed:', error);
    return { 
      success: false, 
      message: error.message || 'Gemini connection failed',
      details: error.name || 'Unknown error'
    };
  }
};

export const checkEnvironmentVariables = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  console.log('🔍 Environment Variables Check:');
  console.log('- Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Missing');
  console.log('- Supabase Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Missing');
  console.log('- Gemini Key:', geminiKey ? `${geminiKey.substring(0, 20)}...` : 'Missing');

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