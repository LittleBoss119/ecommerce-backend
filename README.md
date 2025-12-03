# E-commerce Backend

Backend sederhana untuk aplikasi e-commerce dengan autentikasi JWT dan role-based access control (RBAC) menggunakan Node.js, Express, dan Prisma (SQLite).

Proyek ini hanya mencakup **backend server** (REST API), tanpa frontend. Cocok untuk latihan, integrasi dengan frontend terpisah, atau bahan tugas kuliah.

## Fitur Utama

- **Autentikasi & Otorisasi**
  - Register & login user dengan JWT.
  - Role-based access control:
    - `USER` → belanja, kelola cart, buat order, lihat riwayat order.
    - `ADMIN` → kelola produk, lihat & update status semua order.
- **Manajemen Produk**
  - Admin dapat membuat, mengubah, menghapus produk.
  - Endpoint publik untuk list & detail produk.
- **Cart (Keranjang Belanja)**
  - Setiap user punya 1 cart.
  - Tambah produk ke cart, update quantity, hapus item.
  - Perhitungan total otomatis berdasarkan harga produk.
- **Order**
  - Checkout dari cart → membuat order dengan status awal `PENDING`.
  - User bisa melihat riwayat order miliknya.
- **Admin Order Management**
  - Admin bisa melihat semua order.
  - Admin bisa mengubah status order (misalnya `PENDING` → `PAID` → `SHIPPED` → `COMPLETED`).

## Teknologi

- **Node.js**
- **Express**
- **Prisma ORM** (v6) + **SQLite**
- **JWT** untuk autentikasi
- **bcrypt** untuk hashing password
- **dotenv** untuk environment variables
- **nodemon** untuk development

## Struktur Project (ringkas)

```text
.
├─ prisma/
│  ├─ schema.prisma       # Definisi model database (User, Product, Cart, Order, dll)
│  └─ migrations/         # Hasil prisma migrate dev
├─ src/
│  ├─ app.js              # Inisialisasi Express app, middleware, routes
│  ├─ server.js           # Entry point server (listen ke PORT)
│  ├─ config/             # Konfigurasi (mis. prisma client, env helper)
│  ├─ middlewares/        # Middleware auth, error handler, dll
│  ├─ routes/             # Route definitions (auth, products, cart, orders, admin)
│  └─ controllers/        # Logic utama per endpoint
├─ createAdmin.js         # Script untuk membuat admin user awal
├─ dev.db                 # Database SQLite (bisa dihapus & regenerate)
├─ package.json
└─ .env (tidak di-commit)
