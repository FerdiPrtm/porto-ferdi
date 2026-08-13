# Portofolio Ferdi Pratama

Website portofolio pribadi yang menampilkan profil, project, keahlian, pengalaman, dan pendidikan. Dibangun dengan **Next.js 16 (App Router)**, **Supabase**, dan **Tailwind CSS 4** — lengkap dengan panel admin untuk mengelola konten tanpa menulis kode.

> 🌐 Live demo: https://porto-ferdi.vercel.app

---

## Fitur

- **Halaman publik** — beranda (hero, keahlian, pengalaman, project unggulan), daftar project + filter teknologi, detail project, halaman tentang, dan halaman kontak dengan formulir pesan.
- **Panel admin** (`/admin`) — kelola profil, project, skill, pengalaman, pendidikan, dan inbox pesan.
- **SEO** — `sitemap.xml`, `robots.txt`, Open Graph, dan gambar OG otomatis.
- **Keamanan** — proteksi `is_admin`, RLS (Row Level Security) di database, dan proteksi route `/admin/*`.

## Tech Stack

| Bagian      | Teknologi                                   |
| ----------- | ------------------------------------------- |
| Framework   | Next.js 16 (App Router) + React 19          |
| Bahasa      | TypeScript                                  |
| Styling     | Tailwind CSS 4 + shadcn/ui                  |
| Database    | Supabase (PostgreSQL)                       |
| Autentikasi | Supabase Auth                               |
| Icons       | Lucide React                                |

---

## Cara Menjalankan

### 1. Prasyarat

- [Node.js](https://nodejs.org) versi **20+** (disarankan 22/24)
- Akun [Supabase](https://supabase.com) (gratis)
- Akun [Vercel](https://vercel.com) (untuk deploy)

### 2. Instalasi dependensi

```bash
npm install
```

### 3. Setup database Supabase

1. Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka **SQL Editor**, lalu jalankan seluruh isi file [`supabase/schema.sql`](supabase/schema.sql).
   Skrip ini membuat tabel (`profile`, `projects`, `skills`, `experiences`, `educations`, `messages`), aturan RLS, dan bucket storage.
3. Buat pengguna admin:
   - Buka **Authentication → Users → Add user**, buat akun dengan email & password (mis. `admin@email.com` / password Anda).
   - Jalankan query berikut agar akun tersebut menjadi admin:
     ```sql
     update public.profile
     set is_admin = true
     where id = (select id from auth.users where email = 'email_admin_anda@contoh.com');
     ```

### 4. Konfigurasi environment

Salin `.env.example` menjadi `.env.local`, lalu isi nilainya:

```bash
cp .env.example .env.local
```

| Variabel                    | Sumber                                                              |
| --------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`  | Supabase Dashboard → **Project Settings → API** → `Project URL`     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → **API** → `anon public` key                  |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → **API** → `service_role` key (jangan di-publish) |
| `DATABASE_URL`              | Supabase Dashboard → **Connect** → connection string PostgreSQL      |
| `NEXT_PUBLIC_SITE_URL`      | URL situs, untuk lokal: `http://localhost:3000`                     |

> ⚠️ Jangan pernah commit `.env.local` — file ini sudah masuk `.gitignore`.

### 5. (Opsional) Isi data contoh

Jika ingin langsung melihat data, jalankan skrip seed (butuh pengguna admin di atas):

```bash
node seed-data.mjs
```

Skrip ini mengisi profil, 6 project, 17 skill, 3 pengalaman, dan 2 pendidikan.

### 6. Jalankan development server

```bash
npm run dev
```

Buka **http://localhost:3000**. Situs publik tampil di halaman utama, panel admin di **http://localhost:3000/admin**.

### Perintah lain

```bash
npm run lint   # cek lint
npm run build  # build produksi
npm run start  # jalankan hasil build
```

---

## Deploy ke Vercel

**Opsi A — Git (rekomendasi)**

1. Push repository ini ke GitHub.
2. Di [Vercel Dashboard](https://vercel.com/new), pilih **Add New → Project**, import repo, pilih framework **Next.js**.
3. Tambahkan semua variabel environment dari `.env.local`.
4. Deploy. Setiap `git push` ke branch utama otomatis memicu deploy baru.

**Opsi B — CLI**

```bash
npx vercel --prod
```

Setelah deploy, jangan lupa tambahkan domain sendiri di **Project → Settings → Domains**:

```
A  @  216.198.79.1
A  @  64.29.17.1
```

---

## Struktur Project

```
app/
├─ (public)/          # Halaman publik (beranda, about, projects, contact)
├─ (admin)/           # Halaman admin (/admin/*)
└─ layout.tsx         # Root layout + tema dark
components/
├─ public/            # Komponen publik (project-card, skill-icon, dll.)
├─ admin/             # Komponen admin (form, tombol aksi)
└─ ui/                # Komponen UI shadcn (button, card, input, dll.)
lib/
├─ data.ts            # Query data publik
├─ actions/           # Server actions (pesan, CRUD admin)
├─ supabase/          # Client Supabase + guard admin
└─ validations/       # Validasi Zod
supabase/schema.sql   # Skema database, RLS, dan storage
seed-data.mjs         # Skrip isi data contoh
```

---

## Teknologi Pendukung

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
