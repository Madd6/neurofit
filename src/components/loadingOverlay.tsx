import React from 'react'

const LoadingOverlay = () => {
  return (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className='w-80 h-80 bg-background rounded-xl flex flex-col gap-8 justify-center items-center shadow-2xl'> 
      <div className='text-xl font-bold'>Tunggu Sebentar...</div>
      <div className="w-20 h-20 border-4 border-transparent text-cyan-400 animate-spin flex items-center justify-center border-t-cyan-400 rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-violet-700 animate-spin border-t-violet-700 rounded-full" />
      </div>
    </div>
  </div>
  )
}

export default LoadingOverlay
