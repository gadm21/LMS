'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Course details that match the home and browse pages
const courseDetails = {
  id: '1',
  title: 'Little Red Riding Hood: Analysis & Interpretation',
  instructor: 'Little Red (AI Tutor)',
  price: 0, // FREE
  image: '/images/courses/little-red-riding-hood.jpeg',
  category: 'Literature',
  level: 'Beginner',
  duration: '4 weeks',
  rating: 4.8,
  reviewCount: 256,
  studentsEnrolled: 12786,
  lastUpdated: 'March 2025',
  description: 'This comprehensive course explores the classic fairy tale "Little Red Riding Hood" through various analytical lenses. Dive deep into the symbolism, cultural significance, and different interpretations of this beloved story across history and cultures. Perfect for literature enthusiasts and those interested in folklore studies.',
  whatYouWillLearn: [
    'Understand the historical context and evolution of the Little Red Riding Hood tale',
    'Analyze the symbolism and metaphors within the story',
    'Explore different cultural adaptations and variations',
    'Examine psychological interpretations and feminist perspectives',
    'Discover how the tale has influenced modern literature and media',
    'Develop critical analysis skills applicable to other literary works'
  ],
  courseContent: [
    {
      title: 'Origins and Historical Context',
      lessons: [
        { title: 'The Oral Tradition of Fairy Tales', duration: '15 min' },
        { title: 'Early Written Versions: Perrault and the Brothers Grimm', duration: '20 min' },
        { title: 'Historical and Social Context', duration: '25 min' },
        { title: 'Evolution of the Tale Through Time', duration: '30 min' }
      ]
    },
    {
      title: 'Symbolism and Interpretation',
      lessons: [
        { title: 'The Red Hood/Cap: Color Symbolism', duration: '20 min' },
        { title: 'The Wolf: Predator Symbolism', duration: '25 min' },
        { title: 'The Forest: Setting as Symbol', duration: '20 min' },
        { title: 'The Journey: Coming of Age Metaphor', duration: '30 min' },
        { title: 'Guided Analysis Exercise', duration: '45 min' }
      ]
    },
    {
      title: 'Cultural Variations and Adaptations',
      lessons: [
        { title: 'European Variations', duration: '25 min' },
        { title: 'Asian Adaptations and Similar Tales', duration: '30 min' },
        { title: 'African and Middle Eastern Parallels', duration: '25 min' },
        { title: 'Modern Retellings in Literature', duration: '35 min' },
        { title: 'Film and Media Adaptations', duration: '40 min' }
      ]
    },
    {
      title: 'Critical Perspectives',
      lessons: [
        { title: 'Psychological Interpretations', duration: '30 min' },
        { title: 'Feminist Readings of Little Red Riding Hood', duration: '35 min' },
        { title: 'Sociopolitical Analysis', duration: '25 min' },
        { title: 'The Tale in Modern Context', duration: '30 min' },
        { title: 'Final Project: Creating Your Own Analysis', duration: '90 min' }
      ]
    }
  ],
  requirements: [
    'No prior knowledge of literary analysis required',
    'Basic reading comprehension skills',
    'Interest in folklore and fairy tales',
    'Openness to exploring different interpretations and perspectives'
  ],
  instructorBio: 'Little Red is an AI tutor with a passion for literary analysis and a knack for unraveling the hidden meanings in classic tales. With a virtual backpack full of folklore knowledge and a witty approach to teaching, Little Red guides students through the woods of literary interpretation without letting them stray from the path. Known for breaking down complex symbolism into bite-sized pieces that even Grandma would understand, this tutor has helped thousands of students see that there\'s always more than meets the eye in every story.'
};

// All courses data that matches the home and browse pages
const allCoursesData = [
  {
    id: '1',
    title: 'Little Red Riding Hood: Analysis & Interpretation',
    instructor: 'Little Red (AI Tutor)',
    price: 0,
    image: '/images/courses/little-red-riding-hood.jpeg',
    category: 'Literature',
    level: 'Beginner',
    duration: '4 weeks',
    rating: 4.8,
    reviewCount: 256,
    studentsEnrolled: 12786,
    lastUpdated: 'March 2025',
    description: 'This comprehensive course explores the classic fairy tale "Little Red Riding Hood" through various analytical lenses. Dive deep into the symbolism, cultural significance, and different interpretations of this beloved story across history and cultures. Perfect for literature enthusiasts and those interested in folklore studies.',
    whatYouWillLearn: courseDetails.whatYouWillLearn,
    courseContent: courseDetails.courseContent,
    requirements: courseDetails.requirements,
    instructorBio: 'Little Red is an AI tutor specializing in literary analysis and folklore studies. With expertise in analyzing classic fairy tales, Little Red provides personalized guidance to help students understand the deeper meanings and cultural significance of these timeless stories.'
  },
  {
    id: '2',
    title: 'Six Sigma Green Belt: ASQ Exam Prep',
    instructor: 'Effy Maxwell (AI Tutor)',
    price: 299,
    startingPrice: 5,
    image: '/images/courses/six-sigma-green-belt.webp',
    category: 'Business',
    level: 'Advanced',
    duration: '8 weeks',
    rating: 4.9,
    reviewCount: 189,
    studentsEnrolled: 3567,
    lastUpdated: 'March 2025',
    description: 'Prepare for the ASQ Six Sigma Green Belt certification with this comprehensive course. Learn process improvement methodologies, statistical analysis techniques, and project management skills needed to pass the exam and excel in your career.',
    whatYouWillLearn: courseDetails.whatYouWillLearn,
    courseContent: courseDetails.courseContent,
    requirements: courseDetails.requirements,
    instructorBio: 'Effy Maxwell is an AI tutor who turns the complex world of Six Sigma into surprisingly digestible content. With a virtual toolbelt of statistical methods and a talent for explaining process improvement without inducing naps, Effy makes quality management actually enjoyable. Known for breaking down DMAIC methodology with pop culture references and memorable analogies, this tutor has helped thousands of professionals ace their certification exams while actually understanding the material. Effy\'s virtual office is always stocked with digital coffee to fuel your late-night study sessions.'
  },
  {
    id: '3',
    title: 'Certified Financial Planner: CFA Exam Prep',
    instructor: 'Finnan Morgan (AI Tutor)',
    price: 399,
    startingPrice: 5,
    image: '/images/courses/financial-analyst.webp',
    category: 'Finance',
    level: 'Advanced',
    duration: '10 weeks',
    rating: 4.7,
    reviewCount: 142,
    studentsEnrolled: 2189,
    lastUpdated: 'February 2025',
    description: 'Comprehensive preparation for the Certified Financial Analyst (CFA) exam. Master financial analysis, investment strategies, portfolio management, and ethical standards required for certification.',
    whatYouWillLearn: courseDetails.whatYouWillLearn,
    courseContent: courseDetails.courseContent,
    requirements: courseDetails.requirements,
    instructorBio: "Finnan Morgan is an AI tutor who makes financial analysis feel less like rocket science and more like an engaging puzzle. With a virtual Bloomberg terminal always at the ready and a knack for explaining complex market concepts using everyday examples, Finnan turns intimidating financial jargon into accessible knowledge. Known for demystifying portfolio theory with humor and relatable analogies about shopping budgets, this tutor has guided thousands of aspiring analysts through the CFA labyrinth without letting them get lost in the derivatives. Finnan's digital bow tie is always perfectly straight, just like the regression lines in the analysis examples."
  }
];

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  // Unwrap params using React.use() before accessing properties
  const unwrappedParams = use(params);
  
  // Find the course that matches the ID from the URL
  const currentCourse = allCoursesData.find(course => course.id === unwrappedParams.id) || allCoursesData[0];
  
  const toggleSection = (sectionTitle: string) => {
    if (expandedSections.includes(sectionTitle)) {
      setExpandedSections(expandedSections.filter(title => title !== sectionTitle));
    } else {
      setExpandedSections([...expandedSections, sectionTitle]);
    }
  };
  
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Check if course is already in cart
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cartItems = localStorage.getItem('cartItems');
      if (cartItems) {
        const items = JSON.parse(cartItems);
        const isInCart = items.some(item => item.id === currentCourse.id);
        setAddedToCart(isInCart);
      }
    }
  }, [currentCourse.id]);
  
  const addToCart = () => {
    if (typeof window !== 'undefined') {
      // Get current cart items
      const cartItems = localStorage.getItem('cartItems');
      let items = cartItems ? JSON.parse(cartItems) : [];
      
      // Check if course is already in cart
      const isInCart = items.some(item => item.id === currentCourse.id);
      
      if (!isInCart) {
        // Add course to cart
        items.push({
          id: currentCourse.id,
          title: currentCourse.title,
          instructor: currentCourse.instructor,
          price: currentCourse.startingPrice || currentCourse.price,
          originalPrice: currentCourse.price,
          startingPrice: currentCourse.startingPrice,
          image: currentCourse.image
        });
        
        // Update localStorage
        localStorage.setItem('cartItems', JSON.stringify(items));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new Event('storage'));
        
        // Show success message
        setAddedToCart(true);
        
        // Log for debugging
        console.log('Added course to cart:', currentCourse.id);
      }
    }
  };
  
  const buyNow = () => {
    // Add the course to the cart first
    if (typeof window !== 'undefined') {
      // Get current cart items
      const cartItems = localStorage.getItem('cartItems');
      let items = cartItems ? JSON.parse(cartItems) : [];
      
      // Check if course is already in cart
      const isInCart = items.some(item => item.id === currentCourse.id);
      
      if (!isInCart) {
        // Add course to cart
        items.push({
          id: currentCourse.id,
          title: currentCourse.title,
          instructor: currentCourse.instructor,
          price: currentCourse.startingPrice || currentCourse.price,
          originalPrice: currentCourse.price,
          startingPrice: currentCourse.startingPrice,
          image: currentCourse.image
        });
        
        // Update localStorage
        localStorage.setItem('cartItems', JSON.stringify(items));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new Event('storage'));
      }
    }
    
    console.log('Buying course now:', currentCourse.id);
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Course Header */}
        <section className="bg-secondary/30 py-12">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    {currentCourse.category}
                  </span>
                  <span className="bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    {currentCourse.level}
                  </span>
                </div>
                
                <h1 className="font-bold mb-4">{currentCourse.title}</h1>
                
                <p className="text-muted-foreground mb-6">
                  {currentCourse.description}
                </p>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => {
                        // For full stars
                        if (star <= Math.floor(currentCourse.rating)) {
                          return (
                            <svg 
                              key={star} 
                              className="w-5 h-5 text-yellow-500" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          );
                        } 
                        // For partial stars (decimal part)
                        else if (star === Math.ceil(currentCourse.rating) && currentCourse.rating % 1 !== 0) {
                          const decimal = currentCourse.rating % 1;
                          return (
                            <div key={star} className="relative">
                              {/* Gray background star */}
                              <svg 
                                className="w-5 h-5 text-gray-300" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {/* Yellow partial overlay */}
                              <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${decimal * 100}%` }}>
                                <svg 
                                  className="w-5 h-5 text-yellow-500" 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                            </div>
                          );
                        } 
                        // For empty stars
                        else {
                          return (
                            <svg 
                              key={star} 
                              className="w-5 h-5 text-gray-300" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          );
                        }
                      })}
                    </div>
                    <span className="ml-2 text-muted-foreground">
                      {currentCourse.rating} ({currentCourse.reviewCount} reviews)
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {currentCourse.studentsEnrolled.toLocaleString()} students
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted mr-3"></div>
                    <span className="font-medium">{currentCourse.instructor}</span>
                  </div>
                  <span className="text-muted-foreground">
                    Last updated: {currentCourse.lastUpdated}
                  </span>
                </div>
              </div>
              
              <div className="bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm">
                <div className="relative h-48 w-full">
                  <Image
                    src={currentCourse.image}
                    alt={currentCourse.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    {currentCourse.price === 0 ? (
                      <span className="text-3xl font-bold">FREE</span>
                    ) : currentCourse.startingPrice ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Starting at ${currentCourse.startingPrice}</span>
                        <span className="text-3xl font-bold line-through text-muted-foreground">${currentCourse.price}</span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold">${currentCourse.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={addToCart}
                      className={`w-full ${addedToCart ? 'bg-green-600 hover:bg-green-700 text-white' : 'btn-secondary'} transition-colors duration-300`}
                      disabled={addedToCart}
                    >
                      {addedToCart ? 'Added Successfully' : 'Add to Cart'}
                    </button>
                    
                    <button 
                      onClick={buyNow}
                      className="w-full btn-primary"
                    >
                      Buy Now
                    </button>
                  </div>
                  
                  <div className="mt-6 space-y-4 text-sm">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{courseDetails.duration} of self-paced content</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>AI tutor assistance</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Course Content Tabs */}
        <section className="py-8 border-b border-border/40">
          <div className="container-custom">
            <div className="flex overflow-x-auto space-x-8 pb-2">
              <button
                className={`pb-2 font-medium ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`pb-2 font-medium ${activeTab === 'curriculum' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('curriculum')}
              >
                Curriculum
              </button>
              <button
                className={`pb-2 font-medium ${activeTab === 'instructor' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('instructor')}
              >
                Instructor
              </button>
              <button
                className={`pb-2 font-medium ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>
          </div>
        </section>
        
        {/* Tab Content */}
        <section className="py-12">
          <div className="container-custom">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseDetails.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                  <ul className="space-y-3">
                    {courseDetails.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Description</h2>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground mb-4">
                      {courseDetails.description}
                    </p>
                    <p className="text-muted-foreground mb-4">
                      This self-paced course allows you to explore the rich world of "Little Red Riding Hood" at your own convenience. Through a combination of lectures, interactive exercises, and guided analyses, you'll gain a deep understanding of this classic tale and its significance across cultures and time periods.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Our AI tutor will guide you through the material, providing personalized feedback and answering your questions in real-time. This innovative approach ensures you receive the support you need exactly when you need it, enhancing your learning experience.
                    </p>
                    <p className="text-muted-foreground">
                      By the end of this course, you'll have developed critical analysis skills that extend beyond this specific tale, enabling you to approach other literary works with newfound insight and perspective. Whether you're a literature enthusiast, a folklore aficionado, or simply curious about the deeper meanings behind familiar stories, this course offers valuable knowledge and skills.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-6">Course Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card rounded-xl p-6 border border-border/40">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">Self-Paced Learning</h3>
                      <p className="text-muted-foreground">
                        Complete the course at your own pace, with no deadlines or time constraints. Access the material whenever it's convenient for you.
                      </p>
                    </div>
                    
                    <div className="bg-card rounded-xl p-6 border border-border/40">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">AI Tutor Assistance</h3>
                      <p className="text-muted-foreground">
                        Receive personalized guidance from our AI tutor that adapts to your learning style and provides immediate feedback on your progress.
                      </p>
                    </div>
                    
                    <div className="bg-card rounded-xl p-6 border border-border/40">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">Flexible Learning Options</h3>
                      <p className="text-muted-foreground">
                        Access course materials on any device, allowing you to learn wherever and whenever is most convenient for you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                <div className="space-y-4">
                  {courseDetails.courseContent.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border border-border/40 rounded-lg overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between p-4 bg-secondary/30 text-left"
                        onClick={() => toggleSection(section.title)}
                      >
                        <div className="font-medium">{section.title}</div>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-3">
                            {section.lessons.length} lessons
                          </span>
                          <svg
                            className={`w-5 h-5 transition-transform ${expandedSections.includes(section.title) ? 'transform rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {expandedSections.includes(section.title) && (
                        <div className="p-4 space-y-2">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-muted-foreground mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{lesson.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Instructor Tab */}
            {activeTab === 'instructor' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Instructor</h2>
                <div className="flex items-start space-x-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-muted flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">{currentCourse.instructor}</h3>
                    <p className="text-muted-foreground mb-4">AI Tutor</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{currentCourse.rating} Instructor Rating</span>
                      </div>
                      <span className="text-muted-foreground">{currentCourse.studentsEnrolled.toLocaleString()}+ Students</span>
                    </div>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground mb-4">
                    {currentCourse.instructorBio}
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Our AI tutors combine deep subject knowledge with personalized learning approaches to create an engaging educational experience. The adaptive teaching methodology adjusts to your learning style and pace, ensuring you get exactly the support you need when you need it.
                  </p>
                  <p className="text-muted-foreground">
                    In this course, you'll benefit from 24/7 access to your AI tutor, receiving instant feedback on your progress and personalized guidance throughout your learning journey. No office hours, no waiting - just continuous support whenever inspiration strikes.
                  </p>
                </div>
              </div>
            )}
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Student Reviews</h2>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            className={`w-5 h-5 ${star <= Math.floor(courseDetails.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-lg">
                        {courseDetails.rating} course rating • {courseDetails.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Sample reviews */}
                  <div className="border-b border-border/40 pb-8 last:border-0">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-muted"></div>
                      <div>
                        <h4 className="font-medium">Emily Thompson</h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg 
                                key={star} 
                                className="w-4 h-4 text-yellow-500" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-muted-foreground">2 months ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "This course completely changed how I view fairy tales! Dr. Johnson's analysis is insightful and engaging. The AI tutor was incredibly helpful - it felt like having a personal guide through the material. I loved being able to work through the content at my own pace while still getting immediate feedback on my analyses. Highly recommended for anyone interested in literature or folklore!"
                    </p>
                  </div>
                  
                  <div className="border-b border-border/40 pb-8 last:border-0">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-muted"></div>
                      <div>
                        <h4 className="font-medium">Michael Rodriguez</h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg 
                                key={star} 
                                className={`w-4 h-4 ${star <= 4 ? 'text-yellow-500' : 'text-gray-300'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-muted-foreground">1 month ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "The flexibility of this course was perfect for my busy schedule. I could study late at night or early in the morning, whenever I had free time. The content is rich and thought-provoking, and the AI tutor was surprisingly effective at answering my questions and providing personalized feedback on my assignments. The cultural variations section was particularly fascinating."
                    </p>
                  </div>
                  
                  <div className="border-b border-border/40 pb-8 last:border-0">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-muted"></div>
                      <div>
                        <h4 className="font-medium">Sarah Chen</h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg 
                                key={star} 
                                className="w-4 h-4 text-yellow-500" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-muted-foreground">3 weeks ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "As someone who's always been interested in fairy tales but never studied them formally, this course was the perfect introduction. The AI tutor was incredibly patient with my beginner questions and helped me develop my analytical skills. I appreciated being able to revisit lectures and get additional explanations whenever I needed them. Dr. Johnson's passion for the subject really comes through in her teaching."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
