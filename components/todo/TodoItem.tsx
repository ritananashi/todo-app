'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { toggleTodoComplete } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TodoEditDialog } from './TodoEditDialog'
import { TodoDeleteDialog } from './TodoDeleteDialog'
import { priorityLabels, type Priority } from '@/lib/validations/todo'
import { formatDueDate, getDueDateStatus } from '@/lib/date-utils'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

interface TodoItemProps {
  id: string
  title: string
  isCompleted: boolean
  memo: string | null
  priority: Priority
  dueDate: Date | null
}

export function TodoItem({ id, title, isCompleted, memo, priority, dueDate }: TodoItemProps) {
  const dueDateStatus = getDueDateStatus(dueDate)
  const formattedDueDate = formatDueDate(dueDate)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleToggle = async () => {
    const result = await toggleTodoComplete(id)
    if (result.success && result.todo) {
      const message = result.todo.isCompleted
        ? 'タスクを完了にしました'
        : 'タスクを未完了にしました'
      showSuccessToast(message)
    } else {
      showErrorToast('状態の更新に失敗しました')
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggle}
          aria-label={isCompleted ? '未完了にする' : '完了にする'}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3
              className={cn(
                'font-medium',
                isCompleted
                  ? 'line-through'
                  : 'text-muted-foreground'
              )}
            >
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  priority === 'urgent' && 'bg-red-100 text-red-700',
                  priority === 'high' && 'bg-orange-100 text-orange-700',
                  priority === 'medium' && 'bg-blue-100 text-blue-700',
                  priority === 'low' && 'bg-gray-100 text-gray-700'
                )}
              >
                {priorityLabels[priority]}
              </span>
              {formattedDueDate && (
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    dueDateStatus === 'overdue' && 'bg-red-100 text-red-700',
                    dueDateStatus === 'today' && 'bg-yellow-100 text-yellow-700',
                    dueDateStatus === 'normal' && 'bg-gray-100 text-gray-600'
                  )}
                >
                  {formattedDueDate}
                </span>
              )}
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
          </div>
          {memo && (
            <p className="text-sm text-muted-foreground mt-2">{memo}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-3 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
        >
          編集
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteOpen(true)}
        >
          削除
        </Button>
      </div>

      <TodoEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        todo={{ id, title, memo, isCompleted, priority, dueDate }}
      />

      <TodoDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        todoId={id}
        todoTitle={title}
      />
    </div>
  )
}
