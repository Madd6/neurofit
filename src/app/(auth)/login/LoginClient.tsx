// app/(auth)/login/LoginClient.tsx
"use client"
import dynamic from 'next/dynamic';
import { useState } from 'react';
import SignIn from '@/components/signin/SigInBtn';
import { useWindowSize } from '@/hooks/usewindowsize';
import { GoArrowRight } from "react-icons/go";
// import SplineElement from './SplineElement';

const SplineElement = dynamic(
  () => import("./SplineElement").then((mod) => mod.default),
  {
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    ),
    ssr: false,
  }
);

export default function LoginClient() {
  const { isDesktop } = useWindowSize();
  const [isLoginClicked, setIsLoginClicked] = useState(false);

  const handleClickLanjutkanLogin = () => {
    setIsLoginClicked(true);
  };

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className="container h-[80vh] w-[80%] rounded-2xl flex justify-between items-center">
        {/* Login Form */}
        <div className="flex flex-col h-full lg:w-[40%] w-full items-center justify-center bg-gray-800 rounded-2xl">
          <div className='w-[90%] flex flex-col justify-center items-center h-full'>
            <div className='flex flex-col justify-center items-center'>
              <h1 className='lg:text-2xl text-xl text-center font-medium text-white'>
                Siap Sehat? Ayo Masuk!
              </h1>
              <h3 className='lg:text-xl text-l text-center font-light text-white'>
                Masuk untuk Memulai Perjalanan Diet Anda!
              </h3>
            </div>
            <div className='h-[30%] flex flex-col w-[90%] items-center justify-center rounded-md gap-3'>
              <SignIn provider="google" />
              <SignIn provider="github" />
            </div>
          </div>
        </div>

        {/* Desktop Spline */}
        {isDesktop && (
          <div className='lg:flex h-full lg:w-[60%] items-center justify-center bg-gray-900 rounded-2xl overflow-hidden'>
            <SplineElement />
          </div>
        )}
      </div>

      {/* Mobile Splash Screen */}
      {!isDesktop && !isLoginClicked && (
        <div className='absolute w-full h-full bg-black transition-all flex flex-col justify-around items-center p-4 gap-4'>
          <div className='w-full h-[80%] bg-gray-800 rounded-2xl shadow-lg overflow-hidden'>
            <SplineElement />
          </div>
          <div className='w-full h-[20%] bg-gray-800 rounded-2xl shadow-lg flex justify-center items-center'>
            <button
              onClick={handleClickLanjutkanLogin}
              className='bg-gray-300 text-lg text-center rounded-lg shadow text-black p-2 flex justify-center items-center gap-2'
            >
              Lanjut Login <GoArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}