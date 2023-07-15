'use client'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'

const Menu = () => {
    const router = useRouter()
    const pathname = usePathname();
    console.log(pathname)

    return (
        <div className='flex flex-col gap-2 pt-2 w-[20%] bg-[#6913D8] h-[100vh]'>
            <div className={`text-sm text-white font-medium px-2 cursor-pointer ${pathname === '/' && 'border-l-2'}`} onClick={() => router.push('/')}>Products</div>
            <div className={`text-sm text-white font-medium px-2 cursor-pointer ${pathname.includes('/carts') && 'border-l-2'}`} onClick={() => router.push('/carts')}>Cart</div>
        </div >
    )
}

export default Menu