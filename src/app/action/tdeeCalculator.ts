"use server"; 

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: "AIzaSyBUz5KwIYy0EephxkRGuyRmmYKCBXMjfIo"});

async function tdeeCalculator() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Tolong lakukan dua hal berikut berdasarkan data saya:\
1. Kalkulasi Total Daily Energy Expenditure (TDEE)\
Gunakan data dan rumus RMR kustom di bawah untuk menghitung RMR dan TDEE saya.\
Data Diri:\
Gender: [Pria]\
Berat Badan (BB): [77,5]\
Tinggi Badan (TB): [163]\
Usia: [21]\
Tingkat Aktivitas Fisik (1.55):\
1.2 (Sedentari - sangat jarang berolahraga)\
1.375 (Aktivitas Ringan - olahraga 1-3 hari/minggu)\
1.55 (Aktivitas Sedang - olahraga 3-5 hari/minggu)\
1.725 (Aktivitas Berat - olahraga 6-7 hari/minggu)\
1.9 (Aktivitas Sangat Berat - olahraga intens 2x sehari)\
Rumus RMR Kustom:\
Pria: $\text{RMR} = (9.65 \times \text{BB} \text{ dalam kg}) + (573 \times \text{TB} \text{ dalam m}) - (5.08 \times \text{Usia} \text{ dalam tahun}) + 260$\
Wanita: $\text{RMR} = (7.38 \times \text{BB} \text{ dalam kg}) + (607 \times \text{TB} \text{ dalam m}) - (2.31 \times \text{Usia} \text{ dalam tahun}) + 43$\
TDEE = RMR $\times$ Faktor Aktivitas\
2. Penentuan Target Kalori dan Makronutrisi\
Setelah mendapatkan angka TDEE, tentukan target kalori harian dan hitung pembagian makronutrisi minimal saya.\
Parameter Diet:\
Tujuan Diet: [Penurunan Berat Badan ]\
Perhitungan Makronutrisi Minimal:\
Protein: Hitung asupan minimal Protein dengan target $1.8 \text{ gram}$ per kg BB.\
Lemak: Hitung asupan minimal Lemak dengan target $25\%$ dari total kalori harian.\
Karbohidrat: Hitung sisa kalori untuk Karbohidrat setelah alokasi Protein dan Lemak.\
Output yang Diharapkan:\
Sajikan hasil dalam bentuk tabel yang mencakup:\
Angka RMR dan TDEE.\
Target Kalori Harian.\
Pembagian Kalori dan Gram untuk Protein, Lemak, dan Karbohidrat.",
    config:{
        responseMimeType: "application/json"
    }
  });
  return(response.text);
}
 export default tdeeCalculator;