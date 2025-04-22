'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  
  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartItems = () => {
      if (typeof window !== 'undefined') {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
          setCartItems(JSON.parse(storedItems));
        }
      }
    };
    
    loadCartItems();
    
    // Listen for storage events to update cart when changed from another page
    const handleStorageChange = () => {
      loadCartItems();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);
  
  const removeFromCart = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new Event('storage'));
    }
  };
  
  // Calculate subtotal, discount, and total
  const subtotal = cartItems.reduce((total, item) => {
    // For items with original price, use that for subtotal
    if (item.originalPrice) {
      return total + item.originalPrice;
    }
    return total + item.price;
  }, 0);
  
  // Calculate discount as the difference between original prices and actual prices
  const discount = cartItems.reduce((total, item) => {
    if (item.originalPrice && item.startingPrice) {
      return total + (item.originalPrice - item.price);
    }
    return total;
  }, 0);
  
  const total = subtotal - discount;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container-custom">
          <h1 className="font-bold mb-8">Your Cart</h1>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border border-border/40">
                      <Link href={`/courses/${item.id}`} className="relative h-24 sm:h-20 sm:w-32 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <Link href={`/courses/${item.id}`} className="font-medium mb-1 hover:text-primary transition-colors">
                              {item.title}
                            </Link>
                            <p className="text-sm text-muted-foreground">By {item.instructor}</p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            {item.startingPrice ? (
                              <div className="flex flex-col items-end">
                                <span className="text-sm text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</span>
                                <span className="font-medium">${item.price.toFixed(2)}</span>
                              </div>
                            ) : (
                              <span className="font-medium">${item.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border/40 p-6">
                  <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-border/40 flex justify-between font-medium">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Coupon Code */}
                  <div className="mb-6">
                    <label htmlFor="coupon" className="block text-sm font-medium mb-2">
                      Apply Coupon
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="coupon"
                        placeholder="Enter coupon code"
                        className="flex-grow px-4 py-2 rounded-l-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-r-lg">
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  <Link href="/checkout" className="w-full btn-primary text-center block">
                    Proceed to Checkout
                  </Link>
                  
                  <div className="mt-6 text-center">
                    <Link href="/courses" className="text-sm text-primary">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-secondary/50">
                <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any courses to your cart yet.
              </p>
              <Link href="/courses" className="btn-primary">
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
