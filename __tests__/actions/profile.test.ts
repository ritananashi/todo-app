import { updateProfile, changePassword } from '@/actions/profile'

// Mock modules
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}))

// Import mocks after jest.mock
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAuth = auth as any

describe('updateProfile action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('セッションがない場合、エラーを返す', async () => {
    mockAuth.mockResolvedValue(null)

    const result = await updateProfile({
      name: 'テストユーザー',
      email: 'test@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('認証が必要です')
  })

  it('nameとemailを更新できる', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Old Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.update.mockResolvedValue({
      id: 'user-1',
      email: 'new@example.com',
      name: 'New Name',
    })

    const result = await updateProfile({
      name: 'New Name',
      email: 'new@example.com',
    })

    expect(result.success).toBe(true)
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { name: 'New Name', email: 'new@example.com' },
    })
  })

  it('nameを空にすることができる（nullとして保存される）', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: 'Old Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.update.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: null,
    })

    const result = await updateProfile({
      name: '',
      email: 'test@example.com',
    })

    expect(result.success).toBe(true)
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { name: null, email: 'test@example.com' },
    })
  })

  it('同じemailに変更する場合（自分自身）は成功する', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })
    // 自分自身が見つかる
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
    })
    mockPrisma.user.update.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'New Name',
    })

    const result = await updateProfile({
      name: 'New Name',
      email: 'test@example.com',
    })

    expect(result.success).toBe(true)
  })

  it('既に使用されているemailに変更しようとするとエラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })
    // 別のユーザーが見つかる
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-2',
      email: 'existing@example.com',
    })

    const result = await updateProfile({
      name: 'Name',
      email: 'existing@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('このメールアドレスは既に使用されています')
    expect(mockPrisma.user.update).not.toHaveBeenCalled()
  })

  it('無効なemailの場合、バリデーションエラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })

    const result = await updateProfile({
      name: 'Name',
      email: 'invalid-email',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('有効なメールアドレスを入力してください')
  })

  it('並行更新で一意制約違反が発生した場合、エラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })
    // findUniqueでは見つからない（チェック時点では空いている）
    mockPrisma.user.findUnique.mockResolvedValue(null)
    // しかしupdateで一意制約違反が発生（P2002エラー）
    const p2002Error = new Error('Unique constraint failed')
    Object.assign(p2002Error, { code: 'P2002', meta: { target: ['email'] } })
    mockPrisma.user.update.mockRejectedValue(p2002Error)

    const result = await updateProfile({
      name: 'Name',
      email: 'race-condition@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('このメールアドレスは既に使用されています')
  })

  it('P2002エラーでtarget情報がない場合は汎用エラーメッセージを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    const p2002Error = new Error('Unique constraint failed')
    Object.assign(p2002Error, { code: 'P2002' })
    mockPrisma.user.update.mockRejectedValue(p2002Error)

    const result = await updateProfile({
      name: 'Name',
      email: 'race-condition@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('一意制約違反が発生しました')
  })

  it('P2002エラーで複合キー（emailを含む）の場合はemailエラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    const p2002Error = new Error('Unique constraint failed')
    Object.assign(p2002Error, { code: 'P2002', meta: { target: ['email', 'id'] } })
    mockPrisma.user.update.mockRejectedValue(p2002Error)

    const result = await updateProfile({
      name: 'Name',
      email: 'race-condition@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('このメールアドレスは既に使用されています')
  })

  it('P2002エラーでemail以外の制約違反の場合は汎用エラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    const p2002Error = new Error('Unique constraint failed')
    Object.assign(p2002Error, { code: 'P2002', meta: { target: ['other_field'] } })
    mockPrisma.user.update.mockRejectedValue(p2002Error)

    const result = await updateProfile({
      name: 'Name',
      email: 'test@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('一意制約違反が発生しました')
  })

  it('P2002エラーでtargetが文字列（email）の場合もemailエラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    const p2002Error = new Error('Unique constraint failed')
    Object.assign(p2002Error, { code: 'P2002', meta: { target: 'email' } })
    mockPrisma.user.update.mockRejectedValue(p2002Error)

    const result = await updateProfile({
      name: 'Name',
      email: 'race-condition@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('このメールアドレスは既に使用されています')
  })

  it('P2002エラーでtargetが文字列（email以外）の場合は汎用エラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    const p2002Error = new Error('Unique constraint failed')
    Object.assign(p2002Error, { code: 'P2002', meta: { target: 'other_field' } })
    mockPrisma.user.update.mockRejectedValue(p2002Error)

    const result = await updateProfile({
      name: 'Name',
      email: 'test@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('一意制約違反が発生しました')
  })

  it('emailが小文字に正規化されて保存される', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.update.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'New Name',
    })

    // 大文字のemailを送信
    const result = await updateProfile({
      name: 'New Name',
      email: 'TEST@EXAMPLE.COM',
    })

    expect(result.success).toBe(true)
    // 小文字に正規化されて保存される
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { name: 'New Name', email: 'test@example.com' },
    })
  })

  it('nameが空白のみの場合、nullとして保存される', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: 'Old Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.update.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: null,
    })

    const result = await updateProfile({
      name: '   ',
      email: 'test@example.com',
    })

    expect(result.success).toBe(true)
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { name: null, email: 'test@example.com' },
    })
  })

  it('nameが未指定の場合、既存のnameを保持する（emailのみ更新）', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Existing Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.update.mockResolvedValue({
      id: 'user-1',
      email: 'new@example.com',
      name: 'Existing Name',
    })

    const result = await updateProfile({
      email: 'new@example.com',
    })

    expect(result.success).toBe(true)
    // nameは更新対象に含まれない
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { email: 'new@example.com' },
    })
  })

  it('emailの前後に空白がある場合、trimされて保存される', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'old@example.com', name: 'Name' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.update.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Name',
    })

    const result = await updateProfile({
      name: 'Name',
      email: '  test@example.com  ',
    })

    expect(result.success).toBe(true)
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { name: 'Name', email: 'test@example.com' },
    })
  })
})

describe('changePassword action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('セッションがない場合、エラーを返す', async () => {
    mockAuth.mockResolvedValue(null)

    const result = await changePassword({
      currentPassword: 'oldpass123',
      newPassword: 'newpass123',
      confirmNewPassword: 'newpass123',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('認証が必要です')
  })

  it('パスワードがnullの場合（OAuth認証のみ）、エラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      password: null,
    })

    const result = await changePassword({
      currentPassword: 'oldpass123',
      newPassword: 'newpass123',
      confirmNewPassword: 'newpass123',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('パスワードが設定されていません')
  })

  it('現在のパスワードが間違っている場合、エラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashed_password',
    })
    mockBcrypt.compare.mockResolvedValue(false as never)

    const result = await changePassword({
      currentPassword: 'wrongpass',
      newPassword: 'newpass123',
      confirmNewPassword: 'newpass123',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('現在のパスワードが正しくありません')
  })

  it('新しいパスワードに変更できる', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: new Date().toISOString(),
    })
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashed_old_password',
    })
    mockBcrypt.compare.mockResolvedValue(true as never)
    mockBcrypt.hash.mockResolvedValue('hashed_new_password' as never)
    mockPrisma.user.update.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashed_new_password',
    })

    const result = await changePassword({
      currentPassword: 'oldpass123',
      newPassword: 'newpass123',
      confirmNewPassword: 'newpass123',
    })

    expect(result.success).toBe(true)
    expect(mockBcrypt.compare).toHaveBeenCalledWith('oldpass123', 'hashed_old_password')
    expect(mockBcrypt.hash).toHaveBeenCalledWith('newpass123', 12)
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { password: 'hashed_new_password' },
    })
  })

  it('新しいパスワードが8文字未満の場合、バリデーションエラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: new Date().toISOString(),
    })

    const result = await changePassword({
      currentPassword: 'oldpass123',
      newPassword: 'short1',
      confirmNewPassword: 'short1',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('パスワードは8文字以上で入力してください')
  })

  it('新しいパスワードに英字が含まれない場合、バリデーションエラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: new Date().toISOString(),
    })

    const result = await changePassword({
      currentPassword: 'oldpass123',
      newPassword: '12345678',
      confirmNewPassword: '12345678',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('パスワードには英字と数字を含めてください')
  })

  it('新しいパスワードと確認用が一致しない場合、バリデーションエラーを返す', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: new Date().toISOString(),
    })

    const result = await changePassword({
      currentPassword: 'oldpass123',
      newPassword: 'newpass123',
      confirmNewPassword: 'different123',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('新しいパスワードが一致しません')
  })
})
