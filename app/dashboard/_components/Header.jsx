"use client";
import { UserButton } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <div className='flex p-4 items-center justify-between bg-blue-400 shadow-sm'>
      <Image src={"/logo.svg"} width={40} height={10} alt="logo" />
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-neutral-50 hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard' && 'text-neutral-50 font-bold'}`}>
          <Link href={'/dashboard'}>Dashboard</Link>
        </li>
        <li className={`hover:text-neutral-50 hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard/questions/generate-common-questions' && 'text-neutral-50 font-bold'}`}>
          <Link href={"/dashboard/questions/generate-common-questions"}>Practice Questions</Link>
        </li>

      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
