"use client"
import { handleAuthSubmit } from "@/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export const AuthPage = ({ isLogIn }: {
    isLogIn: boolean
}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const router = useRouter();

    useEffect(() => {
        if(typeof window !== 'undefined') {
            if(token)
                localStorage.setItem('token', token);
        }
    }, [token]);

    const handleClick = async () => { 
        const { redirectTo, token, error } = await handleAuthSubmit(isLogIn, username, password) 
        if(isLogIn && token != '') {
            setToken(token);
        }
        
        if(!error) {
            router.push(`\\${redirectTo}`);
        }
    }

    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="xl:p-12 p-6 m-2 md:w-1/3 sm:w-1/2 w-2/3 min-w-[375px] bg-stone-800 rounded-md flex flex-col gap-4 items-center">
            <div className="flex flex-col pb-4 items-center leading-6 antialiased">
                <h2 className="xl:text-4xl md:text-3xl text-2xl flex md:gap-3 gap-1 2xl:flex-row lg:flex-col font-sans font-semibold tracking-tighter"> 
                    Welcome to
                    <span className="font-mono text-red-600 font-extrabold">BLACKBOARD </span>
                </h2>
                <div className="xl:text-xl lg:text-lg text-md font-stretch-condensed text-pretty text-center">Log in to access the Infinite board!</div>
            </div>
            <div className="w-full">
                <span className="lg:text-lg leading-loose">Email</span>
                <input onChange={(event) => setUsername(event.target.value)} className="w-full p-2 py-3 lg:text-lg rounded-md bg-black text-white" type="text" placeholder="username@email.com"></input>
            </div>
            <div className="w-full">
                <span className="lg:text-lg leading-loose">Password</span>
                <input onChange={(event) => setPassword(event.target.value)} className="w-full p-2 py-3 lg:text-lg rounded-md bg-black text-white" type="password" placeholder="••••••••••••••••"></input>
            </div>

            <button className="mt-2 py-3 sm:mt-4 sm:py-4 sm:text-lg bg-gradient-to-b from-red-400 to-red-700 font-medium rounded-md w-full hover:opacity-80 transition-all duration-300 ease-in-out" 
                onClick={handleClick}>
                    { isLogIn ? "Sign in": "Sign up" }
            </button>
        </div>
    </div>
}