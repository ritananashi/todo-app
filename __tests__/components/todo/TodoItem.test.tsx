import { render, screen } from '@testing-library/react'
import { TodoItem } from '@/components/todo/TodoItem'

describe('TodoItem', () => {
  const baseTodo = {
    id: 'todo-1',
    title: 'タスク1',
    isCompleted: false,
    memo: null,
  }

  it('should render todo title', () => {
    render(<TodoItem {...baseTodo} />)

    expect(screen.getByText('タスク1')).toBeInTheDocument()
  })

  it('should render incomplete todo without strikethrough', () => {
    render(<TodoItem {...baseTodo} isCompleted={false} />)

    const title = screen.getByText('タスク1')
    expect(title).not.toHaveClass('line-through')
  })

  it('should render completed todo with strikethrough', () => {
    render(<TodoItem {...baseTodo} isCompleted={true} />)

    const title = screen.getByText('タスク1')
    expect(title).toHaveClass('line-through')
  })

  it('should show 未完了 status for incomplete todo', () => {
    render(<TodoItem {...baseTodo} isCompleted={false} />)

    expect(screen.getByText('未完了')).toBeInTheDocument()
  })

  it('should show 完了 status for completed todo', () => {
    render(<TodoItem {...baseTodo} isCompleted={true} />)

    expect(screen.getByText('完了')).toBeInTheDocument()
  })

  it('should render memo when provided', () => {
    render(<TodoItem {...baseTodo} memo="メモ内容" />)

    expect(screen.getByText('メモ内容')).toBeInTheDocument()
  })

  it('should not render memo section when memo is null', () => {
    render(<TodoItem {...baseTodo} memo={null} />)

    expect(screen.queryByText('メモ内容')).not.toBeInTheDocument()
  })
})
