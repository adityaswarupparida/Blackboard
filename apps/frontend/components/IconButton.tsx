import { ReactNode } from "react"

export const IconButton = ({ children, onclick, selected }: {
    children : ReactNode;
    onclick  : () => void;
    selected: boolean;
}) => {
    return <button className={`${selected? `bg-gradient-to-b from-red-400 to-red-600 text-white rounded-md hover:opacity-90` : `text-red-400`} 
        hover:bg-red-200 hover:rounded-md cursor-pointer p-3 m-1`} onClick={onclick}>
        { children }
    </button>;
} 