'use client'

import { useState } from 'react'
import Link from 'next/link'

type LessonContentProps = {
  lessonId: string
  courseId: string
  title: string
  type: 'video' | 'text' | 'quiz'
  content: string
  isCompleted: boolean
  onComplete: () => void
}

export default function LessonContent({ 
  lessonId, 
  courseId, 
  title, 
  type, 
  content, 
  isCompleted, 
  onComplete 
}: LessonContentProps) {
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  
  const handleSaveNotes = () => {
    // In a real app, this would save notes to a database
    console.log('Saving notes for lesson:', lessonId, notes)
    setShowNotes(false)
  }
  
  const handleMarkComplete = () => {
    if (!isCompleted) {
      onComplete()
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-sm flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Notes</span>
          </button>
          <button
            onClick={handleMarkComplete}
            className={`text-sm flex items-center space-x-1 ${isCompleted ? 'text-green-500' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>
      
      {/* Lesson Content based on type */}
      <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
        {type === 'video' && (
          <div className="aspect-video bg-black flex items-center justify-center text-white/50">
            Video Player: {title}
            {/* In a real app, this would use the VideoPlayer component */}
          </div>
        )}
        
        {type === 'text' && (
          <div className="p-6 prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
        
        {type === 'quiz' && (
          <div className="p-6">
            <div className="text-lg font-medium mb-4">Quiz: {title}</div>
            <div className="text-muted-foreground mb-6">
              Complete this quiz to test your knowledge of the material covered in this lesson.
            </div>
            {/* In a real app, this would render quiz questions from the content */}
            <div className="space-y-6">
              <div className="p-4 border border-border rounded-lg">
                <div className="font-medium mb-3">Question 1</div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="radio" id="q1-a" name="q1" className="mr-2" />
                    <label htmlFor="q1-a">Answer option A</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q1-b" name="q1" className="mr-2" />
                    <label htmlFor="q1-b">Answer option B</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q1-c" name="q1" className="mr-2" />
                    <label htmlFor="q1-c">Answer option C</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q1-d" name="q1" className="mr-2" />
                    <label htmlFor="q1-d">Answer option D</label>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <div className="font-medium mb-3">Question 2</div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="radio" id="q2-a" name="q2" className="mr-2" />
                    <label htmlFor="q2-a">Answer option A</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q2-b" name="q2" className="mr-2" />
                    <label htmlFor="q2-b">Answer option B</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q2-c" name="q2" className="mr-2" />
                    <label htmlFor="q2-c">Answer option C</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q2-d" name="q2" className="mr-2" />
                    <label htmlFor="q2-d">Answer option D</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="btn-primary">Submit Quiz</button>
            </div>
          </div>
        )}
      </div>
      
      {/* Notes Panel */}
      {showNotes && (
        <div className="bg-card rounded-xl border border-border/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Your Notes</h3>
            <button
              onClick={handleSaveNotes}
              className="text-sm text-primary"
            >
              Save Notes
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            className="w-full h-32 p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          ></textarea>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Link
          href={`/courses/${courseId}/learn`}
          className="btn-secondary"
        >
          Back to Course
        </Link>
        <div className="flex space-x-2">
          <button className="btn-secondary">Previous Lesson</button>
          <button className="btn-primary">Next Lesson</button>
        </div>
      </div>
    </div>
  )
}
