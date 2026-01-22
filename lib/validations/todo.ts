import { z } from 'zod'

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルを入力してください')
    .max(100, 'タイトルは100文字以内で入力してください')
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: 'タイトルは空白のみでは登録できません',
    }),
  memo: z
    .string()
    .max(1000, 'メモは1000文字以内で入力してください')
    .optional()
    .transform((val) => (val?.trim() || undefined)),
})

export type CreateTodoInput = z.input<typeof createTodoSchema>
export type CreateTodoOutput = z.output<typeof createTodoSchema>
