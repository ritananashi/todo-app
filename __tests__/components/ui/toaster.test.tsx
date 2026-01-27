import { render, screen } from '@testing-library/react'
import { Toaster } from '@/components/ui/toaster'

// Mock sonner
jest.mock('sonner', () => ({
  Toaster: jest.fn(({ position, duration, visibleToasts }) => (
    <div
      data-testid="sonner-toaster"
      data-position={position}
      data-duration={duration}
      data-visible-toasts={visibleToasts}
    />
  )),
}))

describe('Toaster', () => {
  it('should render SonnerToaster', () => {
    render(<Toaster />)
    expect(screen.getByTestId('sonner-toaster')).toBeInTheDocument()
  })

  it('should set position to top-right', () => {
    render(<Toaster />)
    expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-position', 'top-right')
  })

  it('should set duration to 5000ms', () => {
    render(<Toaster />)
    expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-duration', '5000')
  })

  it('should set visibleToasts to 1', () => {
    render(<Toaster />)
    expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-visible-toasts', '1')
  })
})
