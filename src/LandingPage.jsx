import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import rotateBg from './finalrotate.png'

export default function LandingPage({ onStart, theme, toggleTheme }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [bgRotation, setBgRotation] = useState(0)

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setRotation({
        x: scrollY * 0.3,
        y: scrollY * 0.5,
        z: scrollY * 0.2
      })
      setBgRotation(scrollY * 0.3)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div className="landing-white">
      {/* Theme Toggle */}
      {toggleTheme && (
        <button className="theme-toggle-floating" onClick={toggleTheme} title="Toggle dark mode">
          {theme === 'day' ? '🌙' : '☀️'}
        </button>
      )}

      {/* Rotating Background Element */}
      <div
        className="rotate-bg-overlay"
        style={{
          backgroundImage: `url(${rotateBg})`,
          backgroundPosition: 'center center',
          backgroundSize: '700px 700px',
          transform: `rotate(${bgRotation}deg)`,
          transformOrigin: 'center center'
        }}
      />

      {/* Welcome Section */}
      <div className="welcome-section">
        <motion.div
          className="welcome-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1>Worth It Today?</h1>
          <p className="welcome-subtitle">Make smarter spending decisions with AI-powered perspective</p>
          <p className="welcome-description">
            Pause before impulse purchases. Get instant perspective on costs, income impact, and smart alternatives.
          </p>
          <motion.button
            className="cta-button landing-button"
            onClick={onStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Start Checking Now
          </motion.button>
        </motion.div>
      </div>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="section-container">
          <motion.div
            className="mission-vision-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mission-card">
              <h2>🎯 Our Mission</h2>
              <p>To empower everyone to make thoughtful spending decisions by combining real-time financial context with AI-powered wisdom.</p>
            </div>
            <div className="vision-card">
              <h2>✨ Our Vision</h2>
              <p>A world where impulse purchases become intentional decisions, and every dollar spent reflects your true values and goals.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why AI Section */}
      <section className="why-ai-section">
        <div className="section-container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why AI Powers Better Decisions
          </motion.h2>
          <motion.div
            className="benefits-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div className="benefit-card" whileHover={{ y: -5 }}>
              <div className="benefit-icon">🧠</div>
              <h3>Contextual Understanding</h3>
              <p>AI analyzes your financial context—salary, savings patterns, and lifestyle—to provide personalized insights.</p>
            </motion.div>
            <motion.div className="benefit-card" whileHover={{ y: -5 }}>
              <div className="benefit-icon">⚡</div>
              <h3>Instant Perspective</h3>
              <p>Get real-time calculations on purchase impact without human delays. Your answers in seconds.</p>
            </motion.div>
            <motion.div className="benefit-card" whileHover={{ y: -5 }}>
              <div className="benefit-icon">💬</div>
              <h3>Empathetic Wisdom</h3>
              <p>Our AI is trained to be supportive, not judgmental. Think of it as a financial friend, not a critic.</p>
            </motion.div>
            <motion.div className="benefit-card" whileHover={{ y: -5 }}>
              <div className="benefit-icon">🎯</div>
              <h3>Smart Alternatives</h3>
              <p>Discover creative ways to use your money. Sometimes the best purchase is the one you hadn't thought of.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to Make Smarter Decisions?</h2>
          <p>Join thousands who are already using Worth It Today to transform how they spend.</p>
          <motion.button
            className="cta-button landing-button"
            onClick={onStart}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Checking Now
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}
