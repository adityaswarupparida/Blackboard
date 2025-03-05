"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Shapes } from "@/draw/shapes";
import { TopBar } from "./TopBar";
import { BottomBar } from "./BottomBar";

const Canvas = ({ roomId, socket }: { 
    roomId: number;
    socket: WebSocket; 
}) => {
    const canvasref = useRef<HTMLCanvasElement>(null);
    const [selectedShape, setSelectedShape] = useState<Shapes>(Shapes.POINTER);
    const isMountedRef = useRef<boolean>(true);  // For Prod, make it default to false
    const [asyncDone, setAsyncDone] = useState<boolean>(false);

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
                console.log('3 '+'canvas work done');
                setAsyncDone(!isMountedRef.current);

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
        <canvas ref={canvasref} height={window.innerHeight} width={window.innerWidth} 
        className="bg-black border-solid border-5 border-white"></canvas>
        <TopBar selectedShape={selectedShape} setSelectedShape={setSelectedShape} />
        <BottomBar canvas={canvasref.current} />
    </div>)
}

export default Canvas;