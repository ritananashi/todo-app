'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import {
  updateProfileSchema,
  changePasswordSchema,
  normalizeProfileInput,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from '@/lib/validations/profile'

// Prisma P2002 error handling helper
// 返り値: 'email' = email制約違反, 'unknown' = 他の一意制約違反, null = P2002以外
function getUniqueConstraintField(error: unknown): 'email' | 'unknown' | null {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('code' in error) ||
    (error as { code: string }).code !== 'P2002'
  ) {
    return null
  }

  // meta.targetでフィールドを確認（配列または文字列の場合がある）
  if ('meta' in error && typeof (error as { meta: unknown }).meta === 'object') {
    const meta = (error as { meta: { target?: unknown } }).meta
    const target = meta?.target

    // targetが配列の場合
    if (Array.isArray(target)) {
      return target.includes('email') ? 'email' : 'unknown'
    }

    // targetが文字列の場合
    if (typeof target === 'string') {
      return target === 'email' || target.includes('email') ? 'email' : 'unknown'
    }

    // targetが存在するが配列でも文字列でもない場合
    if (target) {
      return 'unknown'
    }
  }

  // P2002だがtarget情報がない場合は不明な制約違反として扱う
  return 'unknown'
}

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

  // 正規化（trim, 空文字→null, email小文字化）
  const { name, email } = normalizeProfileInput(parsed.data)

  // 他のユーザーがこのメールアドレスを使用していないかチェック
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser && existingUser.id !== session.user.id) {
    return { success: false, error: 'このメールアドレスは既に使用されています' }
  }

  // name未指定時は更新対象から外す（既存値を保持）
  const updateData = name === undefined ? { email } : { email, name }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })
  } catch (error) {
    const constraintField = getUniqueConstraintField(error)
    if (constraintField === 'email') {
      return { success: false, error: 'このメールアドレスは既に使用されています' }
    }
    if (constraintField === 'unknown') {
      return { success: false, error: '一意制約違反が発生しました' }
    }
    throw error
  }

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
