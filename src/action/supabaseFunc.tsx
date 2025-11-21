"use server"; 
import { FormData } from '@/types/schemaPersonalizeData'
import {  SchemaMenuMakanan, rekomendasiOlahragaSchema, schemaMakronutrisi } from '@/types/schemaResponseAi';
import { auth } from "@/auth";
import { createClient } from '@/utils/supabase/server';

export async function insertPersonalData(formData: FormData) {
    const session = await auth()
    if (!session?.user) throw new Error('User not authenticated');
    const userId = session.user.id;
    const dataToInsert = { userId, ...formData };
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('personalInfo')
        .upsert(dataToInsert,{
            onConflict: "userId",
            ignoreDuplicates: false,
        })
        .select()
    console.log("dataPersonal", data);
    if (error) {
        console.error("Error inserting personal data:", error);
        throw new Error('Failed to insert personal data');
    }
    console.log("Personal data inserted successfully");
    return { success: true };
}

export async function getPersonalData(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('personalInfo')
        .select().eq('userId', userId)
    if (error) {
        console.error("Error selecting personal data:", error);
        return null;
    }
    console.log("Personal data selected successfully");
    return data ;
}

export async function insertMakronutrisi(macros: schemaMakronutrisi) {
    const session = await auth()
    if (!session?.user) throw new Error('User not authenticated');
    const userId = session.user.id;
    const dataToInsert = { userId, ...macros };
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('makronutrisi')
        .upsert(dataToInsert,{
            onConflict: "userId",
            ignoreDuplicates: false,
        })
        .select()
    console.log("makronutrisi", data);
    if (error) {
        console.error("Error inserting makronutrisi:", error);
        throw new Error('Failed to insert makronutrisi');
    }
    console.log("makronutrisi inserted successfully");
    return { success: true };
}
export async function insertRekomendasiMakanan(menu: SchemaMenuMakanan) {
    const session = await auth()
    if (!session?.user) throw new Error('User not authenticated');
    const userId = session.user.id;
    const dataToInsert = { userId, menuMakanan:{ ...menu} };
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('rekomendasiMakanan')
        .upsert(dataToInsert,{
            onConflict: "userId",
            ignoreDuplicates: false,
        })
        .select()
    console.log("rekomendasiMakanan", data);
    if (error) {
        console.error("Error inserting rekomendasiMakanan:", error);
        throw new Error('Failed to insert rekomendasiMakanan');
    }
    console.log("rekomendasiMakanan inserted successfully");
    return { success: true };
}
export async function insertRekomendasiOlahraga(latihan: rekomendasiOlahragaSchema) {
    const session = await auth()
    if (!session?.user) throw new Error('User not authenticated');
    const userId = session.user.id;
    const dataToInsert = { userId, detailLatihan:{ ...latihan} };
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('rekomendasiOlahraga')
        .upsert(dataToInsert,{
            onConflict: "userId",
            ignoreDuplicates: false,
        })
        .select()
    console.log("rekomendasiOlahraga", data);
    if (error) {
        console.error("Error inserting rekomendasiOlahraga:", error);
        throw new Error('Failed to insert rekomendasiOlahraga');
    }
    console.log("rekomendasiOlahraga inserted successfully");
    return { success: true };
}

export async function getMakronutrisi(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('makronutrisi')
        .select().eq('userId', userId)
    if (error) {
        console.error("Error selecting makronutrisi:", error);
        return null;
    }
    console.log("makronutrisi selected successfully");
    return data ;
}
export async function getMenuMakanan(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('rekomendasiMakanan')
        .select().eq('userId', userId)
    if (error) {
        console.error("Error selecting rekomendasiMakanan:", error);
        return null;
    }
    console.log("rekomendasiMakanan selected successfully");
    return data ;
}