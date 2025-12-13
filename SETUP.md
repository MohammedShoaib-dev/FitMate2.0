# FitMate Setup Guide

## Environment Variables Configuration

To enable all features of FitMate, you need to configure the following environment variables in your `.env` file.

### 1. Supabase Configuration

Supabase provides the backend database and authentication services.

1. **Create a Supabase Project:**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project
   - Wait for the project to be fully set up

2. **Get Your Credentials:**
   - Go to Project Settings → API
   - Copy the Project URL and anon/public key

3. **Update .env file:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Database Tables:**
   Run these SQL commands in the Supabase SQL Editor:

   ```sql
   -- Create users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create workouts table
   CREATE TABLE workouts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     description TEXT,
     exercises JSONB DEFAULT '[]',
     duration INTEGER,
     calories_burned INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create nutrition_logs table
   CREATE TABLE nutrition_logs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
     food_items JSONB DEFAULT '[]',
     total_calories INTEGER NOT NULL,
     total_protein INTEGER NOT NULL,
     total_carbs INTEGER NOT NULL,
     total_fat INTEGER NOT NULL,
     logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can view own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can manage own workouts" ON workouts FOR ALL USING (auth.uid() = user_id);
   CREATE POLICY "Users can view own nutrition logs" ON nutrition_logs FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can manage own nutrition logs" ON nutrition_logs FOR ALL USING (auth.uid() = user_id);
   ```

### 2. Gemini AI Configuration

Gemini AI powers the AI Coach feature for personalized fitness advice.

1. **Get API Key:**
   - Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key

2. **Update .env file:**
   ```env
   VITE_GEMINI_API_KEY=your-gemini-api-key-here
   ```

### 3. Complete .env File Example

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

## Demo Credentials

If you don't want to set up Supabase immediately, the app includes demo credentials:

**Regular Users:**
- Email: `user@fitmate.com` | Password: `user123`
- Email: `jane@fitmate.com` | Password: `jane123`

**Admin:**
- Email: `admin@fitmate.com` | Password: `admin123`

## Features Enabled by Configuration

### With Supabase:
- ✅ Real user authentication
- ✅ Persistent data storage
- ✅ User profiles and preferences
- ✅ Workout and nutrition tracking
- ✅ Multi-user support

### With Gemini AI:
- ✅ Intelligent AI Coach responses
- ✅ Personalized workout plans
- ✅ Nutrition advice
- ✅ Form correction tips
- ✅ Motivational coaching

### Without Configuration:
- ✅ Demo authentication (localStorage)
- ✅ Static UI components
- ✅ Predefined responses
- ⚠️ No data persistence
- ⚠️ Limited AI functionality

## Getting Started

1. Copy `.env.example` to `.env`
2. Fill in your API keys and URLs
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server
5. Navigate to the app and test the login functionality

## Troubleshooting

- **Supabase connection issues:** Check your URL and key are correct
- **Gemini AI not working:** Verify your API key and check browser console for errors
- **Authentication failing:** Ensure your Supabase policies are set up correctly
- **CORS errors:** Make sure your domain is added to Supabase allowed origins

## Security Notes

- Never commit your `.env` file to version control
- Use environment-specific keys for development vs production
- Regularly rotate your API keys
- Set up proper RLS policies in Supabase for production use