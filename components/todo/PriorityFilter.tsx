'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { priorityValues, priorityLabels, type Priority } from '@/lib/validations/todo'

interface PriorityFilterProps {
  value: Priority | null
  onChange: (value: Priority | null) => void
}

export function PriorityFilter({ value, onChange }: PriorityFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(null)}
        aria-pressed={value === null}
        className={cn(value === null && 'bg-accent text-accent-foreground')}
      >
        全て
      </Button>
      {priorityValues.map((priority) => (
        <Button
          key={priority}
          variant="outline"
          size="sm"
          onClick={() => onChange(priority)}
          aria-pressed={value === priority}
          className={cn(value === priority && 'bg-accent text-accent-foreground')}
        >
          {priorityLabels[priority]}
        </Button>
      ))}
    </div>
  )
}
