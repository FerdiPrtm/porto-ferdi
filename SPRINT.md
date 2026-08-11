# SPRINT.md — Sprint Planning

Breakdown pekerjaan dari `PRD.md` (section 10 — Milestone) menjadi sprint yang bisa dieksekusi bertahap. Setiap sprint mengikuti siklus kerja di `AGENT.md` (Read → Thinking → Build → Review → Fix → Next Step).

Asumsi: 1 sprint = 1 sesi kerja fokus (bukan durasi kalender tetap), dikerjakan berurutan. Sprint berikutnya tidak dimulai sebelum Definition of Done sprint sebelumnya terpenuhi.

---

## Sprint 0 — Project Setup

**Tujuan:** fondasi project siap, koneksi Supabase jalan, belum ada fitur.

- [x] Init project Next.js (App Router, TypeScript, Tailwind)
- [x] Install & setup shadcn/ui
- [x] Buat project Supabase, catat URL & anon key
- [x] Setup `.env.local` sesuai format di `AGENT.md`
- [x] Buat `lib/supabase/client.ts` dan `lib/supabase/server.ts` (+ `middleware.ts` helper)
- [x] Struktur folder awal sesuai `AGENT.md` (route groups `(public)`, `(admin)`)
- [x] Push repo awal ke GitHub → `https://github.com/FerdiPrtm/porto-ferdi.git` (branch `master`)

**Definition of Done:** `next dev` jalan tanpa error, koneksi ke Supabase berhasil (test query sederhana).

---

## Sprint 1 — Database & RLS

**Tujuan:** semua tabel di skema PRD section 6 dibuat dengan RLS aktif.

- [x] Buat tabel: `profile`, `projects`, `skills`, `experiences`, `educations`, `messages`
- [x] Buat RLS policy sesuai PRD section 7 (public read, admin write, `messages` insert publik)
- [x] Buat Supabase Storage bucket untuk gambar project & CV (public read, admin write)
- [x] Buat 1 akun admin di Supabase Auth (`admin@email.com`)
- [x] Uji manual: coba insert/update sebagai anon (harus gagal kecuali `messages`), sebagai admin (harus berhasil)

**Definition of Done:** semua tabel ada, RLS terverifikasi manual, tidak ada tabel tanpa policy.

---

## Sprint 2 — Auth & Admin Middleware

**Tujuan:** admin bisa login, route `/admin/*` terproteksi.

- [x] Halaman `/admin/login`
- [x] Server action untuk sign in via Supabase Auth
- [x] `proxy.ts` (konvensi Next 16, pengganti `middleware.ts`) redirect ke `/admin/login` jika belum login dan akses `/admin/*`
- [x] Halaman `/admin/dashboard` kosong (placeholder) sebagai target redirect setelah login
- [x] Tombol logout

**Definition of Done:** akses `/admin/dashboard` tanpa login redirect ke login; setelah login berhasil masuk dashboard; session persist saat refresh.

---

## Sprint 3 — Admin Panel: CRUD Projects

**Tujuan:** admin bisa kelola project sepenuhnya.

- [x] Zod schema untuk `projects` (`lib/validations/project.ts`)
- [x] List projects di admin (tabel + tombol edit/hapus)
- [x] Form tambah project (termasuk upload gambar ke Storage)
- [x] Form edit project
- [x] Delete project (dengan konfirmasi)
- [x] Validasi client (React Hook Form) & server (Server Action) pakai schema yang sama

**Definition of Done:** admin bisa create/read/update/delete project end-to-end, gambar tersimpan di Storage, validasi jalan di kedua sisi.

---

## Sprint 4 — Admin Panel: Skills, Experience, Education, Profile

**Tujuan:** sisa CRUD konten selesai.

- [x] CRUD Skills (nama, kategori, level, icon)
- [x] CRUD Experiences (title, company, deskripsi, tanggal)
- [x] CRUD Educations (school, degree, tanggal)
- [x] Form edit Profile (bio, avatar, cv upload, social links)

**Definition of Done:** semua entity di PRD section 6 (kecuali `messages`) bisa dikelola penuh dari admin panel.

---

## Sprint 5 — Admin Panel: Inbox Messages & Dashboard

**Tujuan:** admin bisa pantau pesan masuk dan ringkasan.

- [ ] List messages (nama, email, isi, tanggal, status baca)
- [ ] Tandai sudah dibaca / hapus pesan
- [ ] Dashboard menampilkan jumlah project & jumlah pesan belum dibaca (data real dari DB)

**Definition of Done:** dashboard menampilkan angka real-time dari database, inbox berfungsi penuh.

---

## Sprint 6 — Public Site: Home, About, Projects

**Tujuan:** halaman publik utama tampil dengan data real dari Supabase.

- [ ] Halaman Home (hero, ringkasan, CTA)
- [ ] Halaman Projects (list/grid, filter tech stack opsional)
- [ ] Halaman Project detail (`/projects/[slug]`)
- [ ] Halaman About (bio, skills, timeline experience & education, tombol download CV)
- [ ] Semua data diambil via Server Component (bukan client fetch)

**Definition of Done:** semua halaman publik menampilkan data yang diinput lewat admin panel, tanpa hardcode.

---

## Sprint 7 — Contact Form

**Tujuan:** visitor bisa kirim pesan.

- [ ] Form contact (nama, email, pesan) dengan validasi Zod
- [ ] Server action insert ke tabel `messages`
- [ ] Feedback UI sukses/gagal ke user
- [ ] (Opsional) notifikasi email ke admin saat ada pesan baru

**Definition of Done:** pesan yang dikirim visitor muncul di admin inbox, validasi & error handling jalan.

---

## Sprint 8 — Polish, SEO, Responsive

**Tujuan:** siap rilis.

- [ ] Responsive check semua halaman (mobile, tablet, desktop)
- [ ] Meta tags dinamis per halaman project, Open Graph image
- [ ] `sitemap.xml` dan `robots.txt`
- [ ] Loading states & error states (skeleton/spinner) di halaman yang fetch data
- [ ] Aksesibilitas dasar (alt text, kontras, semantic HTML)

**Definition of Done:** lolos self-review checklist di `AGENT.md`, tidak ada console error, responsive di semua breakpoint utama.

---

## Sprint 9 — Deploy

**Tujuan:** live di production.

- [ ] Setup project di Vercel, hubungkan repo
- [ ] Set environment variables production di Vercel
- [ ] Deploy & smoke test semua fitur di production URL
- [ ] Setup custom domain (jika ada)

**Definition of Done:** website live, admin panel bisa diakses dan berfungsi di production, tidak ada env/secret yang bocor ke client.

---

## Catatan Prioritas

Urutan sprint di atas **wajib** diikuti secara berurutan karena ada dependency (contoh: Sprint 6 butuh Sprint 3–5 selesai agar ada data untuk ditampilkan). Jika user minta reorder, evaluasi dependency dulu sebelum menyetujui.
