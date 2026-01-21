'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { signIn, signOut } from '@/lib/auth'
import { signupSchema, loginSchema, type SignupInput, type LoginInput } from '@/lib/validations/auth'

export type AuthResult = {
  success: boolean
  error?: string
}

export async function signup(data: SignupInput): Promise<AuthResult> {
  const parsed = signupSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { email, password } = parsed.data

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { success: false, error: 'このメールアドレスは既に登録されています' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  })

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch {
    return { success: false, error: 'ログインに失敗しました。再度お試しください。' }
  }

  redirect('/todos')
}

export async function login(data: LoginInput): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { email, password } = parsed.data

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch {
    return { success: false, error: 'メールアドレスまたはパスワードが正しくありません' }
  }

  redirect('/todos')
}

export async function logout(): Promise<void> {
  await signOut({ redirect: false })
  redirect('/login')
}
