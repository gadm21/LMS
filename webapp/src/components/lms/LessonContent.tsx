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
  const [expandedSections, setExpandedSections] = useState<string[]>(['section-1'])
  
  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId))
    } else {
      setExpandedSections([...expandedSections, sectionId])
    }
  }
  
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
            {/* Expandable Sections */}
            <div className="space-y-6">
              <div className="border border-border/40 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection('section-1')}
                  className="w-full flex items-center justify-between p-4 bg-secondary/30 text-left hover:bg-secondary/50 transition-colors"
                >
                  <h2 className="text-xl font-medium">Historical and Social Context</h2>
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.includes('section-1') ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSections.includes('section-1') && (
                  <div className="p-4">
                    <p className="mb-4">The tale of Little Red Riding Hood emerged during a time of significant social and cultural change in Europe. Understanding the historical context helps us appreciate the deeper meanings and evolution of this enduring story.</p>
                    
                    <h3 className="text-lg font-medium mb-2">17th Century France: Charles Perrault's Version</h3>
                    <p className="mb-4">When Charles Perrault published his version of Little Red Riding Hood (Le Petit Chaperon Rouge) in 1697, France was under the rule of Louis XIV. This was a period characterized by:</p>
                    
                    <ul className="list-disc pl-5 mb-4">
                      <li>Strict social hierarchies and court etiquette</li>
                      <li>Growing concerns about moral education, particularly for young women</li>
                      <li>Increasing literacy among the upper classes</li>
                      <li>A fascination with folklore and oral traditions</li>
                    </ul>
                    
                    {/* Image support */}
                    <div className="my-6 border border-border/40 rounded-lg overflow-hidden">
                      <img 
                        src="/images/courses/perrault-illustration.jpg" 
                        alt="Original illustration from Perrault's version"
                        className="w-full h-auto"
                      />
                      <div className="p-2 bg-secondary/20 text-sm text-center text-muted-foreground">
                        Original illustration from Perrault's 1697 publication
                      </div>
                    </div>
                    
                    <p>Perrault's version was explicitly crafted as a moral tale for children, particularly young girls. It warned about the dangers of talking to strangers and the consequences of straying from the proper path.</p>
                  </div>
                )}
              </div>
              
              <div className="border border-border/40 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection('section-2')}
                  className="w-full flex items-center justify-between p-4 bg-secondary/30 text-left hover:bg-secondary/50 transition-colors"
                >
                  <h2 className="text-xl font-medium">19th Century Germany: The Brothers Grimm</h2>
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.includes('section-2') ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSections.includes('section-2') && (
                  <div className="p-4">
                    <p className="mb-4">When Jacob and Wilhelm Grimm included their version of Little Red Riding Hood in their collection "Children's and Household Tales" (1812), Germany was experiencing:</p>
                    
                    <ul className="list-disc pl-5 mb-4">
                      <li>The aftermath of the Napoleonic Wars</li>
                      <li>A growing sense of German national identity</li>
                      <li>Romanticism, with its emphasis on folklore and national traditions</li>
                      <li>Industrialization and changing rural lifestyles</li>
                    </ul>
                    
                    {/* Image support */}
                    <div className="my-6 border border-border/40 rounded-lg overflow-hidden">
                      <img 
                        src="/images/courses/grimm-illustration.jpg" 
                        alt="Illustration from Grimm Brothers' version"
                        className="w-full h-auto"
                      />
                      <div className="p-2 bg-secondary/20 text-sm text-center text-muted-foreground">
                        Illustration from the Brothers Grimm version showing the huntsman's rescue
                      </div>
                    </div>
                    
                    <p>The Grimms' version, which includes the rescue of Little Red Riding Hood and her grandmother by a huntsman, reflects different social values. It emphasizes redemption and protection, with the male huntsman figure representing societal order and security.</p>
                  </div>
                )}
              </div>
              
              <div className="border border-border/40 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection('section-3')}
                  className="w-full flex items-center justify-between p-4 bg-secondary/30 text-left hover:bg-secondary/50 transition-colors"
                >
                  <h2 className="text-xl font-medium">Social Significance and Modern Interpretations</h2>
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.includes('section-3') ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSections.includes('section-3') && (
                  <div className="p-4">
                    <p className="mb-4">Across its various versions, Little Red Riding Hood has consistently addressed several social themes:</p>
                    
                    <ol className="list-decimal pl-5 mb-4">
                      <li><strong>Coming of Age:</strong> The story often functions as a cautionary tale about the transition from childhood to adulthood, particularly for young women.</li>
                      <li><strong>Gender Roles:</strong> The tale reflects and sometimes challenges societal expectations about female behavior and vulnerability.</li>
                      <li><strong>Rural vs. Urban:</strong> The forest setting often represents the unknown dangers outside of civilized society.</li>
                      <li><strong>Obedience and Authority:</strong> The consequences of disobeying parental (particularly maternal) instructions are central to most versions.</li>
                    </ol>
                    
                    {/* Image support */}
                    <div className="my-6 border border-border/40 rounded-lg overflow-hidden">
                      <img 
                        src="/images/courses/modern-adaptation.jpg" 
                        alt="Modern film adaptation of Little Red Riding Hood"
                        className="w-full h-auto"
                      />
                      <div className="p-2 bg-secondary/20 text-sm text-center text-muted-foreground">
                        A scene from a modern film adaptation showing contemporary interpretations
                      </div>
                    </div>
                    
                    <p>As you analyze the tale, consider how these social contexts influenced the storytellers and how the tale itself might have influenced society in turn. The endurance of Little Red Riding Hood speaks to its ability to adapt to changing social concerns while maintaining its core elements.</p>
                    
                    <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <h4 className="font-medium mb-2">AI Tutor Note:</h4>
                      <p>Consider how the historical context of each version might have influenced the specific details included or omitted. For example, why might Perrault's version end with the wolf consuming Little Red Riding Hood, while the Grimms' version includes a rescue? How do these different endings reflect the values and concerns of their respective societies?</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {type === 'quiz' && (
          <div className="p-6">
            <div className="text-lg font-medium mb-4">Quiz: {title}</div>
            <div className="text-muted-foreground mb-6">
              Complete this quiz to test your knowledge and unlock the next lesson. You must answer all questions correctly to proceed.
            </div>
            {/* Quiz questions */}
            <div className="space-y-6">
              <div className="p-4 border border-border rounded-lg">
                <div className="font-medium mb-3">Question 1: What period was Charles Perrault's version of Little Red Riding Hood published?</div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="radio" id="q1-a" name="q1" className="mr-2" />
                    <label htmlFor="q1-a">16th Century</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q1-b" name="q1" className="mr-2" />
                    <label htmlFor="q1-b">17th Century</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q1-c" name="q1" className="mr-2" />
                    <label htmlFor="q1-c">18th Century</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q1-d" name="q1" className="mr-2" />
                    <label htmlFor="q1-d">19th Century</label>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <div className="font-medium mb-3">Question 2: Which of the following is NOT a theme addressed in Little Red Riding Hood?</div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="radio" id="q2-a" name="q2" className="mr-2" />
                    <label htmlFor="q2-a">Coming of Age</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q2-b" name="q2" className="mr-2" />
                    <label htmlFor="q2-b">Gender Roles</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q2-c" name="q2" className="mr-2" />
                    <label htmlFor="q2-c">Industrialization</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q2-d" name="q2" className="mr-2" />
                    <label htmlFor="q2-d">Obedience and Authority</label>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <div className="font-medium mb-3">Question 3: What major difference exists between Perrault's and the Brothers Grimm versions?</div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="radio" id="q3-a" name="q3" className="mr-2" />
                    <label htmlFor="q3-a">The color of the hood/cap</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q3-b" name="q3" className="mr-2" />
                    <label htmlFor="q3-b">The presence of a rescue in the Grimm version</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q3-c" name="q3" className="mr-2" />
                    <label htmlFor="q3-c">The absence of a wolf in Perrault's version</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="q3-d" name="q3" className="mr-2" />
                    <label htmlFor="q3-d">The setting of the story</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                className="btn-primary"
                onClick={() => {
                  alert('Quiz submitted! In a full implementation, this would check answers and unlock the next lesson if all are correct.');
                  onComplete();
                }}
              >
                Submit Quiz
              </button>
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
          <button 
            className="btn-secondary"
            onClick={() => alert('Previous lesson functionality will be implemented with proper progression tracking.')}
          >
            Previous Lesson
          </button>
          {isCompleted ? (
            <button 
              className="btn-primary"
              onClick={() => alert('Next lesson is now available! In a full implementation, this would navigate to the next lesson.')}
            >
              Next Lesson
            </button>
          ) : (
            <button 
              className="btn-primary opacity-50 cursor-not-allowed"
              title="Complete this lesson to unlock the next one"
              disabled={!isCompleted}
            >
              Next Lesson
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
