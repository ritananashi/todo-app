'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { createTodoSchema, type CreateTodoInput } from '@/lib/validations/todo'
import type { TodoModel as Todo } from '@/src/generated/prisma/models'

export type CreateTodoResult =
  | { success: true; todo: Todo }
  | { success: false; error: string }

export type GetTodosResult =
  | { success: true; todos: Todo[] }
  | { success: false; error: string }

export async function createTodo(data: CreateTodoInput): Promise<CreateTodoResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: '認証が必要です' }
  }

  const parsed = createTodoSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { title, memo } = parsed.data

  const todo = await prisma.todo.create({
    data: {
      userId: session.user.id,
      title,
      memo,
    },
  })

  revalidatePath('/todos')

  return { success: true, todo }
}

export async function getTodos(): Promise<GetTodosResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: '認証が必要です' }
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return { success: true, todos }
}
