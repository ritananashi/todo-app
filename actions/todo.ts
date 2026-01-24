'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import {
  createTodoSchema,
  updateTodoSchema,
  type CreateTodoInput,
  type UpdateTodoInput,
} from '@/lib/validations/todo'
import type { TodoModel as Todo } from '@/src/generated/prisma/models'

export type CreateTodoResult =
  | { success: true; todo: Todo }
  | { success: false; error: string }

export type GetTodosResult =
  | { success: true; todos: Todo[] }
  | { success: false; error: string }

export type UpdateTodoResult =
  | { success: true; todo: Todo }
  | { success: false; error: string }

export type DeleteTodoResult =
  | { success: true }
  | { success: false; error: string }

export type ToggleTodoCompleteResult =
  | { success: true; todo: Todo }
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

  const { title, memo, priority, dueDate } = parsed.data

  try {
    const todo = await prisma.todo.create({
      data: {
        userId: session.user.id,
        title,
        memo: memo ?? null,
        priority,
        dueDate,
      },
    })

    revalidatePath('/todos')

    return { success: true, todo }
  } catch (error) {
    console.error('Failed to create todo:', error)
    return { success: false, error: 'タスクの作成に失敗しました' }
  }
}

export async function getTodos(): Promise<GetTodosResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: '認証が必要です' }
  }

  try {
    const todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, todos }
  } catch (error) {
    console.error('Failed to fetch todos:', error)
    return { success: false, error: 'タスクの取得に失敗しました' }
  }
}

export async function updateTodo(data: UpdateTodoInput): Promise<UpdateTodoResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: '認証が必要です' }
  }

  const parsed = updateTodoSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { id, title, memo, isCompleted, priority, dueDate } = parsed.data

  try {
    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
      select: { userId: true },
    })

    // Return same error for both non-existent and unauthorized (security)
    if (!existingTodo || existingTodo.userId !== session.user.id) {
      return { success: false, error: 'タスクが見つかりません' }
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: { title, memo: memo ?? null, isCompleted, priority, dueDate },
    })

    revalidatePath('/todos')

    return { success: true, todo }
  } catch (error) {
    console.error('Failed to update todo:', error)
    return { success: false, error: 'タスクの更新に失敗しました' }
  }
}

export async function deleteTodo(id: string): Promise<DeleteTodoResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: '認証が必要です' }
  }

  if (!id) {
    return { success: false, error: 'IDが必要です' }
  }

  try {
    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
      select: { userId: true },
    })

    // Return same error for both non-existent and unauthorized (security)
    if (!existingTodo || existingTodo.userId !== session.user.id) {
      return { success: false, error: 'タスクが見つかりません' }
    }

    await prisma.todo.delete({
      where: { id },
    })

    revalidatePath('/todos')

    return { success: true }
  } catch (error) {
    console.error('Failed to delete todo:', error)
    return { success: false, error: 'タスクの削除に失敗しました' }
  }
}

export async function toggleTodoComplete(id: string): Promise<ToggleTodoCompleteResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: '認証が必要です' }
  }

  if (!id) {
    return { success: false, error: 'IDが必要です' }
  }

  try {
    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
      select: { userId: true, isCompleted: true },
    })

    // Return same error for both non-existent and unauthorized (security)
    if (!existingTodo || existingTodo.userId !== session.user.id) {
      return { success: false, error: 'タスクが見つかりません' }
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: { isCompleted: !existingTodo.isCompleted },
    })

    revalidatePath('/todos')

    return { success: true, todo }
  } catch (error) {
    console.error('Failed to toggle todo:', error)
    return { success: false, error: 'タスクの更新に失敗しました' }
  }
}
