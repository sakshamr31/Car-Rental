import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const [cars, setCars] = useState([]);

    const setAuthToken = (token) => {
        if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem("token", token);
            setToken(token);
        }
        else{
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem("token");
            setToken(null);
        }
    }

    //fn. to check if user is logged in
    const fetchUser = async () => {
        try{
            const { data } = await axios.get("/api/user/data");

            if(data.success){
                setUser(data.user); 
                
                if(data.user.role === "owner"){
                    setIsOwner(true);
                }
                else{
                    setIsOwner(false);
                }

            }

            else{
                navigate("/");
            }
        }

        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //fn. to fetch all cars from the server
    const fetchCars = async () => {
        try{
            const { data } = await axios.get("/api/user/cars");

            if(data.success){
                setCars(data.cars);
            }
            else{
                toast.error(data.message);
            }
        }

        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //fn. to log out user
    const logout = () => {
        setAuthToken(null);
        setUser(null);
        setIsOwner(false);

        return toast.success("You have been logged out");
    }


    //useEffect to get token from local storage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if(storedToken){
            setAuthToken(storedToken);
        }
    }, []);

    //useEffect to get user data when token is available
    useEffect(() => {
        if(token){
            fetchUser();
            fetchCars();
        }

    }, [token]);

    const value = {
        navigate, 
        currency, 
        axios, 
        user, setUser, 
        token, setToken, 
        setAuthToken,
        isOwner, setIsOwner, 
        fetchUser, 
        showLogin, setShowLogin, 
        logout, 
        fetchCars, 
        cars, setCars, 
        pickupDate, setPickupDate, 
        returnDate, setReturnDate
    };

    return (
    <AppContext.Provider value={value}>
        { children }
    </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
};