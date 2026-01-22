import { cn } from '@/lib/utils'

interface TodoItemProps {
  id: string
  title: string
  isCompleted: boolean
  memo: string | null
}

export function TodoItem({ title, isCompleted, memo }: TodoItemProps) {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between">
        <h3
          className={cn(
            'font-medium',
            isCompleted && 'line-through text-muted-foreground'
          )}
        >
          {title}
        </h3>
        <span
          className={cn(
            'text-xs px-2 py-1 rounded-full',
            isCompleted
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          )}
        >
          {isCompleted ? '完了' : '未完了'}
        </span>
      </div>
      {memo && (
        <p className="text-sm text-muted-foreground mt-2">{memo}</p>
      )}
    </div>
  )
}
