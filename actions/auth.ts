'use server'

import type { SignupInput, LoginInput } from '@/lib/validations/auth'

export type AuthResult = {
  success: boolean
  error?: string
}

export async function signup(_data: SignupInput): Promise<AuthResult> {
  // Will be implemented
  return { success: false, error: 'Not implemented' }
}

export async function login(_data: LoginInput): Promise<AuthResult> {
  // Will be implemented
  return { success: false, error: 'Not implemented' }
}

export async function logout(): Promise<void> {
  // Will be implemented
}
