'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  // Simulate cart functionality - in a real app, this would come from a cart context or API
  useEffect(() => {
    // For demo purposes, we'll use localStorage to store cart items
    const getCartItems = () => {
      if (typeof window !== 'undefined') {
        const cartItems = localStorage.getItem('cartItems')
        return cartItems ? JSON.parse(cartItems).length : 0
      }
      return 0
    }

    setCartItemCount(getCartItems())

    // Listen for storage events to update cart count when changed from another page
    const handleStorageChange = () => {
      setCartItemCount(getCartItems())
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also set up a custom event listener for cart updates within the same page
    window.addEventListener('cartUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleStorageChange)
    }
  }, [])

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false)
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/40">
      <div className="container-custom flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-primary font-bold text-2xl">EduNovai</span>
        </Link>

        {/* Desktop Navigation - Only shown on home page */}


        {/* Desktop Auth Buttons and Cart */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart" className="relative p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link href="/login" className="btn-primary">
            Log in
          </Link>
        </div>

        {/* Mobile Menu Button - Only shown on home page for navigation */}
        {isHomePage ? (
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        ) : (
          <div className="md:hidden"></div> // Empty div to maintain layout on other pages
        )}
      </div>

      {/* Mobile Menu - Only shown on home page */}
      {isHomePage && isMenuOpen && (
        <div className="md:hidden glass-effect">
          <div className="container-custom py-4 space-y-4">
            <div className="flex flex-col space-y-3 pt-4 border-t border-border/40">
              <div className="flex items-center justify-center space-x-4 mb-2">
                <Link
                  href="/cart"
                  className="relative p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/login"
                  className="btn-primary text-center flex-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
