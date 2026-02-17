# Vercel Deployment Guide for buyIT

This guide will walk you through deploying the buyIT app to Vercel in simple steps.

## Prerequisites

- Node.js installed (v16 or higher)
- npm or yarn package manager
- Git installed
- GitHub account (for deploying via GitHub)
- Vercel account (free tier available)

---

## Step 1: Prepare Your Project

### 1.1 Make sure everything is committed to Git
```bash
git init
git add .
git commit -m "Initial commit: buyIT app ready for deployment"
```

If you haven't initialized Git yet, run the above commands. If you already have a Git repo, just make sure all your changes are committed.

### 1.2 Push to GitHub (Recommended)
1. Create a new repository on GitHub (https://github.com/new)
2. Name it `buyIT` (or any name you prefer)
3. Run these commands in your project folder:
```bash
git remote add origin https://github.com/YOUR_USERNAME/buyIT.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Set Up Environment Variables

### 2.1 Create a `.env.production` file (for Vercel)
In your project root, create a file named `.env.production` with your API keys:

```
VITE_GOOGLE_API_KEY=YOUR_HUGGINGFACE_TOKEN_HERE
VITE_LLM_PROVIDER=huggingface
```

**Important:** Keep `.env.local` for local development and `.env.production` for production.

### 2.2 (Alternative) Configure via Vercel Dashboard
You can also add environment variables directly in the Vercel dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add each variable from your `.env.production` file

---

## Step 3: Configure Vite for Vercel

### 3.1 Update `vite.config.js` for production

Your current `vite.config.js` has proxy settings that work locally. For Vercel, you need to handle CORS differently.

Update your `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/huggingface': {
        target: 'https://router.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/huggingface/, '')
      },
      '/api/google': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google/, '')
      },
      '/api/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/groq/, '')
      },
      '/api/together': {
        target: 'https://api.together.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/together/, '')
      },
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, '')
      }
    }
  }
})
```

### 3.2 Create a Vercel API Route Handler

Since proxying won't work in production, create a serverless function. Create this file:

**File: `api/chat.js`**

```javascript
// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider, prompt, key } = req.body;

  try {
    if (provider === 'huggingface') {
      const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistralai/Mistral-7B-Instruct-v0.2:together',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;
      return res.status(200).json({ text });
    }

    // Add other providers similarly...
    return res.status(400).json({ error: 'Provider not supported' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

### 3.3 Update `App.jsx` to use the API route

Replace the `fetchFromHuggingFace` function in `App.jsx`:

```javascript
async function fetchFromHuggingFace(prompt, key) {
  try {
    const endpoint = window.location.hostname === 'localhost' 
      ? '/api/huggingface/chat/completions'
      : '/api/chat';

    const body = window.location.hostname === 'localhost'
      ? JSON.stringify({
          model: 'mistralai/Mistral-7B-Instruct-v0.2:together',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 150
        })
      : JSON.stringify({ provider: 'huggingface', prompt, key });

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(window.location.hostname === 'localhost' && { 'Authorization': `Bearer ${key}` })
      },
      body
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('HF API Error:', res.status, errorText);
      return null;
    }

    const data = await res.json();
    const text = window.location.hostname === 'localhost'
      ? data?.choices?.[0]?.message?.content
      : data?.text;

    return text?.trim() || null;
  } catch (e) {
    console.error('Hugging Face API error:', e.message);
    return null;
  }
}
```

---

## Step 4: Create `vercel.json` Configuration

Create a file named `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_GOOGLE_API_KEY": "@vite_google_api_key",
    "VITE_LLM_PROVIDER": "huggingface"
  }
}
```

---

## Step 5: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

---

## Step 6: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository (`buyIT`)
4. Click "Import"
5. Set environment variables:
   - `VITE_GOOGLE_API_KEY`: Your HuggingFace token
   - `VITE_LLM_PROVIDER`: `huggingface`
6. Click "Deploy"

**That's it!** Vercel will automatically:
- Build your project
- Deploy to a live URL
- Set up automatic redeployments when you push to GitHub

### Option B: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy your project
vercel

# Follow the prompts:
# - Which scope? (Select your account)
# - Link to existing project? (No, for first time)
# - Project name? (buyIT or your choice)
# - Framework preset? (Vite)
# - Modify build settings? (No)
```

---

## Step 7: Add Environment Variables in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your `buyIT` project
3. Click "Settings"
4. Go to "Environment Variables"
5. Add these variables:

| Key | Value |
|-----|-------|
| `VITE_GOOGLE_API_KEY` | Your HuggingFace token (from .env.local) |
| `VITE_LLM_PROVIDER` | `huggingface` |

6. Click "Add Environment Variables"

---

## Step 8: Verify Your Deployment

After deployment:

1. Vercel will give you a live URL (e.g., `https://buyit.vercel.app`)
2. Open it in your browser
3. Test the app to make sure everything works
4. Check that the dark mode toggle works
5. Test a spending calculation to ensure API calls work

---

## Step 9: Set Up Automatic Deployments

Once connected to GitHub, every time you push to the `main` branch, Vercel will automatically redeploy your app.

To push updates:
```bash
git add .
git commit -m "Your message here"
git push origin main
```

---

## Troubleshooting

### Issue: Environment variables not working

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add the variables there
3. Redeploy the project (Settings → Deployments → Redeploy)

### Issue: API calls failing in production

**Solution:**
1. Check that your API key is correct in Vercel environment variables
2. Use the serverless function approach (`api/chat.js`)
3. Check browser console for errors (F12 → Console tab)

### Issue: Dark mode not working

**Solution:**
The CSS transition should work. Clear browser cache (Ctrl+Shift+Del) and refresh.

### Issue: Build failing

**Solution:**
```bash
# Test locally first
npm run build

# Check for errors and fix them
npm run dev
```

---

## Custom Domain (Optional)

To use your own domain instead of `vercel.app`:

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS instructions from your domain provider

---

## Useful Commands

```bash
# Check build locally before deployment
npm run build

# Preview the production build locally
npm run preview

# Deploy with CLI
vercel

# Redeploy current version
vercel --prod
```

---

## Security Notes

- **Never** commit `.env.local` to GitHub (it's already in `.gitignore`)
- Store sensitive keys like API keys in Vercel's Environment Variables, not in code
- The `.env.production` file should only have the production-safe values
- Each environment (development, staging, production) can have different API keys

---

## Next Steps

After deployment:
1. Share the live URL with friends/family
2. Monitor the Vercel Dashboard for analytics
3. Set up error tracking (optional: integrate with Sentry.io)
4. Consider upgrading Vercel plan as traffic grows

---

## Support

- Vercel Docs: https://vercel.com/docs
- Contact Vercel: https://vercel.com/support
- GitHub Issues: https://github.com/YOUR_USERNAME/buyIT/issues

---

**Your app is now live on Vercel! 🎉**
