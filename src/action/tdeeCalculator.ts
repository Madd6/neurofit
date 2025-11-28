"use server"; 

import { auth } from "@/auth";
import { GoogleGenAI } from "@google/genai";
import { getPersonalData, insertMakronutrisi } from "./supabaseFunc";
import { objectSchemaMakronutrisi } from "@/types/schemaResponseAi";
import { z } from "zod";
// import { zodToJsonSchema } from "zod-to-json-schema";
// import { FormData } from "@/types/schemaPersonalizeData";

const ai = new GoogleGenAI({apiKey: process.env.NEXT_API_OPENAI_KEY!});

function getAge(birthDate: string | Date): number {
  const b = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - b.getFullYear();
  const monthDiff = today.getMonth() - b.getMonth();
  const dayDiff = today.getDate() - b.getDate();

  // kalau ulang tahun BELUM lewat tahun ini → kurangi 1
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

async function tdeeCalculator() {
  const session = await auth()
  if (!session?.user){
    return ({
          success: false,
          msg:"Login terlebih dahulu"
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

  const p = res.data[0];

  const age = getAge(p.tanggalLahir);

  const prompt =`
Kamu adalah asisten nutrisi yang menghitung kebutuhan kalori dan makronutrisi harian pengguna.

==================== 
DATA DIRI PENGGUNA
====================
Gender: ${p.gender}
Berat Badan (BB): ${p.beratBadan} kg
Tinggi Badan (TB): ${p.tinggiBadan} cm
Usia: ${age} tahun
Tingkat Aktivitas Fisik (activityFactor): ${p.activityFactor}
Tujuan Diet: ${p.goal}

==================== 
INSTRUKSI PERHITUNGAN
====================
1. Konversi tinggi badan ke meter:
   TB_m = TB_cm / 100

2. Hitung Resting Metabolic Rate (RMR) dengan rumus kustom berikut:

   Jika Gender = Pria:
   RMR = (9.65 × BB_kg) + (573 × TB_m) - (5.08 × Usia_tahun) + 260

   Jika Gender = Wanita:
   RMR = (7.38 × BB_kg) + (607 × TB_m) - (2.31 × Usia_tahun) + 43

3. Hitung Total Daily Energy Expenditure (TDEE):
   TDEE = RMR × activityFactor

4. Tentukan Target Kalori Harian berdasarkan Tujuan Diet:
   - Jika goal = "defisit": gunakan target kalori sedikit di bawah TDEE 
     (misalnya 10–20% di bawah TDEE). Pilih nilai yang wajar dan aman.
   - Jika goal = "maintenance": target kalori ≈ TDEE.
   - Jika goal = "surplus": gunakan target kalori sedikit di atas TDEE 
     (misalnya 10–15% di atas TDEE). Pilih nilai yang wajar.

5. Hitung Makronutrisi Minimal:
   - Protein:
     Minimal protein = 1.8 gram × BB_kg.
     Kalori dari protein = gram_protein × 4 kkal.
   - Lemak:
     Minimal lemak = 25% dari total kalori harian.
     Gram lemak = (kalori_lemak / 9).
   - Karbohidrat:
     Sisa kalori = target_kalori_harian - (kalori_protein + kalori_lemak).
     Gram karbohidrat = sisa_kalori / 4.

6. Pembulatan:
   - Boleh bulatkan semua nilai kalori dan gram ke angka bulat terdekat.
`

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
        responseJsonSchema: z.toJSONSchema(objectSchemaMakronutrisi),
        temperature: 0.2,
      }
    });

    // ✅ Kirim error ke UI, bukan throw
    if (!response.text) {
      return { success: false, data: null, msg: "AI response kosong (tidak ada text JSON)." };
    }

    // ✅ Parsing aman
    const parseResult = objectSchemaMakronutrisi.safeParse(JSON.parse(response.text));
    if (!parseResult.success) {
      return { success: false, data: null, msg: "Gagal parsing JSON sesuai schema makronutrisi." };
    }


    await insertMakronutrisi(parseResult.data);

    // ✅ Kembalikan data hasil AI ke UI
    return { success: true, data: parseResult.data, msg: "success" };

  } catch (err) {
    console.error("Gemini API error:", err);

    return {
      success: false,
      data: null,
      msg: "Gateway AI bermasalah (overload / quota habis / rate limit)."
    };
  }
}
 export default tdeeCalculator;