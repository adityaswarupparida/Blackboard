"use client"
export const AuthPage = ({ isSignIn }: {
    isSignIn: boolean
}) => {
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-4 m-2 w-1/5 h-1/5 bg-white rounded-md flex flex-col gap-2 items-center">
            <div className="w-full">
                <input className="w-full p-2" type="text" placeholder="Email"></input>
            </div>
            <div className="w-full">
                <input className="w-full p-2" type="password" placeholder="Password"></input>
            </div>

            <button className="bg-red-400 rounded p-2 w-full" onClick={() => {

            }}>{ isSignIn ? "Sign in": "Sign up" }</button>
        </div>
    </div>
}