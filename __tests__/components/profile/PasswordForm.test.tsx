import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PasswordForm } from '@/components/profile/PasswordForm'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

// Mock the changePassword action
const mockChangePassword = jest.fn()
jest.mock('@/actions/profile', () => ({
  changePassword: (...args: unknown[]) => mockChangePassword(...args),
}))

// Mock toast utilities
jest.mock('@/lib/toast', () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}))

describe('PasswordForm', () => {
  const defaultProps = {
    onSuccess: jest.fn(),
  }

  beforeEach(() => {
    mockChangePassword.mockReset()
    defaultProps.onSuccess.mockReset()
    jest.mocked(showSuccessToast).mockReset()
    jest.mocked(showErrorToast).mockReset()
  })

  it('フォームフィールドが正しくレンダリングされる', () => {
    render(<PasswordForm {...defaultProps} />)

    expect(screen.getByLabelText('現在のパスワード')).toBeInTheDocument()
    expect(screen.getByLabelText('新しいパスワード')).toBeInTheDocument()
    expect(screen.getByLabelText('新しいパスワード（確認）')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'パスワードを変更' })).toBeInTheDocument()
  })

  it('現在のパスワードが空の場合バリデーションエラーが表示される', async () => {
    render(<PasswordForm {...defaultProps} />)

    const newPasswordInput = screen.getByLabelText('新しいパスワード')
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } })

    const confirmPasswordInput = screen.getByLabelText('新しいパスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } })

    const submitButton = screen.getByRole('button', { name: 'パスワードを変更' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('現在のパスワードを入力してください')).toBeInTheDocument()
    })
    expect(mockChangePassword).not.toHaveBeenCalled()
  })

  it('新しいパスワードが8文字未満の場合バリデーションエラーが表示される', async () => {
    render(<PasswordForm {...defaultProps} />)

    const currentPasswordInput = screen.getByLabelText('現在のパスワード')
    fireEvent.change(currentPasswordInput, { target: { value: 'current123' } })

    const newPasswordInput = screen.getByLabelText('新しいパスワード')
    fireEvent.change(newPasswordInput, { target: { value: 'short1' } })

    const confirmPasswordInput = screen.getByLabelText('新しいパスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'short1' } })

    const submitButton = screen.getByRole('button', { name: 'パスワードを変更' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('パスワードは8文字以上で入力してください')).toBeInTheDocument()
    })
    expect(mockChangePassword).not.toHaveBeenCalled()
  })

  it('新しいパスワードに英字が含まれない場合バリデーションエラーが表示される', async () => {
    render(<PasswordForm {...defaultProps} />)

    const currentPasswordInput = screen.getByLabelText('現在のパスワード')
    fireEvent.change(currentPasswordInput, { target: { value: 'current123' } })

    const newPasswordInput = screen.getByLabelText('新しいパスワード')
    fireEvent.change(newPasswordInput, { target: { value: '12345678' } })

    const confirmPasswordInput = screen.getByLabelText('新しいパスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: '12345678' } })

    const submitButton = screen.getByRole('button', { name: 'パスワードを変更' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('パスワードには英字と数字を含めてください')).toBeInTheDocument()
    })
    expect(mockChangePassword).not.toHaveBeenCalled()
  })

  it('新しいパスワードに数字が含まれない場合バリデーションエラーが表示される', async () => {
    render(<PasswordForm {...defaultProps} />)

    const currentPasswordInput = screen.getByLabelText('現在のパスワード')
    fireEvent.change(currentPasswordInput, { target: { value: 'current123' } })

    const newPasswordInput = screen.getByLabelText('新しいパスワード')
    fireEvent.change(newPasswordInput, { target: { value: 'abcdefgh' } })

    const confirmPasswordInput = screen.getByLabelText('新しいパスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'abcdefgh' } })

    const submitButton = screen.getByRole('button', { name: 'パスワードを変更' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('パスワードには英字と数字を含めてください')).toBeInTheDocument()
    })
    expect(mockChangePassword).not.toHaveBeenCalled()
  })

  it('新しいパスワードと確認用が一致しない場合バリデーションエラーが表示される', async () => {
    render(<PasswordForm {...defaultProps} />)

    const currentPasswordInput = screen.getByLabelText('現在のパスワード')
    fireEvent.change(currentPasswordInput, { target: { value: 'current123' } })

    const newPasswordInput = screen.getByLabelText('新しいパスワード')
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } })

    const confirmPasswordInput = screen.getByLabelText('新しいパスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } })

    const submitButton = screen.getByRole('button', { name: 'パスワードを変更' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('新しいパスワードが一致しません')).toBeInTheDocument()
    })
    expect(mockChangePassword).not.toHaveBeenCalled()
  })

  it('有効なデータでパスワード変更が成功する', async () => {
    mockChangePassword.mockResolvedValue({ success: true })
    render(<PasswordForm {...defaultProps} />)

    const currentPasswordInput = screen.getByLabelText('現在のパスワード')
    fireEvent.change(currentPasswordInput, { target: { value: 'current123' } })

    const newPasswordInput = screen.getByLabelText('新しいパスワード')
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } })

    const confirmPasswordInput = screen.getByLabelText('新しいパスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } })

    const submitButton = screen.getByRole('button', { name: 'パスワードを変更' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: 'current123',
        newPassword: 'newpass123',
        confirmNewPassword: 'newpass123',
      })
    })

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled()
    })
  })

  it('サーバーエラーが表示される', async () => {
    mockChangePassword.mockResolvedValue({
      success: false,
      error: '現在のパスワードが正しくありません',
    })
    render(<PasswordForm {...defaultProps} />)

    const currentPasswordInput = screen.getByLabelText('現在のパスワード')
    fireEvent.change(currentPasswordInput, { target: { value: 'wrongpass' } })

    const newPasswordInput = screen.getByLabelText('新しいパスワード')
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } })

    const confirmPasswordInput = screen.getByLabelText('新しいパスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } })

    const submitButton = screen.getByRole('button', { name: 'パスワードを変更' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('現在のパスワードが正しくありません')).toBeInTheDocument()
    })
    expect(defaultProps.onSuccess).not.toHaveBeenCalled()
  })

  it('パスワード変更成功時にトーストが表示される', async () => {
    mockChangePassword.mockResolvedValue({ success: true })
    render(<PasswordForm {...defaultProps} />)

    const currentPasswordInput = screen.getByLabelText('現在のパスワード')
    fireEvent.change(currentPasswordInput, { target: { value: 'current123' } })

    const newPasswordInput = screen.getByLabelText('新しいパスワード')
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } })

    const confirmPasswordInput = screen.getByLabelText('新しいパスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } })

    const submitButton = screen.getByRole('button', { name: 'パスワードを変更' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(showSuccessToast).toHaveBeenCalledWith('パスワードを変更しました')
    })
  })

  it('パスワード変更失敗時にエラートーストが表示される', async () => {
    mockChangePassword.mockResolvedValue({
      success: false,
      error: '現在のパスワードが正しくありません',
    })
    render(<PasswordForm {...defaultProps} />)

    const currentPasswordInput = screen.getByLabelText('現在のパスワード')
    fireEvent.change(currentPasswordInput, { target: { value: 'wrongpass' } })

    const newPasswordInput = screen.getByLabelText('新しいパスワード')
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } })

    const confirmPasswordInput = screen.getByLabelText('新しいパスワード（確認）')
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } })

    const submitButton = screen.getByRole('button', { name: 'パスワードを変更' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith('パスワードの変更に失敗しました')
    })
  })
})
