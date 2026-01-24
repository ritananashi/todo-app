import { render, screen, fireEvent } from '@testing-library/react'
import { PriorityFilter } from '@/components/todo/PriorityFilter'

describe('PriorityFilter', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockReset()
  })

  it('should render all priority filter options', () => {
    render(<PriorityFilter value={null} onChange={mockOnChange} />)

    expect(screen.getByRole('button', { name: /全て/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /緊急/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /高/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /中/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /低/ })).toBeInTheDocument()
  })

  it('should highlight "全て" when value is null', () => {
    render(<PriorityFilter value={null} onChange={mockOnChange} />)

    const allButton = screen.getByRole('button', { name: /全て/ })
    expect(allButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('should highlight selected priority', () => {
    render(<PriorityFilter value="high" onChange={mockOnChange} />)

    const highButton = screen.getByRole('button', { name: /高/ })
    expect(highButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('should call onChange with priority when clicked', () => {
    render(<PriorityFilter value={null} onChange={mockOnChange} />)

    fireEvent.click(screen.getByRole('button', { name: /緊急/ }))

    expect(mockOnChange).toHaveBeenCalledWith('urgent')
  })

  it('should call onChange with null when "全て" is clicked', () => {
    render(<PriorityFilter value="high" onChange={mockOnChange} />)

    fireEvent.click(screen.getByRole('button', { name: /全て/ }))

    expect(mockOnChange).toHaveBeenCalledWith(null)
  })
})
