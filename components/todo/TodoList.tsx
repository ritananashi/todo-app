import type { TodoModel as Todo } from '@/src/generated/prisma/models'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>ToDoはまだありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          isCompleted={todo.isCompleted}
          memo={todo.memo}
        />
      ))}
    </div>
  )
}
