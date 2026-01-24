'use client'

import { useMemo, useState } from 'react'
import type { TodoModel as Todo } from '@/src/generated/prisma/models'
import type { Priority } from '@/lib/validations/todo'
import { TodoItem } from './TodoItem'
import { TodoFilter, type FilterType } from './TodoFilter'
import { PriorityFilter } from './PriorityFilter'
import { TodoSortSelect, type SortOption } from './TodoSortSelect'

// 重要度の順序（高い順）
const priorityOrder: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
}

interface TodoListProps {
  todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
  const [statusFilter, setStatusFilter] = useState<FilterType>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('createdAt')

  const counts = useMemo(
    () => ({
      all: todos.length,
      incomplete: todos.filter((todo) => !todo.isCompleted).length,
      completed: todos.filter((todo) => todo.isCompleted).length,
    }),
    [todos]
  )

  // RSC境界を跨ぐとDateがstringになるため、クライアント側で正規化
  const normalizedTodos = useMemo(() => {
    return todos.map((todo) => ({
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
      createdAt: new Date(todo.createdAt),
    }))
  }, [todos])

  const filteredAndSortedTodos = useMemo(() => {
    // フィルタリング
    let result = normalizedTodos

    // 完了状態フィルタ
    switch (statusFilter) {
      case 'incomplete':
        result = result.filter((todo) => !todo.isCompleted)
        break
      case 'completed':
        result = result.filter((todo) => todo.isCompleted)
        break
    }

    // 重要度フィルタ
    if (priorityFilter) {
      result = result.filter((todo) => todo.priority === priorityFilter)
    }

    // ソート
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'dueDate':
          // nullは最後に
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return result
  }, [normalizedTodos, statusFilter, priorityFilter, sortBy])

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
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
        counts={counts}
      />
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">重要度:</span>
          <PriorityFilter value={priorityFilter} onChange={setPriorityFilter} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">並び順:</span>
          <TodoSortSelect value={sortBy} onChange={setSortBy} />
        </div>
      </div>
      <div className="space-y-3">
        {filteredAndSortedTodos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>該当するToDoがありません</p>
          </div>
        ) : (
          filteredAndSortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              title={todo.title}
              isCompleted={todo.isCompleted}
              memo={todo.memo}
              priority={todo.priority}
              dueDate={todo.dueDate}
            />
          ))
        )}
      </div>
    </div>
  )
}
