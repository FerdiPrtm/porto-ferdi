import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = fs.readFileSync(".env.local", "utf8");
function get(k) {
  const m = env.match(new RegExp("^" + k + "=(.*)$", "m"));
  return m ? m[1].trim() : undefined;
}
const url = get("NEXT_PUBLIC_SUPABASE_URL");
const key = get("NEXT_PUBLIC_SUPABASE_ANON_KEY");

const auth = createClient(url, key);
const {
  data: { session },
} = await auth.auth.signInWithPassword({
  email: "admin@email.com",
  password: "passwordku",
});
const sb = createClient(url, key, {
  global: { headers: { Authorization: `Bearer ${session.access_token}` } },
});

const { error: authError } = await sb.auth.getUser();
if (authError) {
  console.error("AUTH FAILED:", authError.message);
  process.exit(1);
}

const projects = [
  {
    title: "Sistem Manajemen Inventori",
    slug: "sistem-manajemen-inventori",
    description:
      "Aplikasi web untuk mengelola stok barang, supplier, dan laporan inventori secara real-time. Dilengkapi fitur scan barcode, notifikasi stok menipis, dan ekspor laporan Excel.",
    tech_stack: ["Laravel", "MySQL", "Tailwind CSS"],
    is_featured: true,
    sort_order: 1,
  },
  {
    title: "Aplikasi POS UMKM",
    slug: "aplikasi-pos-umkm",
    description:
      "Sistem kasir modern untuk UMKM: transaksi cepat, manajemen produk, diskon, pajak, dan laporan penjualan harian. Mendukung mode offline dan cetak struk.",
    tech_stack: ["Laravel", "Livewire", "MySQL"],
    is_featured: true,
    sort_order: 2,
  },
  {
    title: "Website Portofolio Pribadi",
    slug: "website-portofolio-pribadi",
    description:
      "Website portofolio yang Anda lihat ini — dibangun dengan Next.js App Router dan Supabase, dilengkapi panel admin untuk mengelola konten tanpa menulis kode.",
    tech_stack: ["Next.js", "Supabase", "Tailwind CSS"],
    is_featured: true,
    sort_order: 3,
  },
  {
    title: "API E-commerce",
    slug: "api-e-commerce",
    description:
      "REST API untuk platform e-commerce: autentikasi JWT, manajemen produk & keranjang, checkout, dan integrasi pembayaran. Diuji dengan 100+ test otomatis.",
    tech_stack: ["Node.js", "Express", "PostgreSQL"],
    is_featured: false,
    sort_order: 4,
  },
  {
    title: "Landing Page Agency Digital",
    slug: "landing-page-agency",
    description:
      "Landing page modern untuk agency digital dengan fokus pada konversi: animasi halus, SEO optimal, dan kecepatan muat di bawah 1 detik (Lighthouse 98+).",
    tech_stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    is_featured: false,
    sort_order: 5,
  },
  {
    title: "Aplikasi Absensi Online",
    slug: "aplikasi-absensi-online",
    description:
      "Sistem absensi karyawan berbasis lokasi dengan fitur izin/cuti, rekapitulasi bulanan, dan dashboard admin. Terintegrasi notifikasi WhatsApp.",
    tech_stack: ["Laravel", "Vue.js", "MySQL"],
    is_featured: false,
    sort_order: 6,
  },
];

const skills = [
  { name: "HTML", category: "Frontend", level: 5, icon: null, sort_order: 1 },
  { name: "CSS", category: "Frontend", level: 5, icon: null, sort_order: 2 },
  { name: "JavaScript", category: "Frontend", level: 5, icon: null, sort_order: 3 },
  { name: "React", category: "Frontend", level: 4, icon: null, sort_order: 4 },
  { name: "Next.js", category: "Frontend", level: 4, icon: null, sort_order: 5 },
  { name: "Tailwind CSS", category: "Frontend", level: 5, icon: null, sort_order: 6 },
  { name: "PHP", category: "Backend", level: 5, icon: null, sort_order: 1 },
  { name: "Laravel", category: "Backend", level: 5, icon: null, sort_order: 2 },
  { name: "Node.js", category: "Backend", level: 4, icon: null, sort_order: 3 },
  { name: "Express", category: "Backend", level: 4, icon: null, sort_order: 4 },
  { name: "REST API", category: "Backend", level: 5, icon: null, sort_order: 5 },
  { name: "PostgreSQL", category: "Database", level: 4, icon: null, sort_order: 1 },
  { name: "MySQL", category: "Database", level: 5, icon: null, sort_order: 2 },
  { name: "Supabase", category: "Database", level: 4, icon: null, sort_order: 3 },
  { name: "Git", category: "Tools", level: 4, icon: null, sort_order: 1 },
  { name: "Docker", category: "Tools", level: 3, icon: null, sort_order: 2 },
  { name: "Figma", category: "Tools", level: 4, icon: null, sort_order: 3 },
];

const experiences = [
  {
    title: "Fullstack Developer",
    company: "PT Maju Teknologi",
    description:
      "Membangun dan memelihara aplikasi web internal & klien menggunakan Laravel dan Next.js. Bertanggung jawab atas desain database, API, dan pengalaman pengguna end-to-end.",
    start_date: "2023-03-01",
    end_date: null,
    sort_order: 1,
  },
  {
    title: "Web Developer (Intern)",
    company: "Startup Digital Nusantara",
    description:
      "Berkontribusi pada pengembangan dashboard analitik dan sistem autentikasi. Belajar alur kerja tim agile dan code review.",
    start_date: "2022-06-01",
    end_date: "2022-12-01",
    sort_order: 2,
  },
  {
    title: "Freelance Web Developer",
    company: "Mandiri",
    description:
      "Mengerjakan berbagai project klien: landing page, sistem kasir UMKM, dan website profil usaha dengan Laravel dan vanilla PHP.",
    start_date: "2021-01-01",
    end_date: "2022-05-01",
    sort_order: 3,
  },
];

const educations = [
  {
    school: "Universitas Indonesia",
    degree: "S1 Teknik Informatika",
    start_date: "2018-09-01",
    end_date: "2022-08-01",
    sort_order: 1,
  },
  {
    school: "SMK Negeri 1 Jakarta",
    degree: "Rekayasa Perangkat Lunak",
    start_date: "2015-07-01",
    end_date: "2018-06-01",
    sort_order: 2,
  },
];

// Bersihkan data contoh lama sebelum isi ulang
await sb.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await sb.from("skills").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await sb
  .from("experiences")
  .delete()
  .neq("id", "00000000-0000-0000-0000-000000000000");
await sb
  .from("educations")
  .delete()
  .neq("id", "00000000-0000-0000-0000-000000000000");

const p = await sb.from("projects").insert(projects).select("title");
const s = await sb.from("skills").insert(skills).select("name");
const x = await sb.from("experiences").insert(experiences).select("title");
const e = await sb.from("educations").insert(educations).select("school");

for (const [label, res] of [
  ["projects", p],
  ["skills", s],
  ["experiences", x],
  ["educations", e],
]) {
  if (res.error) {
    console.error(`${label} INSERT ERROR:`, res.error.message);
  } else {
    console.log(`${label}: ${res.data.length} rows`);
  }
}

const { data: me } = await sb.auth.getUser();
const upd = await sb
  .from("profile")
  .update({
    full_name: "Ferdi Pratama",
    tagline: "Fullstack Web Developer",
    bio: "Halo! Saya Ferdi Pratama, fullstack web developer asal Indonesia dengan 3+ tahun pengalaman membangun aplikasi web modern.\n\nSaya suka merancang solusi yang cepat, bersih, dan mudah digunakan — mulai dari frontend yang menarik sampai backend yang stabil. Sehari-hari saya bekerja dengan Laravel, Next.js, dan PostgreSQL.\n\nDi luar coding, saya gemar berbagi pengetahuan, menulis, dan mengeksplorasi teknologi baru.",
    email: "ferdipratamaaa27@gmail.com",
    social_links: {
      github: "https://github.com/FerdiPrtm",
      linkedin: "https://linkedin.com/in/ferdipratama",
      twitter: "https://x.com/ferdiprtm",
    },
  })
  .eq("id", me.user.id);

if (upd.error) {
  console.error("PROFILE UPDATE ERROR:", upd.error.message);
} else {
  console.log("profile: updated");
}

console.log("DONE");
