import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets.js';
import CarCard from '../components/CarCard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Cars = () => {

  //get search params from url
  const [searchParams] = useSearchParams();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const [input, setInput] = useState();
  const [filteredCars, setFilteredCars] = useState([]);

  const applyFilter = () => {
    if(!input){
      setFilteredCars(cars);
      return;
    }

    const search = input.toLowerCase();

    const filtered = cars.filter(car =>
      car.brand?.toLowerCase().includes(search) || 
      car.model?.toLowerCase().includes(search) || 
      car.category?.toLowerCase().includes(search) || 
      car.transmission?.toLowerCase().includes(search) ||
      String(car.seating_capacity).toLowerCase().includes(search) ||
      car.fuel_type?.toLowerCase().includes(search) ||
      car.location?.toLowerCase().includes(search)
    );

    setFilteredCars(filtered);
  }

  const searchCarAvailability = async () => {
    try{
      const { data } = await axios.post("/api/bookings/check-availability", {location: pickupLocation, pickupDate, returnDate});

      if(data.success){
        setFilteredCars(data.cars);

        if(data.cars.length === 0){
          toast("No cars available");
        }
      }
    }
    
    catch(error){   
      console.error(error);

      const message = error.response?.data?.message || "Something went wrong";

      toast.error(message);
    }
  }

  const isSearchData = pickupLocation && pickupDate && returnDate;

  useEffect(() => {
    if(isSearchData){
      searchCarAvailability();
    }
  }, [pickupLocation, pickupDate, returnDate]);

  useEffect(() => {
    if(cars.length > 0 && !isSearchData){
      applyFilter();
    }
  }, [input, cars]);

  return (
    <div>
      <div className='flex flex-col items-center py-15 bg-green-100 md:px-4'>

        <Title title="Available Cars" subTitle="Browse our collection of premium vehicles available for your next adventure." />

        <div className="flex items-center bg-white px-5 mt-9 max-w-140 w-full h-12 rounded-full shadow-[0_-4px_16px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.08)]">

          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />

          <input onChange={(e) => {
            setInput(e.target.value)
          }} value={input} 
          type="text" placeholder="Search by make, model or features" className='w-full h-full outline-none text-gray-600' />

          <img src={assets.filter_icon} alt="" className='flex-1 h-4.5 ml-2' />
        </div>
      </div>

      <div className='text-lg px-6 md:px-16 lg:px-24 xl:px-32 mt-8'>
        <p className='text-teal-800 xl:px-20 max-w-7xl mx-auto'>Showing {filteredCars.length} Cars</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index) => (
            <div key={car._id}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Cars;