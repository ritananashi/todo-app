import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BasicInfoForm } from '@/components/profile/BasicInfoForm'

// Mock the updateProfile action
const mockUpdateProfile = jest.fn()
jest.mock('@/actions/profile', () => ({
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}))

describe('BasicInfoForm', () => {
  const defaultProps = {
    initialName: 'テストユーザー',
    initialEmail: 'test@example.com',
    onSuccess: jest.fn(),
  }

  beforeEach(() => {
    mockUpdateProfile.mockReset()
    defaultProps.onSuccess.mockReset()
  })

  it('フォームフィールドが正しくレンダリングされる', () => {
    render(<BasicInfoForm {...defaultProps} />)

    expect(screen.getByLabelText('ユーザーネーム')).toBeInTheDocument()
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
  })

  it('初期値が正しく設定される', () => {
    render(<BasicInfoForm {...defaultProps} />)

    expect(screen.getByLabelText('ユーザーネーム')).toHaveValue('テストユーザー')
    expect(screen.getByLabelText('メールアドレス')).toHaveValue('test@example.com')
  })

  it('ユーザーネームが空でも保存できる', async () => {
    mockUpdateProfile.mockResolvedValue({ success: true })
    render(<BasicInfoForm {...defaultProps} />)

    const nameInput = screen.getByLabelText('ユーザーネーム')
    fireEvent.change(nameInput, { target: { value: '' } })

    const submitButton = screen.getByRole('button', { name: '保存' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: '',
        email: 'test@example.com',
      })
    })
  })

  it('メールアドレスが空の場合バリデーションエラーが表示される', async () => {
    render(<BasicInfoForm {...defaultProps} />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: '' } })

    const submitButton = screen.getByRole('button', { name: '保存' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
    })
    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })

  it('無効なメールアドレスの場合バリデーションエラーが表示される', async () => {
    render(<BasicInfoForm {...defaultProps} />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    const submitButton = screen.getByRole('button', { name: '保存' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
    })
    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })

  it('有効なデータで保存が成功する', async () => {
    mockUpdateProfile.mockResolvedValue({ success: true })
    render(<BasicInfoForm {...defaultProps} />)

    const nameInput = screen.getByLabelText('ユーザーネーム')
    fireEvent.change(nameInput, { target: { value: '新しい名前' } })

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } })

    const submitButton = screen.getByRole('button', { name: '保存' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: '新しい名前',
        email: 'new@example.com',
      })
    })

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled()
    })
  })

  it('サーバーエラーが表示される', async () => {
    mockUpdateProfile.mockResolvedValue({
      success: false,
      error: 'このメールアドレスは既に使用されています',
    })
    render(<BasicInfoForm {...defaultProps} />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } })

    const submitButton = screen.getByRole('button', { name: '保存' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('このメールアドレスは既に使用されています')).toBeInTheDocument()
    })
    expect(defaultProps.onSuccess).not.toHaveBeenCalled()
  })

  it('初期ユーザーネームがnullの場合、空文字で表示される', () => {
    render(<BasicInfoForm {...defaultProps} initialName={null} />)

    expect(screen.getByLabelText('ユーザーネーム')).toHaveValue('')
  })
})
