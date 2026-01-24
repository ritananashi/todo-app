import {
  differenceInCalendarDays,
  format,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns'

export type DueDateStatus = 'overdue' | 'today' | 'normal'

/**
 * 締切日のステータスを取得
 */
export function getDueDateStatus(date: Date | null): DueDateStatus | null {
  if (!date) return null

  const today = startOfDay(new Date())
  const dueDate = startOfDay(date)

  if (isBefore(dueDate, today)) {
    return 'overdue'
  }

  if (isToday(dueDate)) {
    return 'today'
  }

  return 'normal'
}

/**
 * 締切日を相対表示でフォーマット
 */
export function formatDueDate(date: Date | null): string | null {
  if (!date) return null

  const today = startOfDay(new Date())
  const dueDate = startOfDay(date)
  const diffDays = differenceInCalendarDays(dueDate, today)

  if (diffDays < 0) {
    return '期限切れ'
  }

  if (diffDays === 0) {
    return '今日'
  }

  if (diffDays === 1) {
    return '明日'
  }

  if (diffDays <= 7) {
    return `${diffDays}日後`
  }

  return format(dueDate, 'M/d')
}
