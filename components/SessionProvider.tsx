'use client'

import type { ReactNode } from 'react'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

interface Props {
  children: ReactNode
}

export function SessionProvider({ children }: Props) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
