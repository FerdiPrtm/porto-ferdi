# PRD — Website Portofolio + Admin Panel

## 1. Ringkasan Produk

Website portofolio pribadi dengan dua bagian:
- **Public site**: halaman yang dilihat pengunjung untuk melihat profil, project, dan skill pemilik.
- **Admin panel**: dashboard privat untuk mengelola konten (project, skill, pengalaman, pesan masuk) tanpa perlu ubah kode.

**Tidak termasuk dalam scope:** fitur blog/artikel.

## 2. Tujuan

- Menampilkan profil profesional secara publik agar mudah diakses recruiter/klien.
- Memungkinkan pemilik memperbarui konten (project baru, skill, pengalaman) sendiri lewat admin panel, tanpa deploy ulang kode.
- Menerima pesan/kontak dari pengunjung dan mengelolanya dari satu tempat.

## 3. Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js (App Router) |
| Database & Auth | Supabase (Postgres, Auth, Storage) |
| Styling | Tailwind CSS + shadcn/ui |
| Form & Validasi | React Hook Form + Zod |
| Deployment | Vercel (app) + Supabase Cloud (backend) |

## 4. User Roles

- **Visitor** (publik, tanpa login): hanya bisa lihat data (read-only).
- **Admin** (1 akun, pemilik portofolio): login untuk CRUD semua konten.

## 5. Scope Fitur

### 5.1 Public Site

| Halaman | Deskripsi |
|---|---|
| Home | Hero section (nama, tagline, foto), ringkasan singkat, CTA ke project & contact |
| Projects (list) | Grid/list semua project, dengan filter berdasarkan tech stack (opsional) |
| Project detail | Deskripsi lengkap, gambar, tech stack, link demo & repo |
| About | Bio lengkap, daftar skill, timeline pengalaman kerja & pendidikan, tombol download CV |
| Contact | Form (nama, email, pesan) yang tersimpan ke database; feedback sukses/gagal ke user |

### 5.2 Admin Panel

| Halaman | Deskripsi |
|---|---|
| Login | Autentikasi via Supabase Auth (email + password) |
| Dashboard | Ringkasan: jumlah project, jumlah pesan belum dibaca |
| Kelola Projects | List, tambah, edit, hapus project; upload gambar ke Supabase Storage |
| Kelola Skills | List, tambah, edit, hapus skill (nama, kategori, level) |
| Kelola Experience & Education | CRUD riwayat kerja dan pendidikan |
| Kelola Profile | Edit data diri (nama, bio, foto, social links, file CV) |
| Inbox Messages | List pesan dari contact form, tandai sudah dibaca, hapus |

## 6. Skema Database (Supabase)

```sql
-- profile (single row, data pemilik)
profile (
  id uuid primary key,
  full_name text,
  tagline text,
  bio text,
  avatar_url text,
  cv_url text,
  email text,
  social_links jsonb, -- {github, linkedin, twitter, ...}
  updated_at timestamptz
)

-- projects
projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  tech_stack text[],
  image_url text,
  demo_url text,
  repo_url text,
  is_featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
)

-- skills
skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text, -- e.g. "Frontend", "Backend", "Tools"
  level smallint, -- 1-5
  icon text,
  sort_order int default 0
)

-- experiences
experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  description text,
  start_date date,
  end_date date, -- null = masih berjalan
  sort_order int default 0
)

-- educations
educations (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text,
  start_date date,
  end_date date,
  sort_order int default 0
)

-- messages
messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
)
```

## 7. Row Level Security (RLS)

- Semua tabel: **SELECT** terbuka untuk publik (anon).
- Semua tabel kecuali `messages`: **INSERT/UPDATE/DELETE** hanya untuk role `authenticated` yang merupakan admin (dicek via `auth.uid()` yang cocok dengan admin user id, atau kolom `is_admin`).
- Tabel `messages`: **INSERT** terbuka untuk publik (agar visitor bisa kirim pesan tanpa login), **SELECT/UPDATE/DELETE** hanya admin.
- Supabase Storage bucket untuk gambar project & CV: **read public**, **write hanya admin**.

## 8. Non-Functional Requirements

- **Responsive**: mobile-first, harus rapi di layar HP hingga desktop.
- **Performance**: pakai Server Components untuk data fetching di public site agar cepat & SEO-friendly.
- **SEO**: meta tags dinamis per halaman project, sitemap.xml, Open Graph image.
- **Security**: admin routes diproteksi middleware; validasi input di client & server (Zod); RLS aktif di semua tabel.
- **Aksesibilitas dasar**: kontras warna cukup, semantic HTML, alt text gambar.

## 9. Out of Scope (v1)

- Blog/artikel
- Multi-admin / role management
- Komentar pada project
- Analytics dashboard custom (bisa pakai Vercel Analytics eksternal)

## 10. Milestone / Fase Pengerjaan

1. Setup project Next.js + Supabase, konfigurasi env & koneksi
2. Buat schema database + RLS policies
3. Implementasi Supabase Auth + middleware proteksi `/admin`
4. Bangun Admin Panel (CRUD Projects → Skills → Experience/Education → Profile → Messages)
5. Bangun Public Site, konsumsi data dari Supabase
6. Contact form + integrasi Storage (upload gambar/CV)
7. Styling, responsive polish, SEO metadata
8. Testing menyeluruh + deploy ke Vercel
