import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets.js';
import Title from '../../components/owner/Title.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const ManageBookings = () => {

  const { currency, axios } = useAppContext();

  const [bookings, setBookings] = useState([]);

  const fetchOwnerBookings = async () => {
    try{
      const { data } = await axios.get("/api/bookings/owner-bookings");

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

  const changeBookingStatus = async (bookingId, status) => {
    try{
      const { data } = await axios.post("/api/bookings/change-status", {bookingId, status});

      if(data.success){
        toast.success(data.message);
        fetchOwnerBookings();
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
    fetchOwnerBookings();
  }, []);


  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title title="Manage Bookings" subTitle="Review customer bookings, confirm reservations, or cancel requests." />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-sm text-left text-gray-600'>

          <thead className='text-zinc-800'>
            <tr>
              <th className='p-3 font-medium min-w-50'>Cars</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>Payment</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id} className='border-t border-borderColor text-gray-600'>

                <td className='p-3 flex items-center gap-3'>

                  <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />

                  <p className='font-medium max-md:hidden'>{booking.car.brand} {booking.car.model}</p>

                </td>

                <td className='p-3 max-md:hidden'>
                  {new Date(booking.pickupDate).toLocaleDateString()}
                  to {new Date(booking.returnDate).toLocaleDateString()}

                </td>

                <td className='p-3'>{currency}{booking.price}</td>

                <td className='p-3 max-md:hidden'>
                  <span className='bg-gray-200 px-3 py-1 rounded-full text-s'>offline</span>
                </td>

                <td className='p-3'>

                  {booking.status === 'pending' ? (
                    <select onChange={e => changeBookingStatus(booking._id, e.target.value)} value={booking.status} 
                    className='px-2 py-1.5 mt-1 text-gray-600 border border-borderColor rounded-md outline-none'>

                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-s font-semibold ${booking.status === 'confirmed' ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'}`}>{booking.status}</span>
                  )}
                </td>
              </tr>

            ))}

          </tbody>
        </table>

      </div>
    </div>
  )
}

export default ManageBookings;