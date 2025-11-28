"use server";
import { auth } from "@/auth";
import { GoogleGenAI } from "@google/genai";
import {  getPersonalData, insertRekomendasiOlahraga } from "./supabaseFunc";
import { SchemaRekomendasiOlahraga } from "@/types/schemaResponseAi";
import { z } from "zod";
const ai = new GoogleGenAI({apiKey: process.env.NEXT_API_OPENAI_KEY!});
export async function getRekomendasiOlahraga({hariLatihanDalamSeminggu,kategoriLatihan}: {hariLatihanDalamSeminggu: string[], kategoriLatihan: string[]}) {
    const session = await auth()
    if (!session?.user) {
      return ({
          success: false,
          msg:"login terlebih dahulu"
        })
    };
    const userId = session.user.id;
    const res = await getPersonalData(userId);
    if (!res.success || !res.data) {
        return ({
          success: false,
          msg:"gagal mendapatkan personal data"
        })
      }
    const personalData = res.data
    const p = personalData[0];
    const prompt =`
        Kamu adalah asisten fitness profesional yang membuat program olahraga personal selama 7 hari.
        ====================
        DATA PERSONAL PENGGUNA
        ====================
        - Berat Badan: ${p.beratBadan} kg
        - Tinggi Badan: ${p.tinggiBadan} cm
        - Gender: ${p.gender}
        - Riwayat Penyakit: ${p.riwayatPenyakit || "Tidak ada"}
        - Tujuan: ${p.goal}
        - hari Latihan yang Diinginkan: ${hariLatihanDalamSeminggu.join(", ")}
        - Kategori Latihan Preferensi: ${kategoriLatihan.join(", ")}
        - hari selain yang di inginkan adalah rest day

        ====================
        PRINSIP KEAMANAN & ADAPTASI
        ====================
        WAJIB sesuaikan program dengan kondisi kesehatan pengguna:

        **Kondisi Respiratori (Asma, Bronkitis)**
        - Hindari: Kardio intensitas tinggi, HIIT agresif, lari jarak jauh
        - Rekomendasikan: Jalan cepat, sepeda santai, latihan beban ringan

        **Cedera/Masalah Sendi (Lutut, Pergelangan Kaki, Punggung)**
        - Hindari: Lari, lompat tali, squat berat, lunges dalam
        - Rekomendasikan: Sepeda statis, latihan upper body, plank modifikasi

        **Obesitas (BMI > 30)**
        - Hindari: High-impact (lari, jumping jack, burpees)
        - Rekomendasikan: Jalan cepat, sepeda, berenang, latihan duduk
        - Fokus: Volume rendah, intensitas sedang, progresif

        **Pemula/Dekondisi**
        - Mulai dengan intensitas 50-60% dari kemampuan maksimal
        - Berikan opsi modifikasi untuk setiap gerakan
        - Rest day yang cukup (minimal 2 hari)

        ====================
        BATASAN JENIS OLAHRAGA (WAJIB DIIKUTI)
        ====================

        **1. KARDIO**
        ✅ BOLEH:
        - Jalan cepat, Jogging ringan-sedang, Lari (untuk yang fit)
        - Lompat tali, Sepeda (outdoor/statis), HIIT kardio ringan-sedang

        ❌ DILARANG:
        - Renang (akses terbatas), Rowing machine, Elliptical, Stair climber
        - Hiking berat, Olahraga air lainnya

        **2. GYM (LATIHAN BEBAN)**
        ✅ BOLEH HANYA:
        Upper Body: Bench press, Dumbbell press, Shoulder press, Dumbbell row, Lat pulldown, Seated cable row, Bicep curl, Tricep pushdown/extension
        Lower Body: Leg press, Leg extension, Leg curl, Squat (barbell/dumbbell dasar)

        ❌ DILARANG:
        - Olympic lifts (Snatch, Clean & Jerk, Power clean)
        - Advanced movements (Turkish get-up, Kettlebell swing berat)
        - Alat spesialis (Smith machine khusus, Cable crossover rumit)

        **3. CALISTHENICS**
        ✅ BOLEH:
        - Push up (standard/modifikasi), Pull up/Chin up, Dips
        - Plank (semua variasi), Squat bodyweight, Lunges
        - Burpees (modifikasi oke), Mountain climber, Jumping jack
        - Sit up, Crunch, Leg raise

        ❌ DILARANG:
        - Skill tingkat lanjut (Handstand pushup, Muscle up, Planche, Front lever, Dragon flag, Human flag)

        ====================
        STRUKTUR PROGRAM 7 HARI
        ====================
        **ATURAN WAJIB:**
        1. Buat program TEPAT 7 hari (Senin–Minggu) dalam array JSON
        2. Sesuaikan jumlah hari latihan aktif dengan ${hariLatihanDalamSeminggu} hari
        3. Sisa hari = REST DAY atau Active Recovery (jalan santai 15-20 menit)
        4. Distribusi kategori sesuai preferensi user: ${kategoriLatihan}
        5. jangan masukkan kategori diluar preferensi user

        **Format JSON untuk SETIAP HARI:**
        {
          "hari": "Senin" | "Selasa" | ... | "Minggu",
          "kategori": "kardio" | "gym" | "calisthenics" | "rest",
          "durasi": <number dalam menit, contoh: 45>,
          "latihan": [
            {
              "nama": "<nama latihan>",
              "setReps": "<contoh: 3 set x 12 reps>" // untuk gym & calisthenics
              "durasi": "<contoh: 20 menit>" // untuk kardio
            }
          ],
          "intensitas": "ringan" | "sedang" | "berat",
          "catatan": "<tips singkat, pencegahan cedera, atau motivasi>"
        }

        **Panduan Durasi:**
        - Kardio: 20-45 menit
        - Gym/Calisthenics: 30-60 menit (termasuk pemanasan & pendinginan)
        - Rest day: 0 menit atau 15-20 menit jalan santai

        **Panduan Set & Reps:**
        - Pemula: 2-3 set x 8-12 reps
        - Menengah: 3-4 set x 10-15 reps
        - Kardio interval: misal "5 menit pemanasan + 20 menit interval + 5 menit cooldown"

        ====================
        ATURAN OUTPUT
        ====================
        1. **HANYA** output array JSON murni, tidak ada teks lain
        2. Tidak boleh ada komentar JavaScript (//) atau komentar apapun
        3. Pastikan 7 objek untuk 7 hari (Senin-Minggu)
        4. Semua field wajib diisi, tidak boleh null atau kosong
        5. Gunakan Bahasa Indonesia untuk semua konten
        6. Hindari istilah atau praktik non-halal (yoga ritual, meditasi keagamaan tertentu)

        ====================
        VALIDASI SEBELUM OUTPUT
        ====================
        Sebelum memberikan jawaban, pastikan:
        ✓ Program sesuai dengan riwayat penyakit pengguna
        ✓ Hanya menggunakan latihan dari daftar yang diizinkan
        ✓ Jumlah hari latihan aktif = ${hariLatihanDalamSeminggu}
        ✓ JSON valid tanpa syntax error
        ✓ Setiap latihan memiliki instruksi yang jelas
        ✓ Ada variasi yang cukup (tidak monoton)
        ✓ Ada rest day yang cukup untuk recovery

        **MULAI BUAT PROGRAM SEKARANG - OUTPUT HANYA JSON ARRAY**`;
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }]
              }
            ],
            config: {
              responseMimeType: "application/json",
              responseJsonSchema: z.toJSONSchema(SchemaRekomendasiOlahraga),
            }
          });

          if (!response.text) {
            return { success: false, data: null, msg: "Gagal mendapat response text dari AI" };
          }

          const parseResult = SchemaRekomendasiOlahraga.safeParse(JSON.parse(response.text));
          if (!parseResult.success) {
            return { success: false, data: null, msg: "Gagal parsing JSON response schema AI." };
          }

          // Simpan ke DB via sistem website
          await insertRekomendasiOlahraga(parseResult.data);

          return { success: true, data: parseResult.data, msg: "success mendapatkan rekomendasi" };
          
        } catch (err) {
          // ❗Ini bagian penting → jangan throw, tapi return ke UI
          const error = err as { message?: string };

          return {
            success: false,
            data: null,
            msg: `Error API Gemini: ${error.message || "Terjadi kegagalan saat memanggil layanan AI."}`
          };
        }
    }