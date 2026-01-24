import { render, screen } from '@testing-library/react'
import { TodoSortSelect } from '@/components/todo/TodoSortSelect'

describe('TodoSortSelect', () => {
  it('should render with default sort option', () => {
    render(<TodoSortSelect value="createdAt" onChange={() => {}} />)

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('作成日順')).toBeInTheDocument()
  })

  it('should display "重要度順" when value is priority', () => {
    render(<TodoSortSelect value="priority" onChange={() => {}} />)
    expect(screen.getByText('重要度順')).toBeInTheDocument()
  })

  it('should display "締切順" when value is dueDate', () => {
    render(<TodoSortSelect value="dueDate" onChange={() => {}} />)
    expect(screen.getByText('締切順')).toBeInTheDocument()
  })
})
