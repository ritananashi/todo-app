import Link from 'next/link'
import { CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <CheckSquare className="size-6 text-primary" aria-hidden="true" data-testid="header-logo-icon" />
          <span className="text-xl font-bold">ToDoアプリ</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="default">新規登録</Button>
          <Button variant="outline">ログイン</Button>
        </div>
      </div>
    </header>
  )
}
