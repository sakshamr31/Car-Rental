import React, { useState } from 'react';
import { assets, cityList } from '../assets/assets.js';
import { useAppContext } from '../context/AppContext.jsx';

const Hero = () => {

    const [pickupLocation, setPickupLocation] = useState('');

    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();

    const handleSearch = (e) => {
        e.preventDefault();

        navigate("/cars?pickupLocation=" + pickupLocation + "&pickupDate=" + pickupDate + "&returnDate=" + returnDate);
    }

  return (

    <div className='h-screen flex flex-col items-center justify-center gap-15 bg-light text-center'>
        
        <h1 className='text-4xl md:text-5xl font-semibold -mt-16'>Luxury Cars on Rent</h1>

        <form onSubmit={handleSearch} className='flex flex-col md:flex-row items-start p-5 rounded-lg md:rounded-full md:px-12 w-full max-w-70 md:max-w-200 bg-amber-100 shadow-[0_-6px_20px_rgba(0,0,0,0.08),0px_8px_20px_rgba(0,0,0,0.1)]'>

            <div className='flex flex-col md:flex-row items-start md:items-center gap-10 w-full justify-between'>

                <div className='flex flex-col items-start gap-2'>

                    <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>

                        <option value="">Pickup Location</option>

                           {cityList.map((city) => <option key={city} value={city}>{city}
                        </option>)}
                    </select>

                    <p className='px-1 text-sm text-gray-600'>{pickupLocation ? pickupLocation : "Please Select Location"}</p>
                </div>

                <div className='flex flex-col items-start gap-2'>

                    <label htmlFor='pickup-date'>Pick-up Date</label>

                    <input value={pickupDate} onChange={e => setPickupDate(e.target.value)} type='date' id='pickup-date' min={new Date().toISOString().split('T')[0]} className='text-sm text-gray-600' required/>
                </div>

                <div className='flex flex-col items-start gap-2'>

                    <label htmlFor='return-date'>Return Date</label>

                    <input value={returnDate} onChange={e => setReturnDate(e.target.value)} type='date' id='return-date' className='text-sm text-gray-600' required/>
                </div>

                <button className='flex items-center justify-center gap-1 px-6 py-3 max-sm:mt-4 bg-blue-600 hover:bg-blue-800 text-white rounded-full cursor-pointer'>

                    <img src={assets.search_icon} alt="Search" className='brightness-500 px-0.5' />
                    Search
                </button>

            </div>
        </form>

        <img src={assets.main_car} alt="Main Car" className='max-h-74' />
    </div>
  )
}

export default Hero;