import { ReactNode } from "react"

export const IconButton = ({ children, onclick, selected }: {
    children : ReactNode;
    onclick  : () => void;
    selected: boolean;
}) => {
    return <button className={`${selected? `bg-red-400 text-white rounded-md hover:bg-red-300` : `text-red-400`} hover:bg-slate-200 hover:rounded-md cursor-pointer p-3 m-1`} 
        onClick={onclick}>
        { children }
    </button>;
} 



{/* <button className="text-black hover:bg-slate-200 hover:rounded-md cursor-pointer p-2 "><Pencil fill="#f87171"/></button> */}
{/* <Circle fill={`#f87171d9`} stroke={`#f87171d9`}/> */}