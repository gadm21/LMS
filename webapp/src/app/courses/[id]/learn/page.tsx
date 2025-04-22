'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import VideoPlayer from '@/components/lms/VideoPlayer'
import LessonContent from '@/components/lms/LessonContent'
import ProgressTracker from '@/components/lms/ProgressTracker'

// Sample course data
const courseData = {
  id: '1',
  title: 'Little Red Riding Hood: Analysis & Interpretation',
  instructor: 'Little Red',
  modules: [
    {
      id: 'module-1',
      title: 'Origins and Historical Context',
      lessons: [
        { 
          id: 'lesson-1-1', 
          title: 'The Oral Tradition of Fairy Tales', 
          duration: '15 min',
          type: 'video',
          isCompleted: true
        },
        { 
          id: 'lesson-1-2', 
          title: 'Early Written Versions: Perrault and the Brothers Grimm', 
          duration: '20 min',
          type: 'video',
          isCompleted: true
        },
        { 
          id: 'lesson-1-3', 
          title: 'Historical and Social Context', 
          duration: '25 min',
          type: 'text',
          isCompleted: false
        },
        { 
          id: 'lesson-1-4', 
          title: 'Evolution of the Tale Through Time', 
          duration: '30 min',
          type: 'video',
          isCompleted: false
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Symbolism and Interpretation',
      lessons: [
        { 
          id: 'lesson-2-1', 
          title: 'The Red Hood/Cap: Color Symbolism', 
          duration: '20 min',
          type: 'video',
          isCompleted: false
        },
        { 
          id: 'lesson-2-2', 
          title: 'The Wolf: Predator Symbolism', 
          duration: '25 min',
          type: 'text',
          isCompleted: false
        },
        { 
          id: 'lesson-2-3', 
          title: 'The Forest: Setting as Symbol', 
          duration: '20 min',
          type: 'video',
          isCompleted: false
        },
        { 
          id: 'lesson-2-4', 
          title: 'The Journey: Coming of Age Metaphor', 
          duration: '30 min',
          type: 'video',
          isCompleted: false
        },
        { 
          id: 'lesson-2-5', 
          title: 'Guided Analysis Exercise', 
          duration: '45 min',
          type: 'quiz',
          isCompleted: false
        }
      ]
    },
    {
      id: 'module-3',
      title: 'Cultural Variations and Adaptations',
      lessons: [
        { 
          id: 'lesson-3-1', 
          title: 'European Variations', 
          duration: '25 min',
          type: 'video',
          isCompleted: false
        },
        { 
          id: 'lesson-3-2', 
          title: 'Asian Adaptations and Similar Tales', 
          duration: '30 min',
          type: 'text',
          isCompleted: false
        },
        { 
          id: 'lesson-3-3', 
          title: 'African and Middle Eastern Parallels', 
          duration: '25 min',
          type: 'video',
          isCompleted: false
        },
        { 
          id: 'lesson-3-4', 
          title: 'Modern Retellings in Literature', 
          duration: '35 min',
          type: 'text',
          isCompleted: false
        },
        { 
          id: 'lesson-3-5', 
          title: 'Film and Media Adaptations', 
          duration: '40 min',
          type: 'video',
          isCompleted: false
        }
      ]
    }
  ]
};

// Sample lesson data
const lessonData = {
  id: 'lesson-1-3',
  title: 'Historical and Social Context',
  type: 'text',
  content: `
    <h2>Historical and Social Context of Little Red Riding Hood</h2>
    
    <p>The tale of Little Red Riding Hood emerged during a time of significant social and cultural change in Europe. Understanding the historical context helps us appreciate the deeper meanings and evolution of this enduring story.</p>
    
    <h3>17th Century France: Charles Perrault's Version</h3>
    
    <p>When Charles Perrault published his version of Little Red Riding Hood (Le Petit Chaperon Rouge) in 1697, France was under the rule of Louis XIV. This was a period characterized by:</p>
    
    <ul>
      <li>Strict social hierarchies and court etiquette</li>
      <li>Growing concerns about moral education, particularly for young women</li>
      <li>Increasing literacy among the upper classes</li>
      <li>A fascination with folklore and oral traditions</li>
    </ul>
    
    <p>Perrault's version was explicitly crafted as a moral tale for children, particularly young girls. It warned about the dangers of talking to strangers and the consequences of straying from the proper path. The story reflected societal concerns about young women's virtue and the importance of proper behavior.</p>
    
    <h3>19th Century Germany: The Brothers Grimm Version</h3>
    
    <p>When Jacob and Wilhelm Grimm included their version of Little Red Riding Hood in their collection "Children's and Household Tales" (1812), Germany was experiencing:</p>
    
    <ul>
      <li>The aftermath of the Napoleonic Wars</li>
      <li>A growing sense of German national identity</li>
      <li>Romanticism, with its emphasis on folklore and national traditions</li>
      <li>Industrialization and changing rural lifestyles</li>
    </ul>
    
    <p>The Grimms' version, which includes the rescue of Little Red Riding Hood and her grandmother by a huntsman, reflects different social values. It emphasizes redemption and protection, with the male huntsman figure representing societal order and security.</p>
    
    <h3>Social Significance</h3>
    
    <p>Across its various versions, Little Red Riding Hood has consistently addressed several social themes:</p>
    
    <ol>
      <li><strong>Coming of Age:</strong> The story often functions as a cautionary tale about the transition from childhood to adulthood, particularly for young women.</li>
      <li><strong>Gender Roles:</strong> The tale reflects and sometimes challenges societal expectations about female behavior and vulnerability.</li>
      <li><strong>Rural vs. Urban:</strong> The forest setting often represents the unknown dangers outside of civilized society.</li>
      <li><strong>Obedience and Authority:</strong> The consequences of disobeying parental (particularly maternal) instructions are central to most versions.</li>
    </ol>
    
    <p>As you analyze the tale, consider how these social contexts influenced the storytellers and how the tale itself might have influenced society in turn. The endurance of Little Red Riding Hood speaks to its ability to adapt to changing social concerns while maintaining its core elements.</p>
    
    <div class="ai-tutor-note">
      <h4>AI Tutor Note:</h4>
      <p>Consider how the historical context of each version might have influenced the specific details included or omitted. For example, why might Perrault's version end with the wolf consuming Little Red Riding Hood, while the Grimms' version includes a rescue? How do these different endings reflect the values and concerns of their respective societies?</p>
    </div>
  `,
  isCompleted: false
};

export default function LearnPage() {
  const [overallProgress, setOverallProgress] = useState(12); // Percentage
  
  const handleMarkComplete = () => {
    // In a real app, this would update the database
    setOverallProgress(overallProgress + 4);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container-custom py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="w-full lg:w-2/3">
              <div className="mb-6">
                <Link href={`/courses/${courseData.id}`} className="text-primary flex items-center mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Course Overview
                </Link>
                <h1 className="text-2xl font-bold mb-2">{courseData.title}</h1>
                <p className="text-muted-foreground">AI Tutor: {courseData.instructor}</p>
              </div>
              
              {/* Lesson Content */}
              <LessonContent
                lessonId={lessonData.id}
                courseId={courseData.id}
                title={lessonData.title}
                type={lessonData.type}
                content={lessonData.content}
                isCompleted={lessonData.isCompleted}
                onComplete={handleMarkComplete}
              />
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-8 space-y-6">
                {/* Progress Tracker */}
                <ProgressTracker
                  courseId={courseData.id}
                  courseName={courseData.title}
                  modules={courseData.modules}
                  overallProgress={overallProgress}
                />
                
                {/* AI Tutor */}
                <div className="bg-card rounded-xl border border-border/40 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-medium">AI Tutor Assistant</h3>
                  </div>
                  
                  <div className="bg-secondary/30 rounded-lg p-4 mb-4">
                    <p className="text-sm">
                      I notice you're studying the historical context of Little Red Riding Hood. Would you like me to explain more about how the social conditions in 17th century France influenced Perrault's version?
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button className="text-sm text-left px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      Yes, tell me more about Perrault's social context
                    </button>
                    <button className="text-sm text-left px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      How does this compare to the Brothers Grimm version?
                    </button>
                    <button className="text-sm text-left px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      What are the key differences between versions?
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ask your AI tutor a question..."
                        className="w-full px-4 py-2 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <button className="absolute right-2 top-2 text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
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
