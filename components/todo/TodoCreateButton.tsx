'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TodoForm } from './TodoForm'

export function TodoCreateButton() {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ タスクを追加</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいタスク</DialogTitle>
          <DialogDescription>
            タイトルとメモを入力して新しいタスクを追加します
          </DialogDescription>
        </DialogHeader>
        <TodoForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
