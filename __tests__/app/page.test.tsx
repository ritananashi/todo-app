import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('should render logo with icon', () => {
    render(<Home />)
    const icon = screen.getByTestId('home-logo-icon')
    expect(icon).toBeInTheDocument()
  })

  it('should render ToDoアプリ heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: 'ToDoアプリ' })
    expect(heading).toBeInTheDocument()
  })

  it('should render タスク管理を始める text', () => {
    render(<Home />)
    expect(screen.getByText('タスク管理を始める')).toBeInTheDocument()
  })

  it('should render 新規登録 link', () => {
    render(<Home />)
    const link = screen.getByRole('link', { name: '新規登録' })
    expect(link).toHaveAttribute('href', '/signup')
  })

  it('should render ログイン link', () => {
    render(<Home />)
    const link = screen.getByRole('link', { name: 'ログイン' })
    expect(link).toHaveAttribute('href', '/login')
  })

  it('should have center alignment classes on main element', () => {
    render(<Home />)
    const main = screen.getByRole('main')
    expect(main).toHaveClass('flex', 'items-center', 'justify-center')
  })
})
