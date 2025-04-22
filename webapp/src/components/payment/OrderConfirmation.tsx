'use client'

import { useState } from 'react'
import Link from 'next/link'

type OrderConfirmationProps = {
  orderId: string
  transactionId: string
  purchaseDate: string
  items: {
    id: string
    title: string
    price: number
  }[]
  total: number
  customerEmail: string
}

export default function OrderConfirmation({
  orderId,
  transactionId,
  purchaseDate,
  items,
  total,
  customerEmail
}: OrderConfirmationProps) {
  const formattedDate = new Date(purchaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Thank You for Your Purchase!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your order has been successfully processed. You will receive a confirmation email shortly.
        </p>
      </div>
      
      <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
        <div className="p-6 border-b border-border/40">
          <h2 className="text-xl font-medium mb-4">Order Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Order ID</div>
              <div className="font-medium">{orderId}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Transaction ID</div>
              <div className="font-medium">{transactionId}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Purchase Date</div>
              <div className="font-medium">{formattedDate}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Email</div>
              <div className="font-medium">{customerEmail}</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="font-medium mb-4">Items Purchased</h3>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.title}</span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-border/40 flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-xl border border-border/40 p-6">
        <h2 className="text-xl font-medium mb-4">What's Next?</h2>
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
              1
            </div>
            <div>
              <h3 className="font-medium mb-1">Access Your Courses</h3>
              <p className="text-muted-foreground">
                Your purchased courses are now available in your dashboard. You can start learning right away.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
              2
            </div>
            <div>
              <h3 className="font-medium mb-1">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey and track your progress through each course.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
              3
            </div>
            <div>
              <h3 className="font-medium mb-1">Earn Certificates</h3>
              <p className="text-muted-foreground">
                Complete courses to earn certificates that showcase your achievements.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <Link href="/dashboard" className="btn-primary">
          Go to Dashboard
        </Link>
        <Link href="/courses" className="btn-secondary">
          Browse More Courses
        </Link>
      </div>
    </div>
  )
}
