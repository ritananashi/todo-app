import { render, screen } from '@testing-library/react'
import { Header } from '@/components/Header'

// Mock the auth function
const mockAuth = jest.fn()
jest.mock('@/lib/auth', () => ({
  auth: () => mockAuth(),
}))

// Mock the UserMenu component
jest.mock('@/components/UserMenu', () => ({
  UserMenu: ({ name, email }: { name: string | null; email: string }) => (
    <div data-testid="user-menu">
      <span data-testid="user-display-name">{name || email}</span>
    </div>
  ),
}))

describe('Header', () => {
  beforeEach(() => {
    mockAuth.mockReset()
  })

  describe('when not authenticated', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(null)
    })

    it('should render logo with icon', async () => {
      render(await Header())
      const icon = screen.getByTestId('header-logo-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render logo text', async () => {
      render(await Header())
      expect(screen.getByText('ToDoアプリ')).toBeInTheDocument()
    })

    it('should have logo as a link to /', async () => {
      render(await Header())
      const link = screen.getByRole('link', { name: /ToDoアプリ/i })
      expect(link).toHaveAttribute('href', '/')
    })

    it('should render 新規登録 link', async () => {
      render(await Header())
      const link = screen.getByRole('link', { name: '新規登録' })
      expect(link).toHaveAttribute('href', '/signup')
    })

    it('should render ログイン link', async () => {
      render(await Header())
      const link = screen.getByRole('link', { name: 'ログイン' })
      expect(link).toHaveAttribute('href', '/login')
    })

    it('should not render UserMenu', async () => {
      render(await Header())
      expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument()
    })
  })

  describe('when authenticated', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
        },
      })
    })

    it('should render UserMenu', async () => {
      render(await Header())
      expect(screen.getByTestId('user-menu')).toBeInTheDocument()
    })

    it('should not render signup link', async () => {
      render(await Header())
      expect(screen.queryByRole('link', { name: '新規登録' })).not.toBeInTheDocument()
    })

    it('should not render login link', async () => {
      render(await Header())
      expect(screen.queryByRole('link', { name: 'ログイン' })).not.toBeInTheDocument()
    })

    it('should display user name when available', async () => {
      render(await Header())
      expect(screen.getByTestId('user-display-name')).toHaveTextContent('Test User')
    })

    it('should display email when name is not available', async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: null,
        },
      })
      render(await Header())
      expect(screen.getByTestId('user-display-name')).toHaveTextContent('test@example.com')
    })

    it('should render ToDo一覧 link', async () => {
      render(await Header())
      const link = screen.getByRole('link', { name: 'ToDo一覧' })
      expect(link).toHaveAttribute('href', '/todos')
    })
  })

  it('should have sticky class for fixed positioning', async () => {
    mockAuth.mockResolvedValue(null)
    const { container } = render(await Header())
    const header = container.querySelector('header')
    expect(header).toHaveClass('sticky')
  })
})
