import { render, screen, fireEvent } from '@testing-library/react'
import { TodoList } from '@/components/todo/TodoList'

// Mock the actions used by TodoItem
jest.mock('@/actions/todo', () => ({
  toggleTodoComplete: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}))

describe('TodoList', () => {
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
      memo: 'メモ内容',
      isCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('should render empty state when no todos', () => {
    render(<TodoList todos={[]} />)

    expect(screen.getByText('ToDoはまだありません')).toBeInTheDocument()
  })

  it('should render list of todos', () => {
    render(<TodoList todos={mockTodos} />)

    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
  })

  it('should render memo for todo with memo', () => {
    render(<TodoList todos={mockTodos} />)

    expect(screen.getByText('メモ内容')).toBeInTheDocument()
  })

  it('should show correct completion status', () => {
    render(<TodoList todos={mockTodos} />)

    expect(screen.getByText('未完了')).toBeInTheDocument()
    expect(screen.getByText('完了')).toBeInTheDocument()
  })

  describe('Filter functionality', () => {
    const todosForFilter = [
      {
        id: 'todo-1',
        userId: 'user-1',
        title: 'タスク1（未完了）',
        memo: null,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'todo-2',
        userId: 'user-1',
        title: 'タスク2（完了）',
        memo: null,
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'todo-3',
        userId: 'user-1',
        title: 'タスク3（未完了）',
        memo: null,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    it('should render filter buttons', () => {
      render(<TodoList todos={todosForFilter} />)

      expect(screen.getByRole('button', { name: /全件 \(/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /未完了 \(/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^完了 \(/ })).toBeInTheDocument()
    })

    it('should show correct counts in filter buttons', () => {
      render(<TodoList todos={todosForFilter} />)

      expect(screen.getByRole('button', { name: /全件 \(3\)/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /未完了 \(2\)/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^完了 \(1\)/ })).toBeInTheDocument()
    })

    it('should show all todos by default', () => {
      render(<TodoList todos={todosForFilter} />)

      expect(screen.getByText('タスク1（未完了）')).toBeInTheDocument()
      expect(screen.getByText('タスク2（完了）')).toBeInTheDocument()
      expect(screen.getByText('タスク3（未完了）')).toBeInTheDocument()
    })

    it('should show only incomplete todos when incomplete filter is clicked', () => {
      render(<TodoList todos={todosForFilter} />)

      fireEvent.click(screen.getByRole('button', { name: /未完了 \(/ }))

      expect(screen.getByText('タスク1（未完了）')).toBeInTheDocument()
      expect(screen.queryByText('タスク2（完了）')).not.toBeInTheDocument()
      expect(screen.getByText('タスク3（未完了）')).toBeInTheDocument()
    })

    it('should show only completed todos when completed filter is clicked', () => {
      render(<TodoList todos={todosForFilter} />)

      fireEvent.click(screen.getByRole('button', { name: /^完了 \(/ }))

      expect(screen.queryByText('タスク1（未完了）')).not.toBeInTheDocument()
      expect(screen.getByText('タスク2（完了）')).toBeInTheDocument()
      expect(screen.queryByText('タスク3（未完了）')).not.toBeInTheDocument()
    })

    it('should show all todos when all filter is clicked after another filter', () => {
      render(<TodoList todos={todosForFilter} />)

      // First, filter to incomplete
      fireEvent.click(screen.getByRole('button', { name: /未完了 \(/ }))
      expect(screen.queryByText('タスク2（完了）')).not.toBeInTheDocument()

      // Then, click all filter
      fireEvent.click(screen.getByRole('button', { name: /全件 \(/ }))

      expect(screen.getByText('タスク1（未完了）')).toBeInTheDocument()
      expect(screen.getByText('タスク2（完了）')).toBeInTheDocument()
      expect(screen.getByText('タスク3（未完了）')).toBeInTheDocument()
    })

    it('should not render filter buttons when todos is empty', () => {
      render(<TodoList todos={[]} />)

      expect(screen.queryByRole('button', { name: /全件/ })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /未完了/ })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^完了/ })).not.toBeInTheDocument()
    })
  })
})
