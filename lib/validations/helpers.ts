import { z } from "zod";

/** String teks opsional: "" diperlakukan sebagai undefined. */
export function textOrEmpty(max: number, message?: string) {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().max(max, message).optional()
  );
}

/** URL opsional: "" diperlakukan sebagai undefined. */
export function urlOrEmpty(message: string) {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().url(message).optional()
  );
}

/** Tanggal (YYYY-MM-DD) opsional: "" diperlakukan sebagai undefined. */
export function dateOrEmpty(message = "Format tanggal harus YYYY-MM-DD.") {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, message).optional()
  );
}

/** Email opsional: "" diperlakukan sebagai undefined. */
export function emailOrEmpty(message = "Email tidak valid.") {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().email(message).optional()
  );
}