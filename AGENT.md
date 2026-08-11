# AGENT.md — Panduan untuk AI Coding Agent

Dokumen ini berisi konteks dan aturan kerja untuk AI agent (Claude Code, Cursor, dll) yang membantu membangun project ini. Baca `PRD.md` terlebih dahulu untuk spesifikasi fitur lengkap sebelum mulai coding.

## Konteks Project

Website portofolio pribadi dengan public site + admin panel, dibangun dengan Next.js (App Router) dan Supabase (Postgres, Auth, Storage). Tidak ada fitur blog. Detail fitur lengkap ada di `PRD.md`.

## Tech Stack & Versi

- Next.js — App Router, Server Components & Server Actions sebagai default, hindari API routes kecuali benar-benar perlu (webhook, dsb)
- Supabase — `@supabase/supabase-js` + `@supabase/ssr` untuk auth di server/client Next.js
- Tailwind CSS + shadcn/ui untuk komponen UI
- React Hook Form + Zod untuk semua form (validasi client & server harus sama-sama pakai schema Zod yang sama)
- TypeScript wajib di seluruh project, no `any` kecuali benar-benar tidak terhindarkan

## Struktur Folder yang Harus Diikuti

```
app/
  (public)/            -> route group untuk halaman publik
  (admin)/admin/        -> route group untuk admin, diproteksi middleware
  api/                  -> hanya jika perlu (webhook dll)
lib/
  supabase/client.ts    -> Supabase client untuk browser
  supabase/server.ts    -> Supabase client untuk server components/actions
  validations/          -> semua Zod schema, satu file per entity
components/
  ui/                   -> komponen shadcn (jangan edit manual, generate via CLI)
  public/                -> komponen khusus public site
  admin/                 -> komponen khusus admin panel
proxy.ts               -> proteksi route /admin (Next 16 mengganti middleware)
```

## Aturan Kerja

1. **Selalu cek `PRD.md`** sebelum implementasi fitur baru untuk memastikan sesuai scope.
2. **Jangan buat tabel/kolom baru** di luar skema pada PRD tanpa konfirmasi ke user terlebih dahulu.
3. **RLS wajib aktif** di setiap tabel baru — jangan pernah biarkan tabel tanpa RLS policy, meskipun untuk testing.
4. **Server-first**: fetch data di Server Component, gunakan Server Actions untuk mutasi (create/update/delete), bukan client-side fetch ke Supabase langsung dari admin panel kecuali untuk kasus real-time atau interaktivitas tinggi.
5. **Validasi ganda**: setiap input form divalidasi dengan Zod schema yang sama di client (React Hook Form) dan di server (dalam Server Action) — jangan percaya input dari client saja.
6. **Env variables**: jangan pernah hardcode Supabase URL/key. Gunakan `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=   # hanya dipakai di server, jangan exposed ke client
   ```
7. **Upload file** (gambar project, avatar, CV) selalu lewat Supabase Storage, simpan hanya URL/path-nya di database, bukan file binary.
8. **Konsistensi penamaan**: tabel & kolom database `snake_case`, variabel/fungsi TypeScript `camelCase`, komponen React `PascalCase`.
9. **Commit kecil dan fokus** — satu fitur/perbaikan per commit, pesan commit jelas (misalnya `feat: admin CRUD projects`, `fix: contact form validation`).
10. **Sebelum menandai fitur selesai**: pastikan sudah dites di mobile viewport, RLS sudah dicek dengan mencoba akses sebagai anon vs admin, dan tidak ada error di console.

## Alur Kerja / Habit Agent

Setiap kali mengerjakan satu task/fitur, agent **wajib** mengikuti siklus berikut secara berurutan. Jangan loncat langsung ke "build" tanpa melalui "read" dan "thinking".

### 1. Read
- Baca ulang `PRD.md` untuk bagian yang relevan dengan task saat ini (fitur, skema tabel, RLS, non-functional requirements).
- Baca ulang `AGENT.md` (dokumen ini) untuk memastikan aturan kerja masih diikuti.
- Cek kode/file yang sudah ada terkait task ini sebelum menulis kode baru — jangan asumsi, verifikasi langsung ke file.

### 2. Thinking
- Sebelum menulis kode, uraikan dulu secara singkat: apa yang mau dibuat, file apa saja yang akan disentuh, dan apakah ada dependensi ke fitur lain.
- Identifikasi edge case (misalnya: form kosong, upload gagal, user tidak login, RLS memblokir akses).
- Jika ada ambiguitas terhadap `PRD.md`, hentikan dan tanyakan ke user (lihat bagian "Yang Harus Ditanyakan").

### 3. Build
- Implementasi sesuai struktur folder dan aturan penamaan yang sudah ditentukan.
- Satu fitur per waktu — jangan mencampur beberapa task berbeda dalam satu batch perubahan.
- Tulis kode TypeScript yang aman (validasi Zod, RLS, dsb) sesuai checklist di "Definition of Done".

### 4. Review
- Baca ulang kode yang baru ditulis seolah-olah sebagai reviewer, bukan penulisnya.
- Cek: apakah sesuai `PRD.md`? Apakah ada error/warning TypeScript? Apakah RLS sudah benar? Apakah responsive?
- Bandingkan hasil build dengan requirement di `PRD.md` poin per poin — jangan hanya cek "jalan atau tidak", tapi "sesuai spek atau tidak".

### 5. Fix
- Perbaiki semua temuan dari tahap Review sebelum lanjut.
- Jika ada bug yang butuh perubahan skema/struktur, kembali ke tahap **Read** untuk cek dampaknya ke bagian lain, jangan langsung tambal di tempat.
- Jangan menandai task selesai jika masih ada known issue yang belum di-fix — laporkan ke user jika issue tersebut butuh keputusan/prioritas.

### 6. Next Step (Grilling)
- Setelah satu task selesai dan lolos review, "grilling" diri sendiri dengan pertanyaan kritis sebelum lanjut ke task berikutnya:
  - Apakah task ini benar-benar selesai sesuai Definition of Done?
  - Apakah ada task lain di `PRD.md` yang jadi prasyarat untuk fitur berikutnya?
  - Apakah ada bagian dari PRD yang perlu diupdate karena keputusan yang diambil saat build?
- Tentukan task berikutnya berdasarkan urutan milestone di `PRD.md` (section 10), bukan berdasarkan preferensi acak.
- Ringkas ke user: apa yang baru selesai, apa yang jadi next step, dan apakah butuh input dari user sebelum lanjut.

> Siklus ini berulang untuk setiap fitur: **Read → Thinking → Build → Review → Fix → Next Step**, lalu kembali ke Read untuk fitur berikutnya.

## Yang Harus Ditanyakan ke User Jika Tidak Jelas

- Struktur/field tambahan yang tidak ada di `PRD.md`
- Perubahan pada skema database yang sudah didefinisikan
- Pilihan desain visual yang signifikan (warna, layout) jika belum ada arahan
- Penambahan dependency/package baru di luar stack yang sudah ditentukan

## Definition of Done per Fitur

- Kode TypeScript tanpa error/warning
- RLS policy sudah dibuat & diverifikasi untuk tabel terkait
- Form (jika ada) tervalidasi di client & server
- Responsive di mobile & desktop
- Tidak ada data sensitif (service role key, dsb) yang bocor ke client bundle
