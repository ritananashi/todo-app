import { z } from 'zod'

// 共通フィールド定義
const titleField = z
  .string()
  .min(1, 'タイトルを入力してください')
  .max(100, 'タイトルは100文字以内で入力してください')
  .transform((val) => val.trim())
  .refine((val) => val.length > 0, {
    message: 'タイトルは空白のみでは登録できません',
  })

const memoField = z
  .string()
  .max(1000, 'メモは1000文字以内で入力してください')
  .optional()
  .transform((val) => (val?.trim() || undefined))

export const createTodoSchema = z.object({
  title: titleField,
  memo: memoField,
})

export type CreateTodoInput = z.input<typeof createTodoSchema>
export type CreateTodoOutput = z.output<typeof createTodoSchema>

export const updateTodoSchema = z.object({
  id: z.string().min(1, 'IDが必要です'),
  title: titleField,
  memo: memoField,
  isCompleted: z.boolean(),
})

export type UpdateTodoInput = z.input<typeof updateTodoSchema>
export type UpdateTodoOutput = z.output<typeof updateTodoSchema>
