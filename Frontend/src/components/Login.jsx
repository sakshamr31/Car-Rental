import React from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Login = () => {

    const { setShowLogin, axios, setAuthToken, navigate } = useAppContext();

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (e) => {
        try{
            e.preventDefault();

            const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

            if(data.success){
                setAuthToken(data.token);
                setShowLogin(false);
                navigate("/");
            }

            else{
                toast.error(data.message);
            }
        }

        catch(error){
            console.log(error.response?.data); 
            toast.error(error.response?.data?.message || error.message);
        }
    }

  return (
    <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm bg-black/50'>

        <form 
            onSubmit={onSubmitHandler} 
            onClick={(e) => e.stopPropagation()} 
            className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-88 text-gray-600 rounded-lg shadow-xl border border-gray-200 bg-neutral-100">

            <p className="text-2xl font-medium m-auto text-fuchsia-900">
                <span>User </span> 
                {state === "login" ? "Login" : "Sign Up"}
            </p>

            {state === "register" && (
                <div className="w-full">
                    <p className='text-zinc-700'>Name</p>

                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="text-gray-600 border border-gray-300 rounded w-full p-2 mt-1 outline-indigo-300" type="text" required />
                </div>
            )}

            <div className="w-full">
                <p className='text-zinc-700'>Email</p>

                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" 
                className="text-gray-600 border border-gray-300 rounded w-full p-2 mt-1 outline-indigo-300" type="email" required />
            </div>

            <div className="w-full text-zinc-700">
                <p className='text-zinc-700'>Password</p>

                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="text-gray-600 border border-gray-300 rounded w-full p-2 mt-1 outline-indigo-300" type="password" required />
            </div>

            {state === "register" ? (
                <p className='text-amber-950'>Already have account? 
                <span onClick={() => setState("login")} 
                className="text-zinc-600 cursor-pointer"> click here</span>
                </p>
            ) : (
                <p className='text-amber-950'>Create an account? 
                <span onClick={() => setState("register")} 
                className="text-zinc-600 cursor-pointer"> click here</span>
                </p>
            )}

            <button className="bg-purple-600 hover:bg-blue-700 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>

        </form>
    </div>
  )
}

export default Login;