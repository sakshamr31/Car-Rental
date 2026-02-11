import React from 'react';
import { assets, menuLinks } from '../assets/assets.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Navbar = () => {

    const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();

    const location = useLocation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    // const [search, setSearch] = useState("");

    const changeRole = async () => {
        try{
            const { data } = await axios.post("/api/owner/change-role");

            if(data.success){
                setIsOwner(true);
                return toast.success(data.message);
            }

            else{
                return toast.error(data.message);
            }
        }

        catch(error){
            return toast.error(error.message);
        }
    }

  return (

    <div className='flex items-center justify-between px-6 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all bg-zinc-100'>
        <Link to = "/">

            <img src={assets.logo} alt="logo" className='h-8'></img>
        </Link>

        <div className={ `max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-zinc-100"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}` }>

            { menuLinks.map((link, index) => (
                <Link 
                    key={index} 
                    to={link.path}
                    className='px-1 rounded-md hover:bg-indigo-50 hover:scale-110 duration-100 transition-all'
                >
                    {link.name}
                </Link>
            )) }

            {/* <div className='hidden lg:flex sm:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
                <input type="text" className='py-1.5 w-full bg-transparent outline-none placeholder-gray-600' placeholder="Search products" />
                <img src={assets.search_icon} alt='Search' />   
            </div> */}

            <div className='flex max-sm:flex-col items:start sm:items-center gap-6'>

                <button onClick={() => isOwner ? navigate("/owner") : changeRole()} 
                className='px-1 rounded-mg cursor-pointer hover:bg-indigo-50 hover:scale-110 duration-100 transition-all'>{isOwner ? "Dashboard" : "List Cars"}</button>

                <button onClick={() => {user ? logout() : setShowLogin(true)}} className='cursor-pointer px-5 py-2 bg-blue-600 hover:bg-blue-800 transition-all text-white rounded-lg'>{user ? "Logout" : "Login"}</button>
            </div>
        </div>

        <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={() => setOpen(!open)} >
            <img src={open ? assets.close_icon : assets.menu_icon} alt="Menu" />
        </button>

    </div>
  )
}

export default Navbar;