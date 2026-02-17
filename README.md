# Worth It Today?

A tiny single-page React app that gives a gentle perspective on a purchase — no judgment, just clarity. It calculates how many hours of work a purchase represents and provides supportive, non-judgmental reflections to help you make thoughtful decisions.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run locally:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

## AI Integration (Optional but Recommended)

The app can generate personalized, warm reflections about your purchase using a free LLM API. 

**🔗 See [README_API.md](README_API.md) for all free API options and comparisons!**

Choose one of the options below:

### Option 0: Google Generative AI (Gemini) - Easiest Setup

**Best for:** Easiest setup, generous free tier, no credit card required.

1. Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key in new project"**
3. Copy your API Key
4. Create a `.env.local` file in your project root:
   ```
   VITE_GOOGLE_API_KEY=your-api-key-here
   VITE_LLM_PROVIDER=google
   ```
5. Restart `npm run dev`

**Cost:** Completely free tier with generous rate limits. Perfect for this app!

---

### Option 1: OpenAI (Recommended for Quality)

**Best for:** Quality, consistent responses. Free trial gives you $5 credit (expires after 3 months).

1. Go to [platform.openai.com](https://platform.openai.com/signup)
2. Sign up with your email or Google/Microsoft account
3. Navigate to **Billing** → **Credits** to see your free $5 trial credit
4. Go to **API keys** in the left sidebar
5. Click **Create new secret key**
6. Copy the key (you'll only see it once!)
7. Create a `.env.local` file in your project root:
   ```
   VITE_OPENAI_KEY=sk-your-key-here
   VITE_LLM_PROVIDER=openai
   ```
8. Restart `npm run dev`

**Cost:** Free $5 trial per account. Models used (`gpt-4o-mini`) cost ~$0.00015 per request (~700 free API calls).

---

### Option 2: Groq (Fastest - Also Free)

**Best for:** Lightning-fast responses and simple setup. No credit card required for the free tier.

1. Go to [console.groq.com](https://console.groq.com)
2. Click **Sign Up** (with Google/GitHub/email)
3. Go to **API Keys** in the left menu
4. Click **Create API Key**
5. Copy and save the key
6. Create a `.env.local` file:
   ```
   VITE_GROQ_KEY=gsk_your-key-here
   VITE_LLM_PROVIDER=groq
   ```
7. Restart `npm run dev`

**Cost:** Completely free. Unlimited requests (rate-limited, but no cost).

---

### Option 3: Hugging Face (Great for Learning)

**Best for:** Open-source models and learning. Free tier available.

1. Go to [huggingface.co](https://huggingface.co)
2. Click **Sign Up** (GitHub/Google/email)
3. Go to your **Settings** → **Access Tokens**
4. Click **New token**
5. Name it "worth-it-today"
6. Select **Read** access
7. Copy the token
8. Create a `.env.local` file:
   ```
   VITE_HF_KEY=hf_your-token-here
   VITE_LLM_PROVIDER=huggingface
   ```
9. Restart `npm run dev`

**Cost:** Free tier with rate limits.

---

### Option 4: Together AI (Also Free)

**Best for:** Open-source models and good performance.

1. Go to [together.ai](https://www.together.ai)
2. Sign up (Google/GitHub/email)
3. Navigate to **API Keys**
4. Create a new API key
5. Copy your key
6. Create a `.env.local` file:
   ```
   VITE_TOGETHER_KEY=your-key-here
   VITE_LLM_PROVIDER=together
   ```
7. Restart `npm run dev`

**Cost:** Free tier with generous limits.

---

## Environment Variable Setup

Create a `.env.local` file in your project root (DO NOT commit this to git):

```env
# Choose ONE of the following providers:

# Google Generative AI (Gemini) - RECOMMENDED (easiest, no CC)
VITE_GOOGLE_API_KEY=your-google-api-key-here
VITE_LLM_PROVIDER=google

# OpenAI (recommended for quality)
# VITE_OPENAI_KEY=sk-your-openai-key
# VITE_LLM_PROVIDER=openai

# Groq (recommended for speed)
# VITE_GROQ_KEY=gsk-your-groq-key
# VITE_LLM_PROVIDER=groq

# Hugging Face
# VITE_HF_KEY=hf_your-token
# VITE_LLM_PROVIDER=huggingface

# Together AI
# VITE_TOGETHER_KEY=your-key
# VITE_LLM_PROVIDER=together
```

**Note:** Only one API key is needed at a time. The app will use whichever is configured.

## How It Works

1. **You provide:**
   - Item name (e.g., "new headphones")
   - Price (e.g., 79.99)
   - Monthly income (e.g., 3500)

2. **The app calculates:**
   - **Hourly wage:** Monthly income ÷ 22 working days ÷ 8 hours
   - **Time cost:** How many hours of work the purchase represents
   - **Income percentage:** What percent of your monthly income it represents

3. **AI Reflection:**
   - Generates a warm, supportive message (if API is configured)
   - Reframes the purchase in a thoughtful way
   - Reminds you it's okay if this genuinely improves your day

4. **Suggestions:**
   - Offers gentle, contextual advice based on price range:
     - **Small purchases (<$50):** Quick reflection time suggestions
     - **Medium purchases ($50-$500):** Sleep-on-it suggestions
     - **Large purchases (>$500):** Deep-think suggestions

## Features

- ✨ Beautiful, modern UI with smooth animations
- 🌐 No backend required — runs entirely in the browser
- 🔒 No data collection or tracking
- 📱 Mobile responsive
- ⚡ Instant calculations
- 🤖 AI-powered supportive reflections (optional)
- 🚀 Deploy instantly to Vercel, Netlify, or any static host

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **New Project** → select your GitHub repo
4. In **Environment Variables**, add:
   - `VITE_OPENAI_KEY` (or your chosen provider's key)
5. Click **Deploy**

That's it! Your app is live and users can start reflecting. 🎉

## Development Notes

- No database needed
- No authentication
- No server required
- Fully static deployment
- ~50KB gzipped bundle

## Troubleshooting

**"API error occurred"?**
- Check your env variable name is correct
- Verify your API key is valid
- Make sure you're not rate-limited (free tiers have limits)

**No reflection appearing?**
- Check browser console for errors (`F12` → Console tab)
- If no API key is set, a friendly fallback message appears instead

**Want the app to work without AI?**
- Simply don't set any API key. A warm, local fallback message will always appear.

## Free Credit Comparison

| Provider | Free Amount | Duration | No CC Required? |
|----------|------------|----------|-----------------|
| Google Gemini | Generous free tier | Forever | Yes |
| Groq | Unlimited | Forever | Yes |
| OpenAI | $5 | 3 months | No (required) |
| Hugging Face | Rate-limited | Forever | Yes |
| Together AI | Rate-limited | Forever | Yes |

**Our recommendation:** Start with **Google Gemini** for easiest setup with no credit card. Move to **OpenAI** if you want the highest quality responses and don't mind adding a credit card.

## License

MIT - Feel free to use and modify!

---

Built with ❤️ to help you make thoughtful spending decisions.
