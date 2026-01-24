import { signupSchema, loginSchema } from '@/lib/validations/auth'

describe('signupSchema', () => {
  it('should validate correct signup data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    }
    const result = signupSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123',
      confirmPassword: 'password123',
    }
    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email')
    }
  })

  it('should reject password shorter than 8 characters', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'short1',
      confirmPassword: 'short1',
    }
    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('パスワードは8文字以上で入力してください')
    }
  })

  it('should reject password without letters', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '12345678',
      confirmPassword: '12345678',
    }
    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('パスワードには英字と数字を含めてください')
    }
  })

  it('should reject password without numbers', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'abcdefgh',
      confirmPassword: 'abcdefgh',
    }
    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('パスワードには英字と数字を含めてください')
    }
  })

  it('should reject when passwords do not match', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'different123',
    }
    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword')
    }
  })

  it('should reject empty email', () => {
    const invalidData = {
      email: '',
      password: 'password123',
      confirmPassword: 'password123',
    }
    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('should validate correct login data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
    }
    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123',
    }
    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email')
    }
  })

  it('should reject empty password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '',
    }
    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('password')
    }
  })
})
