"use client"
import React from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'

const ToastButton = () => {
    function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
    }


    const testSimulasi = async (msg:string) => {
    await delay(500); // 0.5 detik
    toast.success(msg)
    };
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => testSimulasi("Event has been created")}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Event has been created")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info("Be at the area 10 minutes before the event time")
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning("Event start time cannot be earlier than 8am")
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("Event has not been created")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.promise<{ name: string }>(
            () =>
              new Promise((resolve) =>
                setTimeout(() => resolve({ name: "Event" }), 2000)
              ),
            {
              loading: "Loading...",
              success: (data) => `${data.name} has been created`,
              error: "Error",
            }
          )
        }}
      >
        Promise
      </Button>
    </div>
  )
}

export default ToastButton
