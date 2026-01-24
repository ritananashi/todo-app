import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TodoForm } from '@/components/todo/TodoForm'

// Mock the createTodo action
const mockCreateTodo = jest.fn()
jest.mock('@/actions/todo', () => ({
  createTodo: (...args: unknown[]) => mockCreateTodo(...args),
}))

describe('TodoForm', () => {
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    mockCreateTodo.mockReset()
    mockOnSuccess.mockReset()
  })

  it('should render all form fields', () => {
    render(<TodoForm onSuccess={mockOnSuccess} />)

    expect(screen.getByLabelText('タイトル')).toBeInTheDocument()
    expect(screen.getByLabelText('メモ（任意）')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  it('should show validation error for empty title', async () => {
    render(<TodoForm onSuccess={mockOnSuccess} />)

    const submitButton = screen.getByRole('button', { name: '追加' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument()
    })
  })

  it('should show validation error for whitespace-only title', async () => {
    render(<TodoForm onSuccess={mockOnSuccess} />)

    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: '   ' } })

    const submitButton = screen.getByRole('button', { name: '追加' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('タイトルは空白のみでは登録できません')).toBeInTheDocument()
    })
  })

  it('should call createTodo action with form data on valid submission', async () => {
    mockCreateTodo.mockResolvedValue({ success: true, todo: { id: 'todo-1' } })
    render(<TodoForm onSuccess={mockOnSuccess} />)

    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: 'タスク1' } })

    const submitButton = screen.getByRole('button', { name: '追加' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'タスク1',
        memo: undefined,
        priority: 'medium',
        dueDate: null,
      })
    })
  })

  it('should call createTodo with memo when provided', async () => {
    mockCreateTodo.mockResolvedValue({ success: true, todo: { id: 'todo-1' } })
    render(<TodoForm onSuccess={mockOnSuccess} />)

    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: 'タスク1' } })

    const memoInput = screen.getByLabelText('メモ（任意）')
    fireEvent.change(memoInput, { target: { value: 'メモ内容' } })

    const submitButton = screen.getByRole('button', { name: '追加' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'タスク1',
        memo: 'メモ内容',
        priority: 'medium',
        dueDate: null,
      })
    })
  })

  it('should call onSuccess callback after successful submission', async () => {
    mockCreateTodo.mockResolvedValue({ success: true, todo: { id: 'todo-1' } })
    render(<TodoForm onSuccess={mockOnSuccess} />)

    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: 'タスク1' } })

    const submitButton = screen.getByRole('button', { name: '追加' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('should reset form after successful submission', async () => {
    mockCreateTodo.mockResolvedValue({ success: true, todo: { id: 'todo-1' } })
    render(<TodoForm onSuccess={mockOnSuccess} />)

    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: 'タスク1' } })

    const submitButton = screen.getByRole('button', { name: '追加' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(titleInput).toHaveValue('')
    })
  })

  it('should display server error message', async () => {
    mockCreateTodo.mockResolvedValue({ success: false, error: 'エラーが発生しました' })
    render(<TodoForm onSuccess={mockOnSuccess} />)

    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: 'タスク1' } })

    const submitButton = screen.getByRole('button', { name: '追加' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
    })
  })

  it('should not call onSuccess when submission fails', async () => {
    mockCreateTodo.mockResolvedValue({ success: false, error: 'エラーが発生しました' })
    render(<TodoForm onSuccess={mockOnSuccess} />)

    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: 'タスク1' } })

    const submitButton = screen.getByRole('button', { name: '追加' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
    })
    expect(mockOnSuccess).not.toHaveBeenCalled()
  })
})
