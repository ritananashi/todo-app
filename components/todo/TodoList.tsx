'use client'

import { useMemo, useState } from 'react'
import type { TodoModel as Todo } from '@/src/generated/prisma/models'
import { TodoItem } from './TodoItem'
import { TodoFilter, type FilterType } from './TodoFilter'

interface TodoListProps {
  todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const counts = useMemo(
    () => ({
      all: todos.length,
      incomplete: todos.filter((todo) => !todo.isCompleted).length,
      completed: todos.filter((todo) => todo.isCompleted).length,
    }),
    [todos]
  )

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'incomplete':
        return todos.filter((todo) => !todo.isCompleted)
      case 'completed':
        return todos.filter((todo) => todo.isCompleted)
      default:
        return todos
    }
  }, [todos, filter])

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground max-w-2xl mx-auto">
        <p>ToDoはまだありません</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TodoFilter
        currentFilter={filter}
        onFilterChange={setFilter}
        counts={counts}
      />
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            isCompleted={todo.isCompleted}
            memo={todo.memo}
          />
        ))}
      </div>
    </div>
  )
}
