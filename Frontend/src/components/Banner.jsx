import React from 'react';
import { assets } from '../assets/assets.js';

const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 md:pl-14 pt-5 bg-linear-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden'>

        <div className='text-shadow-indigo-100'>

            <h2 className='text-3xl font-medium'>Got a LUXURY CAR sitting idle? </h2>

            <p className='text-zinc-200 mt-3'>List your luxury vehicle on CarRental and unlock a smarter way to earn with flexible bookings and trusted customers.</p>

            <button className='cursor-pointer px-5 py-2 mt-6 mb-4 text-blue-50 bg-red-500 hover:bg-red-800 hover:text-amber-100 duration-100 transition-all  rounded-lg'>List Your Car</button>
        </div>

        <img src={assets.banner_car_image} alt="car" className='max-h-45' />

    </div>
  )
}

export default Banner