import { render, screen } from '@testing-library/react'
import { PrioritySelect } from '@/components/todo/PrioritySelect'

describe('PrioritySelect', () => {
  it('should render with default value "中"', () => {
    render(<PrioritySelect value="medium" onChange={() => {}} />)

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('中')).toBeInTheDocument()
  })

  it('should display "緊急" when value is urgent', () => {
    render(<PrioritySelect value="urgent" onChange={() => {}} />)
    expect(screen.getByText('緊急')).toBeInTheDocument()
  })

  it('should display "高" when value is high', () => {
    render(<PrioritySelect value="high" onChange={() => {}} />)
    expect(screen.getByText('高')).toBeInTheDocument()
  })

  it('should display "低" when value is low', () => {
    render(<PrioritySelect value="low" onChange={() => {}} />)
    expect(screen.getByText('低')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<PrioritySelect value="medium" onChange={() => {}} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })
})
