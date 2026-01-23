'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { toggleTodoComplete } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TodoEditDialog } from './TodoEditDialog'
import { TodoDeleteDialog } from './TodoDeleteDialog'

interface TodoItemProps {
  id: string
  title: string
  isCompleted: boolean
  memo: string | null
}

export function TodoItem({ id, title, isCompleted, memo }: TodoItemProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleToggle = async () => {
    await toggleTodoComplete(id)
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
        todo={{ id, title, memo, isCompleted }}
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
