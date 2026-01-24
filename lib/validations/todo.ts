import { z } from 'zod'

// 重要度の定義
export const priorityValues = ['urgent', 'high', 'medium', 'low'] as const
export type Priority = (typeof priorityValues)[number]

export const priorityLabels: Record<Priority, string> = {
  urgent: '緊急',
  high: '高',
  medium: '中',
  low: '低',
}

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
  .transform((val) => val?.trim() || undefined)

const priorityField = z.enum(priorityValues).default('medium')

const dueDateField = z
  .date()
  .nullable()
  .optional()
  .transform((val) => val ?? null)

export const createTodoSchema = z.object({
  title: titleField,
  memo: memoField,
  priority: priorityField,
  dueDate: dueDateField,
})

export type CreateTodoInput = z.input<typeof createTodoSchema>
export type CreateTodoOutput = z.output<typeof createTodoSchema>

export const updateTodoSchema = z.object({
  id: z.string().min(1, 'IDが必要です'),
  title: titleField,
  memo: memoField,
  isCompleted: z.boolean(),
  priority: priorityField,
  dueDate: dueDateField,
})

export type UpdateTodoInput = z.input<typeof updateTodoSchema>
export type UpdateTodoOutput = z.output<typeof updateTodoSchema>
