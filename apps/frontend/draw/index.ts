import axios from "axios";
import { Circle, Rectangle, Shapes } from "./shapes";
import { HTTP_BACKEND } from "@/config";

type Shape = Rectangle | Circle;

export const initDraw = async (canvas: HTMLCanvasElement, roomId: number, socket: WebSocket) => {
    const ctx = canvas.getContext("2d");
    let existing_shapes: Shape[] = await getExistingShapes(roomId);

    if(!ctx) {
        return;
    }
    
    socket.onmessage = (event) => {
        const messages = JSON.parse(event.data);

        if(messages.type == "chat-messages") {
            const shape = JSON.parse(messages.message);
            existing_shapes.push(shape);
            clearCanvas(existing_shapes, canvas, ctx);
        }

    }

    let start_x = 0;
    let start_y = 0; 
    let mouseclicked = false;
    ctx.strokeStyle = "rgb(255 255 255)"
    clearCanvas(existing_shapes, canvas, ctx);
    
    canvas.addEventListener("mousedown", function (event) {
        start_x = event.clientX;
        start_y = event.clientY;
        mouseclicked = true;
    }); 
    canvas.addEventListener("mouseup", function (event) {
        mouseclicked = false;
        const shape: Shape = {
            type  : Shapes.RECTANGLE,
            x_cood: start_x,
            y_cood: start_y,
            width : event.clientX-start_x,
            height: event.clientY-start_y
        }
        existing_shapes.push(shape);

        console.log(shape);
        // { "type": "chat", "payload": { "roomId": "71DF327", "message": "Hey there" } }
        socket.send(JSON.stringify({
            type: "chat",
            payload: {
                roomId: Number(roomId),
                message: JSON.stringify(shape)
            }
        }));
    }); 
    canvas.addEventListener("mousemove", function (event) {
        if(mouseclicked) {
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            clearCanvas(existing_shapes, canvas, ctx);
            ctx.strokeRect(start_x, start_y, event.clientX-start_x, event.clientY-start_y);
        }

    });
}

const clearCanvas = (existing_shapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    existing_shapes.map(shape => {
        switch (shape.type) {
            case Shapes.RECTANGLE:
                ctx.strokeRect(shape.x_cood, shape.y_cood, shape.width, shape.height);
                break;
        
            case Shapes.CIRCLE:
                
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