"use client"
export const AuthPage = ({ isSignIn }: {
    isSignIn: boolean
}) => {
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
                <input className="w-full p-2 py-3 lg:text-lg rounded-md bg-black text-white" type="text" placeholder="username@email.com"></input>
            </div>
            <div className="w-full">
                <span className="lg:text-lg leading-loose">Password</span>
                <input className="w-full p-2 py-3 lg:text-lg rounded-md bg-black text-white" type="password" placeholder="••••••••••••••••"></input>
            </div>

            <button className="mt-2 py-3 sm:mt-4 sm:py-4 sm:text-lg bg-gradient-to-b from-red-400 to-red-700 font-medium rounded-md w-full hover:opacity-80 transition-all duration-300 ease-in-out" onClick={() => {

            }}>{ isSignIn ? "Sign in": "Sign up" }</button>
        </div>
    </div>
}