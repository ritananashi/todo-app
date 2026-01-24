'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type SortOption = 'createdAt' | 'priority' | 'dueDate'

const sortLabels: Record<SortOption, string> = {
  createdAt: '作成日順',
  priority: '重要度順',
  dueDate: '締切順',
}

interface TodoSortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function TodoSortSelect({ value, onChange }: TodoSortSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createdAt">{sortLabels.createdAt}</SelectItem>
        <SelectItem value="priority">{sortLabels.priority}</SelectItem>
        <SelectItem value="dueDate">{sortLabels.dueDate}</SelectItem>
      </SelectContent>
    </Select>
  )
}
