'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations/profile'
import { updateProfile } from '@/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface BasicInfoFormProps {
  initialName: string | null
  initialEmail: string
  onSuccess: () => void
}

export function BasicInfoForm({ initialName, initialEmail, onSuccess }: BasicInfoFormProps) {
  const { update: updateSession } = useSession()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initialName ?? '',
      email: initialEmail,
    },
  })

  const onSubmit = async (data: UpdateProfileInput) => {
    setServerError(null)
    const result = await updateProfile(data)
    if (result.success) {
      // セッションを更新して、UIに即座に反映する
      // 失敗してもプロフィール自体は保存済みなので、onSuccessは呼び出す
      try {
        await updateSession({ name: data.name, email: data.email })
      } catch {
        // セッション更新失敗はログのみ（プロフィール保存は成功している）
        console.error('セッションの更新に失敗しました')
      }
      onSuccess()
    } else if (result.error) {
      setServerError(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
            {serverError}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ユーザーネーム</FormLabel>
              <FormControl>
                <Input placeholder="ユーザーネーム（任意）" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          保存
        </Button>
      </form>
    </Form>
  )
}
