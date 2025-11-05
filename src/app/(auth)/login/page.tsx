"use client"
import SignIn from '@/components/signin/SigInBtn';
import { useWindowSize } from '@/hooks/usewindowsize'
import { GoArrowRight } from "react-icons/go";

import Spline from '@splinetool/react-spline';
import { useRef, useState } from 'react';

function Page() {
    const { isDesktop } = useWindowSize();
    const [isLoginClicked, setIsLoginClicked] = useState(false)
    const splineRef = useRef(null)
    const handleClickLAnjutkanLogin = () => {
        setIsLoginClicked(true);
        console.log(isLoginClicked)
    }
  return (
    <div className='flex h-screen w-full items-center justify-center '>
        <div className="container h-[80vh] w-[80%] rounded-2xl  flex justify-between items-center">
            <div className="flex flex-col h-full lg:w-[40%] w-full items-center justify-center bg-gray-800 rounded-2xl">
                <div className='w-[90%] flex flex-col justify-center items-center h-full '>
                    <div className='flex flex-col justify-center items-center '>
                        <h1 className='lg:text-2xl text-xl text-center font-medium text-white'>Siap Sehat? Ayo Masuk!</h1>
                        <h3 className='lg:text-xl text-l text-center font-light text-white'>Masuk untuk Memulai Perjalanan Diet Anda!</h3>
                    </div>
                    <div className='h-[30%]  flex flex-col w-[90%] items-center justify-center rounded-md gap-3'>
                            <SignIn provider="google" />
                            <SignIn provider="github" />
                    </div>
                </div>
            </div>
            {
                isDesktop?
                    <div className='lg:flex h-full lg:w-[60%] items-center justify-center bg-gray-900 rounded-2xl overflow-hidden'>
                        <Spline ref={splineRef} scene="https://prod.spline.design/qh2mN7VU8TecM9PW/scene.splinecode" />
                    </div>
                :null
            }
        </div>
        {
            !isDesktop&&!isLoginClicked&&(
                <div className='absolute w-full h-full bg-black transition-all flex flex-col justify-around items-center p-4 gap-4 '>
                    <div className='w-full h-[80%] bg-gray-800 rounded-2xl shadow-lg overflow-hidden'>
                        <Spline ref={splineRef} scene="https://prod.spline.design/qh2mN7VU8TecM9PW/scene.splinecode" />
                    </div>
                    <div className='w-full h-[20%] bg-gray-800 rounded-2xl shadow-lg flex justify-center items-center'>
                        <button onClick={handleClickLAnjutkanLogin} className='bg-gray-300 text-lg text-center rounded-lg shadow text-black p-2 flex justify-center items-center gap-2'>Lanjut Login <GoArrowRight /></button>
                    </div>
                </div>)
        }
    </div>
  )
}

export default Page