import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets.js';
import Title from '../components/Title.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const MyBookings = () => {

  const { axios, user, currency } = useAppContext();

  const [bookings, setBookings] = useState([]);

  const fetchMyBookings = async () => {
    try{
      const { data } = await axios.get("/api/bookings/user-bookings");

      if(data.success){
        setBookings(data.bookings);
      }
      else{
        toast.error(data.message);
      }
    }

    catch(error){
      toast.error(error.message);
    }
  }

  useEffect(() => {
    user && fetchMyBookings();
  }, [user]);

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
      <Title title="My Bookings" subTitle="View and manage your all car bookings" align="left" />

      <div>
        {bookings.map((booking, index) => (

          <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-zinc-600 rounded-lg mt-5 first:mt-12'>
            
            {/* Car Image + Info */}

            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover' />
              </div>

              <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>

              <p className='text-gray-600'>{booking.car.year} ● {booking.car.category} ● {booking.car.location}</p>
            </div>

            {/* Booking Info */}

            <div className='md:col-span-2'>
              <div className='flex items-center gap-5'>

                <p className='px-3 py-1.5 bg-cyan-100 rounded'>Booking #{index+1}</p>

                <p className={`px-3 py-1 text-xs rounded-full ${booking.status === "confirmed" ? "bg-green-600" : "bg-red-500"} `}>{booking.status}</p>
              </div>

              <div className='flex items-start gap-2 mt-4'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />

                <div>
                  <p className=''>Rental Period</p>

                  <p className='text-blue-800'>{booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]} </p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-4'>
                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1' />

                <div>
                  <p className=''>Pick-up Location</p>

                  <p className='text-blue-800'>{booking.car.location}</p>
                </div>
              </div>

            </div>

            {/* Price */}
            
            <div className='md:col-span-1 flex flex-col justify-between gap-6'>
              <div className='text-sm text-right'>
                <p>Total Price</p>

                <h1 className='text-2xl font-semibold text-gray-600'>{currency}{booking.price}</h1>

                <p className='py-1'>
                  <span>Booked on:</span>
                  {" "}
                  <span className="text-blue-800">{booking.createdAt.split("T")[0]}</span>
                </p>

              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default MyBookings;