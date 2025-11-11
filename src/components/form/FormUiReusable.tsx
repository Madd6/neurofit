import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useFormContext } from 'react-hook-form';
import React from 'react'
import { Label } from '../ui/label'
import { FormField, FormItem } from '../ui/form';

type FormUiReusableProps = {
    step: number;
}

// Definisikan tipe yang lebih spesifik
type OptionType = {
    value: string;
    title: string;
}

type FormFieldOption = {
    value: string;
    model: "option";
    type: OptionType[];
    title: string;
}

type FormFieldInput = {
    value: string;
    model: "input";
    type: string;
    title: string;
}

type FormFieldConfig = FormFieldOption | FormFieldInput;

const FormUiReusable = ({step}: FormUiReusableProps) => {
    const {register, formState: {errors}, control} = useFormContext()
    
    const optionGender: OptionType[] = [
        {value:"Laki-laki", title:"Laki-laki"},
        {value:"Perempuan", title:"Perempuan"}
    ];
    
    const optionAktifitas: OptionType[] = [
        {value:"1.2", title:"Sangat jarang"},
        {value:"1.375", title:"1-3 hari seminggu"},
        {value:"1.55", title:"3-5 hari seminggu"},
        {value:"1.725", title:"6-7 hari seminggu"},
        {value:"1.9", title:"2 kali sehari"},
    ];

    const optionGoal: OptionType[] = [
        {value:"defisit", title:"Menurunkan Berat Badan"},
        {value:"maintenance", title:"Pemeliharaan Berat Badan"},
        {value:"surplus", title:"Peningkatan Massa Otot"},
    ];
    
    const stepOne: FormFieldConfig[] = [
        {value:"gender", model: "option", type: optionGender, title:"Gender"},
        {value:"usia", model: "input", type: "number", title:"Usia"},
        {value:"tinggiBadan", model: "input", type: "number", title:"Tinggi Badan"},
        {value:"beratBadan", model: "input", type: "number", title:"Berat Badan"},
    ]
    
    const stepTwo: FormFieldConfig[] = [
        {value:"activityFactor", model: "option", type: optionAktifitas, title:"Faktor Aktivitas"},
        {value:"goal", model: "option", type: optionGoal, title:"Goal"},
    ]
    
    const stepThree: FormFieldConfig[] = [
        {value:"RiwayatPenyakit", model: "input", type: "text", title:"Riwayat Penyakit"},
        {value:"Alergi", model: "input", type: "text", title:"Alergi"},
    ]
    
    const uiToRender = step == 1 ? stepOne : step == 2 ? stepTwo : stepThree;
    
    return (
        <>
            {uiToRender.map((item, index) => (
                item.model === "option" ? (
                    <div className='w-full display flex flex-col justify-between' key={item.value}>
                        <FormField
                            control={control}
                            name={item.value} 
                            render={({ field }) => (
                                <FormItem>
                                    <label htmlFor={item.value}>{item.title}</label>
                                    <RadioGroup 
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {/* Sekarang TypeScript tahu bahwa item.type adalah array */}
                                        {item.type.map((option, idx) => (
                                            <div key={idx} className="flex items-center gap-3 w-full border-2 rounded-lg p-2 shadow-lg hover:bg-secondary/10 hover:scale-105 transition-all cursor-pointer">
                                                <RadioGroupItem value={option.value} id={option.value} />
                                                <Label htmlFor={option.value} className='w-full'>{option.title}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {errors[item.value as keyof typeof errors] && (
                                        <p className='text-red-500 text-sm mt-1'>
                                            {errors[item.value as keyof typeof errors]?.message?.toString()}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>
                ) : (
                    <div className='w-full display flex flex-col justify-between' key={item.value}>
                        <label htmlFor={item.value}>{item.title}</label>
                        <input 
                            {...register(item.value, item.type === 'number' ? { valueAsNumber: true } : {})}
                            className='w-full border-2 p-2 rounded-lg shadow-lg bg-background text-foreground' 
                            type={item.type} 
                        />
                        {errors[item.value as keyof typeof errors] && (
                            <p className='text-red-500 text-sm mt-1'>
                                {errors[item.value as keyof typeof errors]?.message?.toString()}
                            </p>
                        )}
                    </div>
                )
            ))}
        </>
    )
}

export default FormUiReusable