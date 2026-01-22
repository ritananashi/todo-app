import { render, screen } from '@testing-library/react'
import TodosPage from '@/app/todos/page'

// Mock the auth function
jest.mock('@/lib/auth', () => ({
  auth: jest.fn().mockResolvedValue({
    user: {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    },
  }),
}))

// Mock getTodos action
const mockGetTodos = jest.fn()
jest.mock('@/actions/todo', () => ({
  getTodos: () => mockGetTodos(),
  createTodo: jest.fn(),
}))

describe('TodosPage', () => {
  beforeEach(() => {
    mockGetTodos.mockReset()
  })

  it('should render the todos page with title', async () => {
    mockGetTodos.mockResolvedValue({ success: true, todos: [] })
    render(await TodosPage())

    expect(screen.getByRole('heading', { name: 'ToDo一覧' })).toBeInTheDocument()
  })

  it('should have proper page structure', async () => {
    mockGetTodos.mockResolvedValue({ success: true, todos: [] })
    render(await TodosPage())

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('should display empty message when no todos', async () => {
    mockGetTodos.mockResolvedValue({ success: true, todos: [] })
    render(await TodosPage())

    expect(screen.getByText(/ToDoはまだありません/)).toBeInTheDocument()
  })

  it('should display add button', async () => {
    mockGetTodos.mockResolvedValue({ success: true, todos: [] })
    render(await TodosPage())

    expect(screen.getByRole('button', { name: /タスクを追加/i })).toBeInTheDocument()
  })

  it('should display todos when available', async () => {
    mockGetTodos.mockResolvedValue({
      success: true,
      todos: [
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
      ],
    })
    render(await TodosPage())

    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
    expect(screen.getByText('メモ')).toBeInTheDocument()
  })

  it('should display error message when getTodos fails', async () => {
    mockGetTodos.mockResolvedValue({ success: false, error: 'エラーが発生しました' })
    render(await TodosPage())

    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
  })
})
