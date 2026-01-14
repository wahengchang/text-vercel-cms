# Project Architecture: Vercel Full-Stack Blog & CMS

## 1. 項目概述 (Overview)
本專案旨在構建一個現代化、高性能且 SEO 友好的全棧部落格系統。採用 "The Vercel Way" 開發模式，利用 Next.js App Router 與 Serverless 生態系，實現低成本、高擴展性的部署。系統分為面向公眾的 前台展示端 (Public Blog) 與 面向管理員的 後台管理端 (Admin CMS)。

## 2. 技術棧清單 (Tech Stack)
| 層級 (Layer) | 技術選型 (Technology) | 用途說明 (Description) |
| --- | --- | --- |
| Framework | Next.js 14+ (App Router) | 核心框架，負責路由、SSR 渲染與 API (Server Actions)。 |
| Database | Vercel Postgres | Serverless SQL 資料庫，存放文章內容與元數據。 |
| ORM | Prisma | 定義數據結構與類型安全的數據庫操作。 |
| Storage | Vercel Blob | 對象存儲，用於存放文章封面圖 (Cover Images) 與媒體資源。 |
| Auth | Auth.js (v5) Credentials | 身份驗證與路由保護（Email + Password）。 |
| UI Components | Shadcn UI + Tailwind CSS | 快速構建 Admin 後台介面 (Table, Dialog, Form)。 |
| Editor | Novel (Based on Tiptap) | Notion 風格的 WYSIWYG 編輯器，支援 AI 擴展。 |

## 3. 數據庫設計 (Database Schema)
系統使用 PostgreSQL 作為核心數據庫，並透過 Prisma 進行管理。

### Schema 定義 (schema.prisma)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 核心文章模型
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique // URL 友好的文章標識 (e.g. /blog/hello-world)
  content     String   // 存儲 HTML 或 JSON (Novel Output)
  coverImage  String?  // 存儲 Vercel Blob URL
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 關聯設定
  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  String?
  tags        Tag[]     // Implicit Many-to-Many 關係
}

// 分類模型 (單選)
model Category {
  id    String @id @default(cuid())
  name  String
  posts Post[]
}

// 標籤模型 (多選)
model Tag {
  id    String @id @default(cuid())
  name  String
  posts Post[]
}
```

## 4. 系統模組詳解 (Core Modules)

### A. 前台展示端 (Frontend - Public)
- 渲染策略: 全面採用 SSR (Server Side Rendering) 以獲得最佳 SEO 分數。
- 動態 Metadata: 利用 Next.js generateMetadata API，根據文章內容動態生成 `<title>` 和 `<meta description>`。
- 路由結構:
  - `/`: 首頁，展示文章列表。
  - `/blog/[slug]`: 文章詳情頁。

### B. 後台管理與認證 (Admin & Auth)
- 路由保護: 使用 `/admin/*` 作為後台路由前綴，利用 `layout.tsx` 或 `middleware.ts` 攔截所有 `/admin/*` 請求。
- 登入方式: 僅允許 Email + Password 登入（Credentials Provider）。
- CMS 介面: 使用 Shadcn UI 的 DataTable 實現文章管理（分頁、搜尋、狀態切換）。

### C. 內容編輯與存儲 (Editor & Storage)
- 編輯器 (Novel): 集成 Novel React 組件，提供 `/` 指令選單與 Markdown 支援。
- (可選) 配置 OpenAI API Key 以啟用 AI 續寫功能。
- 圖片上傳流程:
  1. 前端 Admin 介面選擇圖片 (`<input type="file">`)。
  2. 觸發 Server Action。
  3. 後端調用 `@vercel/blob` SDK 上傳圖片。
  4. 返回圖片 URL 並存入 Prisma 的 `coverImage` 欄位。

## 5. 路由一覽 (Routing)
| Route | Page | Description | Auth |
| --- | --- | --- | --- |
| `/` | Home | 文章列表與最新內容預覽。 | Public |
| `/blog/[slug]` | Post | 文章詳情頁，動態 SEO Metadata。 | Public |
| `/category` | Categories | 分類列表頁，展示所有分類。 | Public |
| `/category/[slug]` | Category | 分類頁，顯示該分類下的文章列表。 | Public |
| `/tag` | Tags | 標籤列表頁，展示所有標籤。 | Public |
| `/tag/[slug]` | Tag | 標籤頁，顯示該標籤下的文章列表。 | Public |
| `/admin/login` | Admin Login | Email + Password 登入。 | Public |
| `/admin` | Admin Home | 後台儀表板與內容概覽。 | Auth required |
| `/admin/posts` | Posts | 文章列表管理（搜尋、分頁、狀態切換）。 | Auth required |
| `/admin/posts/new` | New Post | 建立文章與編輯器介面。 | Auth required |
| `/admin/posts/[id]` | Edit Post | 編輯文章內容與發布狀態。 | Auth required |
| `/admin/categories` | Categories | 分類管理（新增、編輯、刪除）。 | Auth required |
| `/admin/tags` | Tags | 標籤管理（新增、編輯、刪除）。 | Auth required |

## 6. 開發環境變數 (Environment Variables)
專案運行所需的 `.env` 變數清單：

```bash
# Database (Vercel Postgres)
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# Auth (Auth.js)
AUTH_SECRET="your-random-secret-key"
# 如果使用簡易密碼模式
# ADMIN_EMAIL 為選填，可限制單一管理員信箱
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-secure-password"

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# AI (Optional for Novel Editor)
OPENAI_API_KEY="sk-..."
```

## 7. NPM 套件清單 (Packages)
以下為專案常用套件的整理，方便一次性規劃與安裝。

### A. Core / Framework
- `next`
- `react`
- `react-dom`

### B. TypeScript / Tooling
- `typescript`
- `eslint`
- `eslint-config-next`

### C. Styling / UI
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `tailwindcss-animate`
- `lucide-react`
- `@radix-ui/react-*` (Dialog, Dropdown, Popover, Tabs, etc.)
- `@tanstack/react-table` (Admin 表格)
- `react-hook-form`
- `zod`
- `@hookform/resolvers`

### D. Auth (Email + Password)
- `next-auth`

### E. Database / ORM
- `prisma`
- `@prisma/client`
- `@vercel/postgres`

### F. Storage
- `@vercel/blob`

### G. Editor
- `@tiptap/react`
- `@tiptap/starter-kit`
- `novel` (若採用 Novel 編輯器封裝)

### H. Optional
- `openai` (Novel AI 續寫)

## 8. 實作路徑圖 (Implementation Roadmap)
- Init: 使用 create-next-app 初始化專案，安裝 Tailwind 與 Shadcn UI。
- DB Setup: 設置 Vercel Postgres，編寫 Prisma Schema 並執行 db push。
- Auth Layer: 實作 `/admin` 路由保護與登入頁面。
- CMS Logic: 集成 Novel 編輯器、實作 Blob 上傳 Server Action、實作 Post 的 CRUD 操作。
- Public UI: 根據 Prisma 數據渲染前台部落格頁面。
