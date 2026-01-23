'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateTodoSchema, type UpdateTodoInput } from '@/lib/validations/todo'
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

interface TodoEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  todo: {
    id: string
    title: string
    memo: string | null
    isCompleted: boolean
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
      })
      setServerError(null)
    }
  }, [open, todo, form])

  const onSubmit = async (data: UpdateTodoInput) => {
    setServerError(null)
    const result = await updateTodo(data)
    if (result.success) {
      onOpenChange(false)
    } else {
      setServerError(result.error)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">完了</FormLabel>
                </FormItem>
              )}
            />

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
