'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  priorityValues,
  priorityLabels,
  type Priority,
} from '@/lib/validations/todo'

interface PrioritySelectProps {
  value: Priority
  onChange: (value: Priority) => void
  disabled?: boolean
}

export function PrioritySelect({
  value,
  onChange,
  disabled,
}: PrioritySelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {priorityValues.map((priority) => (
          <SelectItem key={priority} value={priority}>
            {priorityLabels[priority]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
