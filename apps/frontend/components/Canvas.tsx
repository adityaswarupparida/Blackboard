"use client"
import { initDraw } from "@/draw";
import { Circle, Pencil, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Shapes } from "@/draw/shapes";

const Canvas = ({ roomId, socket }: { 
    roomId: number;
    socket: WebSocket; 
}) => {
    const canvasref = useRef<HTMLCanvasElement>(null);
    const [selectedShape, setSelectedShape] = useState<Shapes>(Shapes.PENCIL);
    const isMountedRef = useRef<boolean>(true);  // For Prod, make it default to false

    useEffect(() => {
        localStorage.setItem('Shape', JSON.stringify(selectedShape));
    }, [selectedShape])
    
    useEffect(() => {
        // console.log('1 '+Shapes[selectedShape]);
        // console.log('1 '+localStorage.getItem('Shape'));
        let cleanup : (() => void );
        const startcanvas = async () => {    
            if(canvasref.current && !isMountedRef.current) {
                const canvas = canvasref.current;
                // console.log('2 '+'canvas work start');
                cleanup = await initDraw(canvas, roomId, socket); 
                // console.log('3 '+'canvas work done');

            }  
        }

        startcanvas();
        return () => {
            // console.log('4 '+'Cleanup entered');
            // console.log('4 '+cleanup);
            isMountedRef.current = false;
            if(cleanup) {
                cleanup();
                // console.log('5 '+'Cleanup done');
            }
        }
    }, [canvasref, selectedShape])

    return (<div>
        <canvas ref={canvasref} height={947} width={1710}></canvas>
        <div className="absolute top-2 w-screen flex justify-center">
            <div className="flex gap-2 rounded-md justify-center bg-white">
                <IconButton onclick={() => {
                    setSelectedShape(Shapes.RECTANGLE)
                }} selected={selectedShape === Shapes.RECTANGLE}>
                    <Square fill={`${selectedShape === Shapes.RECTANGLE ? `#f87171d9`: `none`}`}/>
                </IconButton>
                <IconButton onclick={() => {
                    setSelectedShape(Shapes.CIRCLE)
                }} selected={selectedShape === Shapes.CIRCLE}>
                    <Circle fill={`${selectedShape === Shapes.CIRCLE ? `#f87171d9`: `none`}`}/>
                </IconButton>
                <IconButton onclick={() => {
                    setSelectedShape(Shapes.PENCIL)
                }} selected={selectedShape === Shapes.PENCIL}>
                    <Pencil fill={`${selectedShape === Shapes.PENCIL ? `#f87171d7`: `none`}`}/>
                </IconButton>
            </div>
        </div>
    </div>)
}

export default Canvas;