"use server";
import { auth } from "@/auth";
import { GoogleGenAI } from "@google/genai";
import {  getPersonalData, insertRekomendasiOlahraga } from "./supabaseFunc";
import { SchemaRekomendasiOlahraga } from "@/types/schemaResponseAi";
import { z } from "zod";
const ai = new GoogleGenAI({apiKey: "AIzaSyBUz5KwIYy0EephxkRGuyRmmYKCBXMjfIo"});
export async function getRekomendasiOlahraga() {
    const session = await auth()
    if (!session?.user) throw new Error('User not authenticated');
    const userId = session.user.id;
    const personalData = await getPersonalData(userId);

    if (!personalData || personalData.length === 0) {
      throw new Error("Personal data not found");
    }
    const p = personalData[0];
    const prompt =`
        Kamu adalah asisten fitness yang membuat program olahraga selama 7 hari untuk pengguna.
        sesuaikan program dengan data personal pengguna berikut ini:

        ====================
        DATA PERSONAL PENGGUNA
        ====================
        beratBadan: ${p.beratBadan} kg
        tinggiBadan: ${p.tinggiBadan} cm
        gender: ${p.gender}
        riwayatPenyakit: ${p.riwayatPenyakit ? p.riwayatPenyakit : "tidak ada"}
        tujuan: ${p.goal}

        sesuaikan program dengan kondisi tubuh pengguna, misal pengguna dengan riwayat penyakit asma jangan diberikan olahraga dengan intensitas tinggi yang dapat memicu serangan asma.
        dan jika pengguna memiliki riwayat cedera lutut, hindari latihan yang memberikan tekanan berlebih pada lutut seperti lari jarak jauh atau squat berat.
        atau jika pengguna merupakan obesitas maka hindari latihan berdampak tinggi seperti lari atau jumping jack, dan fokus pada latihan berdampak rendah seperti bersepeda atau berenang.
        gunakan data personal tersebut untuk membuat program olahraga yang aman, efektif, dan sesuai dengan kondisi pengguna.

        =========================
        BATASAN JENIS OLAHRAGA
        =========================
        Kamu hanya boleh memberikan rekomendasi olahraga dari 3 kategori berikut:

        1. **KARDIO (UMUM DAN MUDAH DILAKUKAN)**
        - Jalan cepat
        - Jogging
        - Lari
        - Lompat tali
        - Sepeda (bisa outdoor atau statis)
        - HIIT cardio ringan
        dilarang memberikan:
        - renang profesional, rowing machine, elliptical, hiking berat, olahraga dengan alat mahal

        2. **GYM (LATIHAN BEBAN DASAR & UMUM)**  
        Hanya boleh:
        - Bench press
        - Dumbbell press
        - Shoulder press
        - Dumbbell row
        - Lat pulldown
        - Seated cable row
        - Bicep curl
        - Tricep pushdown
        - Leg press
        - Leg extension
        - Leg curl
        Tidak boleh:
        - movement advance (snatch, clean & jerk, olympic lift, crossfit skill)
        - machine yang mahal / jarang tersedia

        3. **CALISTHENICS DASAR**
        - Push up
        - Pull up
        - Chin up
        - Dips
        - Plank
        - Squat
        - Lunges
        - Burpees
        - Mountain climber
        - Jumping jack
        - Sit up / crunch
        Tidak boleh:
        - handstand pushup, muscle up, planche, front lever, dragon flag

        =========================
        ATURAN PROGRAM
        =========================
        1. Buat program olahraga untuk **7 hari (Senin–Minggu)**.
        2. Setiap hari harus memiliki 1 sesi latihan.
        3. Format latihan harian:
        - "kategori": kardio / gym / calisthenics
        - "durasi": berapa menit (misalnya 30–60 menit)
        - "latihan": daftar latihan (array)
        - "setReps": set dan repetisi (untuk gym & calisthenics)
        - "catatan": tips singkat
        4. Intensitas harus realistis untuk tingkat pemula-menengah.
        5. Jangan rekomendasikan alat mahal.
        6. Jangan rekomendasikan olahraga non-halal (misalnya yoga ritual, meditasi agama, dll).
        7. Utamakan keselamatan pengguna dan sampaikan pencegahan cedera.
        8. Jawab dalam Bahasa Indonesia.

        =========================
        CATATAN PENTING
        =========================
        - Pastikan 7 objek untuk 7 hari.
        - Semua JSON harus valid, tidak boleh ada komentar atau teks lain.
        - Hanya gunakan latihan yang diizinkan dalam batasan kategori.
    `
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],config: {
              responseMimeType: "application/json",
              responseJsonSchema: z.toJSONSchema(SchemaRekomendasiOlahraga),
              temperature: 0.2,
            }
          });
          if(!response.text) throw new Error("AI response is empty");
          const parseResult = SchemaRekomendasiOlahraga.safeParse(JSON.parse(response.text));
          if (!parseResult.success) throw new Error("Failed to parse AI response");
          insertRekomendasiOlahraga(parseResult.data);
          return(parseResult.data);
    }