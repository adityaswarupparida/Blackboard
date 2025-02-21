"use client"
import { initDraw } from "@/draw";
import { CircleIcon } from "@/icons/circle";
import { RectangleIcon } from "@/icons/rectangle";
import { useEffect, useRef } from "react";

const Canvas = ({ roomId, socket }: { 
    roomId: number;
    socket: WebSocket; 
}) => {
    const canvasref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(canvasref.current) {
            const canvas = canvasref.current;
            initDraw(canvas, roomId, socket); 
        }
    }, [canvasref])

    return (<div>
        <canvas ref={canvasref} height={947} width={1710}></canvas>
        <div className="absolute top-2 w-screen flex justify-center">
            <div className="flex gap-2 rounded-md justify-center bg-white">
                <div className="text-black hover:bg-slate-200 hover:rounded-md cursor-pointer p-2"><RectangleIcon /></div>
                <div className="text-black hover:bg-slate-200 hover:rounded-md cursor-pointer p-2 "><CircleIcon /></div>
            </div>
        </div>
    </div>)
}

export default Canvas;