import React, { useState, useEffect } from 'react'
import LandingPage from './LandingPage'

function formatNumber(n) {
  return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '--'
}

export default function App() {
  const [item, setItem] = useState('')
  const [price, setPrice] = useState('')
  const [income, setIncome] = useState('')
  const [incomeType, setIncomeType] = useState('salary') // 'salary' or 'allowance'
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showLanding, setShowLanding] = useState(true)
  const [theme, setTheme] = useState('day')
  const [lastApiCall, setLastApiCall] = useState(0)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const RATE_LIMIT_MS = 3000 // 3 seconds between requests

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Update cooldown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return
    const timer = setTimeout(() => {
      setCooldownRemaining(Math.max(0, cooldownRemaining - 100))
    }, 100)
    return () => clearTimeout(timer)
  }, [cooldownRemaining])

  const toggleTheme = () => {
    setTheme(prev => prev === 'day' ? 'night' : 'day')
  }

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} theme={theme} toggleTheme={toggleTheme} />
  }

  const compute = async () => {
    const p = parseFloat(price || 0)
    const m = parseFloat(income || 0)
    if (!p || !m) {
      setResult({ error: 'Please enter numbers for price and monthly income.' })
      return
    }

    // Rate limiting check
    const now = Date.now()
    const timeSinceLastCall = now - lastApiCall
    if (timeSinceLastCall < RATE_LIMIT_MS) {
      const remaining = Math.ceil((RATE_LIMIT_MS - timeSinceLastCall) / 1000)
      setResult({ error: `Please wait ${remaining}s before getting another perspective. No spamming! 😊` })
      return
    }

    const hourly = m / (22 * 8)
    const hours = p / hourly
    const percent = (p / m) * 100

    // Get days in current month automatically
    const today = new Date()
    const year = today.getFullYear()
    const currentMonth = today.getMonth()
    const daysInMonth = new Date(year, currentMonth + 1, 0).getDate()

    // Allowance layer: simply divide monthly allowance by days in month
    const dailyAllowance = m / daysInMonth
    const daysUsed = p / dailyAllowance
    
    // Classify tier based on percentage of income (for both salary and allowance)
    let salaryTier = 'comfortable'
    let salaryMessage = 'This is a small, comfortable purchase.'
    if (percent >= 1 && percent < 3) {
      salaryTier = 'reasonable'
      salaryMessage = 'This is a reasonable purchase — absolutely doable if it matters to you.'
    } else if (percent >= 3 && percent < 7) {
      salaryTier = 'larger'
      salaryMessage = 'This is a bigger purchase worth thinking about, but still within reach.'
    } else if (percent >= 7) {
      salaryTier = 'planned'
      salaryMessage = 'This is a planned purchase — consider if it fits your larger goals.'
    }
    
    // Classify tier based on days of allowance used
    let allowanceTier = 'comfortable'
    let allowanceMessage = 'This fits comfortably within your spending flexibility.'
    if (daysUsed >= 2 && daysUsed < 7) {
      allowanceTier = 'reasonable'
      allowanceMessage = 'This is a reasonable purchase — absolutely doable if it matters to you.'
    } else if (daysUsed >= 7 && daysUsed < 14) {
      allowanceTier = 'larger'
      allowanceMessage = 'This is a bigger purchase worth thinking about, but still within reach.'
    } else if (daysUsed >= 14) {
      allowanceTier = 'planned'
      allowanceMessage = 'This is a planned purchase — consider if it fits your larger goals.'
    }

    const baseResult = {
      item: item || 'This item',
      price: p,
      monthly: m,
      hourly,
      hours,
      percent,
      incomeType,
      reflection: null,
      dailyAllowance,
      daysUsed,
      allowanceTier,
      allowanceMessage,
      salaryTier,
      salaryMessage,
    }

    setResult(baseResult)

    // Record API call time for rate limiting
    setLastApiCall(Date.now())
    setCooldownRemaining(RATE_LIMIT_MS)

    // optional LLM reflection
    setLoading(true)
    try {
      const reflection = await fetchReflection({ 
        item: baseResult.item, 
        price: p, 
        percent, 
        hourly, 
        monthly: m, 
        incomeType,
        dailyAllowance,
        daysUsed,
        allowanceTier,
        salaryTier,
        daysInMonth,
      })
      setResult(r => ({ ...r, reflection }))
    } catch (e) {
      setResult(r => ({ ...r, reflection: null }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app" data-theme={theme}>
      <header>
        <div className="header-controls">
          <button className="back-button" onClick={() => setShowLanding(true)}>← Back</button>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
            {theme === 'day' ? '🌙' : '☀️'}
          </button>
        </div>
        <h1>Worth It Today?</h1>
        <p className="tag">✨ A gentle perspective on a purchase — no judgment, just clarity.</p>
      </header>

      <main>
        <div className="card inputs">
          <label>
            💝 What are you thinking about?
            <input value={item} onChange={e => setItem(e.target.value)} placeholder="e.g., new headphones, coffee, flight ticket" />
          </label>

          <label>
            💰 How much does it cost?
            <input value={price} onChange={e => setPrice(e.target.value)} inputMode="decimal" placeholder="e.g., 999" />
          </label>

          <label>
            📊 What's your monthly income source?
            <div className="income-type-toggle">
              <button 
                className={`toggle-btn ${incomeType === 'salary' ? 'active' : ''}`}
                onClick={() => setIncomeType('salary')}
              >
                💼 Salary/Income
              </button>
              <button 
                className={`toggle-btn ${incomeType === 'allowance' ? 'active' : ''}`}
                onClick={() => setIncomeType('allowance')}
              >
                🎁 Allowance
              </button>
            </div>
          </label>

          <label>
            {incomeType === 'salary' ? '💵 Monthly salary' : '🎁 Monthly allowance'}
            <input value={income} onChange={e => setIncome(e.target.value)} inputMode="decimal" placeholder="e.g., 50000" />
          </label>

          <button 
            onClick={compute}
            disabled={loading || cooldownRemaining > 0}
            title={cooldownRemaining > 0 ? `Wait ${Math.ceil(cooldownRemaining / 1000)}s` : ''}
          >
            {loading ? '🤔 Thinking kindly…' : cooldownRemaining > 0 ? `⏳ Wait ${Math.ceil(cooldownRemaining / 1000)}s` : '✨ Give me perspective'}
          </button>
        </div>

        {result && (
          <div className="card result">
            {result.error ? (
              <p className="error">⚠️ {result.error}</p>
            ) : (
              <>
                <h2 className="item">🛍️ {result.item}</h2>

                {result.incomeType === 'salary' ? (
                  <div className="metrics">
                    <div>
                      <div className="label">⏱️ Time cost</div>
                      <div className="value">≈ {formatNumber(result.hours)} hours</div>
                    </div>
                    <div>
                      <div className="label">📈 Share of salary</div>
                      <div className="value">≈ {formatNumber(result.percent)}%</div>
                    </div>
                  </div>
                ) : (
                  <div className="metrics allowance-metrics">
                    <div>
                      <div className="label">💳 Daily allowance</div>
                      <div className="value">₹{formatNumber(result.dailyAllowance)}</div>
                    </div>
                    <div>
                      <div className="label">📅 Days of allowance</div>
                      <div className="value">≈ {formatNumber(result.daysUsed)} days</div>
                    </div>
                  </div>
                )}

                <div className="allowance-message">
                  {result.incomeType === 'salary' ? result.salaryMessage : result.allowanceMessage}
                </div>

                <div className="spending-index">
                  <div className="index-header">
                    <h3>💰 Spending Index</h3>
                  </div>
                  <div className="index-chart">
                    <div className="chart-bar">
                      <div className="segment segment-comfortable" style={{width: '25%'}}></div>
                      <div className="segment segment-reasonable" style={{width: '50%'}}></div>
                      <div className="segment segment-larger" style={{width: '75%'}}></div>
                      <div className="segment segment-planned" style={{width: '100%'}}></div>
                      <div className="indicator" style={{left: `${Math.min((result.incomeType === 'salary' ? result.percent / 7 : result.daysUsed / 14) * 100, 100)}%`}}></div>
                    </div>
                    <div className="chart-labels">
                      <div className="label-item">
                        <div className="label-color comfortable"></div>
                        <span>{result.incomeType === 'salary' ? 'Comfortable (<1%)' : 'Comfortable (<2 days)'}</span>
                      </div>
                      <div className="label-item">
                        <div className="label-color reasonable"></div>
                        <span>{result.incomeType === 'salary' ? 'Reasonable (1-3%)' : 'Reasonable (2-7 days)'}</span>
                      </div>
                      <div className="label-item">
                        <div className="label-color larger"></div>
                        <span>{result.incomeType === 'salary' ? 'Larger (3-7%)' : 'Larger (7-14 days)'}</span>
                      </div>
                      <div className="label-item">
                        <div className="label-color planned"></div>
                        <span>{result.incomeType === 'salary' ? 'Planned (7%+)' : 'Planned (14+ days)'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="reflection">
                  <h3>💬 A warm thought</h3>
                  {loading ? (
                    <p>Thinking kindly…</p>
                  ) : (
                    <p>{result.reflection || fallbackReflection(result)}</p>
                  )}
                </div>

                <div className="support">If this makes your day better, you can still go ahead 🙂</div>
              </>
            )}
          </div>
        )}
      </main>

      <footer>
        <small>Built to help you reflect — no tracking, no judgment.</small>
      </footer>
    </div>
  )
}

function fallbackReflection({ item, price, percent }) {
  return `Buying ${item} for ₹${formatNumber(price)} (≈ ${formatNumber(percent)}% of your month) can be a small, meaningful choice. If it genuinely improves your day, that matters.`
}

// Helper: Check if we're in production (Vercel) or development (local)
function isProduction() {
  return !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')
}

async function fetchReflection({ item, price, percent, hourly, monthly, incomeType, dailyAllowance, daysUsed, allowanceTier, salaryTier, daysInMonth }) {
  const key = import.meta.env.VITE_GOOGLE_API_KEY
  const provider = import.meta.env.VITE_LLM_PROVIDER || 'google'
  
  if (!key) {
    console.error('API key not configured in .env.local')
    return null
  }

  // Use the appropriate tier based on income type
  const currentTier = incomeType === 'salary' ? salaryTier : allowanceTier

  // Detect item category to suggest alternatives from different categories
  const getCategory = (itemName) => {
    const lower = itemName.toLowerCase()
    if (lower.match(/food|coffee|drink|meal|pizza|burger|snack|lunch|dinner|breakfast/)) return 'food'
    if (lower.match(/movie|concert|show|ticket|theatre|cinema/)) return 'entertainment'
    if (lower.match(/book|magazine|novel|comic/)) return 'reading'
    if (lower.match(/shirt|pants|dress|jacket|shoe|clothes|fashion|hat|socks/)) return 'fashion'
    if (lower.match(/phone|laptop|tablet|computer|headphone|camera|watch|gadget|tech/)) return 'tech'
    if (lower.match(/game|console|ps5|xbox|nintendo/)) return 'gaming'
    if (lower.match(/plant|flower|garden|pot|seed/)) return 'garden'
    if (lower.match(/sport|gym|yoga|exercise|bike|ball|racket/)) return 'sports'
    if (lower.match(/music|instrument|guitar|piano|vinyl|speaker/)) return 'music'
    return 'general'
  }

  const itemCategory = getCategory(item)

  // Suggest alternatives from different categories
  const suggestDifferentCategory = (category) => {
    const suggestions = {
      food: ['a interesting book or audiobook', 'concert or show tickets', 'fitness class or yoga session'],
      entertainment: ['a nice meal or cooking class', 'a good book or e-reader', 'sports equipment or gym pass'],
      reading: ['a cafe experience or nice meal', 'concert or movie tickets', 'creative supplies or hobby items'],
      fashion: ['a cooking class or food experience', 'concert tickets', 'sports gear or fitness equipment'],
      tech: ['a weekend trip or experience', 'hobby supplies or craft materials', 'a relaxing spa or massage'],
      gaming: ['a nice dinner or restaurant experience', 'books or courses', 'sports activities or outdoors'],
      garden: ['art supplies or creative tools', 'books or educational resources', 'fitness or wellness items'],
      sports: ['a nice meal or culinary experience', 'books or learning materials', 'music lessons or instruments'],
      music: ['a nice dining experience', 'books or educational content', 'fitness or wellness activities'],
      general: ['a book you\'ve been wanting', 'a nice meal with friends', 'an experience or class you\'d enjoy']
    }
    return suggestions[category]?.[Math.floor(Math.random() * 3)] || 'something meaningful'
  }

  const alternativeSuggestion = suggestDifferentCategory(itemCategory)

  let prompt
  if (incomeType === 'salary') {
    prompt = `User is considering buying: ${item}. Price: ₹${formatNumber(price)}. Monthly salary: ₹${formatNumber(monthly)}. Hourly earning: ₹${formatNumber(hourly)}. This represents ${formatNumber(percent)}% of their monthly salary. This would take about ${formatNumber(daysUsed)} hours of work (tier: ${currentTier}). 

Write a short, warm, supportive reflection under 60 words. The user is thinking about buying: ${item} (category: ${itemCategory}). 

Include: 
1) Instead of suggesting more ${itemCategory}, suggest one specific alternative like: ${alternativeSuggestion} that costs around the same amount
2) Explicit reassurance that it's completely okay to go ahead with the purchase if they truly want it. 

Keep tone friendly and non-judgmental.`
  } else {
    prompt = `User is considering buying: ${item}. Price: ₹${formatNumber(price)}. Monthly allowance: ₹${formatNumber(monthly)}. Daily allowance (${daysInMonth} days in current month): ₹${formatNumber(dailyAllowance)}. This purchase uses about ${formatNumber(daysUsed)} days of allowance (tier: ${currentTier}). 

Write a short, warm, supportive reflection under 60 words. The user is thinking about buying: ${item} (category: ${itemCategory}). 

Include: 
1) Instead of suggesting more ${itemCategory}, suggest one specific alternative like: ${alternativeSuggestion} that costs around the same amount
2) Explicit reassurance that it's completely okay to go ahead with the purchase if they truly want it. 

Keep tone friendly and non-judgmental.`
  }

  console.log(`Using provider: ${provider}`)

  if (provider === 'huggingface') {
    return await fetchFromHuggingFace(prompt, key)
  } else if (provider === 'groq') {
    return await fetchFromGroq(prompt, key)
  } else if (provider === 'together') {
    return await fetchFromTogether(prompt, key)
  } else if (provider === 'openai') {
    return await fetchFromOpenAI(prompt, key)
  } else {
    // default to google
    return await fetchFromGoogle(prompt, key)
  }
}

async function fetchFromGoogle(prompt, key) {
  try {
    console.log('Sending request to Google Gemini API...')
    
    if (isProduction()) {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google', prompt, key })
      })
      if (!res.ok) return null
      const data = await res.json()
      return data?.text?.trim() || null
    } else {
      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
      }
      const url = `/api/google/v1beta/models/gemini-2.0-flash:generateContent`

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': key
        },
        body: JSON.stringify(requestBody)
      })

      if (!res.ok) return null
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      return text?.trim() || null
    }
  } catch (e) {
    console.error('Google API error:', e.message)
    return null
  }
}

async function fetchFromHuggingFace(prompt, key) {
  try {
    console.log('Sending request to Hugging Face Router...')
    
    if (isProduction()) {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'huggingface', prompt, key })
      })
      if (!res.ok) return null
      const data = await res.json()
      return data?.text?.trim() || null
    } else {
      const res = await fetch('/api/huggingface/chat/completions', {
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
      })

      console.log('Response status:', res.status)
      if (!res.ok) return null
      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content
      return text?.trim() || null
    }
  } catch (e) {
    console.error('Hugging Face API error:', e.message)
    return null
  }
}

async function fetchFromGroq(prompt, key) {
  try {
    console.log('Sending request to Groq API...')
    if (isProduction()) {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'groq', prompt, key })
      })
      if (!res.ok) return null
      const data = await res.json()
      return data?.text?.trim() || null
    } else {
      const res = await fetch('/api/groq/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 150
        })
      })
      if (!res.ok) return null
      const data = await res.json()
      return data?.choices?.[0]?.message?.content?.trim() || null
    }
  } catch (e) {
    console.error('Groq API error:', e.message)
    return null
  }
}

async function fetchFromTogether(prompt, key) {
  try {
    console.log('Sending request to Together AI API...')
    if (isProduction()) {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'together', prompt, key })
      })
      if (!res.ok) return null
      const data = await res.json()
      return data?.text?.trim() || null
    } else {
      const res = await fetch('/api/together/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistralai/Mistral-7B-Instruct-v0.1',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 150
        })
      })
      if (!res.ok) return null
      const data = await res.json()
      return data?.choices?.[0]?.message?.content?.trim() || null
    }
  } catch (e) {
    console.error('Together API error:', e.message)
    return null
  }
}

async function fetchFromOpenAI(prompt, key) {
  try {
    console.log('Sending request to OpenAI API...')
    if (isProduction()) {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'openai', prompt, key })
      })
      if (!res.ok) return null
      const data = await res.json()
      return data?.text?.trim() || null
    } else {
      const res = await fetch('/api/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 150
        })
      })
      if (!res.ok) return null
      const data = await res.json()
      return data?.choices?.[0]?.message?.content?.trim() || null
    }
  } catch (e) {
    console.error('OpenAI API error:', e.message)
    return null
  }
}
