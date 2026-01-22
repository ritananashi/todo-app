# CLAUDE.md - Todo App

このファイルはClaude Codeがこのリポジトリで作業する際のガイドラインです。

## プロジェクト概要

Next.js 16で構築されたフルスタックTodoアプリケーション。

- **本番URL**: https://todo-app-weld-zeta.vercel.app/
- **データベース**: PostgreSQL (Supabase)
- **認証**: NextAuth.js v5

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16.1.3 (App Router) |
| 言語 | TypeScript 5 (strict mode) |
| UI | React 19.2.3, shadcn/ui, Tailwind CSS v4 |
| ORM | Prisma 7.2.0 |
| 認証 | NextAuth.js 5.0.0-beta.30 |
| バリデーション | Zod 4.3.5, React Hook Form |
| テスト | Jest 30.2.0, Testing Library |

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動 (localhost:3000)
npm run build    # 本番ビルド (Prisma generate + migrate含む)
npm run start    # 本番サーバー起動
npm run lint     # ESLint実行
npm run test     # Jestテスト実行
npm run test -- --watch          # テストをウォッチモードで実行
npm run test -- --coverage       # カバレッジレポート付きテスト
npx prisma studio                # Prisma Studio (DBビューア)
npx prisma migrate dev           # マイグレーション作成・実行
npx prisma generate              # Prisma Client生成
```

## 開発フロー (TDD + プルリクエスト)

### 1. ブランチ戦略

```
main (保護ブランチ)
  └── feature/xxx  # 機能開発
  └── fix/xxx      # バグ修正
  └── refactor/xxx # リファクタリング
```

**命名規則**: `<type>/<short-description>`
- 例: `feature/add-todo-edit`, `fix/login-validation`, `refactor/todo-list`

### 1.5 計画とIssue管理

Plan modeで計画を立てた後は、必ずGitHub issueを作成する。

```bash
# issueを作成
gh issue create --title "<type>: <タイトル>" --body "## 概要
...

## 実装タスク
- [ ] タスク1
- [ ] タスク2
..."
```

**ルール**:
- 計画完了後、実装開始前にissueを作成する
- issueには実装タスクをチェックリスト形式で記載する
- コミットメッセージに `Refs #<issue番号>` を含める
- PRに `Closes #<issue番号>` を含めてissueと紐づける

### 2. TDD開発サイクル (Red-Green-Refactor)

新機能・修正を実装する際は、必ず以下の順序で進める：

#### Step 1: Red (テストを先に書く)
```bash
# 1. featureブランチを作成
git checkout -b feature/add-new-feature

# 2. 失敗するテストを書く
# __tests__/ または *.test.ts(x) にテストを作成
npm run test -- --watch
```

#### Step 2: Green (テストを通す最小限の実装)
```bash
# 3. テストが通る最小限のコードを実装
# 4. テストがパスすることを確認
npm run test
```

#### Step 3: Refactor (リファクタリング)
```bash
# 5. テストを維持しながらコードを改善
# 6. lint・型チェックを実行
npm run lint
npx tsc --noEmit
```

### 3. Codex MCPによるコードレビュー (PR作成前必須)

プルリクエストを作成する前に、必ずCodex MCPを使用してコードレビューを受ける。
**指摘事項がなくなるまで、レビュー→修正のサイクルを繰り返すこと。**

#### レビューサイクル

```
┌─────────────────────────────────────────────────────┐
│  1. Codex MCPでコードレビューを依頼                   │
│     ↓                                               │
│  2. レビュー結果を確認                               │
│     ↓                                               │
│  3. 指摘事項あり? ─→ Yes ─→ コードを修正 ─→ 1へ戻る  │
│     ↓ No                                            │
│  4. PR作成へ進む                                     │
└─────────────────────────────────────────────────────┘
```

#### Codex MCPの使用方法

```
# コードレビューを依頼
mcp__codex__codex を使用して、変更したファイルのレビューを依頼する

# レビュー依頼時に含める情報:
# - 変更したファイルの一覧
# - 変更の目的・意図
# - 特に確認してほしいポイント
```

#### レビュー観点

Codex MCPは以下の観点でレビューを行う:

- **コード品質**: 可読性、保守性、命名規約
- **セキュリティ**: 脆弱性、入力バリデーション
- **パフォーマンス**: 非効率な処理、N+1問題
- **TypeScript**: 型安全性、any の使用
- **テスト**: カバレッジ、エッジケース
- **ベストプラクティス**: React/Next.js の慣例

#### 修正のルール

- 全ての指摘事項に対応する（対応しない場合は理由を明記）
- 修正後は再度テストを実行して確認
- 指摘がゼロになるまでレビューサイクルを継続

### 4. プルリクエスト作成

Codex MCPのレビューで指摘事項がなくなったら、PRを作成する。

```bash
# 7. 変更をコミット
git add .
git commit -m "<type>: <description>"

# 8. リモートにプッシュ
git push -u origin feature/add-new-feature

# 9. PRを作成
gh pr create --title "<title>" --body "## Summary
- 変更内容の説明

## Codex Review
- [x] Codex MCPによるコードレビュー完了
- [x] 全ての指摘事項を修正済み

## Test Plan
- [ ] テストが全てパスする
- [ ] 新規テストを追加した
- [ ] lint/型エラーがない"
```

### 5. コミット規約

#### コミットの粒度

**重要**: 変更を加えたら、1つの論理的な単位（小さなステップ）ごとに必ずコミットする。

- 大きな変更は小さなタスクに分割し、分割ごとにコミットする
- 1つのコミットは1つの目的に集中する
- テストと実装は同じコミットに含めてよい

**良い例**:
```bash
git commit -m "test: Jest環境セットアップ"
git commit -m "feat: Headerコンポーネントを追加"
git commit -m "feat: トップページを実装"
git commit -m "feat: レイアウトにHeaderを追加"
```

**悪い例**:
```bash
# 1つのコミットに複数の変更を含めない
git commit -m "feat: Headerとトップページとレイアウトを実装"
```

#### コミットメッセージ形式

```
<type>: <description>

Refs #<issue番号>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

#### type一覧

| type | 説明 |
|------|------|
| feat | 新機能 |
| fix | バグ修正 |
| refactor | リファクタリング |
| test | テスト追加・修正 |
| docs | ドキュメント |
| style | フォーマット変更 |
| chore | ビルド・設定変更 |

## ディレクトリ構造

```
todo-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   └── globals.css         # グローバルスタイル
├── components/             # Reactコンポーネント
│   └── ui/                 # shadcn/uiコンポーネント
├── lib/                    # ユーティリティ
│   ├── prisma.ts           # Prismaクライアント
│   └── utils.ts            # ヘルパー関数
├── prisma/
│   ├── schema.prisma       # DBスキーマ定義
│   └── migrations/         # マイグレーション履歴
├── __tests__/              # テストファイル (推奨配置)
└── src/generated/prisma/   # 自動生成 (編集不可)
```

## テストガイドライン

### テストファイルの配置

```
# 方法1: __tests__ディレクトリ (推奨)
__tests__/
├── components/
│   └── TodoItem.test.tsx
├── lib/
│   └── utils.test.ts
└── app/
    └── api/
        └── todos.test.ts

# 方法2: コロケーション
components/
├── TodoItem.tsx
└── TodoItem.test.tsx
```

### テスト命名規約

```typescript
describe('TodoItem', () => {
  it('should render todo title', () => {})
  it('should toggle completion when clicked', () => {})
  it('should call onDelete when delete button clicked', () => {})
})
```

### テストユーティリティ

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
```

## コーディング規約

### TypeScript

- `strict: true` を維持する
- `any` の使用を避ける
- 型は明示的に定義する

### インポートパス

```typescript
// パスエイリアスを使用
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'
```

### コンポーネント

```typescript
// 関数コンポーネント + TypeScript
interface Props {
  title: string
  isCompleted: boolean
}

export function TodoItem({ title, isCompleted }: Props) {
  return (...)
}
```

### Server Actions / API Routes

```typescript
// Zodでバリデーション
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1).max(100),
  memo: z.string().optional(),
})
```

## データベースモデル

### 主要モデル

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  todos     Todo[]
}

model Todo {
  id          String   @id @default(cuid())
  userId      String
  title       String
  memo        String?
  isCompleted Boolean  @default(false)
  user        User     @relation(...)
}
```

## 環境変数

開発環境では `.env` ファイルを使用:

```bash
DATABASE_URL="postgresql://..."    # Prisma接続用
DIRECT_URL="postgresql://..."      # マイグレーション用
AUTH_SECRET="..."                  # Auth.js用
AUTH_URL="http://localhost:3000"   # Auth.js用（本番はhttpsのURL）
```

## PRマージ前チェックリスト

- [ ] `npm run test` が全てパス
- [ ] `npm run lint` がエラーなし
- [ ] `npx tsc --noEmit` が型エラーなし
- [ ] 新機能にはテストを追加
- [ ] **Codex MCPによるコードレビュー完了（指摘事項ゼロ）**
- [ ] PRの説明が明確
