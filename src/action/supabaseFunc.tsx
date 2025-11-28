"use server"

import { FormData } from "@/types/schemaPersonalizeData"
import {
  SchemaMenuMakanan,
  rekomendasiOlahragaSchema,
  schemaMakronutrisi,
} from "@/types/schemaResponseAi"
import { auth } from "@/auth"
import { createClient } from "@/utils/supabase/server"

// ---- Generic result type (dipakai semua fungsi) ----
type ActionResult<T = undefined> = {
  success: boolean
  data?: T
  msg?: string
}

// ---- Tipe row untuk tabel Supabase ----
type PersonalInfoRow = FormData & {
  userId: string
}

type MakronutrisiRow = schemaMakronutrisi & {
  userId: string
}

type RekomendasiMakananRow = {
  userId: string
  menuMakanan: SchemaMenuMakanan
}

type RekomendasiOlahragaRow = {
  userId: string
  detailLatihan: rekomendasiOlahragaSchema
}

// ================== PERSONAL DATA ==================

export async function insertPersonalData(
  formData: FormData
): Promise<ActionResult<FormData>> {
  const session = await auth()
  if (!session?.user) throw new Error("User not authenticated")

  const userId = session.user.id
  const dataToInsert: PersonalInfoRow = { userId, ...formData }
  const supabase = await createClient()

  const { error } = await supabase
    .from("personalInfo")
    .upsert(dataToInsert, {
      onConflict: "userId",
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    return { success: false, msg: error.message }
  }

  console.log("Personal data inserted successfully")
  return {
    success: true,
    data: formData,
    msg: "Personal data inserted successfully",
  }
}

export async function getPersonalData(
  userId: string
): Promise<ActionResult<FormData[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("personalInfo")
    .select()
    .eq("userId", userId)

  if (error) {
    return { success: false, msg: error.message }
  }

  // cast terkontrol → tidak pakai any
  const typedData = (data ?? []) as PersonalInfoRow[]

  console.log("Personal data selected successfully")
  return {
    success: true,
    data: typedData.map((row) => {
      const {  ...rest } = row
      return rest
    }),
  }
}

// ================== MAKRONUTRISI ==================

export async function insertMakronutrisi(
  macros: schemaMakronutrisi
): Promise<ActionResult<schemaMakronutrisi>> {
  const session = await auth()
  if (!session?.user) throw new Error("User not authenticated")

  const userId = session.user.id
  const dataToInsert: MakronutrisiRow = { userId, ...macros }
  const supabase = await createClient()

  const { error } = await supabase
    .from("makronutrisi")
    .upsert(dataToInsert, {
      onConflict: "userId",
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    return { success: false, msg: error.message }
  }

  console.log("makronutrisi inserted successfully")
  return { success: true, data: macros }
}

export async function getMakronutrisi(
  userId: string
): Promise<ActionResult<schemaMakronutrisi[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("makronutrisi")
    .select()
    .eq("userId", userId)

  if (error) {
    return { success: false, msg: error.message }
  }

  const typedData = (data ?? []) as MakronutrisiRow[]

  console.log("makronutrisi selected successfully")
  return {
    success: true,
    data: typedData.map((row) => {
      const {  ...rest } = row
      return rest
    }),
  }
}

// ================== REKOMENDASI MAKANAN ==================

export async function insertRekomendasiMakanan(
  menu: SchemaMenuMakanan
): Promise<ActionResult<SchemaMenuMakanan>> {
  const session = await auth()
  if (!session?.user) throw new Error("User not authenticated")

  const userId = session.user.id
  const dataToInsert: RekomendasiMakananRow = {
    userId,
    menuMakanan: { ...menu },
  }
  const supabase = await createClient()

  const { error } = await supabase
    .from("rekomendasiMakanan")
    .upsert(dataToInsert, {
      onConflict: "userId",
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    return { success: false, msg: error.message }
  }

  console.log("rekomendasiMakanan inserted successfully")
  return { success: true, data: menu, msg: "success" }
}

export async function getMenuMakanan(
  userId: string
): Promise<ActionResult<SchemaMenuMakanan[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("rekomendasiMakanan")
    .select("menuMakanan")
    .eq("userId", userId)

  if (error) {
    return { success: false, msg: error.message }
  }

  const rows = (data ?? []) as { menuMakanan: SchemaMenuMakanan }[]

  console.log("rekomendasiMakanan selected successfully")
  return {
    success: true,
    data: rows.map((row) => row.menuMakanan),
  }
}

// ================== REKOMENDASI OLAHRAGA ==================

export async function insertRekomendasiOlahraga(
  latihan: rekomendasiOlahragaSchema
): Promise<ActionResult<rekomendasiOlahragaSchema>> {
  const session = await auth()
  if (!session?.user) throw new Error("User not authenticated")

  const userId = session.user.id
  const dataToInsert: RekomendasiOlahragaRow = {
    userId,
    detailLatihan: { ...latihan },
  }
  const supabase = await createClient()

  const { error } = await supabase
    .from("rekomendasiOlahraga")
    .upsert(dataToInsert, {
      onConflict: "userId",
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    return { success: false, msg: error.message }
  }

  console.log("rekomendasiOlahraga inserted successfully")
  return { success: true, data: latihan }
}

export async function getDetailLatihan(
  userId: string
): Promise<ActionResult<rekomendasiOlahragaSchema | null>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("rekomendasiOlahraga")
    .select("detailLatihan")
    .eq("userId", userId)
    .single()

  if (error) {
    return { success: false, msg: error.message }
  }

  const detailLatihan = (data?.detailLatihan ??
    null) as rekomendasiOlahragaSchema | null

  console.log(detailLatihan)

  return { success: true, data: detailLatihan }
}
