import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TodoEditDialog } from '@/components/todo/TodoEditDialog'

// Mock the updateTodo action
const mockUpdateTodo = jest.fn()
jest.mock('@/actions/todo', () => ({
  updateTodo: (...args: unknown[]) => mockUpdateTodo(...args),
}))

describe('TodoEditDialog', () => {
  const baseTodo = {
    id: 'todo-1',
    title: 'タスク1',
    memo: 'メモ内容',
    isCompleted: false,
    priority: 'medium' as const,
    dueDate: null,
  }

  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    todo: baseTodo,
  }

  beforeEach(() => {
    mockUpdateTodo.mockReset()
    defaultProps.onOpenChange.mockReset()
  })

  it('should render dialog when open', () => {
    render(<TodoEditDialog {...defaultProps} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('タスクを編集')).toBeInTheDocument()
  })

  it('should not render dialog when closed', () => {
    render(<TodoEditDialog {...defaultProps} open={false} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should populate form with todo data', () => {
    render(<TodoEditDialog {...defaultProps} />)

    expect(screen.getByLabelText('タイトル')).toHaveValue('タスク1')
    expect(screen.getByLabelText('メモ（任意）')).toHaveValue('メモ内容')
  })

  it('should show unchecked checkbox for incomplete todo', () => {
    render(<TodoEditDialog {...defaultProps} />)

    const checkbox = screen.getByRole('checkbox', { name: /完了/i })
    expect(checkbox).not.toBeChecked()
  })

  it('should show checked checkbox for completed todo', () => {
    render(<TodoEditDialog {...defaultProps} todo={{ ...baseTodo, isCompleted: true }} />)

    const checkbox = screen.getByRole('checkbox', { name: /完了/i })
    expect(checkbox).toBeChecked()
  })

  it('should call updateTodo with form data on submit', async () => {
    mockUpdateTodo.mockResolvedValue({ success: true, todo: { ...baseTodo, title: '更新後' } })
    render(<TodoEditDialog {...defaultProps} />)

    // Update title
    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: '更新後' } })

    // Submit
    const submitButton = screen.getByRole('button', { name: '保存' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith({
        id: 'todo-1',
        title: '更新後',
        memo: 'メモ内容',
        isCompleted: false,
        priority: 'medium',
        dueDate: null,
      })
    })
  })

  it('should close dialog on successful update', async () => {
    mockUpdateTodo.mockResolvedValue({ success: true, todo: baseTodo })
    render(<TodoEditDialog {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: '保存' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('should show validation error for empty title', async () => {
    render(<TodoEditDialog {...defaultProps} />)

    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: '' } })

    const submitButton = screen.getByRole('button', { name: '保存' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument()
    })
    expect(mockUpdateTodo).not.toHaveBeenCalled()
  })

  it('should show server error on update failure', async () => {
    mockUpdateTodo.mockResolvedValue({ success: false, error: 'タスクが見つかりません' })
    render(<TodoEditDialog {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: '保存' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('タスクが見つかりません')).toBeInTheDocument()
    })
    expect(defaultProps.onOpenChange).not.toHaveBeenCalledWith(false)
  })

  it('should close dialog when cancel button is clicked', () => {
    render(<TodoEditDialog {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
    fireEvent.click(cancelButton)

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })
})
