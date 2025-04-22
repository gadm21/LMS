'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CourseCard from '@/components/course/CourseCard'

// Updated course data to match the home page featured courses
const allCourses = [
  {
    id: '1',
    title: 'Little Red Riding Hood: Analysis & Interpretation',
    instructor: 'Little Red (AI Tutor)',
    price: 0,
    image: '/images/courses/little-red-riding-hood.jpeg',
    category: 'Literature',
    level: 'Beginner',
    duration: '4 weeks'
  },
  {
    id: '2',
    title: 'Six Sigma Green Belt: ASQ Exam Prep',
    instructor: 'Effy Maxwell (AI Tutor)',
    price: 299,
    image: '/images/courses/six-sigma-green-belt.webp',
    category: 'Business',
    level: 'Advanced',
    duration: '8 weeks',
    startingPrice: 5
  },
  {
    id: '3',
    title: 'Certified Financial Planner: CFA Exam Prep',
    instructor: 'Finnan Morgan (AI Tutor)',
    price: 399,
    image: '/images/courses/financial-analyst.webp',
    category: 'Finance',
    level: 'Advanced',
    duration: '10 weeks',
    startingPrice: 5
  }
];

// Categories
const categories = [
  'All',
  'Literature',
  'Technology',
  'Design',
  'Business',
  'Personal Development',
  'Health & Wellness'
];

// Levels
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');

  // Filter courses based on selected filters
  const filteredCourses = allCourses.filter(course => {
    // Filter by category
    if (selectedCategory !== 'All' && course.category !== selectedCategory) {
      return false;
    }
    
    // Filter by level
    if (selectedLevel !== 'All Levels' && course.level !== selectedLevel) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort courses based on selected sort option
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOption === 'price-low') {
      return a.price - b.price;
    } else if (sortOption === 'price-high') {
      return b.price - a.price;
    }
    // Default: featured/newest
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-secondary/30 py-12 md:py-16">
          <div className="container-custom">
            <h1 className="font-bold text-center mb-4">Browse Our Courses</h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Discover self-paced courses with AI tutors designed to help you advance your career and expand your knowledge
            </p>
          </div>
        </section>
        
        {/* Filters and Search */}
        <section className="py-8 border-b border-border/40">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              {/* Search */}
              <div className="w-full md:w-64">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full px-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                {/* Category Filter */}
                <select
                  className="px-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                
                {/* Level Filter */}
                <select
                  className="px-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                
                {/* Sort Options */}
                <select
                  className="px-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        
        {/* Course Grid */}
        <section className="py-12">
          <div className="container-custom">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-muted-foreground">
                Showing {sortedCourses.length} of {allCourses.length} courses
              </p>
            </div>
            
            {sortedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedLevel('All Levels');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
