'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { data: session, status } = useSession();
  
  // Double-check authentication status to prevent showing logout on sign-in screen
  const isAuthenticated = status === 'authenticated' && !!session;
  
  return (
    <header className="bg-background border-b border-border/40 px-6 py-3 sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-primary font-bold text-xl">
          EduNovai
        </Link>
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition-opacity">
                  {session.user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                Logout
              </Button>
            </div>
          ) : (
            <></>
          )}
        </nav>
      </div>
    </header>
  );
}
