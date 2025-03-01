import axios from "axios";
import { Circle, Line, Rectangle, Shapes } from "./shapes";
import { HTTP_BACKEND } from "@/config";

type Shape = Rectangle | Circle | Line;
let existing_shapes: Shape[];
let scale = 1;
let translate_coords: {
    x: number;
    y: number;
} = {
    x: 0,
    y: 0
};
let offsetX = 0;
let offsetY = 0;
export const initDraw = async (canvas: HTMLCanvasElement, roomId: number, socket: WebSocket) => {
    const ctx = canvas.getContext("2d");
    existing_shapes = await getExistingShapes(roomId);

    if(!ctx) {
        return () => {};
    }

    socket.onmessage = (event) => {
        const messages = JSON.parse(event.data);

        // Fix the bug => overlapping of same shapes when sent and received on same socket
        if(messages.type == "chat-messages") {
            const shape = JSON.parse(messages.message);
            existing_shapes.push(shape);
            redraw(canvas, ctx);
        }

    }

    let start_x = 0;
    let start_y = 0; 
    let drag_x: number;
    let drag_y: number;
    let mouseclicked = false;
    let selected = localStorage.getItem('Shape');
    ctx.strokeStyle = "rgb(255 255 255)";
    redraw(canvas, ctx);

    if(!selected) {
        return () => {};
    }

    const mousedownHandler = (event: MouseEvent) => {
        start_x = (event.clientX - offsetX) / scale;
        start_y = (event.clientY - offsetY) / scale;
        mouseclicked = true;

        drag_x = event.pageX - translate_coords.x;
        drag_y = event.pageY - translate_coords.y;
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
                    width : (event.clientX - offsetX) / scale - start_x,
                    height: (event.clientY - offsetY) / scale - start_y
                });
                break;
        
            case Shapes.CIRCLE:
                existing_shapes.push({
                    type    : Shapes.CIRCLE,
                    cx_cood : start_x,
                    cy_cood : start_y,
                    x_radius: (event.clientX - offsetX) / scale,
                    y_radius: (event.clientY - offsetY) / scale
                });
                break;

            default:
                break;
        }
        console.log(existing_shapes);
        // existing_shapes.push(shape);
        // clearCanvas(existing_shapes, canvas, ctx, scale, translate_coords);          
        redraw(canvas, ctx);

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
            // clearCanvas(existing_shapes, canvas, ctx, scale, translate_coords);   
            redraw(canvas, ctx);       
            switch (parseInt(selected)) {
                case Shapes.RECTANGLE:
                    ctx.strokeRect(start_x, start_y, (event.clientX-offsetX)/scale - start_x, (event.clientY-offsetY)/scale - start_y);
                    break;
            
                case Shapes.CIRCLE:
                    drawOval(ctx, start_x, start_y, (event.clientX-offsetX)/scale, (event.clientY-offsetY)/scale);
                    break;

                case Shapes.DRAG:
                    // get mouse position
                    translate_coords.x = event.pageX - drag_x;
                    translate_coords.y = event.pageY - drag_y;
                    offsetX = translate_coords.x;
                    offsetY = translate_coords.y;
                    // if(event.pageX > canvas.width)
                    //     canvas.width += translate_coords.x;
                    // if(event.pageY > canvas.height)
                    //     canvas.height += translate_coords.y;
                    redraw(canvas, ctx);
                    break;

                default:
                    break;
            }
        }
    }

    const wheelHandler = (event: WheelEvent) => {
        const zoomfactor = event.deltaY > 0 ? 0.9 : 1.1;
        scale *= zoomfactor;

        const point_x = (event.clientX - offsetX) / scale;
        const point_y = (event.clientY - offsetY) / scale;

        translate_coords.x = event.clientX - point_x * scale;
        translate_coords.y = event.clientY - point_y * scale;
        offsetX = translate_coords.x;
        offsetY = translate_coords.y;

        redraw(canvas, ctx);
    }
    // const resizeHandler = async (event: Event) => {
    //     canvas.width = canvas.clientWidth;
    //     canvas.height = canvas.clientHeight;
    //     // await initDraw(canvas, roomId, socket);
    // }

    // canvas.addEventListener("resize", resizeHandler);
    canvas.addEventListener("mousedown", mousedownHandler); 
    canvas.addEventListener("mouseup", mouseupHandler); 
    canvas.addEventListener("mousemove", mousemoveHandler);
    canvas.addEventListener("wheel", wheelHandler);
    canvas.addEventListener("contextmenu", (event) => event.preventDefault());


    return () => { 
        // console.log('Removed '+selected);
        // console.log('Removed '+Shapes[selectedShape]);
        // canvas.removeEventListener("resize", resizeHandler);
        canvas.removeEventListener("mousedown", mousedownHandler);
        canvas.removeEventListener("mouseup", mouseupHandler);
        canvas.removeEventListener("mousemove", mousemoveHandler); 
    };
}

const clearCanvas = (existing_shapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number, translate_coords: { x: number, y: number }) => {

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

}

const drawShapes = (existing_shapes: Shape[], ctx: CanvasRenderingContext2D) => {
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

const redraw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    clearCanvas(existing_shapes, canvas, ctx, scale, translate_coords);

    ctx.setTransform(scale, 0, 0, scale, translate_coords.x, translate_coords.y);

    drawShapes(existing_shapes, ctx);
} 

const getExistingShapes = async (roomId: number) => {
    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = response.data.messages;  // [{ "userId": "9ytni98nml", { "type": 1, "x_coord": 25, "y_coord": 25, "width": 50, "height": 50 } },..]

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