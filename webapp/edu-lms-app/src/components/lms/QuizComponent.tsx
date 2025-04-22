'use client'

import { useState } from 'react'
import Image from 'next/image'

type QuizComponentProps = {
  quizId: string
  title: string
  description: string
  questions: {
    id: string
    question: string
    options: {
      id: string
      text: string
    }[]
    correctOptionId: string
  }[]
  onComplete: (score: number, totalQuestions: number) => void
}

export default function QuizComponent({
  quizId,
  title,
  description,
  questions,
  onComplete
}: QuizComponentProps) {
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  
  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return
    
    setCurrentAnswers({
      ...currentAnswers,
      [questionId]: optionId
    })
  }
  
  const handleSubmitQuiz = () => {
    if (isSubmitted) return
    
    // Calculate score
    let correctAnswers = 0
    questions.forEach(question => {
      if (currentAnswers[question.id] === question.correctOptionId) {
        correctAnswers++
      }
    })
    
    const finalScore = correctAnswers
    setScore(finalScore)
    setIsSubmitted(true)
    onComplete(finalScore, questions.length)
  }
  
  const isQuestionAnswered = (questionId: string) => {
    return currentAnswers[questionId] !== undefined
  }
  
  const isAllQuestionsAnswered = () => {
    return questions.every(question => isQuestionAnswered(question.id))
  }
  
  const getOptionClassName = (questionId: string, optionId: string) => {
    if (!isSubmitted) {
      return currentAnswers[questionId] === optionId
        ? 'bg-primary/10 border-primary'
        : 'bg-card hover:bg-secondary/50 border-border/40'
    }
    
    const question = questions.find(q => q.id === questionId)
    if (!question) return ''
    
    if (optionId === question.correctOptionId) {
      return 'bg-green-100 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-300'
    }
    
    if (currentAnswers[questionId] === optionId) {
      return 'bg-red-100 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-300'
    }
    
    return 'bg-card border-border/40 opacity-50'
  }
  
  return (
    <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
      <div className="p-6 border-b border-border/40">
        <h2 className="text-xl font-medium mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="p-6">
        {questions.map((question, index) => (
          <div key={question.id} className="mb-8 last:mb-0">
            <div className="flex items-start mb-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium mr-3">
                {index + 1}
              </span>
              <h3 className="font-medium">{question.question}</h3>
            </div>
            
            <div className="space-y-3 pl-9">
              {question.options.map(option => (
                <button
                  key={option.id}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${getOptionClassName(question.id, option.id)}`}
                  onClick={() => handleSelectOption(question.id, option.id)}
                  disabled={isSubmitted}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border ${currentAnswers[question.id] === option.id ? 'border-primary bg-primary' : 'border-muted-foreground'} flex-shrink-0 mr-3 flex items-center justify-center`}>
                      {currentAnswers[question.id] === option.id && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>{option.text}</span>
                  </div>
                  
                  {isSubmitted && option.id === question.correctOptionId && (
                    <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Correct answer</span>
                    </div>
                  )}
                  
                  {isSubmitted && currentAnswers[question.id] === option.id && option.id !== question.correctOptionId && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Incorrect answer</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 border-t border-border/40 flex items-center justify-between">
        {isSubmitted ? (
          <div className="flex items-center">
            <div className="text-lg font-medium">
              Your score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
            </div>
            {score === questions.length && (
              <div className="ml-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm font-medium px-3 py-1 rounded-full">
                Perfect Score!
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {Object.keys(currentAnswers).length} of {questions.length} questions answered
          </div>
        )}
        
        {!isSubmitted && (
          <button
            className="btn-primary"
            onClick={handleSubmitQuiz}
            disabled={!isAllQuestionsAnswered()}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  )
}
