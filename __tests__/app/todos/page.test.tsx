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

describe('TodosPage', () => {
  it('should render the todos page with title', async () => {
    render(await TodosPage())

    expect(screen.getByRole('heading', { name: 'ToDo一覧' })).toBeInTheDocument()
  })

  it('should have proper page structure', async () => {
    render(await TodosPage())

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('should display placeholder message', async () => {
    render(await TodosPage())

    expect(screen.getByText(/ToDoはまだありません/)).toBeInTheDocument()
  })
})
