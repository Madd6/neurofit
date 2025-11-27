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

// ================== PERSONAL DATA ==================

export async function insertPersonalData(
  formData: FormData
): Promise<ActionResult<FormData>> {
  const session = await auth()
  if (!session?.user) throw new Error("User not authenticated")

  const userId = session.user.id
  const dataToInsert = { userId, ...formData }
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
  // bisa juga return row supabase, tapi untuk simple pakai formData
  return { success: true, data: formData, msg: "Personal data inserted successfully" }
}

export async function getPersonalData(
  userId: string
): Promise<ActionResult<any[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("personalInfo")
    .select()
    .eq("userId", userId)

  if (error) {
    return { success: false, msg: error.message }
  }

  console.log("Personal data selected successfully")
  return { success: true, data: data ?? [] }
}

// ================== MAKRONUTRISI ==================

export async function insertMakronutrisi(
  macros: schemaMakronutrisi
): Promise<ActionResult<schemaMakronutrisi>> {
  const session = await auth()
  if (!session?.user) throw new Error("User not authenticated")

  const userId = session.user.id
  const dataToInsert = { userId, ...macros }
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
): Promise<ActionResult<any[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("makronutrisi")
    .select()
    .eq("userId", userId)

  if (error) {
    return { success: false, msg: error.message }
  }

  console.log("makronutrisi selected successfully")
  return { success: true, data: data ?? [] }
}

// ================== REKOMENDASI MAKANAN ==================

export async function insertRekomendasiMakanan(
  menu: SchemaMenuMakanan
): Promise<ActionResult<SchemaMenuMakanan>> {
  const session = await auth()
  if (!session?.user) throw new Error("User not authenticated")

  const userId = session.user.id
  const dataToInsert = { userId, menuMakanan: { ...menu } }
  const supabase = await createClient()

  const { error } = await supabase
    .from("rekomendasiMakanan")
    .upsert(dataToInsert, {
      onConflict: "userId",
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    return { success: false, msg:error.message }
  }

  console.log("rekomendasiMakanan inserted successfully")
  return { success: true, data: menu, msg:"success" }
}

export async function getMenuMakanan(
  userId: string
): Promise<ActionResult<any[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("rekomendasiMakanan")
    .select()
    .eq("userId", userId)

  if (error) {
    return { success: false, msg: error.message }
  }

  console.log("rekomendasiMakanan selected successfully")
  return { success: true, data: data ?? [] }
}

// ================== REKOMENDASI OLAHRAGA ==================

export async function insertRekomendasiOlahraga(
  latihan: rekomendasiOlahragaSchema
): Promise<ActionResult<rekomendasiOlahragaSchema>> {
  const session = await auth()
  if (!session?.user) throw new Error("User not authenticated")

  const userId = session.user.id
  const dataToInsert = { userId, detailLatihan: { ...latihan } }
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
): Promise<ActionResult<any[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("rekomendasiOlahraga")
    .select()
    .eq("userId", userId)
    .single()

  if (error) {
    return { success: false, msg: error.message }
  }
  console.log(data.detailLatihan)

  return { success: true, data: data.detailLatihan ?? [] }
}
