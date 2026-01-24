'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BasicInfoForm } from './BasicInfoForm'
import { PasswordForm } from './PasswordForm'

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialName: string | null
  initialEmail: string
}

export function ProfileDialog({
  open,
  onOpenChange,
  initialName,
  initialEmail,
}: ProfileDialogProps) {
  const handleBasicInfoSuccess = () => {
    // 基本情報更新成功時の処理（必要に応じてトースト表示など）
  }

  const handlePasswordSuccess = () => {
    // パスワード変更成功時の処理（必要に応じてトースト表示など）
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>プロフィール編集</DialogTitle>
          <DialogDescription>
            プロフィール情報やパスワードを変更できます
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-4">基本情報</h3>
            <BasicInfoForm
              initialName={initialName}
              initialEmail={initialEmail}
              onSuccess={handleBasicInfoSuccess}
            />
          </section>

          <div className="border-t" />

          <section>
            <h3 className="text-lg font-medium mb-4">パスワード変更</h3>
            <PasswordForm onSuccess={handlePasswordSuccess} />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
