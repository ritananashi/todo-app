'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTodoSchema, type CreateTodoInput } from '@/lib/validations/todo'
import { createTodo } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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

interface TodoFormProps {
  onSuccess: () => void
}

export function TodoForm({ onSuccess }: TodoFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      memo: '',
      priority: 'medium',
      dueDate: null,
    },
  })

  const onSubmit = async (data: CreateTodoInput) => {
    setServerError(null)
    const result = await createTodo(data)
    if (result.success) {
      showSuccessToast('タスクを作成しました')
      form.reset()
      onSuccess()
    } else {
      showErrorToast('タスクの作成に失敗しました')
      setServerError(result.error)
    }
  }

  return (
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

        <Button type="submit" className="w-full">
          追加
        </Button>
      </form>
    </Form>
  )
}
