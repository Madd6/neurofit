import {z} from "zod";

const stepOneSchema = z.object({
    gender: z.string().min(1, { message: "Gender wajib dipilih" }),

    tanggalLahir: z.date({
        error: "Tanggal Lahir wajib diisi"
    }),
    
    tinggiBadan: z.number({ 
        error: "Tinggi Badan wajib diisi",
    })
    .min(50, { message: "Tinggi badan minimal 50 cm" })
    .max(300, { message: "Tinggi badan maksimal 300 cm" }),
    
    beratBadan: z.number({ 
        error: "Berat Badan wajib diisi",
    })
    .min(20, { message: "Berat badan minimal 20 kg" })
    .max(500, { message: "Berat badan maksimal 500 kg" })
});

const stepTwoSchema = z.object({
    activityFactor: z.string().min(1, { message: "Faktor aktivitas wajib dipilih" }),
    goal: z.string().min(1, { message: "Goal wajib dipilih" }),
});

const stepThreeSchema = z.object({
    riwayatPenyakit: z.string().optional(),
    alergi: z.string().optional(),
});


export const formSchema = stepOneSchema.merge(stepTwoSchema).merge(stepThreeSchema);

export type FormData = z.infer<typeof formSchema>;