import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().optional().nullable(),
  email: z
    .string()
    .trim()
    .email('有効なメールアドレスを入力してください'),
})

// 正規化用のヘルパー関数（Server Actionで使用）
// name未指定時はundefinedを返し、更新対象から外せるようにする
export function normalizeProfileInput(data: UpdateProfileInput): {
  name: string | null | undefined
  email: string
} {
  // nameが未指定（undefined）の場合はundefinedを維持
  // null または 空文字の場合はnullに正規化
  // 有効な文字列の場合はtrimして返す
  let name: string | null | undefined
  if (data.name === undefined) {
    name = undefined
  } else if (data.name === null || data.name.trim() === '') {
    name = null
  } else {
    name = data.name.trim()
  }

  return {
    name,
    email: data.email.toLowerCase(), // trimはスキーマで実行済み
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
