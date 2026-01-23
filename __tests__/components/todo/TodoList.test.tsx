import { render, screen } from '@testing-library/react'
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
})
