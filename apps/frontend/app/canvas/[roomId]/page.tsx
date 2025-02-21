"use client"
import { useEffect, useRef } from "react";

const Cannvas = () => {
    const canvasref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(canvasref.current) {
            const canvas = canvasref.current;
            const ctx = canvas.getContext("2d");

            if(!ctx) {
                return;
            }
            
            let start_x = 0, start_y = 0; 
            let mouseclicked = false;
            ctx.strokeStyle = "rgb(255 255 255)"
            
            canvas.addEventListener("mousedown", function (event) {
                start_x = event.clientX;
                start_y = event.clientY;
                mouseclicked = true;
            }); 
            canvas.addEventListener("mouseup", function (event) {
                mouseclicked = false;
            }); 
            canvas.addEventListener("mousemove", function (event) {
                if(mouseclicked) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeRect(start_x, start_y, event.clientX-start_x, event.clientY-start_y);
                }

            }); 
        }
    }, [canvasref])

    return (<div>
        <canvas ref={canvasref} height={947} width={1710}></canvas>
    </div>)
}

export default Cannvas;