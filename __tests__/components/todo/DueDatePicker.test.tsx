import { render, screen } from '@testing-library/react'
import { DueDatePicker } from '@/components/todo/DueDatePicker'

describe('DueDatePicker', () => {
  it('should render with placeholder when no date is selected', () => {
    render(<DueDatePicker value={null} onChange={() => {}} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('締切日を選択')).toBeInTheDocument()
  })

  it('should display formatted date when date is selected', () => {
    const date = new Date('2026-02-15')
    render(<DueDatePicker value={date} onChange={() => {}} />)

    expect(screen.getByText('2026/02/15')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<DueDatePicker value={null} onChange={() => {}} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
