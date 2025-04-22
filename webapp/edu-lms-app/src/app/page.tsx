'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/layout/HeroSection'

export default function Home() {
  // Featured courses data
  const featuredCourses = [
    {
      id: '1',
      title: 'Little Red Riding Hood: Analysis & Interpretation',
      aiTutor: 'Little Red',
      image: '/images/courses/little-red-riding-hood.jpeg',
      price: 0,
      rating: 4.8,
      students: 12786,
      category: 'Literature'
    },
    {
      id: '2',
      title: 'Six Sigma Green Belt: ASQ Exam Prep',
      aiTutor: 'Effy Maxwell',
      image: '/images/courses/six-sigma-green-belt.webp',
      price: 299,
      rating: 4.9,
      students: 3567,
      category: 'Business',
      startingPrice: 5
    },
    {
      id: '3',
      title: 'Certified Financial Planner: CFA Exam Prep',
      aiTutor: 'Finnan Morgan',
      image: '/images/courses/financial-analyst.webp',
      price: 399,
      rating: 4.7,
      students: 2189,
      category: 'Finance',
      startingPrice: 5
    }
  ];
  
  // Categories data
  const categories = [
    { name: 'Literature', icon: '📚', count: 24 },
    { name: 'Business', icon: '📊', count: 36 },
    { name: 'Finance', icon: '💰', count: 28 },
    { name: 'Technology', icon: '💻', count: 42 },
    { name: 'Design', icon: '🎨', count: 18 },
    { name: 'Science', icon: '🔬', count: 29 }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection 
          title="Elevate Your Future with Modern Education"
          subtitle="AI-powered online courses adapted to your pace, providing personalized guidance from an intelligent AI tutor. Learn smarter, not harder—master skills, advance your career, and achieve your dreams with a learning experience designed just for you."
          primaryButtonText="Explore Courses"
          primaryButtonLink="/courses"
          secondaryButtonText="Learn More"
          secondaryButtonLink="/courses"
        />
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-secondary/5">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Our innovative approach to education combines cutting-edge technology with personalized learning experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card rounded-xl border border-border/40 p-8 transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Self-Paced Learning</h3>
                <p className="text-muted-foreground">
                  Learn at your own pace with flexible schedules and on-demand access to course materials. No deadlines or pressure—just progress at the speed that works for you.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-card rounded-xl border border-border/40 p-8 transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">AI Tutor Assistance</h3>
                <p className="text-muted-foreground">
                  Get personalized guidance from our intelligent AI tutors that adapt to your learning style and needs. Receive instant feedback, answers to questions, and tailored recommendations.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-card rounded-xl border border-border/40 p-8 transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Verified Certificates</h3>
                <p className="text-muted-foreground">
                  Earn recognized certificates upon course completion to showcase your new skills. Share your achievements on LinkedIn and other platforms to boost your career prospects.
                </p>
              </div>
              
              {/* Feature 4 - Real-Time Progress Tracking */}
              <div className="bg-card rounded-xl border border-border/40 p-8 transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Real-Time Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Stay on top of your learning journey with intuitive dashboards and detailed analytics. Monitor your achievements, identify areas for improvement, and celebrate your milestones as you advance.
                </p>
              </div>
              
              {/* Feature 5 - Accessible Anytime, Anywhere */}
              <div className="bg-card rounded-xl border border-border/40 p-8 transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Accessible Anytime, Anywhere</h3>
                <p className="text-muted-foreground">
                  Whether you're at home, at work, or on the move, our platform is available 24/7 on all devices. Learn wherever life takes you—no classrooms, no commute, just seamless access to knowledge.
                </p>
              </div>
              
              {/* Feature 6 - Always Up-to-Date Content */}
              <div className="bg-card rounded-xl border border-border/40 p-8 transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Always Up-to-Date Content</h3>
                <p className="text-muted-foreground">
                  Our AI continuously analyzes industry trends and updates course material in real time, ensuring you always learn the most relevant and current information. No outdated content—just cutting-edge skills that match today's world.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Courses Section */}
        <section id="courses" className="py-20">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Explore our most popular courses with personalized AI tutoring and self-paced learning options.
                </p>
              </div>
              <Link href="/courses" className="mt-4 md:mt-0 btn-secondary">
                View All Courses
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div key={course.id} className="bg-card rounded-xl border border-border/40 overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {course.category}
                      </span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-xl mb-2">{course.title}</h3>
                    <p className="text-muted-foreground mb-4">AI Tutor: {course.aiTutor}</p>
                    <div className="flex items-center justify-between">
                      {course.price === 0 ? (
                        <span className="text-lg font-bold">FREE</span>
                      ) : course.startingPrice ? (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-muted-foreground mr-2">Starting at ${course.startingPrice}</span>
                          <span className="text-lg font-bold line-through text-muted-foreground">${course.price}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">${course.price}</span>
                      )}
                      <span className="text-sm text-muted-foreground">{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="mt-6">
                      <Link href={`/courses/${course.id}`} className="btn-primary w-full">
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Browse by Category Section */}
        <section id="categories" className="py-20 bg-secondary/5">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                Browse by Category
                <span className="ml-3 text-sm font-medium text-red-500">(Coming Soon)</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our diverse range of course categories to find the perfect learning path for your goals.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="bg-card rounded-xl border border-border/40 p-6 text-center transition-all hover:shadow-lg hover:border-primary/40 cursor-default"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-medium mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} courses</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from our students about their experiences with our AI-powered learning platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-card rounded-xl border border-border/40 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">JD</span>
                  </div>
                  <div>
                    <h4 className="font-medium">James Davis</h4>
                    <p className="text-sm text-muted-foreground">Six Sigma Green Belt Student</p>
                  </div>
                </div>
                <p className="italic">
                  "The AI tutor was a game-changer for me. It's like having a personal instructor available 24/7 who understands exactly where I'm struggling and how to help me. The self-paced format allowed me to balance my studies with my full-time job."
                </p>
                <div className="mt-4 flex">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-card rounded-xl border border-border/40 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">SL</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah Lee</h4>
                    <p className="text-sm text-muted-foreground">CFA Exam Prep Student</p>
                  </div>
                </div>
                <p className="italic">
                  "I've tried other online courses before, but the AI tutor on this platform makes all the difference. It adapts to my learning style and provides personalized feedback on my practice exams. I've learned more in two months than I did in a year of traditional courses."
                </p>
                <div className="mt-4 flex">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-card rounded-xl border border-border/40 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">RM</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Robert Martinez</h4>
                    <p className="text-sm text-muted-foreground">Literature Student</p>
                  </div>
                </div>
                <p className="italic">
                  "The Little Red Riding Hood course was fascinating! The AI tutor helped me understand the symbolism and historical context in ways I never would have on my own. Being able to learn at my own pace meant I could really dive deep into the material."
                </p>
                <div className="mt-4 flex">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of students who are already benefiting from our AI-powered courses and personalized learning approach. Start your journey today and learn at your own pace with guidance from our intelligent AI tutors.
              </p>
              <div className="flex justify-center">
                <button onClick={() => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' })} className="btn-primary">
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
