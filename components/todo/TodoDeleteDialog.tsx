'use client'

import { useState } from 'react'
import { deleteTodo } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

interface TodoDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  todoId: string
  todoTitle: string
}

export function TodoDeleteDialog({
  open,
  onOpenChange,
  todoId,
  todoTitle,
}: TodoDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    const result = await deleteTodo(todoId)

    if (result.success) {
      showSuccessToast('タスクを削除しました')
      onOpenChange(false)
    } else {
      showErrorToast('タスクの削除に失敗しました')
      setError(result.error)
    }

    setIsDeleting(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      // Reset state when dialog opens
      setError(null)
      setIsDeleting(false)
    }
    onOpenChange(nextOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>タスクを削除</AlertDialogTitle>
          <AlertDialogDescription>
            「{todoTitle}」を削除しますか？この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '削除中...' : '削除'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
