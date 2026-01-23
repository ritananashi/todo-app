import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TodoItem } from '@/components/todo/TodoItem'

// Mock the actions
const mockToggleTodoComplete = jest.fn()
const mockUpdateTodo = jest.fn()
const mockDeleteTodo = jest.fn()

jest.mock('@/actions/todo', () => ({
  toggleTodoComplete: (...args: unknown[]) => mockToggleTodoComplete(...args),
  updateTodo: (...args: unknown[]) => mockUpdateTodo(...args),
  deleteTodo: (...args: unknown[]) => mockDeleteTodo(...args),
}))

describe('TodoItem', () => {
  const baseTodo = {
    id: 'todo-1',
    title: 'タスク1',
    isCompleted: false,
    memo: null,
  }

  beforeEach(() => {
    mockToggleTodoComplete.mockReset()
    mockUpdateTodo.mockReset()
    mockDeleteTodo.mockReset()
  })

  it('should render todo title', () => {
    render(<TodoItem {...baseTodo} />)

    expect(screen.getByText('タスク1')).toBeInTheDocument()
  })

  it('should render incomplete todo without strikethrough', () => {
    render(<TodoItem {...baseTodo} isCompleted={false} />)

    const title = screen.getByText('タスク1')
    expect(title).not.toHaveClass('line-through')
  })

  it('should render completed todo with strikethrough', () => {
    render(<TodoItem {...baseTodo} isCompleted={true} />)

    const title = screen.getByText('タスク1')
    expect(title).toHaveClass('line-through')
  })

  it('should show 未完了 status for incomplete todo', () => {
    render(<TodoItem {...baseTodo} isCompleted={false} />)

    expect(screen.getByText('未完了')).toBeInTheDocument()
  })

  it('should show 完了 status for completed todo', () => {
    render(<TodoItem {...baseTodo} isCompleted={true} />)

    expect(screen.getByText('完了')).toBeInTheDocument()
  })

  it('should render memo when provided', () => {
    render(<TodoItem {...baseTodo} memo="メモ内容" />)

    expect(screen.getByText('メモ内容')).toBeInTheDocument()
  })

  it('should not render memo section when memo is null', () => {
    render(<TodoItem {...baseTodo} memo={null} />)

    expect(screen.queryByText('メモ内容')).not.toBeInTheDocument()
  })

  it('should render edit button', () => {
    render(<TodoItem {...baseTodo} />)

    expect(screen.getByRole('button', { name: /編集/i })).toBeInTheDocument()
  })

  it('should render delete button', () => {
    render(<TodoItem {...baseTodo} />)

    expect(screen.getByRole('button', { name: /削除/i })).toBeInTheDocument()
  })

  it('should render checkbox for toggle', () => {
    render(<TodoItem {...baseTodo} />)

    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('should show unchecked checkbox for incomplete todo', () => {
    render(<TodoItem {...baseTodo} isCompleted={false} />)

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should show checked checkbox for completed todo', () => {
    render(<TodoItem {...baseTodo} isCompleted={true} />)

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should call toggleTodoComplete when checkbox is clicked', async () => {
    mockToggleTodoComplete.mockResolvedValue({ success: true, todo: { ...baseTodo, isCompleted: true } })
    render(<TodoItem {...baseTodo} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(mockToggleTodoComplete).toHaveBeenCalledWith('todo-1')
    })
  })

  it('should open edit dialog when edit button is clicked', async () => {
    render(<TodoItem {...baseTodo} />)

    const editButton = screen.getByRole('button', { name: /編集/i })
    fireEvent.click(editButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('タスクを編集')).toBeInTheDocument()
    })
  })

  it('should open delete dialog when delete button is clicked', async () => {
    render(<TodoItem {...baseTodo} />)

    const deleteButton = screen.getByRole('button', { name: /削除/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText('タスクを削除')).toBeInTheDocument()
    })
  })
})
