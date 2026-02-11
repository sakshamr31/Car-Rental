import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets.js';
import Title from '../../components/owner/Title.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const ManageCars = () => {

  const { isOwner, axios, currency } = useAppContext();

  const [cars, setCars] = useState([]);

  const fetchOwnerCars = async () => {
    try{
      const { data } = await axios.get("/api/owner/cars");

      if(data.success){
        setCars(data.cars);
      }
      else{
        toast.error(data.message);
      }
    }

    catch(error){
      toast.error(error.message);
    }
  }

  const toggleAvailability = async (carId) => {
    try{
      const { data } = await axios.post("/api/owner/toggle-car", {carId});

      if(data.success){
        toast.success(data.message);
        fetchOwnerCars();
      }
      else{
        toast.error(data.message);
      }
    }

    catch(error){
      toast.error(error.message);
    }
  }

  const deleteCar = async (carId) => {
    try{
      const isConfirm = window.confirm("Do you really want to delete this car?");

      if(!isConfirm){
        return null;
      }

      const { data } = await axios.post("/api/owner/delete-car", {carId});

      if(data.success){
        toast.success(data.message);
        fetchOwnerCars();
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
    if(isOwner){
      fetchOwnerCars();
    }
  }, [isOwner]);

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title title="Manage Cars" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses." />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-s text-left text-gray-600'>

          <thead className='text-zinc-800'>
            <tr>
              <th className='p-3 font-medium min-w-50'>Cars</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium max-md:hidden'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((car, index) => (
              <tr key={car._id} className='border-t border-borderColor'>
                <td className='p-3 flex items-center gap-3'>

                  <img src={car.image} alt="" className='h-16 w-16 aspect-square rounded-md object-cover' />

                  <div className='max-md:hidden'>

                    <p className='font-medium text-gray-600'>{car.brand} {car.model}</p>
                    <p className='text-xs text-gray-600'>{car.seating_capacity} • {car.transmission}</p>
                  </div>
                </td>

                <td className='p-3 max-md:hidden'>{car.category}</td>
                <td className='p-3'>{currency}{car.pricePerDay}/day</td>

                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs ${car.isAvailable ? 'bg-green-200 text-green-700' : 'bg-red-100 text-red-500' } `}>
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className='p-3 align-top'>
                  <div className='flex items-center'></div>

                  <img 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleAvailability(car._id); 
                    }} 
                    src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} alt="" className='cursor-pointer' />

                  <img onClick={() => deleteCar(car._id)} src={assets.delete_icon} alt="" className='cursor-pointer' />
                </td>
              </tr>

            ))}

          </tbody>
        </table>

      </div>
    </div>
  )
}

export default ManageCars;