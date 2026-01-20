import { render, screen } from '@testing-library/react'
import { Header } from '@/components/Header'

describe('Header', () => {
  it('should render logo with icon', () => {
    render(<Header />)
    const icon = screen.getByTestId('header-logo-icon')
    expect(icon).toBeInTheDocument()
  })

  it('should render logo text', () => {
    render(<Header />)
    expect(screen.getByText('ToDoアプリ')).toBeInTheDocument()
  })

  it('should have logo as a link to /', () => {
    render(<Header />)
    const link = screen.getByRole('link', { name: /ToDoアプリ/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('should render 新規登録 button', () => {
    render(<Header />)
    const button = screen.getByRole('button', { name: '新規登録' })
    expect(button).toBeInTheDocument()
  })

  it('should render ログイン button', () => {
    render(<Header />)
    const button = screen.getByRole('button', { name: 'ログイン' })
    expect(button).toBeInTheDocument()
  })

  it('should have sticky class for fixed positioning', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('sticky')
  })
})
