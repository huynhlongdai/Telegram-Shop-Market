# TeleShop — Telegram Mini App: Project Plan

## Tổng quan dự án

TeleShop là một Telegram Mini App marketplace giao dịch bằng crypto (TON / USDT), tích hợp trực tiếp vào Telegram. Người dùng có thể mua hàng, mở cửa hàng, quản lý đơn hàng, rút tiền, tạo flash sale, tạo voucher, và tham gia chương trình KOL affiliate — tất cả trong Telegram.

---

## Stack kỹ thuật

| Layer | Công nghệ |
|---|---|
| Monorepo | pnpm workspaces |
| Runtime | Node.js 24, TypeScript 5.9 |
| Frontend | React + Vite (path `/teleshop/`) |
| API | Express 5 (path `/api/`) |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod v3, drizzle-zod |
| API Contract | OpenAPI spec + Orval codegen |
| Build | esbuild (CJS bundle) |
| i18n | i18next + react-i18next |
| Styling | Tailwind CSS |

---

## Cấu trúc thư mục

```
artifacts/
  teleshop/          # React + Vite frontend (TMA)
    src/
      pages/         # Tất cả các trang UI
      components/    # Layout, shared components
      lib/           # auth, i18n, api-client
      locales/       # en.ts, vi.ts, ru.ts, zh.ts
      hooks/         # use-toast, etc.
  api-server/        # Express 5 backend
    src/
      routes/        # products, orders, wallet, admin, ...
      db/            # Drizzle schema + migrations
  mockup-sandbox/    # Canvas design preview server
lib/
  api-spec/          # OpenAPI spec + Orval codegen
  api-client-react/  # Generated React Query hooks
  db/                # Shared Drizzle schema
```

---

## Các trang đã xây dựng

### Người dùng (Buyer)
| Trang | Đường dẫn | Mô tả |
|---|---|---|
| Home | `/` | Trang chủ, flash sale banner, trending products |
| Shop Page | `/shop/:id` | Xem cửa hàng, danh sách sản phẩm |
| Product Detail | `/product/:id` | Chi tiết sản phẩm, thêm vào giỏ |
| Checkout | `/checkout` | Các bước thanh toán |
| Order List | `/orders` | Danh sách đơn hàng của tôi |
| Order Detail | `/orders/:id` | Chi tiết đơn hàng, mở tranh chấp |
| Wallet | `/wallet` | Số dư TON/USDT, rút tiền, lịch sử giao dịch |
| User Profile | `/profile` | Thông tin tài khoản, đổi ngôn ngữ |
| Auth Welcome | `/auth` | Đăng nhập Telegram |
| Affiliate | `/affiliate` | Bảng affiliate dashboard |

### Người bán (Merchant)
| Trang | Đường dẫn | Mô tả |
|---|---|---|
| Merchant Dashboard | `/dashboard` | Doanh thu, đơn hàng, quick actions |
| Order Management | `/orders/manage` | Quản lý đơn hàng |
| Flash Sale | `/flash-sale` | Tạo và quản lý flash sale |
| Voucher | `/vouchers` | Tạo và quản lý voucher/coupon |
| KOL Onboarding | `/kol` | Đăng ký chương trình KOL affiliate |

### Quản trị (Admin)
| Trang | Đường dẫn | Mô tả |
|---|---|---|
| Admin Panel | `/admin` | Stats, quản lý shop, xử lý tranh chấp |

---

## API Routes

| Route | Method | Mô tả |
|---|---|---|
| `/api/products` | GET, POST | Danh sách và tạo sản phẩm |
| `/api/products/:id` | GET, PUT, DELETE | Chi tiết, cập nhật, xóa sản phẩm |
| `/api/orders` | GET, POST | Đặt hàng, xem đơn |
| `/api/orders/:id` | GET, PUT | Chi tiết và cập nhật trạng thái |
| `/api/wallet/balance` | GET | Số dư ví |
| `/api/wallet/withdraw` | POST | Yêu cầu rút tiền |
| `/api/wallet/transactions` | GET | Lịch sử giao dịch |
| `/api/shops` | GET, POST | Danh sách và tạo cửa hàng |
| `/api/shops/my` | GET | Cửa hàng của tôi |
| `/api/vouchers` | GET, POST | Voucher |
| `/api/disputes` | GET, POST | Tranh chấp |
| `/api/affiliate` | GET, POST | Affiliate/KOL |
| `/api/admin/stats` | GET | Thống kê admin |
| `/api/admin/shops` | GET | Danh sách shop pending |
| `/api/admin/disputes` | GET | Danh sách tranh chấp |

---

## i18n — Đa ngôn ngữ

### Ngôn ngữ hỗ trợ
| Code | Tên | Cờ |
|---|---|---|
| `en` | English | 🇺🇸 |
| `vi` | Tiếng Việt | 🇻🇳 |
| `ru` | Русский | 🇷🇺 |
| `zh` | 中文 | 🇨🇳 |

### Logic phát hiện ngôn ngữ (ưu tiên từ cao xuống thấp)
1. **Telegram WebApp locale** — `window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code`
2. **Browser locale** — `navigator.language`
3. **localStorage** — key `teleshop_lang` (lưu khi user tự chọn)
4. **Fallback** — `en`

### Translation keys (namespace)
```
nav.*          — Navigation tabs
home.*         — Home page
auth.*         — Welcome / login
profile.*      — User profile
dashboard.*    — Merchant dashboard
orders.*       — Order list + status
wallet.*       — Wallet page (balance, withdraw, transactions, security)
flashSale.*    — Flash sale creation form
voucher.*      — Voucher management
kol.*          — KOL / affiliate onboarding
admin.*        — Admin panel
dispute.*      — Dispute flow
common.*       — Shared (loading, error, save, cancel, ...)
```

### Locale files
```
artifacts/teleshop/src/locales/
  en.ts    — English (source of truth)
  vi.ts    — Vietnamese
  ru.ts    — Russian
  zh.ts    — Chinese
```

### i18n config
```
artifacts/teleshop/src/lib/i18n.ts
```
- Sử dụng `i18next` + `react-i18next` + `i18next-browser-languagedetector`
- `setLanguage(lang)` — exported function để đổi ngôn ngữ và lưu vào localStorage
- `LANGUAGES` — exported array với `{ code, label, flag }` cho language switcher UI

---

## Database Schema (Drizzle ORM)

### Các bảng chính
| Bảng | Mô tả |
|---|---|
| `users` | Telegram users |
| `shops` | Cửa hàng của merchants |
| `products` | Sản phẩm |
| `orders` | Đơn hàng |
| `order_items` | Chi tiết đơn hàng |
| `wallets` | Số dư ví (TON + USDT) |
| `wallet_transactions` | Lịch sử giao dịch |
| `vouchers` | Voucher / coupon |
| `disputes` | Tranh chấp |
| `affiliates` | Affiliate / KOL |
| `affiliate_referrals` | Referral tracking |

---

## Environment Variables

| Biến | Mô tả |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Port cho mỗi service (tự động từ workflow) |
| `BASE_PATH` | Base path prefix (tự động từ workflow) |

---

## Các lệnh quan trọng

```bash
# Chạy API server
pnpm --filter @workspace/api-server run dev

# Chạy TeleShop frontend
pnpm --filter @workspace/teleshop run dev

# Typecheck toàn bộ project
pnpm run typecheck

# Build toàn bộ
pnpm run build

# Regenerate API hooks từ OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema (dev only)
pnpm --filter @workspace/db run push
```

---

## Roadmap / Việc cần làm tiếp theo

### P0 — Sửa lỗi pre-existing (TypeScript)
- [ ] `src/lib/api-client.ts` — thiếu dependency `axios`
- [ ] `src/lib/auth.tsx` — `queryKey` missing trong UseQueryOptions
- [ ] `src/pages/CheckoutSteps.tsx` — `items` không tồn tại trong `OrderInput`
- [ ] `src/pages/OrderDetail.tsx` — `shippingAddress` không tồn tại trên `Order`
- [ ] `src/pages/OrderManagement.tsx` — `query` param và status type mismatch
- [ ] `src/pages/ProductDetail.tsx` — type `string` không assign được vào `number`
- [ ] `src/pages/ShopPage.tsx` — `queryKey` missing trong UseQueryOptions

### P1 — Tính năng còn thiếu
- [ ] Tích hợp TON Connect / TonKeeper để kết nối ví thật
- [ ] Telegram Bot webhook (xử lý notification khi có đơn hàng mới)
- [ ] Upload ảnh sản phẩm (Object Storage)
- [ ] Hệ thống escrow thực sự (giữ tiền cho đến khi buyer confirm nhận hàng)
- [ ] Push notification qua Telegram Bot
- [ ] Trang Settings (cài đặt tài khoản, commission bot)
- [ ] Trang AffiliateDashboard (link giới thiệu, thống kê)

### P2 — Cải thiện UX
- [ ] Skeleton loading states cho tất cả trang
- [ ] Offline support / PWA
- [ ] Dark/light mode toggle
- [ ] Haptic feedback (Telegram WebApp API)
- [ ] Product image carousel
- [ ] Order tracking real-time

### P3 — Admin & Operations
- [ ] Admin: approve/reject shop với email notification
- [ ] Admin: resolve dispute với payout tự động
- [ ] Fee configuration UI
- [ ] Analytics dashboard (doanh thu theo ngày/tuần/tháng)
- [ ] KYC flow cho merchants

---

## Kiến trúc quan trọng

### API contract-first
Tất cả API được định nghĩa trong OpenAPI spec trước, rồi generate React Query hooks và Zod schemas từ đó. Không viết hooks tay.

### Escrow flow
```
Buyer pays → Escrow locked → Merchant ships → Buyer confirms → Merchant receives
                                            ↓
                                     (dispute) → Admin resolves → Refund/Release
```

### Auth flow
```
Telegram WebApp → initData → POST /api/auth/login → JWT token → localStorage
```

### Proxy routing (Replit)
```
/           → teleshop (React Vite)
/api/*      → api-server (Express 5)
```

---

*Tạo ngày: 31/05/2026*
*Version: 1.0*
