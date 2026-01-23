import { render, screen, fireEvent } from '@testing-library/react'
import { TodoFilter } from '@/components/todo/TodoFilter'

describe('TodoFilter', () => {
  const defaultCounts = {
    all: 5,
    incomplete: 3,
    completed: 2,
  }

  const mockOnFilterChange = jest.fn()

  beforeEach(() => {
    mockOnFilterChange.mockClear()
  })

  it('should render three filter buttons', () => {
    render(
      <TodoFilter
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        counts={defaultCounts}
      />
    )

    expect(screen.getByRole('button', { name: /全件 \(/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /未完了 \(/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^完了 \(/ })).toBeInTheDocument()
  })

  it('should display counts for each filter', () => {
    render(
      <TodoFilter
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        counts={defaultCounts}
      />
    )

    expect(screen.getByRole('button', { name: /全件 \(5\)/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /未完了 \(3\)/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /完了 \(2\)/ })).toBeInTheDocument()
  })

  it('should call onFilterChange with "all" when all button is clicked', () => {
    render(
      <TodoFilter
        currentFilter="incomplete"
        onFilterChange={mockOnFilterChange}
        counts={defaultCounts}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /全件/ }))

    expect(mockOnFilterChange).toHaveBeenCalledWith('all')
  })

  it('should call onFilterChange with "incomplete" when incomplete button is clicked', () => {
    render(
      <TodoFilter
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        counts={defaultCounts}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /未完了/ }))

    expect(mockOnFilterChange).toHaveBeenCalledWith('incomplete')
  })

  it('should call onFilterChange with "completed" when completed button is clicked', () => {
    render(
      <TodoFilter
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        counts={defaultCounts}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /^完了 \(/ }))

    expect(mockOnFilterChange).toHaveBeenCalledWith('completed')
  })

  it('should highlight the active filter button', () => {
    const { rerender } = render(
      <TodoFilter
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        counts={defaultCounts}
      />
    )

    const allButton = screen.getByRole('button', { name: /全件 \(/ })
    const incompleteButton = screen.getByRole('button', { name: /未完了 \(/ })
    const completedButton = screen.getByRole('button', { name: /^完了 \(/ })

    // "all" is active
    expect(allButton).toHaveAttribute('aria-pressed', 'true')
    expect(incompleteButton).toHaveAttribute('aria-pressed', 'false')
    expect(completedButton).toHaveAttribute('aria-pressed', 'false')

    // Change to "incomplete"
    rerender(
      <TodoFilter
        currentFilter="incomplete"
        onFilterChange={mockOnFilterChange}
        counts={defaultCounts}
      />
    )

    expect(allButton).toHaveAttribute('aria-pressed', 'false')
    expect(incompleteButton).toHaveAttribute('aria-pressed', 'true')
    expect(completedButton).toHaveAttribute('aria-pressed', 'false')

    // Change to "completed"
    rerender(
      <TodoFilter
        currentFilter="completed"
        onFilterChange={mockOnFilterChange}
        counts={defaultCounts}
      />
    )

    expect(allButton).toHaveAttribute('aria-pressed', 'false')
    expect(incompleteButton).toHaveAttribute('aria-pressed', 'false')
    expect(completedButton).toHaveAttribute('aria-pressed', 'true')
  })
})
