'use client'

import { useState } from 'react'
import Link from 'next/link'

type ProgressTrackerProps = {
  courseId: string
  courseName: string
  modules: {
    id: string
    title: string
    lessons: {
      id: string
      title: string
      duration: string
      isCompleted: boolean
      type: 'video' | 'text' | 'quiz'
    }[]
  }[]
  overallProgress: number
}

export default function ProgressTracker({ 
  courseId, 
  courseName, 
  modules, 
  overallProgress 
}: ProgressTrackerProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id || ''])
  
  const toggleModule = (moduleId: string) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter(id => id !== moduleId))
    } else {
      setExpandedModules([...expandedModules, moduleId])
    }
  }
  
  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0)
  const completedLessons = modules.reduce((total, module) => 
    total + module.lessons.filter(lesson => lesson.isCompleted).length, 0)
  
  return (
    <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
      <div className="p-4 border-b border-border/40">
        <h2 className="font-medium">{courseName}</h2>
        <div className="flex items-center mt-2">
          <div className="flex-grow h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <span className="ml-3 text-sm text-muted-foreground">
            {completedLessons} of {totalLessons} completed
          </span>
        </div>
      </div>
      
      <div className="max-h-[500px] overflow-y-auto">
        {modules.map((module) => (
          <div key={module.id} className="border-b border-border/40 last:border-0">
            <button
              className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
              onClick={() => toggleModule(module.id)}
            >
              <div className="font-medium">{module.title}</div>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-3">
                  {module.lessons.filter(lesson => lesson.isCompleted).length} of {module.lessons.length}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${expandedModules.includes(module.id) ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {expandedModules.includes(module.id) && (
              <div className="pl-4 pr-2 pb-2">
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${courseId}/learn/${lesson.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center">
                      {lesson.isCompleted ? (
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-muted-foreground mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <div>
                        <div className="text-sm">{lesson.title}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                          {lesson.type === 'video' && (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                          {lesson.type === 'text' && (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                          {lesson.type === 'quiz' && (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
