import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getTodos } from '@/actions/todo'
import { TodoCreateButton } from '@/components/todo/TodoCreateButton'
import { TodoList } from '@/components/todo/TodoList'

export const dynamic = 'force-dynamic'

export default async function TodosPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const result = await getTodos()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ToDo一覧</h1>
        <TodoCreateButton />
      </div>
      {result.success ? (
        <TodoList todos={result.todos} />
      ) : (
        <div className="text-center py-12 text-red-500">
          <p>{result.error}</p>
        </div>
      )}
    </main>
  )
}
