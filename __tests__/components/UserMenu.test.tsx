import { render, screen, fireEvent } from '@testing-library/react'
import { UserMenu } from '@/components/UserMenu'

// Mock the ProfileDialog
jest.mock('@/components/profile/ProfileDialog', () => ({
  ProfileDialog: ({ open }: { open: boolean }) => (
    open ? <div data-testid="profile-dialog">プロフィール編集</div> : null
  ),
}))

// Mock the logout action
const mockLogout = jest.fn()
jest.mock('@/actions/auth', () => ({
  logout: () => mockLogout(),
}))

// Mock the DropdownMenu components
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => (
    asChild ? <>{children}</> : <button>{children}</button>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick, asChild }: { children: React.ReactNode; onClick?: () => void; asChild?: boolean }) => {
    if (asChild) {
      return <div role="menuitem">{children}</div>
    }
    return (
      <button role="menuitem" onClick={onClick}>
        {children}
      </button>
    )
  },
  DropdownMenuSeparator: () => <hr />,
}))

describe('UserMenu', () => {
  const defaultProps = {
    name: 'テストユーザー',
    email: 'test@example.com',
  }

  beforeEach(() => {
    mockLogout.mockReset()
  })

  it('nameがある場合、nameが表示される', () => {
    render(<UserMenu {...defaultProps} />)

    expect(screen.getByText('テストユーザー')).toBeInTheDocument()
  })

  it('nameがnullの場合、emailが表示される', () => {
    render(<UserMenu {...defaultProps} name={null} />)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('nameが空文字の場合、emailが表示される', () => {
    render(<UserMenu {...defaultProps} name="" />)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('ドロップダウンメニューにプロフィール編集とログアウトが表示される', () => {
    render(<UserMenu {...defaultProps} />)

    expect(screen.getByRole('menuitem', { name: /プロフィール編集/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /ログアウト/i })).toBeInTheDocument()
  })

  it('プロフィール編集をクリックするとダイアログが開く', () => {
    render(<UserMenu {...defaultProps} />)

    const profileMenuItem = screen.getByRole('menuitem', { name: /プロフィール編集/i })
    fireEvent.click(profileMenuItem)

    expect(screen.getByTestId('profile-dialog')).toBeInTheDocument()
  })

  it('ログアウトボタンをクリックするとlogout actionが呼ばれる', () => {
    render(<UserMenu {...defaultProps} />)

    const logoutButton = screen.getByRole('button', { name: /ログアウト/i })
    fireEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalled()
  })
})
