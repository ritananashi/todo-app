import { createTodoSchema, updateTodoSchema } from '@/lib/validations/todo'

describe('createTodoSchema', () => {
  it('should validate correct todo data', () => {
    const validData = {
      title: 'タスク1',
    }
    const result = createTodoSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should validate todo data with memo', () => {
    const validData = {
      title: 'タスク1',
      memo: 'メモ内容',
    }
    const result = createTodoSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.memo).toBe('メモ内容')
    }
  })

  it('should transform empty memo to undefined', () => {
    const validData = {
      title: 'タスク1',
      memo: '',
    }
    const result = createTodoSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.memo).toBeUndefined()
    }
  })

  it('should reject empty title', () => {
    const invalidData = {
      title: '',
    }
    const result = createTodoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title')
      expect(result.error.issues[0].message).toBe('タイトルを入力してください')
    }
  })

  it('should reject whitespace-only title', () => {
    const invalidData = {
      title: '   ',
    }
    const result = createTodoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title')
      expect(result.error.issues[0].message).toBe('タイトルは空白のみでは登録できません')
    }
  })

  it('should reject title longer than 100 characters', () => {
    const invalidData = {
      title: 'a'.repeat(101),
    }
    const result = createTodoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title')
      expect(result.error.issues[0].message).toBe('タイトルは100文字以内で入力してください')
    }
  })

  it('should accept title with exactly 100 characters', () => {
    const validData = {
      title: 'a'.repeat(100),
    }
    const result = createTodoSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject memo longer than 1000 characters', () => {
    const invalidData = {
      title: 'タスク1',
      memo: 'a'.repeat(1001),
    }
    const result = createTodoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('memo')
      expect(result.error.issues[0].message).toBe('メモは1000文字以内で入力してください')
    }
  })

  it('should accept memo with exactly 1000 characters', () => {
    const validData = {
      title: 'タスク1',
      memo: 'a'.repeat(1000),
    }
    const result = createTodoSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})

describe('updateTodoSchema', () => {
  const validData = {
    id: 'todo-1',
    title: 'タスク1',
    memo: '',
    isCompleted: false,
  }

  it('should validate correct update data', () => {
    const result = updateTodoSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.id).toBe('todo-1')
      expect(result.data.title).toBe('タスク1')
      expect(result.data.isCompleted).toBe(false)
    }
  })

  it('should validate update data with memo', () => {
    const data = {
      ...validData,
      memo: 'メモ内容',
    }
    const result = updateTodoSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.memo).toBe('メモ内容')
    }
  })

  it('should validate completed todo', () => {
    const data = {
      ...validData,
      isCompleted: true,
    }
    const result = updateTodoSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isCompleted).toBe(true)
    }
  })

  it('should transform empty memo to undefined', () => {
    const data = {
      ...validData,
      memo: '',
    }
    const result = updateTodoSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.memo).toBeUndefined()
    }
  })

  it('should reject empty id', () => {
    const data = {
      ...validData,
      id: '',
    }
    const result = updateTodoSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('id')
      expect(result.error.issues[0].message).toBe('IDが必要です')
    }
  })

  it('should reject missing id', () => {
    const { id: _id, ...dataWithoutId } = validData
    const result = updateTodoSchema.safeParse(dataWithoutId)
    expect(result.success).toBe(false)
  })

  it('should reject empty title', () => {
    const data = {
      ...validData,
      title: '',
    }
    const result = updateTodoSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title')
      expect(result.error.issues[0].message).toBe('タイトルを入力してください')
    }
  })

  it('should reject whitespace-only title', () => {
    const data = {
      ...validData,
      title: '   ',
    }
    const result = updateTodoSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title')
      expect(result.error.issues[0].message).toBe('タイトルは空白のみでは登録できません')
    }
  })

  it('should reject title longer than 100 characters', () => {
    const data = {
      ...validData,
      title: 'a'.repeat(101),
    }
    const result = updateTodoSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title')
      expect(result.error.issues[0].message).toBe('タイトルは100文字以内で入力してください')
    }
  })

  it('should reject memo longer than 1000 characters', () => {
    const data = {
      ...validData,
      memo: 'a'.repeat(1001),
    }
    const result = updateTodoSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('memo')
      expect(result.error.issues[0].message).toBe('メモは1000文字以内で入力してください')
    }
  })

  it('should reject invalid isCompleted type', () => {
    const data = {
      ...validData,
      isCompleted: 'true', // string instead of boolean
    }
    const result = updateTodoSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})
