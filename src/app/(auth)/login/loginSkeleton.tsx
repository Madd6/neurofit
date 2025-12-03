// app/login/LoginSkeleton.tsx (Server Component)
export default function LoginSkeleton() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className="container h-[80vh] w-[80%] rounded-2xl flex justify-between items-center">
        <div className="flex flex-col h-full lg:w-[40%] w-full items-center justify-center bg-gray-800 rounded-2xl animate-pulse">
          <div className='w-[90%] flex flex-col justify-center items-center h-full gap-4'>
            {/* Title skeleton */}
            <div className='h-8 w-3/4 bg-gray-700 rounded'></div>
            <div className='h-6 w-2/3 bg-gray-700 rounded'></div>
            
            {/* Button skeletons */}
            <div className='flex flex-col w-[90%] gap-3 mt-8'>
              <div className='h-12 bg-gray-700 rounded'></div>
              <div className='h-12 bg-gray-700 rounded'></div>
            </div>
          </div>
        </div>
        
        {/* Desktop placeholder */}
        <div className='hidden lg:flex h-full lg:w-[60%] items-center justify-center bg-gray-900 rounded-2xl'>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
}