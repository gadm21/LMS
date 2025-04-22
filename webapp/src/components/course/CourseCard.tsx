'use client'

import Image from 'next/image'
import Link from 'next/link'

type CourseCardProps = {
  id: string
  title: string
  instructor: string
  price: number
  image: string
  category: string
  level: string
  duration: string
  startingPrice?: number
}

export default function CourseCard({
  id,
  title,
  instructor,
  price,
  image,
  category,
  level,
  duration,
  startingPrice
}: CourseCardProps) {
  return (
    <div className="card-hover rounded-2xl overflow-hidden bg-card border border-border/40 shadow-sm">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
          {category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-medium line-clamp-2 mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3">By {instructor}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>{level}</span>
          <span>•</span>
          <span>{duration}</span>
        </div>
        
        <div className="flex items-center justify-between">
          {price === 0 ? (
            <span className="font-medium text-lg">FREE</span>
          ) : startingPrice ? (
            <div className="flex items-center">
              <span className="text-sm font-medium text-muted-foreground mr-2">Starting at ${startingPrice}</span>
              <span className="text-lg font-bold line-through text-muted-foreground">${price}</span>
            </div>
          ) : (
            <span className="font-medium text-lg">${price.toFixed(2)}</span>
          )}
          <Link href={`/courses/${id}`} className="btn-primary text-sm py-2">
            View Course
          </Link>
        </div>
      </div>
    </div>
  )
}
