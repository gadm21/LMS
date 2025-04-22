'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type VideoPlayerProps = {
  videoUrl: string
  title: string
  onComplete: () => void
  isCompleted: boolean
}

export default function VideoPlayer({ videoUrl, title, onComplete, isCompleted }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [showControls, setShowControls] = useState(true)
  
  // In a real implementation, this would use the HTML5 video API
  // to track progress and handle video completion
  const handleVideoEnd = () => {
    setIsPlaying(false)
    if (!isCompleted) {
      onComplete()
    }
  }
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }
  
  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <div 
        className="relative aspect-video bg-black cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(isPlaying ? false : true)}
        onClick={togglePlay}
      >
        {/* Video Placeholder - in a real app, this would be a video element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50 text-sm">Video Player: {title}</div>
        </div>
        
        {/* Play/Pause Button Overlay */}
        {showControls && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center text-white"
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        )}
        
        {/* Video Controls */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-grow">
                <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-white text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  className="text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlay()
                  }}
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                
                <div className="flex items-center space-x-2">
                  <button className="text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  </button>
                  <div className="w-20">
                    <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full"
                        style={{ width: `${volume}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                  </svg>
                </button>
                <button className="text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                  </svg>
                </button>
                <button className="text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Completed
          </div>
        )}
      </div>
    </div>
  )
}
