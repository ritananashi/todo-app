import { formatDueDate, getDueDateStatus } from '@/lib/date-utils'

// テスト用の基準日を固定
const mockToday = new Date('2026-01-24T00:00:00')

describe('getDueDateStatus', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockToday)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return "overdue" for past dates', () => {
    const yesterday = new Date('2026-01-23T00:00:00')
    expect(getDueDateStatus(yesterday)).toBe('overdue')
  })

  it('should return "today" for today', () => {
    const today = new Date('2026-01-24T00:00:00')
    expect(getDueDateStatus(today)).toBe('today')
  })

  it('should return "normal" for future dates', () => {
    const tomorrow = new Date('2026-01-25T00:00:00')
    expect(getDueDateStatus(tomorrow)).toBe('normal')
  })

  it('should return null for null input', () => {
    expect(getDueDateStatus(null)).toBeNull()
  })
})

describe('formatDueDate', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockToday)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return "期限切れ" for past dates', () => {
    const pastDate = new Date('2026-01-22T00:00:00')
    expect(formatDueDate(pastDate)).toBe('期限切れ')
  })

  it('should return "今日" for today', () => {
    const today = new Date('2026-01-24T00:00:00')
    expect(formatDueDate(today)).toBe('今日')
  })

  it('should return "明日" for tomorrow', () => {
    const tomorrow = new Date('2026-01-25T00:00:00')
    expect(formatDueDate(tomorrow)).toBe('明日')
  })

  it('should return "N日後" for dates within a week', () => {
    const threeDaysLater = new Date('2026-01-27T00:00:00')
    expect(formatDueDate(threeDaysLater)).toBe('3日後')
  })

  it('should return formatted date for dates more than a week away', () => {
    const farFuture = new Date('2026-02-15T00:00:00')
    expect(formatDueDate(farFuture)).toBe('2/15')
  })

  it('should return null for null input', () => {
    expect(formatDueDate(null)).toBeNull()
  })
})
