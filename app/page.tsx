import { CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <CheckSquare className="size-12 text-primary" aria-hidden="true" data-testid="home-logo-icon" />
          <h1 className="text-4xl font-bold">ToDoアプリ</h1>
        </div>
        <p className="text-lg text-muted-foreground">タスク管理を始める</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="default" size="lg">新規登録</Button>
        <Button variant="outline" size="lg">ログイン</Button>
      </div>
    </main>
  )
}
