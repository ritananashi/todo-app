'use client'

import { Button } from '@/components/ui/button'

export type FilterType = 'all' | 'incomplete' | 'completed'

interface TodoFilterProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts: {
    all: number
    incomplete: number
    completed: number
  }
}

export function TodoFilter({
  currentFilter,
  onFilterChange,
  counts,
}: TodoFilterProps) {
  const filters: { type: FilterType; label: string }[] = [
    { type: 'all', label: '全件' },
    { type: 'incomplete', label: '未完了' },
    { type: 'completed', label: '完了' },
  ]

  return (
    <div className="flex gap-2 mb-4">
      {filters.map(({ type, label }) => {
        const isActive = currentFilter === type
        return (
          <Button
            key={type}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(type)}
            data-active={isActive}
          >
            {label} ({counts[type]})
          </Button>
        )
      })}
    </div>
  )
}
