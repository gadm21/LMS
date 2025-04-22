'use client'

import { useState } from 'react'
import PaymentService from '@/lib/payment-service'

type PaymentProcessorProps = {
  amount: number
  onSuccess: (transactionId: string) => void
  onError: (error: string) => void
}

export default function PaymentProcessor({ amount, onSuccess, onError }: PaymentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isProcessing) return
    
    setIsProcessing(true)
    
    try {
      // Format card number for display (remove spaces)
      const formattedCardNumber = formData.cardNumber.replace(/\s+/g, '')
      
      // Process payment
      const response = await PaymentService.processPayment({
        amount,
        cardNumber: formattedCardNumber,
        cardholderName: formData.cardholderName,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv
      })
      
      // Handle successful payment
      onSuccess(response.transactionId)
    } catch (error: any) {
      // Handle payment error
      onError(error.error || 'An error occurred while processing your payment')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Format card number with spaces for better readability
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }
  
  return (
    <div className="bg-card rounded-xl border border-border/40 p-6">
      <h2 className="text-xl font-medium mb-6">Payment Information</h2>
      
      {/* Payment Method Selector */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            type="button"
            className={`flex-1 p-4 rounded-lg border ${paymentMethod === 'credit-card' ? 'border-primary bg-primary/5' : 'border-border/40'} transition-colors`}
            onClick={() => setPaymentMethod('credit-card')}
          >
            <div className="flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="text-center font-medium">Credit Card</div>
          </button>
          
          <button
            type="button"
            className={`flex-1 p-4 rounded-lg border ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-border/40'} transition-colors`}
            onClick={() => setPaymentMethod('paypal')}
            disabled
          >
            <div className="flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-[#00457C]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.58 2.977-2.477 4.532-5.887 4.532h-2.19c-.173 0-.296.134-.323.304l-1.4 8.88-.004.024h2.7c.174 0 .322-.126.35-.296l.022-.128.558-3.537.036-.194c.028-.17.176-.296.35-.296h.22c2.422 0 4.312-.632 4.865-2.465.23-.752.331-1.385.331-1.877 0-.76-.156-1.265-.428-1.66z" />
                <path d="M20.413 8.656c-.01-.055-.02-.109-.03-.164-.289-1.109-1.253-1.714-2.548-1.968a10.25 10.25 0 0 0-.947-.085h-5.15c-.173 0-.322.126-.35.297l-1.4 8.88-.004.024h2.7c.174 0 .322-.126.35-.296l.022-.128.558-3.537.036-.194c.028-.17.176-.296.35-.296h.22c2.422 0 4.312-.632 4.865-2.465.23-.752.331-1.385.331-1.877 0-.76-.156-1.265-.428-1.66-.066-.096-.139-.185-.22-.267-.028-.027-.058-.055-.088-.08l.333.816z" />
              </svg>
            </div>
            <div className="text-center font-medium">PayPal</div>
            <div className="text-xs text-muted-foreground mt-1">(Coming Soon)</div>
          </button>
        </div>
      </div>
      
      {/* Credit Card Form */}
      {paymentMethod === 'credit-card' && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formatCardNumber(formData.cardNumber)}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value)
                  setFormData(prev => ({ ...prev, cardNumber: formatted }))
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            
            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                id="cardholderName"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleChange}
                placeholder="John Smith"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
                  maxLength={5}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
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
                  maxLength={4}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Pay ${amount.toFixed(2)}</>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
      
      {/* PayPal Form (placeholder) */}
      {paymentMethod === 'paypal' && (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            PayPal integration coming soon
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setPaymentMethod('credit-card')}
          >
            Switch to Credit Card
          </button>
        </div>
      )}
      
      {/* Security Notice */}
      <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Secure payment processing. We do not store your card details.</span>
      </div>
    </div>
  )
}
