import { auth } from '@/lib/auth'

export default async function TodosPage() {
  const session = await auth()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ToDo一覧</h1>
      <div className="text-center py-12 text-muted-foreground">
        <p>ToDoはまだありません</p>
        <p className="text-sm mt-2">
          ようこそ、{session?.user?.email}さん
        </p>
      </div>
    </main>
  )
}
