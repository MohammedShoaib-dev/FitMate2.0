# Environment Variables Test

## Current Status Check

Your `.env` file contains:
```env
VITE_SUPABASE_URL=https://aafbjevzxyliztwbkteo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GEMINI_API_KEY=AIzaSyC8kfx9M_fFtQZOzvN5g9D4fWuoqBQlDQE
```

## Troubleshooting Steps:

### 1. **Restart Development Server** (Most Common Fix)
Environment variables are only loaded when the dev server starts. After adding the Gemini API key:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. **Check Browser Console**
1. Open Admin Dashboard
2. Open browser DevTools (F12)
3. Look for console logs showing environment variable values
4. Should see debug info about API configuration

### 3. **Verify File Location**
Make sure you're editing the `.env` file in the root directory (same level as `package.json`), not `.env.example`.

### 4. **Check for Spaces/Formatting**
Environment variables should have no spaces around the `=`:
```env
# ✅ Correct
VITE_GEMINI_API_KEY=AIzaSyC8kfx9M_fFtQZOzvN5g9D4fWuoqBQlDQE

# ❌ Wrong
VITE_GEMINI_API_KEY = AIzaSyC8kfx9M_fFtQZOzvN5g9D4fWuoqBQlDQE
```

### 5. **Manual Test**
Add this to any component to test:
```javascript
console.log('Env vars:', {
  supabase: import.meta.env.VITE_SUPABASE_URL,
  gemini: import.meta.env.VITE_GEMINI_API_KEY
});
```

## Expected Results After Restart:

✅ **Supabase**: Should show "Configured" but may show "Connected but database tables not set up"
✅ **Gemini AI**: Should show "Configured" and "Connected"

## If Still Not Working:

1. **Clear browser cache** and hard refresh (Ctrl+Shift+R)
2. **Check .env file encoding** - should be UTF-8
3. **Try creating a new .env file** from scratch
4. **Verify no .env.local file** is overriding your settings

The most likely fix is simply restarting your development server!