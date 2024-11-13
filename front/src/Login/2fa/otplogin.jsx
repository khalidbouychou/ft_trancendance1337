'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function CSSSquareDigitOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    // Here you would typically make an API call to verify the OTP
    console.log('Submitting OTP:', otpString)
    setError('')
  }

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2 className="otp-title">Enter OTP</h2>
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-input-group">
            {otp.map((digit, index) => (
              <div key={index} className="otp-input-wrapper">
                <input
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  aria-label={`Digit ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <Button type="submit" className="otp-submit-button">
            Verify OTP
          </Button>
        </form>
        {error && <p className="otp-error">{error}</p>}
      </div>
      <style jsx>{`
        .otp-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(to right, #e0f2fe, #e0e7ff);
        }
        .otp-box {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          background-color: white;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .otp-title {
          font-size: 1.875rem;
          font-weight: bold;
          text-align: center;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }
        .otp-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .otp-input-group {
          display: flex;
          justify-content: center; /* Change from space-between to center */
        }
        .otp-input-wrapper {
          width: 3.5rem;
          height: 3.5rem;
          position: relative;
          margin: 0 0.25rem; /* Add this line */
        }
        .otp-input {
          width: 100%;
          height: 100%;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          border: 2px solid #d1d5db;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }
        .otp-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .otp-submit-button {
          width: 100%;
        }
        .otp-error {
          color: #ef4444;
          text-align: center;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  )
}