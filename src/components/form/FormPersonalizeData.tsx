"use client"
import React, { FormEvent, useState, } from 'react'
import {useForm,FormProvider,SubmitHandler} from 'react-hook-form'
import { Button } from '../ui/button'
import FormUiReusable from './FormUiReusable'
import { zodResolver } from '@hookform/resolvers/zod'
import { insertPersonalData } from '@/action/supabaseFunc'
import { FormData,formSchema } from '@/types/schemaPersonalizeData'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'


const FormPersonalizeData = (personaldata:FormData |null) => {
    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            gender: personaldata?.gender || '',
            tanggalLahir: personaldata?.tanggalLahir || undefined,
            tinggiBadan: personaldata?.tinggiBadan || undefined,
            beratBadan: personaldata?.beratBadan || undefined,
            activityFactor: String(personaldata?.activityFactor) || '',
            goal: personaldata?.goal || '',
            riwayatPenyakit: personaldata?.riwayatPenyakit || '',
            alergi: personaldata?.alergi || '',
        }
    });
    const { handleSubmit, trigger} = methods;
    const [step , setStep] = useState<number>(1);
    const progressLabel = ["personal info","Perencanaan & Tujuan","Informasi Kesehatan"];
    const titleAndSubTitleForm = [
        {title: "Beritahu Kami Tentang Dirimu", subTitle: "Mari Mulai Dengan Memberikan Beberapa Data Pribadi"},
        {title: "Perencanaan & Tujuanmu", subTitle: "Bantu Kami Memahami Aktivitas dan Tujuanmu"},
        {title: "Preferensi & Informasi Kesehatan", subTitle: "Berikan Informasi Tambahan untuk Personalisasi Lebih Lanjut"},
    ]
    const stepFields = {
        1:["gender","tanggalLahir","tinggiBadan","beratBadan"],
        2:["activityFactor","goal"],
        3:["RiwayatPenyakit","Alergi"],
    }
    const onSubmit: SubmitHandler<FormData> = async(data) => {
        // console.log(data);
        const res = await insertPersonalData(data);
        if(!res.success || !res.data){
            toast(res.msg)
        }
        if(res.success || res.data){
            toast.success(res.msg)
        }
        redirect("/")
    }
    const handleNextStep = async(event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const fieldsToValidate = stepFields[step as keyof typeof stepFields];

        const isValid = await trigger(fieldsToValidate as any);

        if (!isValid) {
            console.log('Validasi gagal, silakan lengkapi form dengan benar');
            return;
        }
        if(step <3){
            setStep(step + 1);
        }else if(step == 3){
            methods.handleSubmit(onSubmit)();
        }
    }
    const handleBackStep = (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if(step >1){
            setStep(step - 1);
        }
    }
    return (
    <div className='w-full flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-center items-center rounded-xl mx-8 gap-4 py-8 md:w-1/3 w-2/3'>
            <div className='w-full flex justify-around items-center gap-4 '>
                {progressLabel.map((item, index) => (
                    <div className='flex flex-1/3 justify-center items-center flex-col gap-2' key={index}>
                        <div className='w-6 h-6 rounded-full bg-secondary'>
                            {index<step && (<div className='w-6 h-6 rounded-full bg-gradient-to-br from-violet-700 via-cyan-400 to-lime-400 '></div>)}
                        </div>
                        <span className="text-sm font-medium text-center md:h-12 h-24 py-4 text-secondary-foreground">{item}</span>
                    </div>

                ))}
                
            </div>
            <div className='h-1.5 w-full bg-secondary rounded-xl mt-2'>
                <div className={`w-${step}/3 bg-gradient-to-br from-violet-700 via-cyan-400 to-lime-400 h-1.5 rounded-xl`}></div>
            </div>
        </div>
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center bg-card border-2 border-secondary shadow-lg rounded-xl m-8 px-8 gap-4 py-8 md:w-1/3 w-2/3' >
                <div className='w-full'>
                    <h1 className='text-2xl font-bold'>{titleAndSubTitleForm[step-1].title}</h1>
                    <h1 className='text-md font-extralight opacity-70'>{titleAndSubTitleForm[step-1].subTitle}</h1>
                </div>
                
                    <FormUiReusable step={step} />
        
                <div className='w-full flex justify-between items-center mt-8'>
                    <Button disabled={step==1} variant={'outline'} onClick={handleBackStep}>Back</Button>
                    <Button variant={'default'} type='submit' onClick={handleNextStep}>{step == 3 ? "Submit" : "Next"}</Button>
                </div>
            </form>
        </FormProvider>
    </div>
  )
}

export default FormPersonalizeData
