"use server";
import { auth } from "@/auth";
import { GoogleGenAI } from "@google/genai";
import { getMakronutrisi, getMenuMakanan, getPersonalData, insertRekomendasiMakanan } from "./supabaseFunc";
import { objectSchemaMenuMakanan } from "@/types/schemaResponseAi";
import { z } from "zod";
const ai = new GoogleGenAI({apiKey: process.env.NEXT_API_OPENAI_KEY!});
export async function getRekomendasiMakanan() {
    const session = await auth()
    if (!session?.user) {
      return ({
          success: false,
          msg:"Login terlebih dahulu"
        })
    };
    const userId = session.user.id;
    const res = await getPersonalData(userId);
    const resMacro = await getMakronutrisi(userId);

    if(!res.success || !res.data){
        return{
            success: false,
            data: null,
            msg: "gagal mendapatkan personal data , silakan isi personal data anda"
          }
    }
    const personalData = res.data
    if(!resMacro.success || !resMacro.data){
          return{
            success: false,
            data: null,
            msg: "gagal mendapatkan makronutrisi , silakan coba lagi nanti."
          }
    }
    const makronutrisi = resMacro.data
    const p = personalData[0];
    const m = makronutrisi[0];
    const prompt =`
        Kamu adalah asisten nutrisi yang memberikan rekomendasi makanan halal, murah, dan berbasis makronutrisi pengguna untuk 1 minggu penuh.

        ====================
        DATA MAKRO PENGGUNA
        ====================
        TDEE: ${m.tdee} kkal
        RMR: ${m.rmr} kkal
        Target Kalori Harian: ${m.targetKalori} kkal
        Protein Target: ${m.protein} gram
        Lemak Target: ${m.lemak} gram
        Karbohidrat Target: ${m.karbohidrat} gram

        ${p.alergi ? `Alergi Pengguna: ${p.alergi}` : ""}
        ${p.riwayatPenyakit ? `Riwayat Penyakit Pengguna: ${p.riwayatPenyakit}` : ""}

        =========================
        ATURAN REKOMENDASI MAKANAN
        =========================
        1. Semua rekomendasi makanan HARUS halal.
        2. Selalu perhatikan alergi atau riwayat penyakit (jika pengguna memiliki data tersebut).
        3. Gunakan bahan makanan yang mudah ditemukan & murah, seperti:
        - Ayam
        - Telur
        - Ikan kembung / ikan tongkol
        - Tahu, tempe
        - Sayuran umum (bayam, sawi, wortel, kol, buncis)
        - Buah lokal (pisang, pepaya, apel murah, semangka, dll)
        - Sumber karbohidrat standar (nasi, kentang, roti tawar, oatmeal lokal)
        4. Jangan gunakan bahan mahal atau yang tidak umum untuk masyarakat berpenghasilan rendah, seperti:
        - Salmon
        - Tuna kaleng premium
        - Kalkun
        - Keju mahal, almond, quinoa, chia seed, greek yogurt, dsb
        5. Rekomendasi harus realistis, mudah dimasak, dan sesuai makronutrisi.
        6. Makanan boleh berupa:
        - Makanan lengkap (seperti “nasi + ayam + sayur”)
        - Snack sehat murah
        - Alternatif pilihan
        7. Pastikan total makanan yang direkomendasikan mendekati target kalori dan makro pengguna.
        8. jangan rekomendasikan makanan dengan gula yang tinggi
        9. waktu makan harus tetap setiap harinya (misal: sarapan, makan siang, makan malam, snack pagi, snack sore)
    `
    try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(objectSchemaMenuMakanan),
      },
    });

    if (!response.text) {
      return { success: false, data: null, msg: "Gagal mendapatkan response text dari AI." };
    }

    // Parsing response
    const parseResult = objectSchemaMenuMakanan.safeParse(JSON.parse(response.text));
    if (!parseResult.success) {
      return { success: false, data: null, msg: "Gagal parsing JSON sesuai schema rekomendasi makanan." };
    }
    // ---- Cek rekomendasi lama di database ----
    const menuMakanan = await getMenuMakanan(userId); //cek menu lama
    if (!menuMakanan.success || menuMakanan.data?.length === 0 ||menuMakanan.data === null ) {
      await insertRekomendasiMakanan(parseResult.data);
      
      return { 
        success: true, 
        data: parseResult.data, 
        msg: "success insert ke database" 
      };
    }

    // Return ke UI
    return { success: true, data: parseResult.data, msg: "success" };

  } catch (err) {

    return {
      success: false,
      data: null,
      msg: "Service AI sedang overload atau quota habis, silakan coba lagi nanti.",
      err:err
    };
  }
}