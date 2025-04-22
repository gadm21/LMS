'use client'

import { SessionProvider } from 'next-auth/react';
import Header from './Header';

import { ReactNode } from 'react';

type SessionWrapperProps = {
  children: ReactNode;
}

export default function SessionWrapper({ children }: SessionWrapperProps) {
  return (
    <SessionProvider>
      <Header />
      {children}
    </SessionProvider>
  );
}
