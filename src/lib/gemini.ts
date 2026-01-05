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
    model: 'gemini-2.5-flash',
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
  
  // Workout plan creation
  if (lowerPrompt.includes('workout plan') || lowerPrompt.includes('create workout') || lowerPrompt.includes('training plan')) {
    return `**Custom Workout Plan for You:**

**Week 1-2: Foundation Building**
• Day 1 (Upper Body): Push-ups 3x8-12, Dumbbell rows 3x8-12, Shoulder press 3x8-10, Plank 3x30sec
• Day 2 (Lower Body): Bodyweight squats 3x12-15, Lunges 3x10 each leg, Glute bridges 3x12-15, Wall sit 3x30sec
• Day 3 (Full Body): Burpees 3x5-8, Mountain climbers 3x20, Jumping jacks 3x30sec, Dead bugs 3x10 each side

**Week 3-4: Progressive Overload**
• Add weight or increase reps by 10-20%
• Focus on form over speed
• Rest 48-72 hours between sessions

**Tips:** Warm up 5-10 min, cool down with stretching, stay hydrated!`;
  }

  // Form improvement
  if (lowerPrompt.includes('form') || lowerPrompt.includes('technique') || lowerPrompt.includes('improve')) {
    return `**Perfect Your Exercise Form:**

**Key Principles:**
• Start Light: Master bodyweight before adding weight
• Control the Movement: 2 seconds down, 1 second pause, 2 seconds up
• Full Range of Motion: Complete the entire movement pattern
• Breathe Properly: Exhale on exertion, inhale on release

**Common Form Fixes:**
• Squats: Keep chest up, knees track over toes, weight in heels
• Push-ups: Straight line from head to heels, elbows at 45 degrees
• Deadlifts: Keep bar close to body, hinge at hips, neutral spine

**Pro Tip:** Record yourself or use mirrors to check form!`;
  }

  // Abs/core exercises
  if (lowerPrompt.includes('abs') || lowerPrompt.includes('core') || lowerPrompt.includes('stomach')) {
    return `**Best Ab Exercises for a Strong Core:**

**Beginner Level:**
• Plank: 3x30-60sec - Full body stability
• Dead Bug: 3x10 each side - Core control
• Glute Bridge: 3x12-15 - Posterior chain
• Modified Bicycle Crunches: 3x20 total

**Intermediate Level:**
• Mountain Climbers: 3x30sec - Dynamic core
• Russian Twists: 3x20 - Obliques
• Leg Raises: 3x10-12 - Lower abs
• Side Plank: 3x20-30sec each side

**Advanced Level:**
• Hanging Leg Raises: 3x8-12
• Ab Wheel Rollouts: 3x8-10
• Dragon Flags: 3x5-8

**Remember:** Abs are made in the kitchen! Combine with proper nutrition.`;
  }

  // Post-workout meals
  if (lowerPrompt.includes('post-workout') || lowerPrompt.includes('after workout') || lowerPrompt.includes('post workout') || (lowerPrompt.includes('meal') && lowerPrompt.includes('workout'))) {
    return `**Perfect Post-Workout Meals:**

**Within 30 Minutes (Recovery Window):**
• Protein Shake: Whey protein + banana + berries
• Chocolate Milk: Quick carbs + protein (3:1 ratio)
• Greek Yogurt: With honey and granola

**Full Meals (1-2 Hours Post-Workout):**
• Muscle Building: Grilled chicken + sweet potato + broccoli
• Weight Loss: Salmon + quinoa + mixed vegetables
• Vegetarian: Lentil bowl + brown rice + avocado
• Quick Option: Tuna sandwich + apple + nuts

**Hydration Goals:**
• 16-24oz water immediately after
• Replace 150% of fluid lost through sweat
• Add electrolytes for workouts over 1 hour

**Timing Matters:** Eat within 2 hours for optimal recovery!`;
  }

  // General workout questions
  if (lowerPrompt.includes('workout') || lowerPrompt.includes('exercise') || lowerPrompt.includes('training')) {
    return `**Smart Workout Strategy:**

**The Big 5 Compound Movements:**
1. Squats - Legs, glutes, core
2. Deadlifts - Full posterior chain
3. Push-ups/Bench Press - Chest, shoulders, triceps
4. Pull-ups/Rows - Back, biceps
5. Overhead Press - Shoulders, core

**Weekly Structure:**
• Frequency: 3-4 days per week
• Sets: 3-4 per exercise
• Reps: 8-12 for muscle building, 12-15 for endurance
• Rest: 48-72 hours between training same muscles

**Progressive Overload:**
• Week 1-2: Master form
• Week 3-4: Add weight (5-10%)
• Week 5-6: Increase reps or sets
• Week 7-8: Deload (reduce intensity)

**Always:** Warm up 5-10 min, cool down with stretching!`;
  }
  
  // Nutrition related
  if (lowerPrompt.includes('diet') || lowerPrompt.includes('nutrition') || lowerPrompt.includes('food') || lowerPrompt.includes('eat') || lowerPrompt.includes('meal')) {
    return `**Nutrition for Fitness Success:**

**Macronutrient Breakdown:**
• Protein: 0.8-1.2g per lb bodyweight (muscle building/recovery)
• Carbs: 2-3g per lb bodyweight (energy for workouts)
• Fats: 0.3-0.4g per lb bodyweight (hormone production)

**Best Food Sources:**
• Proteins: Chicken, fish, eggs, Greek yogurt, beans, quinoa
• Carbs: Oats, sweet potatoes, brown rice, fruits, vegetables
• Fats: Avocado, nuts, olive oil, fatty fish

**Meal Timing:**
• Pre-workout: Light carbs + small protein (1-2 hours before)
• Post-workout: Protein + carbs within 30 minutes
• Daily: Eat every 3-4 hours to maintain energy

**Hydration:** 8-10 glasses water daily, more during workouts!`;
  }
  
  // Weight loss
  if (lowerPrompt.includes('lose weight') || lowerPrompt.includes('loose weight') || lowerPrompt.includes('fat loss') || lowerPrompt.includes('cutting') || lowerPrompt.includes('weight loss')) {
    return `**Effective Weight Loss Strategy:**

**Calorie Management:**
• Deficit: 300-500 calories below maintenance
• Track: Use apps like MyFitnessPal for 1-2 weeks
• Don't Starve: Minimum 1200 calories for women, 1500 for men

**Exercise Combination:**
• Strength Training: 3x/week (preserves muscle)
• Cardio: 2-3x/week (burns calories)
• HIIT: 1-2x/week (efficient fat burning)

**Sustainable Habits:**
• Meal Prep: Plan and prepare meals in advance
• Protein Priority: Keeps you full and preserves muscle
• Sleep: 7-9 hours (affects hunger hormones)
• Patience: 1-2 lbs per week is healthy and sustainable

**Remember:** It's a marathon, not a sprint!`;
  }
  
  // Strength training
  if (lowerPrompt.includes('get stronger') || lowerPrompt.includes('strength') || lowerPrompt.includes('strong')) {
    return `**Get Stronger - Strength Training Guide:**

**Progressive Overload Principles:**
• Increase weight by 2.5-5lbs when you can complete all sets/reps
• Focus on compound movements (squat, deadlift, bench, row)
• Train 3-4x per week with 48-72 hours rest between sessions
• Track your lifts to monitor progress

**Strength Building Program:**
• Week 1-2: 3 sets x 8-10 reps at 70-75% max effort
• Week 3-4: 4 sets x 6-8 reps at 75-80% max effort  
• Week 5-6: 5 sets x 4-6 reps at 80-85% max effort
• Week 7: Deload - reduce weight by 10-15%

**Key Exercises for Strength:**
• Squats: King of lower body strength
• Deadlifts: Full body power and posterior chain
• Bench Press: Upper body pushing strength
• Overhead Press: Shoulder and core strength
• Pull-ups/Rows: Upper body pulling strength

**Nutrition for Strength:**
• Eat in slight calorie surplus (200-300 calories)
• Protein: 1g per lb bodyweight minimum
• Carbs: Fuel your workouts (2-3g per lb bodyweight)
• Sleep: 7-9 hours for recovery and strength gains

**Timeline:** Strength gains visible in 2-4 weeks, significant improvements in 8-12 weeks!`;
  }

  // Chest exercises
  if (lowerPrompt.includes('chest press') || lowerPrompt.includes('bench press') || lowerPrompt.includes('chest workout') || lowerPrompt.includes('chest exercise')) {
    return `**Perfect Chest Press Technique:**

**Bench Press Setup:**
• Lie flat on bench, feet firmly on floor
• Grip bar slightly wider than shoulder-width
• Retract shoulder blades, create slight arch in lower back
• Bar should be over your chest/nipple line

**Movement Execution:**
• Unrack bar and position over chest
• Lower bar slowly (2-3 seconds) to chest
• Touch chest lightly, don't bounce
• Press up explosively, driving through heels
• Keep elbows at 45-degree angle to body

**Common Mistakes to Avoid:**
• Flaring elbows too wide (90 degrees)
• Bouncing bar off chest
• Lifting feet off ground
• Arching back excessively
• Not using full range of motion

**Progression Options:**
• Beginner: Push-ups → Incline bench → Flat bench
• Intermediate: Add weight gradually (2.5-5lbs per week)
• Advanced: Pause reps, tempo variations, different angles

**Safety Tips:**
• Always use a spotter for heavy weights
• Start light and focus on form first
• Warm up with lighter weights
• Don't train chest more than 2-3x per week

**Rep Ranges:**
• Strength: 3-5 reps at 85-90% max
• Muscle Building: 6-12 reps at 70-80% max
• Endurance: 12-20 reps at 60-70% max`;
  }

  // Dumbbell form
  if (lowerPrompt.includes('dumble') || lowerPrompt.includes('dumbbell') || lowerPrompt.includes('proper form')) {
    return `**Perfect Dumbbell Form Guide:**

**General Dumbbell Principles:**
• Start with lighter weights to master form
• Control the weight through full range of motion
• Keep core engaged throughout all movements
• Breathe out on exertion, in on the negative

**Common Dumbbell Exercises & Form:**

**Dumbbell Chest Press:**
• Lie on bench, dumbbells at chest level
• Press up and slightly inward (dumbbells almost touch at top)
• Lower with control until slight stretch in chest
• Keep wrists straight and strong

**Dumbbell Rows:**
• Hinge at hips, keep back straight
• Pull dumbbells to lower ribs/upper abs
• Squeeze shoulder blades together at top
• Don't let shoulders round forward

**Dumbbell Shoulder Press:**
• Start with dumbbells at shoulder height
• Press straight up, not forward
• Don't arch back excessively
• Lower with control to ear level

**Dumbbell Squats:**
• Hold dumbbells at sides or shoulders
• Feet shoulder-width apart
• Sit back like sitting in chair
• Keep chest up, knees track over toes

**Form Check Tips:**
• Use mirrors to check your form
• Start with bodyweight, then add dumbbells
• Focus on feeling the target muscles working
• If form breaks down, reduce weight immediately

**Progressive Overload:**
• Week 1-2: Master movement pattern
• Week 3-4: Increase weight by 2.5-5lbs
• Week 5-6: Add more reps or sets
• Always prioritize form over heavy weight!`;
  }
  
  // Muscle building
  if (lowerPrompt.includes('muscle') || lowerPrompt.includes('bulk') || lowerPrompt.includes('gain') || lowerPrompt.includes('build')) {
    return `**Muscle Building Blueprint:**

**Training Principles:**
• Progressive Overload: Gradually increase weight, reps, or sets
• Frequency: Train each muscle group 2-3x per week
• Volume: 10-20 sets per muscle group per week
• Rest: 48-72 hours between training same muscles

**Nutrition for Growth:**
• Calorie Surplus: 200-500 calories above maintenance
• Protein: 1-1.2g per lb bodyweight
• Timing: Protein every 3-4 hours throughout the day
• Post-Workout: 20-40g protein within 2 hours

**Recovery Essentials:**
• Sleep: 7-9 hours (muscle growth happens during rest)
• Hydration: Adequate water for protein synthesis
• Stress Management: High cortisol inhibits muscle growth

**Timeline:** Noticeable changes in 4-6 weeks, significant results in 3-6 months!`;
  }
  
  // Motivation
  if (lowerPrompt.includes('motivation') || lowerPrompt.includes('tired') || lowerPrompt.includes('lazy') || lowerPrompt.includes('give up')) {
    return `**Motivation & Mindset Boost:**

**Mindset Shifts:**
• Progress over perfection - Small steps lead to big changes
• Identity shift - "I am someone who exercises" vs "I'm trying to exercise"
• Process goals - Focus on actions, not just outcomes
• Self-compassion - One bad day doesn't ruin everything

**Practical Strategies:**
• Start small - 10 minutes is better than 0 minutes
• Schedule it - Treat workouts like important appointments
• Find your why - Connect fitness to your deeper values
• Track wins - Celebrate every small victory

**Energy Boosters:**
• Morning workouts - Get it done before life gets busy
• Workout buddy - Accountability makes it easier
• Playlist power - Music can increase performance by 15%
• Reward system - Treat yourself for consistency

Remember: You're stronger than your excuses!`;
  }
  
  // General greeting
  if (lowerPrompt.includes('hi') || lowerPrompt.includes('hello') || lowerPrompt.includes('hey')) {
    return `**Welcome to FitMate AI Coach!**

I'm here to help you crush your fitness goals! I can assist with:

**Workout Planning** - Custom routines for any fitness level
**Nutrition Guidance** - Meal planning and macro advice  
**Progress Tracking** - Form tips and technique improvement
**Motivation** - Mindset coaching and habit building
**Goal Setting** - Realistic timelines and strategies

**Popular Questions:**
• "Create a workout plan for beginners"
• "Best exercises for abs"
• "Post-workout meal suggestions"
• "How to improve my squat form"
• "Help me stay motivated"

What fitness goal can I help you achieve today?`;
  }
  
  // Default response
  return `**Great Fitness Question!**

I'd love to give you a more specific answer! Here are some ways I can help:

**Workout Related:** "Create a workout plan", "Best exercises for [body part]", "How to improve form"
**Nutrition:** "Post-workout meals", "Weight loss diet", "Muscle building nutrition"
**Goals:** "Lose weight", "Build muscle", "Get stronger", "Improve endurance"
**Motivation:** "Stay motivated", "Build habits", "Overcome plateaus"

**General Fitness Principles:**
• Consistency beats perfection
• Progressive overload drives results  
• Recovery is when you actually grow
• Nutrition is 70% of your results

What specific aspect of fitness would you like to dive deeper into?`;
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