import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">新規登録</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            アカウントを作成してToDoを管理しましょう
          </p>
        </div>
        <SignupForm />
      </div>
    </main>
  )
}
