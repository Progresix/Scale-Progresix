# Scale Progresix - Toko Produk Digital

<p align="center">
  <img src="public/icon.svg" alt="Scale Progresix Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Toko produk digital modern dengan guest checkout, pembayaran Midtrans, dan pengiriman email otomatis.</strong>
</p>

<p align="center">
  <a href="#deskripsi">Deskripsi</a> •
  <a href="#fitur">Fitur</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#instalasi">Instalasi</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 📖 Deskripsi

**Scale Progresix** adalah platform e-commerce produk digital yang dibangun dengan teknologi modern. Pengguna dapat membeli produk digital tanpa perlu registrasi akun (guest checkout), membayar melalui berbagai metode pembayaran via Midtrans, dan menerima produk secara otomatis melalui email.

### 🎯 Fitur Utama

- **🛒 Guest Checkout** - Pembelian tanpa registrasi akun
- **💳 Pembayaran Midtrans** - Support berbagai metode (QRIS, E-Wallet, Bank Transfer, Kartu Kredit)
- **📧 Email Otomatis** - Konfirmasi pembelian dengan link download
- **🌙 Dark Mode** - Tampilan gelap untuk kenyamanan mata
- **📱 Responsive** - Optimal di desktop, tablet, dan mobile
- **🔐 Admin Dashboard** - Kelola produk, transaksi, dan pelanggan
- **⚡ Performa Tinggi** - ISR, lazy loading, dan optimasi gambar

---

## 🛠 Tech Stack

| Teknologi | Penggunaan |
|-----------|------------|
| **Next.js 16** | Framework React dengan App Router |
| **TypeScript** | Type safety dan developer experience |
| **Tailwind CSS 4** | Styling dengan utility-first |
| **Supabase** | Database, Authentication, Storage |
| **Midtrans Snap** | Payment gateway Indonesia |
| **Resend** | Email delivery service |
| **Framer Motion** | Animasi UI yang smooth |
| **shadcn/ui** | Komponen UI yang accessible |
| **Vercel** | Deployment dan hosting |

---

## 📁 Struktur Folder

```
scale-progresix/
├── 📁 public/                 # Static assets
│   ├── icon.svg              # Logo aplikasi
│   ├── favicon.ico           # Browser favicon
│   └── manifest.json         # PWA manifest
│
├── 📁 src/
│   ├── 📁 app/               # Next.js App Router
│   │   ├── 📁 (marketing)/   # Halaman publik
│   │   │   ├── page.tsx      # Landing page
│   │   ├── 📁 (auth)/        # Halaman autentikasi
│   │   │   ├── login/        # Login admin
│   │   ├── 📁 dashboard/     # Admin dashboard
│   │   │   ├── admin/        # CRUD produk & transaksi
│   │   ├── 📁 api/           # API Routes
│   │   │   ├── auth/         # Autentikasi API
│   │   │   ├── admin/        # Admin API
│   │   │   ├── midtrans/     # Webhook Midtrans
│   │   └── 📁 components/    # Komponen React
│       ├── 📁 ui/            # shadcn/ui components
│       ├── 📁 shared/        # Shared components
│       └── 📁 admin/         # Admin-specific components
│
├── 📁 lib/                   # Utilities & helpers
│   ├── supabase/             # Supabase client
│   ├── midtrans.ts           # Midtrans integration
│   ├── resend.ts             # Email service
│   └── rate-limit.ts         # Rate limiting
│
├── 📁 types/                 # TypeScript types
│   └── database.ts           # Database schema types
│
├── .env.local               # Environment variables
├── next.config.ts           # Next.js config
├── tailwind.config.ts       # Tailwind config
└── package.json             # Dependencies
```

---

## 🗄 Skema Database

### Tabel `products`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(255) | Nama produk |
| `slug` | VARCHAR(255) | URL-friendly identifier |
| `description` | TEXT | Deskripsi produk |
| `price` | INTEGER | Harga dalam IDR |
| `image_url` | TEXT | URL gambar produk |
| `file_url` | TEXT | Path file di Supabase Storage |
| `is_active` | BOOLEAN | Status aktif/nonaktif |
| `created_at` | TIMESTAMP | Tanggal dibuat |
| `updated_at` | TIMESTAMP | Tanggal diupdate |

### Tabel `transactions`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | UUID | Primary key |
| `product_id` | UUID | Foreign key ke products |
| `amount` | INTEGER | Jumlah pembayaran |
| `status` | ENUM | Status: pending, success, failed, expired |
| `midtrans_order_id` | VARCHAR | Order ID dari Midtrans |
| `payment_type` | VARCHAR | Metode pembayaran |
| `guest_email` | VARCHAR(255) | Email pembeli |
| `guest_name` | VARCHAR(255) | Nama pembeli |
| `created_at` | TIMESTAMP | Tanggal transaksi |
| `updated_at` | TIMESTAMP | Tanggal update |

### Storage Buckets

| Bucket | Akses | Kegunaan |
|--------|-------|----------|
| `product-images` | Public | Gambar produk |
| `product-files` | Private | File produk digital |

---

## ⚙️ Instalasi

### Prasyarat

- Node.js 18+ atau Bun
- Akun Supabase
- Akun Midtrans (sandbox untuk development)
- Akun Resend (opsional, untuk email)

### Langkah Instalasi

1. **Clone Repository**

```bash
git clone https://github.com/username/scale-progresix.git
cd scale-progresix
```

2. **Install Dependencies**

```bash
# Menggunakan bun (recommended)
bun install

# atau npm
npm install
```

3. **Setup Environment Variables**

Buat file `.env.local` di root folder:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx

# Resend (opsional)
RESEND_API_KEY=re_xxxxx

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Setup Supabase Database**

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Buat tabel products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  image_url TEXT,
  file_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat tabel transactions
CREATE TYPE transaction_status AS ENUM ('pending', 'success', 'failed', 'expired');

CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  status transaction_status DEFAULT 'pending',
  midtrans_order_id VARCHAR(255) UNIQUE,
  payment_type VARCHAR(50),
  guest_email VARCHAR(255) NOT NULL,
  guest_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat trigger untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Buat index untuk performa
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_midtrans_order_id ON transactions(midtrans_order_id);
CREATE INDEX idx_transactions_guest_email ON transactions(guest_email);

-- Buat storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('product-files', 'product-files', false);

-- Policy untuk product-images (public read)
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin write access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('product-images', 'product-files') AND auth.role() = 'authenticated');

CREATE POLICY "Admin update access" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('product-images', 'product-files') AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete access" ON storage.objects
  FOR DELETE USING (bucket_id IN ('product-images', 'product-files') AND auth.role() = 'authenticated');
```

5. **Buat Admin User**

Di Supabase Dashboard:
1. Buka **Authentication** > **Users**
2. Klik **Add User** > **Create new user**
3. Masukkan email dan password admin
4. Buka **Table Editor** > buat tabel `admin_users`:

```sql
CREATE TABLE admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user (ganti dengan user ID dari auth.users)
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin' FROM auth.users WHERE email = 'admin@example.com';
```

6. **Jalankan Development Server**

```bash
bun dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

| Variable | Required | Deskripsi |
|----------|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Anon key untuk client-side |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key untuk admin operations |
| `MIDTRANS_SERVER_KEY` | ✅ | Server key dari Midtrans dashboard |
| `MIDTRANS_CLIENT_KEY` | ✅ | Client key dari Midtrans dashboard |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | ✅ | Client key untuk frontend |
| `RESEND_API_KEY` | ❌ | API key Resend untuk email |
| `NEXT_PUBLIC_BASE_URL` | ❌ | Base URL aplikasi (default: localhost:3000) |

---

## 🚀 Deployment ke Vercel

### Langkah Deploy

1. **Push ke GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect ke Vercel**

1. Buka [vercel.com](https://vercel.com)
2. Klik **New Project**
3. Import repository GitHub
4. Framework preset: **Next.js** (auto-detect)

3. **Tambah Environment Variables**

Di Vercel Dashboard:
1. Buka project > **Settings** > **Environment Variables**
2. Tambahkan semua variable dari `.env.local`

4. **Deploy**

Vercel akan otomatis deploy setiap push ke branch `main`.

### Konfigurasi Midtrans untuk Production

1. Buka [dashboard.midtrans.com](https://dashboard.midtrans.com)
2. Ganti ke mode **Production**
3. Update environment variables dengan production keys
4. Tambahkan webhook URL: `https://yourdomain.com/api/midtrans/webhook`

---

## 📱 Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Product Detail
![Product Detail](docs/screenshots/product-detail.png)

### Checkout
![Checkout](docs/screenshots/checkout.png)

### Admin Dashboard
![Admin Dashboard](docs/screenshots/dashboard.png)

---

## 🧪 Testing

### Payment Testing (Sandbox Midtrans)

| Metode | Nomor/Card |
|--------|------------|
| **Credit Card** | `4811 1111 1111 1111` (Visa) |
| **CVV** | `123` |
| **Expiry** | Bulan depan |
| **Gopay/QRIS** | Scan QR di app |

### Email Testing

Tanpa Resend API key, sistem akan berjalan dalam mode demo dan menampilkan link download langsung.

---

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

---

## 📄 Lisensi

MIT License - lihat [LICENSE](LICENSE) untuk detail.

---

## 👨‍💻 Author

**Scale Progresix Team**

- Website: [scaleprogresix.com](https://scaleprogresix.com)
- Email: support@scaleprogresix.com

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) - Komponen UI yang beautiful
- [Midtrans](https://midtrans.com) - Payment gateway Indonesia
- [Supabase](https://supabase.com) - Backend as a Service
- [Resend](https://resend.com) - Email API yang modern
- [Framer Motion](https://framer.com/motion) - Animasi React

---

<p align="center">
  Dibuat dengan ❤️ menggunakan Next.js dan Supabase
</p>
