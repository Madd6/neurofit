import { auth } from '@/auth';
import React from 'react'
import { ToggleTheme } from './toggleTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AudioWide } from '@/app/layout';
import { SignOut } from './signin/SignOutBtn';
import Image from 'next/image';
import Link from 'next/link';
import {  User } from 'lucide-react';

const MyNav = async () => {
    const session = await auth()
      console.log("session home", session);
      const userImage = session?.user.image ?? "";
  return (
    <div className="absolute top-0 left-0 -translate-y-0.5 flex items-center gap-4 justify-between w-full z-[9999]">
        <Link href={'/'} className="bg-gradient-to-br from-cyan-400 to-violet-700 p-2 h-[45px] w-[150px] text-foreground" style={{
            clipPath:'path("M 0,0 L 130,0 L 110,40 L 105,43 L 100,45  L 0,45 L 0,0 Z")'
        }}>
            <div className={`text-xl font-bold text-foreground bg-gradient-to-br from-cyan-400 to-violet-700 ${AudioWide.className}`} >Neurofit</div>
        </Link>
        
        <div className="flex justify-end items-center gap-2 bg-gradient-to-br from-cyan-400 to-violet-700 p-2 text-foreground w-[120px] h-[45px]" style={{
            clipPath:'path("M 0,0 L 120,0 L 120,45 L 30,45 L 20,40 L 0,0 Z")'
        }}>
            <ToggleTheme className={"text-foreground "}/>
            {session?
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className='size-9 rounded-sm overflow-hidden border-2 shadow-sm shadow-gray-800'>
                        <Image src={userImage} alt="triple triangle" width={50} height={50}/>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><SignOut /></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            :
            <Link href={'/login'} className='cursor-pointer'>
                <div className='size-9 rounded-sm overflow-hidden border-2 shadow-sm shadow-gray-800 flex justify-center items-center'>
                    <User /> 
                </div>
            </Link>
            }
        </div>
    </div>
  )
}

export default MyNav
