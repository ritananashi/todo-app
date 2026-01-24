'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateTodoSchema,
  type UpdateTodoInput,
  type Priority,
} from '@/lib/validations/todo'
import { updateTodo } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PrioritySelect } from './PrioritySelect'
import { DueDatePicker } from './DueDatePicker'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

interface TodoEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  todo: {
    id: string
    title: string
    memo: string | null
    isCompleted: boolean
    priority: Priority
    dueDate: Date | null
  }
}

export function TodoEditDialog({ open, onOpenChange, todo }: TodoEditDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<UpdateTodoInput>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      id: todo.id,
      title: todo.title,
      memo: todo.memo ?? '',
      isCompleted: todo.isCompleted,
      priority: todo.priority,
      dueDate: todo.dueDate,
    },
  })

  // Reset form when todo changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        id: todo.id,
        title: todo.title,
        memo: todo.memo ?? '',
        isCompleted: todo.isCompleted,
        priority: todo.priority,
        dueDate: todo.dueDate,
      })
    }
  }, [open, todo, form])

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      // Reset error when dialog opens
      setServerError(null)
    }
    onOpenChange(nextOpen)
  }

  const onSubmit = async (data: UpdateTodoInput) => {
    setServerError(null)
    const result = await updateTodo(data)
    if (result.success) {
      showSuccessToast('タスクを更新しました')
      onOpenChange(false)
    } else {
      showErrorToast('タスクの更新に失敗しました')
      setServerError(result.error)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タスクを編集</DialogTitle>
          <DialogDescription>
            タスクの内容を編集します
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {serverError && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {serverError}
              </div>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input placeholder="タスクを入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ（任意）</FormLabel>
                  <FormControl>
                    <Textarea placeholder="メモを入力（任意）" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isCompleted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">完了</FormLabel>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>重要度</FormLabel>
                    <FormControl>
                      <PrioritySelect value={field.value ?? 'medium'} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>締切日（任意）</FormLabel>
                    <FormControl>
                      <DueDatePicker value={field.value ?? null} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
