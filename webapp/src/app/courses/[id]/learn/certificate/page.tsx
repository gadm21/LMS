'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CertificateGenerator from '@/components/lms/CertificateGenerator'

export default function CertificatePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container-custom py-8">
          <div className="mb-6">
            <Link href="/dashboard" className="text-primary flex items-center mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mb-2">Certificate Component Demo</h1>
            <p className="text-muted-foreground mb-6">
              This is a demonstration of our certificate component, which is awarded upon course completion.
              The certificate includes personalized information and can be downloaded or shared.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CertificateGenerator
                certificateId="LRRH-2025-1234"
                courseName="Little Red Riding Hood: Analysis & Interpretation"
                studentName="Test User"
                completionDate="2025-03-31"
                instructorName="Dr. Sarah Johnson"
                instructorTitle="Literature Professor and Folklore Specialist"
              />
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-card rounded-xl border border-border/40 p-6">
                  <h2 className="font-medium mb-4">About Our Certificates</h2>
                  <p className="text-muted-foreground mb-4">
                    Our certificates are designed to showcase your achievements and can be shared on professional networks. Key features include:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Unique certificate ID for verification</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Professional design suitable for your portfolio</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Easy sharing options for social media</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Downloadable PDF format</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-card rounded-xl border border-border/40 p-6">
                  <h2 className="font-medium mb-4">Try Other LMS Features</h2>
                  <div className="space-y-4">
                    <Link href="/courses/1/learn" className="btn-secondary w-full flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Course Content
                    </Link>
                    <Link href="/courses/1/learn/quiz" className="btn-secondary w-full flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Quiz Component
                    </Link>
                    <Link href="/dashboard" className="btn-secondary w-full flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
                    </Link>
                  </div>
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
