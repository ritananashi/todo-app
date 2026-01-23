import Link from 'next/link'
import { CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { logout } from '@/actions/auth'

export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <CheckSquare className="size-6 text-primary" aria-hidden="true" data-testid="header-logo-icon" />
          <span className="text-xl font-bold">ToDoアプリ</span>
        </Link>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              {session.user?.email && (
                <span className="hidden text-sm text-muted-foreground sm:block">
                  {session.user.email}
                </span>
              )}
              <Button variant="ghost" asChild>
                <Link href="/todos">ToDo一覧</Link>
              </Button>
              <form action={logout}>
                <Button type="submit" variant="outline">
                  ログアウト
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="default" asChild>
                <Link href="/signup">新規登録</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">ログイン</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
