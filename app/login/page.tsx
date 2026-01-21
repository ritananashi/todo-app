import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            アカウントにログインしてToDoを管理しましょう
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
