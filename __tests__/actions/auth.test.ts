import { signup, login, logout } from '@/actions/auth'

// Mock modules
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock next/navigation redirect
jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

// Import mocks after jest.mock
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signIn, signOut } from '@/lib/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>

describe('signup action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new user and sign in', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockBcrypt.hash.mockResolvedValue('hashed_password' as never)
    mockPrisma.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: null,
      password: 'hashed_password',
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    mockSignIn.mockResolvedValue(undefined)

    await expect(signup({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })).rejects.toThrow('REDIRECT:/todos')

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    })
    expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 12)
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        password: 'hashed_password',
      },
    })
    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirect: false,
    })
  })

  it('should return error if email already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'existing-user',
      email: 'existing@example.com',
      name: null,
      password: 'hashed_password',
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await signup({
      email: 'existing@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('このメールアドレスは既に登録されています')
    expect(mockPrisma.user.create).not.toHaveBeenCalled()
  })

  it('should return error for invalid input', async () => {
    const result = await signup({
      email: 'invalid-email',
      password: 'short',
      confirmPassword: 'short',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
  })
})

describe('login action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should sign in with valid credentials', async () => {
    mockSignIn.mockResolvedValue(undefined)

    await expect(login({
      email: 'test@example.com',
      password: 'password123',
    })).rejects.toThrow('REDIRECT:/todos')

    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirect: false,
    })
  })

  it('should return error for invalid credentials', async () => {
    mockSignIn.mockRejectedValue(new Error('CredentialsSignin'))

    const result = await login({
      email: 'test@example.com',
      password: 'wrongpassword',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('メールアドレスまたはパスワードが正しくありません')
  })

  it('should return error for invalid input', async () => {
    const result = await login({
      email: 'invalid-email',
      password: '',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(mockSignIn).not.toHaveBeenCalled()
  })
})

describe('logout action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should sign out and redirect to login', async () => {
    mockSignOut.mockResolvedValue(undefined)

    await expect(logout()).rejects.toThrow('REDIRECT:/login')

    expect(mockSignOut).toHaveBeenCalledWith({ redirect: false })
  })
})
