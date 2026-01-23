import { createTodo, getTodos, updateTodo, deleteTodo, toggleTodoComplete } from '@/actions/todo'

// Mock modules
jest.mock('@/lib/prisma', () => ({
  prisma: {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

// Import mocks after jest.mock
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAuth = auth as jest.MockedFunction<any>
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>

describe('createTodo action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new todo for authenticated user', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.create.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-1',
      title: 'タスク1',
      memo: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await createTodo({ title: 'タスク1' })

    expect(result.success).toBe(true)
    expect(mockPrisma.todo.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        title: 'タスク1',
        memo: undefined,
      },
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/todos')
  })

  it('should create a todo with memo', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.create.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-1',
      title: 'タスク1',
      memo: 'メモ内容',
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await createTodo({ title: 'タスク1', memo: 'メモ内容' })

    expect(result.success).toBe(true)
    expect(mockPrisma.todo.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        title: 'タスク1',
        memo: 'メモ内容',
      },
    })
  })

  it('should return error for unauthenticated user', async () => {
    mockAuth.mockResolvedValue(null)

    const result = await createTodo({ title: 'タスク1' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('認証が必要です')
    }
    expect(mockPrisma.todo.create).not.toHaveBeenCalled()
  })

  it('should return error for session without user id', async () => {
    mockAuth.mockResolvedValue({
      user: { email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })

    const result = await createTodo({ title: 'タスク1' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('認証が必要です')
    }
    expect(mockPrisma.todo.create).not.toHaveBeenCalled()
  })

  it('should return error for invalid input', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })

    const result = await createTodo({ title: '' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('タイトルを入力してください')
    }
    expect(mockPrisma.todo.create).not.toHaveBeenCalled()
  })

  it('should return error for whitespace-only title', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })

    const result = await createTodo({ title: '   ' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('タイトルは空白のみでは登録できません')
    }
    expect(mockPrisma.todo.create).not.toHaveBeenCalled()
  })
})

describe('getTodos action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return todos for authenticated user', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    const mockTodos = [
      {
        id: 'todo-1',
        userId: 'user-1',
        title: 'タスク1',
        memo: null,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'todo-2',
        userId: 'user-1',
        title: 'タスク2',
        memo: 'メモ',
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    mockPrisma.todo.findMany.mockResolvedValue(mockTodos)

    const result = await getTodos()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.todos).toEqual(mockTodos)
    }
    expect(mockPrisma.todo.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { createdAt: 'desc' },
    })
  })

  it('should return empty array when user has no todos', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findMany.mockResolvedValue([])

    const result = await getTodos()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.todos).toEqual([])
    }
  })

  it('should return error for unauthenticated user', async () => {
    mockAuth.mockResolvedValue(null)

    const result = await getTodos()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('認証が必要です')
    }
    expect(mockPrisma.todo.findMany).not.toHaveBeenCalled()
  })

  it('should return error for session without user id', async () => {
    mockAuth.mockResolvedValue({
      user: { email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })

    const result = await getTodos()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('認証が必要です')
    }
    expect(mockPrisma.todo.findMany).not.toHaveBeenCalled()
  })
})

describe('updateTodo action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const validUpdateData = {
    id: 'todo-1',
    title: '更新後のタスク',
    memo: '更新後のメモ',
    isCompleted: true,
  }

  it('should update todo for authenticated user', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findUnique.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-1',
      title: 'タスク1',
      memo: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    mockPrisma.todo.update.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-1',
      title: '更新後のタスク',
      memo: '更新後のメモ',
      isCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await updateTodo(validUpdateData)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.todo.title).toBe('更新後のタスク')
      expect(result.todo.memo).toBe('更新後のメモ')
      expect(result.todo.isCompleted).toBe(true)
    }
    expect(mockPrisma.todo.update).toHaveBeenCalledWith({
      where: { id: 'todo-1' },
      data: {
        title: '更新後のタスク',
        memo: '更新後のメモ',
        isCompleted: true,
      },
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/todos')
  })

  it('should return error for unauthenticated user', async () => {
    mockAuth.mockResolvedValue(null)

    const result = await updateTodo(validUpdateData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('認証が必要です')
    }
    expect(mockPrisma.todo.findUnique).not.toHaveBeenCalled()
  })

  it('should return error for invalid input', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })

    const result = await updateTodo({ ...validUpdateData, title: '' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('タイトルを入力してください')
    }
    expect(mockPrisma.todo.findUnique).not.toHaveBeenCalled()
  })

  it('should return error for non-existent todo', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findUnique.mockResolvedValue(null)

    const result = await updateTodo(validUpdateData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('タスクが見つかりません')
    }
    expect(mockPrisma.todo.update).not.toHaveBeenCalled()
  })

  it('should return error when updating other user todo', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findUnique.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-2', // Different user
      title: 'タスク1',
      memo: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await updateTodo(validUpdateData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('タスクが見つかりません') // Same error for security
    }
    expect(mockPrisma.todo.update).not.toHaveBeenCalled()
  })
})

describe('deleteTodo action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete todo for authenticated user', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findUnique.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-1',
      title: 'タスク1',
      memo: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    mockPrisma.todo.delete.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-1',
      title: 'タスク1',
      memo: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await deleteTodo('todo-1')

    expect(result.success).toBe(true)
    expect(mockPrisma.todo.delete).toHaveBeenCalledWith({
      where: { id: 'todo-1' },
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/todos')
  })

  it('should return error for unauthenticated user', async () => {
    mockAuth.mockResolvedValue(null)

    const result = await deleteTodo('todo-1')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('認証が必要です')
    }
    expect(mockPrisma.todo.findUnique).not.toHaveBeenCalled()
  })

  it('should return error for non-existent todo', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findUnique.mockResolvedValue(null)

    const result = await deleteTodo('todo-1')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('タスクが見つかりません')
    }
    expect(mockPrisma.todo.delete).not.toHaveBeenCalled()
  })

  it('should return error when deleting other user todo', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findUnique.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-2', // Different user
      title: 'タスク1',
      memo: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await deleteTodo('todo-1')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('タスクが見つかりません')
    }
    expect(mockPrisma.todo.delete).not.toHaveBeenCalled()
  })

  it('should return error for empty id', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })

    const result = await deleteTodo('')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('IDが必要です')
    }
    expect(mockPrisma.todo.findUnique).not.toHaveBeenCalled()
  })
})

describe('toggleTodoComplete action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should toggle incomplete todo to complete', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findUnique.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-1',
      title: 'タスク1',
      memo: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    mockPrisma.todo.update.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-1',
      title: 'タスク1',
      memo: null,
      isCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await toggleTodoComplete('todo-1')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.todo.isCompleted).toBe(true)
    }
    expect(mockPrisma.todo.update).toHaveBeenCalledWith({
      where: { id: 'todo-1' },
      data: { isCompleted: true },
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/todos')
  })

  it('should toggle complete todo to incomplete', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findUnique.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-1',
      title: 'タスク1',
      memo: null,
      isCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    mockPrisma.todo.update.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-1',
      title: 'タスク1',
      memo: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await toggleTodoComplete('todo-1')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.todo.isCompleted).toBe(false)
    }
    expect(mockPrisma.todo.update).toHaveBeenCalledWith({
      where: { id: 'todo-1' },
      data: { isCompleted: false },
    })
  })

  it('should return error for unauthenticated user', async () => {
    mockAuth.mockResolvedValue(null)

    const result = await toggleTodoComplete('todo-1')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('認証が必要です')
    }
    expect(mockPrisma.todo.findUnique).not.toHaveBeenCalled()
  })

  it('should return error for non-existent todo', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findUnique.mockResolvedValue(null)

    const result = await toggleTodoComplete('todo-1')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('タスクが見つかりません')
    }
    expect(mockPrisma.todo.update).not.toHaveBeenCalled()
  })

  it('should return error when toggling other user todo', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
    mockPrisma.todo.findUnique.mockResolvedValue({
      id: 'todo-1',
      userId: 'user-2',
      title: 'タスク1',
      memo: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await toggleTodoComplete('todo-1')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('タスクが見つかりません')
    }
    expect(mockPrisma.todo.update).not.toHaveBeenCalled()
  })

  it('should return error for empty id', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })

    const result = await toggleTodoComplete('')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('IDが必要です')
    }
    expect(mockPrisma.todo.findUnique).not.toHaveBeenCalled()
  })
})
