import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/login/page'

// Mock LoginForm component
jest.mock('@/components/auth/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">Login Form Mock</div>,
}))

describe('LoginPage', () => {
  it('should render the login page with title', () => {
    render(<LoginPage />)

    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument()
  })

  it('should render the LoginForm component', () => {
    render(<LoginPage />)

    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('should have proper page structure', () => {
    render(<LoginPage />)

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
