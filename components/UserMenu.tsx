'use client'

import { useState } from 'react'
import { User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProfileDialog } from '@/components/profile/ProfileDialog'
import { logout } from '@/actions/auth'

interface UserMenuProps {
  name: string | null
  email: string
}

export function UserMenu({ name, email }: UserMenuProps) {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

  const displayName = name && name.trim() !== '' ? name : email

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <User className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{displayName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
            <User className="mr-2 size-4" />
            プロフィール編集
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={logout}>
            <DropdownMenuItem asChild>
              <button type="submit" className="w-full">
                <LogOut className="mr-2 size-4" />
                ログアウト
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        initialName={name}
        initialEmail={email}
      />
    </>
  )
}
