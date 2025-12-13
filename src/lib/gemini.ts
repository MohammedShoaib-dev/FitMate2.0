import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  console.error('Missing Gemini API key. Please check your .env file.');
  throw new Error('Missing Gemini API key. Please check your .env file.');
}

console.log('🔑 Gemini API Configuration:');
console.log('- API Key loaded:', apiKey ? 'Yes' : 'No');
console.log('- API Key length:', apiKey ? apiKey.length : 0);
console.log('- API Key starts with AIza:', apiKey ? apiKey.startsWith('AIza') : false);

let genAI: GoogleGenerativeAI;
let geminiModel: any;

try {
  console.log('🚀 Initializing Gemini AI...');
  genAI = new GoogleGenerativeAI(apiKey);
  
  geminiModel = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 1024,
    },
  });
  
  console.log('✅ Gemini AI initialized successfully');
  
} catch (error) {
  console.error('❌ Failed to initialize Gemini AI:', error);
  geminiModel = null;
}

export { geminiModel }

// Direct test function for browser console
export const directAPITest = async () => {
  console.log('🔬 Direct API Test Starting...');
  
  try {
    if (!geminiModel) {
      console.error('❌ Model not initialized');
      return false;
    }
    
    console.log('📤 Making direct API call...');
    const result = await geminiModel.generateContent('Hello');
    
    console.log('📥 Response received:', result);
    console.log('📝 Response text:', result.response.text());
    
    return true;
  } catch (error) {
    console.error('❌ Direct test failed:', error);
    return false;
  }
}

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testGemini = directAPITest;
  (window as any).geminiModel = geminiModel;
}

// Test function to verify API connection
export const testGeminiAPI = async () => {
  console.log('🧪 Starting Gemini API test...');
  
  try {
    // Step 1: Check API key
    console.log('Step 1: Checking API key...');
    if (!apiKey) {
      return { success: false, error: 'No API key found' };
    }
    
    if (apiKey === 'your_gemini_api_key_here') {
      return { success: false, error: 'Placeholder API key detected' };
    }
    
    console.log('✅ API key exists and is not placeholder');
    console.log('- Length:', apiKey.length);
    console.log('- Starts with AIza:', apiKey.startsWith('AIza'));
    
    // Step 2: Check model initialization
    console.log('Step 2: Checking model...');
    if (!geminiModel) {
      return { success: false, error: 'Gemini model not initialized' };
    }
    console.log('✅ Model initialized');
    
    // Step 3: Simple API test
    console.log('Step 3: Testing API call...');
    const testPrompt = 'Say "Hello from Gemini"';
    console.log('- Test prompt:', testPrompt);
    
    const result = await Promise.race([
      geminiModel.generateContent(testPrompt),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
      )
    ]);
    
    console.log('✅ API call completed');
    console.log('- Result object exists:', !!result);
    console.log('- Response object exists:', !!result?.response);
    
    if (!result || !result.response) {
      return { success: false, error: 'Invalid response structure' };
    }
    
    const responseText = result.response.text();
    console.log('✅ Response text extracted');
    console.log('- Response:', responseText);
    
    return { success: true, response: responseText };
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    
    // Detailed error logging
    const errorInfo = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    };
    
    console.error('Error details:', errorInfo);
    
    return { 
      success: false, 
      error: errorInfo.message,
      details: errorInfo
    };
  }
}

// Smart fitness responses for fallback mode
const getSmartFitnessResponse = (prompt: string): string => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Workout related
  if (lowerPrompt.includes('workout') || lowerPrompt.includes('exercise')) {
    return "Great question about workouts! Here's my advice: Start with compound movements like squats, deadlifts, and push-ups. Aim for 3-4 sets of 8-12 reps. Remember to warm up for 5-10 minutes before exercising and cool down afterward. Progressive overload is key - gradually increase weight or reps each week! 💪";
  }
  
  // Nutrition related
  if (lowerPrompt.includes('diet') || lowerPrompt.includes('nutrition') || lowerPrompt.includes('food') || lowerPrompt.includes('eat')) {
    return "Nutrition is crucial for your fitness goals! Focus on whole foods: lean proteins (chicken, fish, beans), complex carbs (oats, quinoa, sweet potatoes), and healthy fats (avocado, nuts). Stay hydrated with 8+ glasses of water daily. Eat protein within 30 minutes after workouts for optimal recovery! 🥗";
  }
  
  // Weight loss
  if (lowerPrompt.includes('lose weight') || lowerPrompt.includes('fat loss') || lowerPrompt.includes('cutting')) {
    return "For healthy weight loss: Create a moderate calorie deficit (300-500 calories below maintenance), combine cardio with strength training, prioritize protein (0.8-1g per lb bodyweight), and be patient - aim for 1-2 lbs per week. Consistency beats perfection! 📉";
  }
  
  // Muscle building
  if (lowerPrompt.includes('muscle') || lowerPrompt.includes('bulk') || lowerPrompt.includes('gain')) {
    return "Building muscle requires: Progressive resistance training 3-4x/week, adequate protein (1-1.2g per lb bodyweight), sufficient calories (slight surplus), and 7-9 hours of sleep for recovery. Focus on compound movements and be patient - muscle growth takes time! 💪";
  }
  
  // Motivation
  if (lowerPrompt.includes('motivation') || lowerPrompt.includes('tired') || lowerPrompt.includes('lazy')) {
    return "I understand motivation can be tough! Remember: You don't have to feel motivated to take action. Start small - even 10 minutes counts. Focus on how you feel AFTER exercise, not before. You're building a stronger, healthier version of yourself. Every workout is a victory! 🌟";
  }
  
  // General greeting
  if (lowerPrompt.includes('hi') || lowerPrompt.includes('hello') || lowerPrompt.includes('hey')) {
    return "Hello! I'm your AI fitness coach at FitMate! 👋 I'm here to help you with workouts, nutrition, motivation, and reaching your fitness goals. What would you like to know about today? Whether it's exercise form, meal planning, or staying motivated - I've got you covered! 💪";
  }
  
  // Default response
  return "That's a great fitness question! While I'm having some technical difficulties with my advanced AI features, I can still help you with general fitness advice. Remember: consistency is key, proper form prevents injury, and small progress is still progress. What specific aspect of fitness would you like to focus on? 🏋️‍♂️";
};

// Helper function for fitness coaching
export const getFitnessAdvice = async (prompt: string) => {
  console.log('🤖 getFitnessAdvice called with prompt:', prompt.substring(0, 50) + '...');
  
  // First try the smart fallback for immediate response
  const smartResponse = getSmartFitnessResponse(prompt);
  
  try {
    // Validate setup
    if (!geminiModel) {
      console.log('⚠️ Gemini model not initialized, using smart fallback');
      return smartResponse;
    }
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.log('⚠️ API key not configured, using smart fallback');
      return smartResponse;
    }
    
    if (!apiKey.startsWith('AIza')) {
      console.log('⚠️ Invalid API key format, using smart fallback');
      return smartResponse;
    }

    const fullPrompt = `You are a professional fitness coach and nutritionist at FitMate gym. Provide helpful, accurate, and motivating advice. Keep responses concise and actionable. Always be encouraging and supportive.

User question: ${prompt}

Please provide a helpful response about fitness, nutrition, or exercise.`;
    
    console.log('📤 Attempting Gemini API call...');
    
    // Add timeout to prevent hanging
    const result = await Promise.race([
      geminiModel.generateContent(fullPrompt),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 8000)
      )
    ]);
    
    if (!result || !result.response) {
      console.log('⚠️ Invalid API response, using smart fallback');
      return smartResponse;
    }
    
    const responseText = result.response.text();
    
    if (!responseText || responseText.trim().length === 0) {
      console.log('⚠️ Empty API response, using smart fallback');
      return smartResponse;
    }
    
    console.log('✅ Successfully got Gemini AI response');
    return responseText;
    
  } catch (error) {
    console.log('⚠️ API error, using smart fallback:', error instanceof Error ? error.message : 'Unknown error');
    return smartResponse;
  }
}

// Helper function for workout planning
export const generateWorkoutPlan = async (
  fitnessLevel: string,
  goals: string,
  availableTime: string,
  equipment: string
) => {
  try {
    const prompt = `Create a personalized workout plan with the following details:
    - Fitness Level: ${fitnessLevel}
    - Goals: ${goals}
    - Available Time: ${availableTime}
    - Equipment: ${equipment}
    
    Please provide a structured workout plan with exercises, sets, reps, and rest periods.`;
    
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw new Error('Failed to generate workout plan. Please try again.');
  }
}

// Helper function for nutrition advice
export const getNutritionAdvice = async (
  dietaryGoals: string,
  restrictions: string,
  currentWeight: string,
  targetWeight: string
) => {
  try {
    const prompt = `Provide nutrition advice for:
    - Dietary Goals: ${dietaryGoals}
    - Restrictions: ${restrictions}
    - Current Weight: ${currentWeight}
    - Target Weight: ${targetWeight}
    
    Include meal suggestions, calorie recommendations, and macro breakdowns.`;
    
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error getting nutrition advice:', error);
    throw new Error('Failed to get nutrition advice. Please try again.');
  }
}