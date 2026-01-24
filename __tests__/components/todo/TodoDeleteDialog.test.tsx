import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TodoDeleteDialog } from '@/components/todo/TodoDeleteDialog'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

// Mock the deleteTodo action
const mockDeleteTodo = jest.fn()
jest.mock('@/actions/todo', () => ({
  deleteTodo: (...args: unknown[]) => mockDeleteTodo(...args),
}))

// Mock toast utilities
jest.mock('@/lib/toast', () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}))

describe('TodoDeleteDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    todoId: 'todo-1',
    todoTitle: 'タスク1',
  }

  beforeEach(() => {
    mockDeleteTodo.mockReset()
    defaultProps.onOpenChange.mockReset()
    jest.mocked(showSuccessToast).mockReset()
    jest.mocked(showErrorToast).mockReset()
  })

  it('should render dialog when open', () => {
    render(<TodoDeleteDialog {...defaultProps} />)

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText('タスクを削除')).toBeInTheDocument()
  })

  it('should not render dialog when closed', () => {
    render(<TodoDeleteDialog {...defaultProps} open={false} />)

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('should display todo title in confirmation message', () => {
    render(<TodoDeleteDialog {...defaultProps} />)

    expect(screen.getByText(/「タスク1」を削除しますか/)).toBeInTheDocument()
  })

  it('should call deleteTodo with todo id on confirm', async () => {
    mockDeleteTodo.mockResolvedValue({ success: true })
    render(<TodoDeleteDialog {...defaultProps} />)

    const deleteButton = screen.getByRole('button', { name: '削除' })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith('todo-1')
    })
  })

  it('should close dialog on successful delete', async () => {
    mockDeleteTodo.mockResolvedValue({ success: true })
    render(<TodoDeleteDialog {...defaultProps} />)

    const deleteButton = screen.getByRole('button', { name: '削除' })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('should show error message on delete failure', async () => {
    mockDeleteTodo.mockResolvedValue({ success: false, error: 'タスクが見つかりません' })
    render(<TodoDeleteDialog {...defaultProps} />)

    const deleteButton = screen.getByRole('button', { name: '削除' })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('タスクが見つかりません')).toBeInTheDocument()
    })
    expect(defaultProps.onOpenChange).not.toHaveBeenCalledWith(false)
  })

  it('should disable delete button while deleting', async () => {
    mockDeleteTodo.mockImplementation(() => new Promise(() => {})) // Never resolves
    render(<TodoDeleteDialog {...defaultProps} />)

    const deleteButton = screen.getByRole('button', { name: '削除' })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '削除中...' })).toBeDisabled()
    })
  })

  it('should close dialog when cancel button is clicked', () => {
    render(<TodoDeleteDialog {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
    fireEvent.click(cancelButton)

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('should show success toast on successful delete', async () => {
    mockDeleteTodo.mockResolvedValue({ success: true })
    render(<TodoDeleteDialog {...defaultProps} />)

    const deleteButton = screen.getByRole('button', { name: '削除' })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(showSuccessToast).toHaveBeenCalledWith('タスクを削除しました')
    })
  })

  it('should show error toast on delete failure', async () => {
    mockDeleteTodo.mockResolvedValue({ success: false, error: 'タスクが見つかりません' })
    render(<TodoDeleteDialog {...defaultProps} />)

    const deleteButton = screen.getByRole('button', { name: '削除' })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith('タスクの削除に失敗しました')
    })
  })
})
