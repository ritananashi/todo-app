import { createTodo, getTodos } from '@/actions/todo'

// Mock modules
jest.mock('@/lib/prisma', () => ({
  prisma: {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
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
