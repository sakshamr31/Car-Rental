import React, { useState } from 'react';
import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets.js';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const AddCar = () => {

  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: '', 
    model: '', 
    year: 0, 
    pricePerDay: 0, 
    transmission: '', 
    fuel_type: '', 
    seating_capacity: 0,
    location: '', 
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if(isLoading){
      return null;
    }

    if(!image){
      toast.error("Please upload a car image");
      return;
    }

    setIsLoading(true);

    try{
      const formData = new FormData();

      formData.append('image', image);
      formData.append('carData', JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if(data.success){
        toast.success(data.message);

        setImage(null);

        setCar({
          brand: '', 
          model: '', 
          year: 0, 
          pricePerDay: 0, 
          transmission: '', 
          fuel_type: '', 
          seating_capacity: 0,
          location: '', 
          description: '',
        });
      }
      else{
        toast.error(data.message);
      }
    }

    catch(error){
      toast.error(error.message);
    }

    finally{
      setIsLoading(false);
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 block mx-auto bg-emerald-50'>
      <Title title="Add New Car" subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications" />

      <form onSubmit={ onSubmitHandler } className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* Car Image */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor='car-image'>

            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" required className='h-14 rounded cursor-pointer mb-1' />

            <input type='file' id='car-image' accept='image/*' hidden onChange={e => setImage(e.target.files[0])} />
          </label>

          <p className='text-sm text-emerald-900'>Upload an image of your Car </p>
        </div>

        {/* Car Brand & Model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>

            <label className='text-emerald-800'>Brand</label>

            <input type="text" placeholder='e.g. BMW, Mercedes, Audi...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-600' value={car.brand} onChange={e  => setCar({...car, brand: e.target.value})}/>
          </div>

          <div className='flex flex-col w-full'>

            <label className='text-emerald-800'>Model</label>

            <input type="text" placeholder='e.g. X5, E-Class, M4...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-600' value={car.model} onChange={e  => setCar({...car, model: e.target.value})}/>
          </div>
        </div>

        {/* Car year, Price, Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>

          <div className='flex flex-col w-full'>

            <label className='text-emerald-800'>Year</label>

            <input type="number" placeholder='e.g. 2023, 2024...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-600' value={car.year} onChange={e  => setCar({...car, year: Number(e.target.value)})}/>
          </div>

          <div className='flex flex-col w-full'>

            <label className='text-emerald-800'>Daily Price ({currency})</label>

            <input type="number" placeholder='e.g. 100, 150, 200...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-600' value={car.pricePerDay} onChange={e  => setCar({...car, pricePerDay: Number(e.target.value)})}/>
          </div>

          <div className='flex flex-col w-full'>

            <label className='text-emerald-800'>Category</label>

            <select onChange={e => setCar({...car, category: e.target.value})} value={car.category} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-600'>

              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Van">Van</option>
            </select>

          </div>
        </div>

        {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>

          <div className='flex flex-col w-full'>

            <label className='text-emerald-800'>Transmission</label>

            <select onChange={e => setCar({...car, transmission: e.target.value})} value={car.transmission} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-600'>

              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>

          </div>

          <div className='flex flex-col w-full'>

            <label className='text-emerald-800'>Fuel Type</label>

            <select onChange={e => setCar({...car, fuel_type: e.target.value})} value={car.fuel_type} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-600'>

              <option value="">Select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>

          </div>

          <div className='flex flex-col w-full'>

            <label className='text-emerald-800'>Seating Capacity</label>

            <input type="number" placeholder='e.g. 2, 4...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-600' value={car.seating_capacity} onChange={e  => setCar({...car, seating_capacity: Number(e.target.value)})} />
          </div>
        </div>

        {/* Car Location */}
        <div className='flex flex-col w-full'>
          <label className='text-emerald-800'>Location</label>

            <select onChange={e => setCar({...car, location: e.target.value})} value={car.location} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-600'>

              <option value="">Select a location</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Houston">Houston</option>
              <option value="Chicago">Chicago</option>
            </select>
        </div>

        {/* Car Description */}
        <div className='flex flex-col w-full'>

          <label className='text-emerald-800'>Description</label>

          <textarea rows={5} placeholder='Get ready for a hassle-free ride! This car is clean, comfortable, and packed with features to make every trip enjoyable — whether it’s a quick city run or a long adventure.' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-600' value={car.description} onChange={e  => setCar({...car, description: e.target.value})}></textarea>
        </div>

        <button disabled={isLoading} className={`flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max transition-all duration-100 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-lime-700 hover:scale-105 cursor-pointer'}`}>
          <img src={assets.tick_icon} alt="" />{isLoading ? "Listing..." : "List Your Car"}
        </button>

      </form>
    </div>

  )
}

export default AddCar;