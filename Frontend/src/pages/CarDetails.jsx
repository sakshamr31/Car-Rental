import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import Loader from '../components/Loader.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const CarDetails = () => {

  const { id } = useParams();
  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();

  const navigate = useNavigate();

  const [car, setCar] = useState(null);

  const currency = import.meta.env.VITE_CURRENCY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickupDate || !returnDate) {
      toast.error("Please select both dates");
      return;
    }

    if (returnDate < pickupDate) {
      toast.error("Return date cannot be before pickup date");
      return;
    }

    try{
      const { data } = await axios.post("/api/bookings/create-booking", {
        car: id, 
        pickupDate, 
        returnDate
      });

      if(data.success){
        toast.success(data.message);
        navigate("/my-bookings");
      }
      else{
        toast.error(data.message);
      }
    }

    catch(error){
      console.log(error.response);

      toast.error(
        error.response?.data?.message || "Booking failed"
      );
    }
  }

  useEffect(() => {
    if (!cars || cars.length === 0){
      return;
    }

    setCar(cars.find(car => car._id === id
    ))
  }, [cars, id]);

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-8'>
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-8 text-green-800 cursor-pointer transition-transform duration-100 hover:scale-105'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />Back to all cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>

        {/* Left: Car Image & Details */}

        <div className='lg:col-span-2'>
          <img src={car.image} alt="" className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md' />

          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
              <p className='text-gray-600 text-lg'>{car.category} ● {car.year}</p>
            </div>

            <hr className='border-borderColor my-4' />

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type }, 
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({icon, text}) => (
                <div key={text} className='flex flex-col items-center bg-fuchsia-100 p-4 rounded-lg'>
                  <img src={icon} alt="" className='
                  h-5 mb-2' />
                  {text}
                </div>
              ))}
            </div>

            {/* Description */}
              
              <div>
                <h1 className='text-xl font-medium underline mb-2'>Description</h1>
                <p className='text-gray-600'>{car.description}</p>
              </div>

            {/* Features */}

            <div>
              <h1 className='text-xl font-medium mb-2 underline'>Features</h1>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {
                  ["Rear Parking Camera", "Bluetooth connectivity", "Power Steering", "Leather Seats","GPS", "ABS"].map((item) => (
                    <li key={item} className='flex items-center text-gray-600'>
                      <img src={assets.check_icon} alt="" className='h-4 mr-2' />
                      {item}
                    </li>
                  ))
                }
              </ul>
            </div>

          </div>
        </div>

        {/* Right: Booking Form */}

        <form onSubmit={handleSubmit} className='shadow-[0_0_20px_rgba(0,0,0,0.15)] h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-600 bg-zinc-50'>

          <p className='flex items-center justify-between text-2xl text-gray-700 font-semibold'>{currency}{car.pricePerDay}
            <span className='text-base text-gray-600 font-normal'>per day</span></p>

            <hr className='border-borderColor my-6' />

            <div className='flex flex-col gap-2'>
              <label htmlFor='pickup-date' className='text-black'>Pickup Date </label>
              
              <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='pickup-date' min={new Date().toISOString().split('T')[0]} />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='return-date' className='text-black'>Return Date </label>
              
              <input value={returnDate} onChange={(e) => setReturnDate(e.target.value)} type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='return-date' />
            </div>

            <button className='block mx-auto w-24 bg-blue-500 font-medium text-white hover:bg-cyan-700 hover:text-green-50 hover:scale-105 duration:100 py-3 rounded-xl cursor-pointer'>Book Now</button>
        </form>

      </div>
    </div>
  ) : <Loader />
}

export default CarDetails;