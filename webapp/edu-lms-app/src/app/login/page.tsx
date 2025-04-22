'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/5 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl border border-border/40 shadow-lg p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-primary font-bold text-2xl">EduNova</span>
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Fill out the form to get started with your learning journey'}
            </p>
          </div>
          
          <form className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
              />
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Confirm your password"
                />
              </div>
            )}
            
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full btn-primary py-2 mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
