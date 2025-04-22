'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import QuizComponent from '@/components/lms/QuizComponent'

// Sample quiz data
const quizData = {
  quizId: 'quiz-1',
  title: 'Little Red Riding Hood: Symbolism Quiz',
  description: 'Test your understanding of the symbolism in Little Red Riding Hood with this quiz.',
  questions: [
    {
      id: 'q1',
      question: 'What does the red hood/cap most commonly symbolize in literary analysis?',
      options: [
        { id: 'q1-a', text: 'Danger and warning' },
        { id: 'q1-b', text: 'Coming of age and emerging sexuality' },
        { id: 'q1-c', text: 'Political affiliation' },
        { id: 'q1-d', text: 'Wealth and prosperity' }
      ],
      correctOptionId: 'q1-b'
    },
    {
      id: 'q2',
      question: 'The wolf in Little Red Riding Hood is often interpreted as representing:',
      options: [
        { id: 'q2-a', text: 'Nature and wilderness' },
        { id: 'q2-b', text: 'Childhood fears' },
        { id: 'q2-c', text: 'Male predators and danger' },
        { id: 'q2-d', text: 'All of the above' }
      ],
      correctOptionId: 'q2-d'
    },
    {
      id: 'q3',
      question: 'The forest in the story typically symbolizes:',
      options: [
        { id: 'q3-a', text: 'A place of transformation and testing' },
        { id: 'q3-b', text: 'The unknown and potentially dangerous world' },
        { id: 'q3-c', text: 'A transition between childhood and adulthood' },
        { id: 'q3-d', text: 'All of the above' }
      ],
      correctOptionId: 'q3-d'
    },
    {
      id: 'q4',
      question: 'In Charles Perrault\'s version, the story ends with:',
      options: [
        { id: 'q4-a', text: 'The wolf eating Little Red Riding Hood' },
        { id: 'q4-b', text: 'A huntsman rescuing Little Red Riding Hood' },
        { id: 'q4-c', text: 'Little Red Riding Hood outsmarting the wolf' },
        { id: 'q4-d', text: 'Little Red Riding Hood becoming friends with the wolf' }
      ],
      correctOptionId: 'q4-a'
    },
    {
      id: 'q5',
      question: 'The path in Little Red Riding Hood can be interpreted as:',
      options: [
        { id: 'q5-a', text: 'The straight and narrow path of virtue' },
        { id: 'q5-b', text: 'Life\'s journey with its choices and temptations' },
        { id: 'q5-c', text: 'A symbol of societal expectations' },
        { id: 'q5-d', text: 'All of the above' }
      ],
      correctOptionId: 'q5-d'
    }
  ]
};

export default function QuizPage() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  
  const handleQuizComplete = (finalScore: number, total: number) => {
    setScore(finalScore);
    setTotalQuestions(total);
    setQuizCompleted(true);
  };
  
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
            <h1 className="text-2xl font-bold mb-2">Quiz Component Demo</h1>
            <p className="text-muted-foreground mb-6">
              This is a demonstration of our quiz component, which is part of our Learning Management System.
              The quiz includes immediate feedback, score calculation, and adaptive content.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <QuizComponent
                quizId={quizData.quizId}
                title={quizData.title}
                description={quizData.description}
                questions={quizData.questions}
                onComplete={handleQuizComplete}
              />
              
              {quizCompleted && (
                <div className="mt-8 bg-card rounded-xl border border-border/40 p-6">
                  <h2 className="text-xl font-medium mb-4">AI Tutor Feedback</h2>
                  <div className="bg-secondary/30 rounded-lg p-4 mb-4">
                    <p>
                      Great job on completing the quiz! You scored {score} out of {totalQuestions}.
                      {score === totalQuestions ? (
                        " That's a perfect score! You have an excellent understanding of the symbolism in Little Red Riding Hood."
                      ) : score >= totalQuestions * 0.8 ? (
                        " That's an excellent score! You have a strong grasp of the symbolism in Little Red Riding Hood."
                      ) : score >= totalQuestions * 0.6 ? (
                        " That's a good score! You understand many of the symbolic elements in Little Red Riding Hood, but there are a few areas you might want to review."
                      ) : (
                        " You've made a good start, but I recommend reviewing the material on symbolism in fairy tales. Would you like me to provide some additional resources?"
                      )}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Recommended Next Steps:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Review the lesson on "Symbolism and Interpretation" in Module 2</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Explore the comparative analysis of different versions in Module 3</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Try the guided analysis exercise to deepen your understanding</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-card rounded-xl border border-border/40 p-6">
                  <h2 className="font-medium mb-4">About Our Quiz System</h2>
                  <p className="text-muted-foreground mb-4">
                    Our quiz system is designed to test your knowledge while providing a learning experience. Key features include:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Immediate feedback on your answers</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Personalized AI tutor recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Progress tracking across your courses</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Adaptive difficulty based on your performance</span>
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
                    <Link href="/courses/1/learn/certificate" className="btn-secondary w-full flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Certificate
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
