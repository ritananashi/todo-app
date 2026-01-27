import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/auth/LoginForm'
import { showErrorToast } from '@/lib/toast'

// Mock the login action
const mockLogin = jest.fn()
jest.mock('@/actions/auth', () => ({
  login: (...args: unknown[]) => mockLogin(...args),
}))

// Mock toast utilities
jest.mock('@/lib/toast', () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockReset()
    jest.mocked(showErrorToast).mockReset()
  })

  it('should render all form fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument()
  })

  it('should show validation error for invalid email', async () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    const passwordInput = screen.getByLabelText('パスワード')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: 'ログイン' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
    })
  })

  it('should show validation error for empty password', async () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const submitButton = screen.getByRole('button', { name: 'ログイン' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()
    })
  })

  it('should call login action with form data on valid submission', async () => {
    mockLogin.mockResolvedValue({ success: true })
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const passwordInput = screen.getByLabelText('パスワード')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: 'ログイン' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should display server error message', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'メールアドレスまたはパスワードが正しくありません' })
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const passwordInput = screen.getByLabelText('パスワード')
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })

    const submitButton = screen.getByRole('button', { name: 'ログイン' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('メールアドレスまたはパスワードが正しくありません')).toBeInTheDocument()
    })
  })

  it('should have a link to signup page', () => {
    render(<LoginForm />)

    const signupLink = screen.getByRole('link', { name: '新規登録' })
    expect(signupLink).toHaveAttribute('href', '/signup')
  })

  it('should show error toast when login fails', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'メールアドレスまたはパスワードが正しくありません' })
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const passwordInput = screen.getByLabelText('パスワード')
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })

    const submitButton = screen.getByRole('button', { name: 'ログイン' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith('ログインに失敗しました')
    })
  })
})
