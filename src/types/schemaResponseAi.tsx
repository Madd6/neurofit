import {z} from "zod"

export const objectSchemaMakronutrisi = z.object({
    tdee: z.number().describe("Total Daily Energy Expenditure"),
    rmr: z.number().describe("Resting Metabolic Rate"),
    targetKalori: z.number().describe("Target Kalori Harian"),
    protein: z.number().describe("Kebutuhan protein harian dalam gram"),
    lemak: z.number().describe("Kebutuhan lemak harian dalam gram"),
    karbohidrat: z.number().describe("Kebutuhan karbohidrat harian dalam gram"),
})
export const objectSchemaMenuMakanan = z.object(
{
  meals: z.array(
    z.object({
      nama: z.string().describe("nama menu makanan"),
      jamMakan: z.string().describe("waktu atau jam makan untuk menu ini"),
      deskripsi: z.string().describe("deskripsi singkat tentang menu makanan"),
      bahan: z.array(z.object({
        daftarBahan: z.string().describe("daftar bahan yang dibutuhkan untuk membuat menu makanan ini"),
        jumlahBahan: z.string().describe("jumlah atau takaran bahan yang dibutuhkan"),
      })),
      caraMemasak: z.array(z.object({
        langkah: z.string().describe("langkah atau instruksi untuk memasak menu makanan ini"), 
        urutanLangkah: z.number().describe("urutan langkah dalam proses memasak"),
      })),
      perkiraanKalori: z.number().describe("perkiraan kalori dalam kkal"),
      protein: z.number().describe("total protein dalam gram dari makanan ini"),
      lemak: z.number().describe("total lemak dalam gram dari makanan ini"),
      karbohidrat: z.number().describe("total karbohidrat dalam gram dari makanan ini"),
    })
  ),
  totalHarian: z.object({
    kalori: z.number().describe("total kalori dari semua makanan yang direkomendasikan"),
    protein: z.number().describe("total protein dari semua makanan yang direkomendasikan"),
    lemak: z.number().describe("total lemak dari semua makanan yang direkomendasikan"),
    karbohidrat: z.number().describe("total karbohidrat dari semua makanan yang direkomendasikan"),
  }),
  catatan: z.string().describe("catatan tambahan atau saran untuk pengguna terkait menu makanan yang direkomendasikan"),
})
export const SchemaRekomendasiOlahraga = z.array(
        z.object({
            hari:z.enum(["senin","selasa","rabu","kamis","jumat","sabtu","minggu"]).describe("hari dalam seminggu"),
            kategori: z.enum(["kardio" , "gym" , "calisthenics","rest"]).describe("kategori olahraga"),
            durasi: z.number().describe("durasi latihan dalam menit"),
            detailLatihan: z.array(
                z.object({
                    nama: z.string().describe("nama latihan"),
                    set: z.number().describe("jumlah set latihan"),
                    repetisi: z.string().describe("jumlah repetisi atau durasi latihan"),
                })
            ),
            intensitas: z.enum(["ringan" , "sedang" , "berat"]).describe("intensitas latihan"),
            catatan: z.string().describe("catatan atau tips tambahan untuk latihan hari tersebut"),
        })
    );
export const schemaDetailLatihan = z.array(
                z.object({
                    nama: z.string().describe("nama latihan"),
                    set: z.number().describe("jumlah set latihan"),
                    repetisi: z.string().describe("jumlah repetisi atau durasi latihan"),
                })
            )

export type schemaMakronutrisi = z.infer<typeof objectSchemaMakronutrisi>;
export type SchemaMenuMakanan = z.infer<typeof objectSchemaMenuMakanan>;
export type rekomendasiOlahragaSchema = z.infer<typeof SchemaRekomendasiOlahraga>;