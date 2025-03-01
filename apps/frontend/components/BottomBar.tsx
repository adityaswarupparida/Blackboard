import { Minus, Plus } from "lucide-react"

export const BottomBar = ({ canvas }: {
    canvas: HTMLCanvasElement | null
}) => {

    if(!canvas) {
        return <div>
        <div className="text-white flex absolute bottom-2 right-2 gap-1 bg-stone-800 rounded">
            <button className="py-2 px-4 hover:bg-neutral-700 rounded" onClick={() => {

            }}><Plus /></button>
            <span className="px-2 py-2" >{'100%'}</span>
            <button className="py-2 px-4 hover:bg-neutral-700 rounded" onClick={() => {

            }}><Minus /></button>
        </div>
    </div>;
    }
    return (<div>
        <div className="text-white flex absolute bottom-2 right-2 gap-1 bg-stone-800 rounded">
            <button className="py-2 px-4 hover:bg-neutral-700 rounded" onClick={() => {

            }}><Plus /></button>
            <span className="px-2 py-2" >{'100%'}</span>
            <button className="py-2 px-4 hover:bg-neutral-700 rounded" onClick={() => {
 
            }}><Minus /></button>
        </div>
    </div>)
} 

