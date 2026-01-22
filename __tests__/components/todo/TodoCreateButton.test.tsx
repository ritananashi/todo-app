import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TodoCreateButton } from '@/components/todo/TodoCreateButton'

// Mock the createTodo action
const mockCreateTodo = jest.fn()
jest.mock('@/actions/todo', () => ({
  createTodo: (...args: unknown[]) => mockCreateTodo(...args),
}))

describe('TodoCreateButton', () => {
  beforeEach(() => {
    mockCreateTodo.mockReset()
  })

  it('should render the add button', () => {
    render(<TodoCreateButton />)

    expect(screen.getByRole('button', { name: /タスクを追加/i })).toBeInTheDocument()
  })

  it('should open dialog when button is clicked', async () => {
    render(<TodoCreateButton />)

    const addButton = screen.getByRole('button', { name: /タスクを追加/i })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('新しいタスク')).toBeInTheDocument()
    })
  })

  it('should show form fields in dialog', async () => {
    render(<TodoCreateButton />)

    const addButton = screen.getByRole('button', { name: /タスクを追加/i })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByLabelText('タイトル')).toBeInTheDocument()
      expect(screen.getByLabelText('メモ（任意）')).toBeInTheDocument()
    })
  })

  it('should close dialog after successful submission', async () => {
    mockCreateTodo.mockResolvedValue({ success: true, todo: { id: 'todo-1' } })
    render(<TodoCreateButton />)

    // Open dialog
    const addButton = screen.getByRole('button', { name: /タスクを追加/i })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Fill form
    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: 'タスク1' } })

    // Submit
    const submitButton = screen.getByRole('button', { name: '追加' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
