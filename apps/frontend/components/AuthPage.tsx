"use client"
export const AuthPage = ({ isSignIn }: {
    isSignIn: boolean
}) => {
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-12 m-2 w-1/3 bg-stone-800 rounded-md flex flex-col gap-4 items-center">
            <div className="flex flex-col pb-4 items-center leading-6 antialiased">
                <h2 className="text-4xl flex gap-3 font-sans font-semibold tracking-tighter"> 
                    Welcome to
                    <span className="font-mono text-red-600 font-extrabold">BLACKBOARD </span>
                </h2>
                <div className="text-xl font-stretch-condensed">Log in to access the Infinite board!</div>
            </div>
            <div className="w-full">
                <span className="text-lg leading-loose">Email</span>
                <input className="w-full p-2 py-3 text-lg bg-black text-white" type="text" placeholder="username@email.com"></input>
            </div>
            <div className="w-full">
                <span className="text-lg leading-loose">Password</span>
                <input className="w-full p-2 py-3 text-lg bg-black text-white" type="password" placeholder="••••••••••••••••"></input>
            </div>

            <button className="mt-4 text-lg bg-gradient-to-b from-red-400 to-red-700 font-medium rounded-md py-4 w-full hover:opacity-80 transition-all duration-300 ease-in-out" onClick={() => {

            }}>{ isSignIn ? "Sign in": "Sign up" }</button>
        </div>
    </div>
}