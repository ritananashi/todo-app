'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from '@/lib/validations/profile'

export type ProfileResult = {
  success: boolean
  error?: string
}

export async function updateProfile(data: UpdateProfileInput): Promise<ProfileResult> {
  const parsed = updateProfileSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: '認証が必要です' }
  }

  const { name, email } = parsed.data

  // 他のユーザーがこのメールアドレスを使用していないかチェック
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser && existingUser.id !== session.user.id) {
    return { success: false, error: 'このメールアドレスは既に使用されています' }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name ?? null, email },
  })

  return { success: true }
}

export async function changePassword(data: ChangePasswordInput): Promise<ProfileResult> {
  const parsed = changePasswordSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: '認証が必要です' }
  }

  const { currentPassword, newPassword } = parsed.data

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user?.password) {
    return { success: false, error: 'パスワードが設定されていません' }
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password)
  if (!isValidPassword) {
    return { success: false, error: '現在のパスワードが正しくありません' }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  return { success: true }
}
