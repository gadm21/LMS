'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('my-courses');
  
  // Sample enrolled courses data
  const enrolledCourses = [
    {
      id: '1',
      title: 'Little Red Riding Hood: Analysis & Interpretation',
      instructor: 'Little Red',
      image: '/images/courses/little-red-riding-hood.jpeg',
      progress: 12,
      lastAccessed: '2 hours ago'
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow">
        {/* Dashboard Header */}
        <section className="bg-secondary/30 py-8">
          <div className="container-custom">
            <h1 className="font-bold mb-2">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress, access your courses, and manage your account
            </p>
          </div>
        </section>
        
        {/* Dashboard Tabs */}
        <section className="border-b border-border/40">
          <div className="container-custom">
            <div className="flex overflow-x-auto space-x-8 py-4">
              <button
                className={`pb-2 font-medium ${activeTab === 'my-courses' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('my-courses')}
              >
                My Courses
              </button>
              <button
                className={`pb-2 font-medium ${activeTab === 'certificates' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('certificates')}
              >
                Certificates
              </button>
              <button
                className={`pb-2 font-medium ${activeTab === 'purchase-history' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('purchase-history')}
              >
                Purchase History
              </button>
              <button
                className={`pb-2 font-medium ${activeTab === 'account' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('account')}
              >
                Account Settings
              </button>
            </div>
          </div>
        </section>
        
        {/* Tab Content */}
        <section className="py-12">
          <div className="container-custom">
            {/* My Courses Tab */}
            {activeTab === 'my-courses' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <h2 className="text-2xl font-bold">My Enrolled Courses</h2>
                  <Link href="/courses" className="mt-4 md:mt-0 btn-secondary">
                    Browse More Courses
                  </Link>
                </div>
                
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-6">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="bg-card rounded-xl border border-border/40 overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto relative">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 md:w-3/4 flex flex-col justify-between">
                            <div>
                              <h3 className="font-medium mb-2">{course.title}</h3>
                              <p className="text-muted-foreground mb-4">AI Tutor: {course.instructor}</p>
                              
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-muted-foreground">Progress: {course.progress}%</span>
                                  <span className="text-sm text-muted-foreground">Last accessed: {course.lastAccessed}</span>
                                </div>
                                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full" 
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              <Link href={`/courses/${course.id}/learn`} className="btn-primary">
                                Continue Learning
                              </Link>
                              <button 
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setShowCourseDetails(true);
                                }} 
                                className="btn-secondary"
                              >
                                Course Details
                              </button>
                              <button 
                                className={`btn-secondary opacity-50 cursor-not-allowed`}
                                title="Accessible once you complete the course"
                                disabled={course.progress < 100}
                              >
                                Certificate
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-xl border border-border/40">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-secondary">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.
                    </p>
                    <Link href="/courses" className="btn-primary">
                      Browse Courses
                    </Link>
                  </div>
                )}
                
                {/* Demo Access Section */}
                <div className="mt-12 bg-primary/5 rounded-xl border border-primary/20 p-6">
                  <h3 className="text-xl font-medium mb-4">Test Access to LMS Features</h3>
                  <p className="mb-6">
                    You can directly access our Learning Management System features without enrollment using the links below:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/courses/1/learn" className="btn-primary">
                      Access Little Red Riding Hood Course
                    </Link>
                    <Link href="/courses/1/learn/quiz" className="btn-secondary">
                      Try Quiz Component
                    </Link>
                    <Link href="/courses/1/learn/certificate" className="btn-secondary">
                      View Certificate Example
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div>
                <h2 className="text-2xl font-bold mb-8">My Certificates</h2>
                
                <div className="text-center py-12 bg-card rounded-xl border border-border/40">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-secondary">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No certificates yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete a course to earn your certificate. You can download and share your certificates once earned.
                  </p>
                  <Link href="/courses/1/learn/certificate" className="btn-primary">
                    View Certificate Example
                  </Link>
                </div>
              </div>
            )}
            
            {/* Purchase History Tab */}
            {activeTab === 'purchase-history' && (
              <div>
                <h2 className="text-2xl font-bold mb-8">Purchase History</h2>
                
                <div className="text-center py-12 bg-card rounded-xl border border-border/40">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-secondary">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No purchase history</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't made any purchases yet. Browse our catalog to find courses that interest you.
                  </p>
                  <Link href="/courses" className="btn-primary">
                    Browse Courses
                  </Link>
                </div>
              </div>
            )}
            
            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-bold mb-8">Account Settings</h2>
                
                <div className="bg-card rounded-xl border border-border/40 p-6 mb-8">
                  <h3 className="font-medium mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value="Test User"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={session?.user?.email || 'test@example.com'}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium mb-2">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      ></textarea>
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl border border-border/40 p-6">
                  <h3 className="font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Course Updates</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications about course updates and new content</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">New Courses</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications about new course releases</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Promotions</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications about discounts and special offers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn-primary">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Course Details Popup */}
      {showCourseDetails && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                <button 
                  onClick={() => setShowCourseDetails(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3">
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress: {selectedCourse.progress}%</span>
                      <span className="text-sm text-muted-foreground">Last accessed: {selectedCourse.lastAccessed}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${selectedCourse.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <p className="text-muted-foreground mb-4">AI Tutor: {selectedCourse.instructor}</p>
                  
                  <h3 className="text-lg font-medium mb-2">Course Description</h3>
                  <p className="text-muted-foreground mb-6">
                    An in-depth analysis of the classic fairy tale "Little Red Riding Hood." This course explores the historical context, symbolism, and cultural variations of this beloved story. Through close reading and guided interpretation, you'll discover the deeper meanings and enduring relevance of this seemingly simple tale.
                  </p>
                  
                  <h3 className="text-lg font-medium mb-2">What You'll Learn</h3>
                  <ul className="list-disc pl-5 mb-6 text-muted-foreground">
                    <li>The historical origins and evolution of the tale</li>
                    <li>Symbolic interpretations of key elements (the red hood, the wolf, the forest)</li>
                    <li>Comparative analysis of different cultural versions</li>
                    <li>Modern adaptations and their significance</li>
                    <li>Techniques for literary analysis and interpretation</li>
                  </ul>
                  
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/courses/${selectedCourse.id}/learn`} className="btn-primary">
                      Continue Learning
                    </Link>
                    <button 
                      className={`btn-secondary opacity-50 cursor-not-allowed`}
                      title="Accessible once you complete the course"
                      disabled={selectedCourse.progress < 100}
                    >
                      Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
