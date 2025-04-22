'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    country: 'United States',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const [step, setStep] = useState(1);
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // In a real app, this would process the payment and redirect to a confirmation page
      window.location.href = '/dashboard';
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
          <h1 className="font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl border border-border/40 p-6">
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        1
                      </div>
                      <div className="ml-2 font-medium">Account</div>
                    </div>
                    <div className="w-16 h-0.5 bg-muted"></div>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        2
                      </div>
                      <div className="ml-2 font-medium">Payment</div>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div>
                      <h2 className="text-xl font-medium mb-4">Account Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <p className="mt-2 text-sm text-muted-foreground">
                          We'll send your receipt and course access to this email
                        </p>
                      </div>
                      
                      <div className="flex justify-end">
                        <button type="submit" className="btn-primary">
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {step === 2 && (
                    <div>
                      <h2 className="text-xl font-medium mb-4">Payment Information</h2>
                      
                      <div className="mb-6">
                        <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          required
                          className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label htmlFor="nameOnCard" className="block text-sm font-medium mb-2">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            id="nameOnCard"
                            name="nameOnCard"
                            value={formData.nameOnCard}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                      
                      <div className="mb-4">
                        <label htmlFor="country" className="block text-sm font-medium mb-2">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="billingAddress" className="block text-sm font-medium mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          id="billingAddress"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button 
                          type="button" 
                          onClick={() => setStep(1)}
                          className="btn-secondary"
                        >
                          Back
                        </button>
                        <button type="submit" className="btn-primary">
                          Complete Purchase
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border/40 p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-sm text-muted-foreground line-clamp-1">{item.title}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 mb-6 pt-4 border-t border-border/40">
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
                
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    By completing your purchase, you agree to our{' '}
                    <Link href="/terms" className="text-primary">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                  <p>
                    All courses come with a 30-day money-back guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
