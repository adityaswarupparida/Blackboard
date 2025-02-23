import axios from "axios";
import { Circle, Rectangle, Shapes } from "./shapes";
import { HTTP_BACKEND } from "@/config";

type Shape = Rectangle | Circle;

export const initDraw = async (canvas: HTMLCanvasElement, roomId: number, socket: WebSocket) => {
    const ctx = canvas.getContext("2d");
    let existing_shapes: Shape[] = await getExistingShapes(roomId);

    if(!ctx) {
        return () => {};
    }
    
    socket.onmessage = (event) => {
        const messages = JSON.parse(event.data);

        // Fix the bug => overlapping of same shapes when sent and received on same socket
        if(messages.type == "chat-messages") {
            const shape = JSON.parse(messages.message);
            existing_shapes.push(shape);
            clearCanvas(existing_shapes, canvas, ctx);
        }

    }

    let start_x = 0;
    let start_y = 0; 
    let mouseclicked = false;
    let selected = localStorage.getItem('Shape');
    ctx.strokeStyle = "rgb(255 255 255)";
    clearCanvas(existing_shapes, canvas, ctx);

    var offsetX = canvas.offsetLeft;
    var offsetY = canvas.offsetTop;

    if(!selected) {
        return () => {};
    }

    const mousedownHandler = (event: MouseEvent) => {
        start_x = event.clientX - offsetX;
        start_y = event.clientY - offsetY;
        mouseclicked = true;
    }

    const mouseupHandler = (event: MouseEvent) => {
    
        console.log(Shapes[parseInt(selected)]);
        // console.log(Shapes[selectedShape]);
        mouseclicked = false;
        switch (parseInt(selected)) {
            case Shapes.RECTANGLE:
                existing_shapes.push({
                    type  : Shapes.RECTANGLE,
                    x_cood: start_x,
                    y_cood: start_y,
                    width : event.clientX - start_x,
                    height: event.clientY - start_y
                });
                break;
        
            case Shapes.CIRCLE:
                existing_shapes.push({
                    type    : Shapes.CIRCLE,
                    cx_cood : start_x,
                    cy_cood : start_y,
                    x_radius: event.clientX - offsetX,
                    y_radius: event.clientY - offsetY
                });
                break;

            default:
                break;
        }
        console.log(existing_shapes);
        // existing_shapes.push(shape);

        console.log(existing_shapes.at(-1));
        // { "type": "chat", "payload": { "roomId": "71DF327", "message": "Hey there" } }
        if(parseInt(selected) !== Shapes.PENCIL && existing_shapes.at(-1)?.type === parseInt(selected)) {
            socket.send(JSON.stringify({
                type: "chat",
                payload: {
                    roomId: Number(roomId),
                    message: JSON.stringify(existing_shapes.at(-1))
                }
            }));
                    
        }
    }

    const mousemoveHandler = (event: MouseEvent) => {
        if(mouseclicked) {
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            clearCanvas(existing_shapes, canvas, ctx);          
            switch (parseInt(selected)) {
                case Shapes.RECTANGLE:
                    ctx.strokeRect(start_x, start_y, event.clientX-start_x, event.clientY-start_y);
                    break;
            
                case Shapes.CIRCLE:
                    drawOval(ctx, start_x, start_y, event.clientX-offsetX, event.clientY-offsetY);
                    break;

                default:
                    break;
            }
        }
    }

    canvas.addEventListener("mousedown", mousedownHandler); 
    canvas.addEventListener("mouseup", mouseupHandler); 
    canvas.addEventListener("mousemove", mousemoveHandler);

    return () => { 
        // console.log('Removed '+selected);
        // console.log('Removed '+Shapes[selectedShape]);
        canvas.removeEventListener("mousedown", mousedownHandler);
        canvas.removeEventListener("mouseup", mouseupHandler);
        canvas.removeEventListener("mousemove", mousemoveHandler); 
    };
}

const clearCanvas = (existing_shapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    existing_shapes.map(shape => {
        switch (shape.type) {
            case Shapes.RECTANGLE:
                ctx.strokeRect(shape.x_cood, shape.y_cood, shape.width, shape.height);
                break;
        
            case Shapes.CIRCLE:
                drawOval(ctx, shape.cx_cood, shape.cy_cood, shape.x_radius, shape.y_radius);
                break;

            default:
                break;
        }
    })
}

const getExistingShapes = async (roomId: number) => {
    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = response.data.messages;  // [{ "userId": "9ytni98nml" { "type": 1, "x_coord": 25, "y_coord": 25, "width": 50, "height": 50 } },..]

    const shapes = messages.map((shape: { message: string }) => {
        const shapedata = JSON.parse(shape.message);
        return shapedata; 
    })

    return shapes;
}

const drawOval = (ctx: CanvasRenderingContext2D, startX: number, startY: number, x: number, y: number) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY + (y - startY) / 2);
    ctx.bezierCurveTo(startX, startY, x, startY, x, startY + (y - startY) / 2);
    ctx.bezierCurveTo(x, y, startX, y, startX, startY + (y - startY) / 2);
    ctx.closePath();
    ctx.stroke();
}