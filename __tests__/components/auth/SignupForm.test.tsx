import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignupForm } from '@/components/auth/SignupForm'
import { showErrorToast } from '@/lib/toast'

// Mock the signup action
const mockSignup = jest.fn()
jest.mock('@/actions/auth', () => ({
  signup: (...args: unknown[]) => mockSignup(...args),
}))

// Mock toast utilities
jest.mock('@/lib/toast', () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}))

describe('SignupForm', () => {
  beforeEach(() => {
    mockSignup.mockReset()
    jest.mocked(showErrorToast).mockReset()
  })

  it('should render all form fields', () => {
    render(<SignupForm />)

    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード（確認）')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '新規登録' })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    render(<SignupForm />)

    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email', async () => {
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    const passwordInput = screen.getByLabelText('パスワード')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const confirmPasswordInput = screen.getByLabelText('パスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
    })
  })

  it('should show validation error for short password', async () => {
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const passwordInput = screen.getByLabelText('パスワード')
    fireEvent.change(passwordInput, { target: { value: 'short' } })

    const confirmPasswordInput = screen.getByLabelText('パスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'short' } })

    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('パスワードは8文字以上で入力してください')).toBeInTheDocument()
    })
  })

  it('should show validation error when passwords do not match', async () => {
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const passwordInput = screen.getByLabelText('パスワード')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const confirmPasswordInput = screen.getByLabelText('パスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } })

    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument()
    })
  })

  it('should call signup action with form data on valid submission', async () => {
    mockSignup.mockResolvedValue({ success: true })
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const passwordInput = screen.getByLabelText('パスワード')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const confirmPasswordInput = screen.getByLabelText('パスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
    })
  })

  it('should display server error message', async () => {
    mockSignup.mockResolvedValue({ success: false, error: 'このメールアドレスは既に登録されています' })
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } })

    const passwordInput = screen.getByLabelText('パスワード')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const confirmPasswordInput = screen.getByLabelText('パスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('このメールアドレスは既に登録されています')).toBeInTheDocument()
    })
  })

  it('should have a link to login page', () => {
    render(<SignupForm />)

    const loginLink = screen.getByRole('link', { name: 'ログイン' })
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('should show error toast when signup fails', async () => {
    mockSignup.mockResolvedValue({ success: false, error: 'このメールアドレスは既に登録されています' })
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } })

    const passwordInput = screen.getByLabelText('パスワード')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const confirmPasswordInput = screen.getByLabelText('パスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith('新規登録に失敗しました')
    })
  })
})
