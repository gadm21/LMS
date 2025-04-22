'use client'

import { useState } from 'react'
import Image from 'next/image'

type CertificateGeneratorProps = {
  certificateId: string
  courseName: string
  studentName: string
  completionDate: string
  instructorName: string
  instructorTitle: string
}

export default function CertificateGenerator({
  certificateId,
  courseName,
  studentName,
  completionDate,
  instructorName,
  instructorTitle
}: CertificateGeneratorProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  
  const handleDownload = () => {
    // In a real app, this would generate a PDF certificate for download
    setIsDownloading(true)
    setTimeout(() => {
      setIsDownloading(false)
      alert('Certificate downloaded successfully!')
    }, 1500)
  }
  
  const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
        {/* Certificate Preview */}
        <div className="relative aspect-[1.4/1] w-full bg-white p-8">
          <div className="absolute inset-0 border-[12px] border-primary/10 m-4"></div>
          
          <div className="relative h-full flex flex-col items-center justify-between text-black p-6">
            {/* Header */}
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">EduNova</div>
              <div className="text-sm text-gray-500">Certificate of Completion</div>
            </div>
            
            {/* Content */}
            <div className="text-center max-w-lg">
              <div className="text-sm text-gray-500 mb-2">This certifies that</div>
              <div className="text-3xl font-serif mb-4">{studentName}</div>
              <div className="text-sm text-gray-500 mb-2">has successfully completed</div>
              <div className="text-2xl font-medium mb-4">{courseName}</div>
              <div className="text-sm text-gray-500 mb-2">on</div>
              <div className="text-xl mb-4">{formattedDate}</div>
            </div>
            
            {/* Footer */}
            <div className="w-full flex justify-between items-end">
              <div className="text-center">
                <div className="w-40 border-t border-gray-300 pt-2">
                  <div className="font-medium">{instructorName}</div>
                  <div className="text-xs text-gray-500">{instructorTitle}</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 relative mb-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Verified Certificate</div>
                <div className="text-xs text-gray-500">ID: {certificateId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-medium mb-1">Course Certificate</h2>
          <p className="text-muted-foreground">
            Congratulations on completing {courseName}!
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="btn-primary flex items-center"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Certificate
            </>
          )}
        </button>
      </div>
      
      {/* Share Options */}
      <div className="bg-card rounded-xl border border-border/40 p-6">
        <h3 className="font-medium mb-4">Share Your Achievement</h3>
        <div className="flex space-x-4">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0A66C2] text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
