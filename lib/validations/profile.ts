import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().optional().nullable(),
  email: z.string().email('有効なメールアドレスを入力してください'),
})

// 正規化用のヘルパー関数（Server Actionで使用）
export function normalizeProfileInput(data: UpdateProfileInput): {
  name: string | null
  email: string
} {
  const name = data.name?.trim()
  return {
    name: name && name !== '' ? name : null,
    email: data.email.trim().toLowerCase(),
  }
}

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
    newPassword: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        'パスワードには英字と数字を含めてください'
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: '新しいパスワードが一致しません',
    path: ['confirmNewPassword'],
  })

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
