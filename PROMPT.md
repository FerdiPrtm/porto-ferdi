# PROMPT.md — Starter Prompt untuk AI Coding Agent

Prompt siap pakai untuk memulai sesi kerja dengan AI coding agent (Claude Code, Cursor, dll). Copy-paste sesuai kebutuhan sesi.

---

## Prompt Kick-off (Sesi Pertama)

```
Kamu akan membantu saya membangun website portofolio + admin panel dengan Next.js dan Supabase.

Sebelum mulai, baca file berikut secara berurutan:
1. PRD.md — spesifikasi produk lengkap (fitur, skema database, RLS, requirement)
2. AGENT.md — aturan kerja dan siklus habit yang WAJIB kamu ikuti (Read → Thinking → Build → Review → Fix → Next Step)
3. SPRINT.md — breakdown pekerjaan per sprint

Setelah membaca ketiganya, konfirmasi ke saya:
- Ringkasan singkat apa yang akan dibangun
- Sprint mana yang akan dikerjakan pertama (harus Sprint 0 kecuali sudah ada progress sebelumnya)
- Task spesifik apa saja di sprint tersebut

Ikuti siklus kerja di AGENT.md untuk SETIAP task, jangan langsung coding tanpa tahap Read dan Thinking. Setelah satu sprint selesai, lakukan "Next Step (Grilling)" sebelum lanjut ke sprint berikutnya, dan laporkan ke saya progressnya.

Jangan menambah fitur atau mengubah skema database di luar yang tertulis di PRD.md tanpa bertanya ke saya terlebih dahulu.

Mulai dari Sprint 0.
```

---

## Prompt Lanjutan (Sesi Berikutnya / Sprint Baru)

```
Lanjutkan pengerjaan project ini. Sebelum mulai:
1. Baca ulang PRD.md dan SPRINT.md untuk sprint yang akan dikerjakan.
2. Cek kode yang sudah ada di repo untuk memastikan status progress sesuai checklist SPRINT.md.
3. Konfirmasi ke saya sprint & task apa yang akan dikerjakan sesi ini sebelum mulai build.

Ikuti siklus Read → Thinking → Build → Review → Fix → Next Step sesuai AGENT.md.
```

---

## Prompt Review (Minta Agent Audit Progress)

```
Sebelum lanjut ke sprint berikutnya, lakukan review menyeluruh terhadap sprint yang baru selesai:
1. Cek ulang checklist di SPRINT.md untuk sprint ini — mana yang sudah selesai, mana yang belum/terlewat.
2. Bandingkan implementasi dengan requirement di PRD.md poin per poin.
3. Cek RLS policy masih sesuai PRD.md section 7.
4. Cek tidak ada TypeScript error/warning dan tidak ada console error.
5. Laporkan hasil audit dalam bentuk daftar: [Selesai] / [Belum] / [Perlu Perbaikan] beserta alasannya.

Jangan perbaiki dulu — laporkan temuan ke saya sebelum eksekusi fix.
```

---

## Prompt Fix Cepat (Bug Spesifik)

```
Ada bug: [jelaskan bug di sini].

Sebelum fix:
1. Baca kode terkait dan cek apakah root cause berkaitan dengan skema/struktur di PRD.md.
2. Jika perbaikan berdampak ke bagian lain (tabel, RLS, komponen lain), jelaskan dampaknya ke saya dulu sebelum eksekusi.
3. Setelah fix, jalankan ulang tahap Review dari AGENT.md untuk area yang terdampak.
```

---

## Tips Penggunaan

- Selalu mulai sesi baru dengan salah satu prompt di atas, jangan langsung minta fitur tanpa konteks — ini memastikan agent membaca `PRD.md`/`AGENT.md`/`SPRINT.md` lebih dulu.
- Update checklist di `SPRINT.md` (centang task selesai) setiap akhir sesi agar sesi berikutnya tahu progress terakhir.
- Jika requirement berubah di tengah jalan, update `PRD.md` dulu sebelum minta agent lanjut coding, supaya dokumen tetap jadi sumber kebenaran tunggal.
