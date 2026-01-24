import { toast } from 'sonner'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('toast utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('showSuccessToast', () => {
    it('should call toast.success with the message', () => {
      showSuccessToast('タスクを作成しました')
      expect(toast.success).toHaveBeenCalledWith('タスクを作成しました')
    })

    it('should call toast.success only once', () => {
      showSuccessToast('タスクを更新しました')
      expect(toast.success).toHaveBeenCalledTimes(1)
    })
  })

  describe('showErrorToast', () => {
    it('should call toast.error with the message', () => {
      showErrorToast('タスクの作成に失敗しました')
      expect(toast.error).toHaveBeenCalledWith('タスクの作成に失敗しました')
    })

    it('should call toast.error only once', () => {
      showErrorToast('タスクの更新に失敗しました')
      expect(toast.error).toHaveBeenCalledTimes(1)
    })
  })
})
