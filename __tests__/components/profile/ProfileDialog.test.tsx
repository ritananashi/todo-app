import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileDialog } from '@/components/profile/ProfileDialog'

// Mock the form components
jest.mock('@/components/profile/BasicInfoForm', () => ({
  BasicInfoForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="basic-info-form">
      <button onClick={onSuccess}>保存</button>
    </div>
  ),
}))

jest.mock('@/components/profile/PasswordForm', () => ({
  PasswordForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="password-form">
      <button onClick={onSuccess}>パスワードを変更</button>
    </div>
  ),
}))

describe('ProfileDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    initialName: 'テストユーザー',
    initialEmail: 'test@example.com',
  }

  beforeEach(() => {
    defaultProps.onOpenChange.mockReset()
  })

  it('ダイアログが開いている時、タイトルと2つのセクションが表示される', () => {
    render(<ProfileDialog {...defaultProps} />)

    expect(screen.getByText('プロフィール編集')).toBeInTheDocument()
    expect(screen.getByText('基本情報')).toBeInTheDocument()
    expect(screen.getByText('パスワード変更')).toBeInTheDocument()
  })

  it('基本情報セクションにBasicInfoFormが表示される', () => {
    render(<ProfileDialog {...defaultProps} />)

    expect(screen.getByTestId('basic-info-form')).toBeInTheDocument()
  })

  it('パスワード変更セクションにPasswordFormが表示される', () => {
    render(<ProfileDialog {...defaultProps} />)

    expect(screen.getByTestId('password-form')).toBeInTheDocument()
  })

  it('ダイアログが閉じている時、コンテンツは表示されない', () => {
    render(<ProfileDialog {...defaultProps} open={false} />)

    expect(screen.queryByText('プロフィール編集')).not.toBeInTheDocument()
  })

  it('閉じるボタンをクリックするとonOpenChangeが呼ばれる', () => {
    render(<ProfileDialog {...defaultProps} />)

    // Dialogの閉じるボタン（×）をクリック
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('基本情報の保存成功時にダイアログが閉じる', () => {
    render(<ProfileDialog {...defaultProps} />)

    const saveButton = screen.getByRole('button', { name: '保存' })
    fireEvent.click(saveButton)

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('パスワード変更成功時にダイアログが閉じる', () => {
    render(<ProfileDialog {...defaultProps} />)

    const changePasswordButton = screen.getByRole('button', { name: 'パスワードを変更' })
    fireEvent.click(changePasswordButton)

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })
})
