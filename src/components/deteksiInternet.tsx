"use client";

import { useEffect, useState } from "react";

export default function InternetGate({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-black text-white">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">📡 Tidak Ada Internet</h1>
          <p className="text-sm opacity-80">Silakan periksa koneksi kamu</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
