"use client"
import { UserButton } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import Image from "next/image";
import { usePathname } from 'next/navigation';
function Header() {
  const path=usePathname();
  useEffect(()=>{
    console.log(path);
  },[]);
  return (
    <div className='flex p-4 items-center justify-between bg-blue-400 shadow-sm'>
      <Image src={"/logo.svg"} width={40} height={10} alt="logo"/>
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-neutral-50 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard' && 'text-neutral-50 font-bold'}`}>Dashboard</li>
        <li className={`hover:text-neutral-50 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/questions' && 'text-neutral-50 font-bold'}`}>Questions</li>
        <li className={`hover:text-neutral-50 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/upgrade' && 'text-neutral-50 font-bold'}`}>Upgrade</li>
        <li className={`hover:text-neutral-50 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/how' && 'text-neutral-50 font-bold'}`}>How it Works?</li>
      </ul>
      <UserButton/>
    </div>
  )
}

export default Header
