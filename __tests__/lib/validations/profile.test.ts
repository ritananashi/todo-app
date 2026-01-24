import {
  updateProfileSchema,
  changePasswordSchema,
  normalizeProfileInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from '@/lib/validations/profile'

describe('updateProfileSchema', () => {
  describe('正常系', () => {
    it('nameとemailが有効な場合、バリデーションが成功する', () => {
      const input: UpdateProfileInput = {
        name: 'テストユーザー',
        email: 'test@example.com',
      }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('nameが空文字の場合でもバリデーションが成功する', () => {
      const input: UpdateProfileInput = {
        name: '',
        email: 'test@example.com',
      }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('nameがnullの場合でもバリデーションが成功する', () => {
      const input = {
        name: null,
        email: 'test@example.com',
      }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('nameが未定義の場合でもバリデーションが成功する', () => {
      const input = {
        email: 'test@example.com',
      }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('emailの前後に空白がある場合、trimされてバリデーションが成功する', () => {
      const input = {
        name: 'テストユーザー',
        email: '  test@example.com  ',
      }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })
  })

  describe('異常系', () => {
    it('emailが空の場合、バリデーションエラーになる', () => {
      const input = {
        name: 'テストユーザー',
        email: '',
      }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('有効なメールアドレスを入力してください')
      }
    })

    it('emailがメール形式でない場合、バリデーションエラーになる', () => {
      const input = {
        name: 'テストユーザー',
        email: 'invalid-email',
      }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('有効なメールアドレスを入力してください')
      }
    })
  })
})

describe('normalizeProfileInput', () => {
  it('emailが小文字に変換される（trimはスキーマで実行済み）', () => {
    const input: UpdateProfileInput = {
      name: 'テストユーザー',
      email: 'TEST@EXAMPLE.COM',
    }
    const result = normalizeProfileInput(input)
    expect(result.email).toBe('test@example.com')
  })

  it('nameがtrimされる', () => {
    const input: UpdateProfileInput = {
      name: '  テストユーザー  ',
      email: 'test@example.com',
    }
    const result = normalizeProfileInput(input)
    expect(result.name).toBe('テストユーザー')
  })

  it('nameが空白のみの場合、nullに変換される', () => {
    const input: UpdateProfileInput = {
      name: '   ',
      email: 'test@example.com',
    }
    const result = normalizeProfileInput(input)
    expect(result.name).toBeNull()
  })

  it('nameが空文字の場合、nullに変換される', () => {
    const input: UpdateProfileInput = {
      name: '',
      email: 'test@example.com',
    }
    const result = normalizeProfileInput(input)
    expect(result.name).toBeNull()
  })

  it('nameがnullの場合、nullのまま', () => {
    const input: UpdateProfileInput = {
      name: null,
      email: 'test@example.com',
    }
    const result = normalizeProfileInput(input)
    expect(result.name).toBeNull()
  })

  it('nameがundefinedの場合、undefinedのまま（更新対象から外す）', () => {
    const input: UpdateProfileInput = {
      email: 'test@example.com',
    }
    const result = normalizeProfileInput(input)
    expect(result.name).toBeUndefined()
  })
})

describe('changePasswordSchema', () => {
  describe('正常系', () => {
    it('全てのフィールドが有効な場合、バリデーションが成功する', () => {
      const input: ChangePasswordInput = {
        currentPassword: 'currentPass123',
        newPassword: 'newPass123',
        confirmNewPassword: 'newPass123',
      }
      const result = changePasswordSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  describe('異常系', () => {
    it('currentPasswordが空の場合、バリデーションエラーになる', () => {
      const input = {
        currentPassword: '',
        newPassword: 'newPass123',
        confirmNewPassword: 'newPass123',
      }
      const result = changePasswordSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('現在のパスワードを入力してください')
      }
    })

    it('newPasswordが8文字未満の場合、バリデーションエラーになる', () => {
      const input = {
        currentPassword: 'currentPass123',
        newPassword: 'pass1',
        confirmNewPassword: 'pass1',
      }
      const result = changePasswordSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('パスワードは8文字以上で入力してください')
      }
    })

    it('newPasswordに英字が含まれない場合、バリデーションエラーになる', () => {
      const input = {
        currentPassword: 'currentPass123',
        newPassword: '12345678',
        confirmNewPassword: '12345678',
      }
      const result = changePasswordSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('パスワードには英字と数字を含めてください')
      }
    })

    it('newPasswordに数字が含まれない場合、バリデーションエラーになる', () => {
      const input = {
        currentPassword: 'currentPass123',
        newPassword: 'abcdefgh',
        confirmNewPassword: 'abcdefgh',
      }
      const result = changePasswordSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('パスワードには英字と数字を含めてください')
      }
    })

    it('confirmNewPasswordが一致しない場合、バリデーションエラーになる', () => {
      const input = {
        currentPassword: 'currentPass123',
        newPassword: 'newPass123',
        confirmNewPassword: 'differentPass123',
      }
      const result = changePasswordSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('新しいパスワードが一致しません')
      }
    })
  })
})
