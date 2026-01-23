import { render, screen } from '@testing-library/react'
import { Header } from '@/components/Header'

// Mock the auth function
const mockAuth = jest.fn()
jest.mock('@/lib/auth', () => ({
  auth: () => mockAuth(),
}))

// Mock the logout action
jest.mock('@/actions/auth', () => ({
  logout: jest.fn(),
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

    it('should not render logout button', async () => {
      render(await Header())
      expect(screen.queryByRole('button', { name: 'ログアウト' })).not.toBeInTheDocument()
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

    it('should render logout button', async () => {
      render(await Header())
      const button = screen.getByRole('button', { name: 'ログアウト' })
      expect(button).toBeInTheDocument()
    })

    it('should not render signup link', async () => {
      render(await Header())
      expect(screen.queryByRole('link', { name: '新規登録' })).not.toBeInTheDocument()
    })

    it('should not render login link', async () => {
      render(await Header())
      expect(screen.queryByRole('link', { name: 'ログイン' })).not.toBeInTheDocument()
    })

    it('should not render email when user email is not available', async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          name: 'Test User',
        },
      })
      render(await Header())
      const emailElements = document.querySelectorAll('.text-muted-foreground')
      expect(emailElements.length).toBe(0)
    })

    it('should display user email address', async () => {
      render(await Header())
      const emailElement = screen.getByText('test@example.com')
      expect(emailElement).toBeInTheDocument()
    })

    it('should hide email on mobile with hidden sm:block classes', async () => {
      render(await Header())
      const emailElement = screen.getByText('test@example.com')
      expect(emailElement).toHaveClass('hidden', 'sm:block')
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
