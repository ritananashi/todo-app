import '@testing-library/jest-dom'

// Mock ResizeObserver for radix-ui components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
