import { render, screen } from '@testing-library/react'
import SignupPage from '@/app/signup/page'

// Mock SignupForm component
jest.mock('@/components/auth/SignupForm', () => ({
  SignupForm: () => <div data-testid="signup-form">Signup Form Mock</div>,
}))

describe('SignupPage', () => {
  it('should render the signup page with title', () => {
    render(<SignupPage />)

    expect(screen.getByRole('heading', { name: '新規登録' })).toBeInTheDocument()
  })

  it('should render the SignupForm component', () => {
    render(<SignupPage />)

    expect(screen.getByTestId('signup-form')).toBeInTheDocument()
  })

  it('should have proper page structure', () => {
    render(<SignupPage />)

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
