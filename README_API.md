# Free LLM API Options for buyIT

Your app supports multiple free LLM providers. If Google's quota is exhausted, use one of these alternatives:

## 🟢 Currently Recommended: Groq (Fastest Free Tier)

**Speed:** Ultra-fast inference  
**Free Tier:** Very generous - no daily limits on most models  
**Setup Time:** 2 minutes

1. Sign up: https://console.groq.com/keys
2. Copy your API key
3. Update `.env.local`:
```env
VITE_GOOGLE_API_KEY=your_groq_api_key_here
VITE_LLM_PROVIDER=groq
```
4. No code changes needed - the app auto-detects the provider

---

## 🟠 Hugging Face Inference API

**Speed:** Good  
**Free Tier:** Limited but sufficient for testing  
**Setup Time:** 3 minutes

1. Sign up: https://huggingface.co/join
2. Get your API token: https://huggingface.co/settings/tokens
3. Update `.env.local`:
```env
VITE_GOOGLE_API_KEY=hf_your_token_here
VITE_LLM_PROVIDER=huggingface
```

---

## 🟡 Together AI

**Speed:** Very fast  
**Free Tier:** Decent - $5 free credits  
**Setup Time:** 2 minutes

1. Sign up: https://www.together.ai/
2. Get your API key: https://api.together.ai/
3. Update `.env.local`:
```env
VITE_GOOGLE_API_KEY=your_together_api_key
VITE_LLM_PROVIDER=together
```

---

## 🔵 Google Gemini (Current)

**Speed:** Good  
**Free Tier:** Limited (60 requests per minute free tier, daily limits)  
**Setup Time:** 1 minute

- Currently using this
- Quotas reset daily at midnight UTC
- Add billing for unlimited access

**Get API Key:** https://ai.google.dev/tutorials/setup

```env
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_LLM_PROVIDER=google
```

---

## 🔴 OpenAI (Paid, but cheapest)

**Speed:** Good  
**Cost:** $0.00015 per 1K input tokens (very cheap for this use case)  
**Setup Time:** 2 minutes

1. Sign up: https://platform.openai.com
2. Add payment method
3. Get API key: https://platform.openai.com/api-keys
4. Update `.env.local`:
```env
VITE_GOOGLE_API_KEY=sk-your_openai_key
VITE_LLM_PROVIDER=openai
```

---

## How to Switch Between Providers

All you need to do is update your `.env.local` file with:

```env
VITE_GOOGLE_API_KEY=<your_api_key>
VITE_LLM_PROVIDER=<provider_name>
```

**Supported providers:** `google`, `groq`, `huggingface`, `together`, `openai`

Then refresh your browser - no code changes needed!

---

## Recommended Strategy

1. **First choice:** Groq (fastest, most generous free tier)
2. **Second choice:** Together AI (good speed, free credits)
3. **Third choice:** Hugging Face (reliable, works well)
4. **If paid:** OpenAI (extremely cheap for this use case)

---

## Testing Your API Key

After updating `.env.local`:
1. Refresh the browser (Ctrl+R)
2. Open DevTools (F12) → Console
3. Try "Give me perspective"
4. Check console logs for successful API response

If still getting 429/quota errors, wait and try a different provider.

---

## Monitoring Usage

- **Google:** https://ai.dev/rate-limit
- **Groq:** https://console.groq.com/docs
- **Together:** https://www.together.ai/dashboard
- **Hugging Face:** https://huggingface.co/settings/usage
- **OpenAI:** https://platform.openai.com/account/billing/overview
