import axios from "axios";
import { Circle, Line, Pencil, Rectangle, Shapes } from "./shapes";
import { HTTP_BACKEND } from "@/config";

type Shape = Rectangle | Circle | Line | Pencil;
let existing_shapes: Shape[];
let scale = 1;
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
    ctx.lineWidth = 3;

    let points: {
        x: number;
        y: number
    }[] = [];
    redraw(canvas, ctx);

    if(!selected) {
        return () => {};
    }

    const mousedownHandler = (event: MouseEvent) => {
        start_x = (event.clientX - offsetX) / scale;
        start_y = (event.clientY - offsetY) / scale;
        mouseclicked = true;

        if(selected === 'PENCIL') {
            points.push({x: start_x, y: start_y});
        }
        drag_x = event.pageX - offsetX;
        drag_y = event.pageY - offsetY;
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
            
            case Shapes.LINE:
                existing_shapes.push({
                    type    : Shapes.LINE,
                    x_start : start_x,
                    y_start : start_y,
                    x_end   : (event.clientX - offsetX) / scale,
                    y_end   : (event.clientY - offsetY) / scale
                });
                break;

            case Shapes.PENCIL:
                points.push({x: (event.clientX - offsetX) / scale, y: (event.clientY - offsetY) / scale});
                existing_shapes.push({
                    type    : Shapes.PENCIL,
                    points  : points
                });
                points = [];
                break;

            default:
                break;
        }

        existing_shapes.forEach((shape) => {
            console.log(shape.type);
        })
        // existing_shapes.push(shape);
        redraw(canvas, ctx);

        console.log(existing_shapes.at(-1)?.type);
        // { "type": "chat", "payload": { "roomId": "71DF327", "message": "Hey there" } }
        if(parseInt(selected) !== Shapes.POINTER && existing_shapes.at(-1)?.type === parseInt(selected)) {
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
            redraw(canvas, ctx);       
            switch (parseInt(selected)) {
                case Shapes.RECTANGLE:
                    ctx.strokeRect(start_x, start_y, (event.clientX-offsetX)/scale - start_x, (event.clientY-offsetY)/scale - start_y);
                    break;
            
                case Shapes.CIRCLE:
                    drawOval(ctx, start_x, start_y, (event.clientX-offsetX)/scale, (event.clientY-offsetY)/scale);
                    break;

                case Shapes.LINE:
                    drawLine(ctx, start_x, start_y, (event.clientX-offsetX)/scale, (event.clientY-offsetY)/scale);
                    break;
                
                case Shapes.PENCIL:
                    points.push({x: (event.clientX - offsetX) / scale, y: (event.clientY - offsetY) / scale});
                    drawPencil(ctx, points);
                    break;

                case Shapes.DRAG:
                    // get mouse position
                    offsetX = event.pageX - drag_x;
                    offsetY = event.pageY - drag_y;
                    // offsetX = translate_coords.x;
                    // offsetY = translate_coords.y;
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
        // TODO: Correct the zoom factor
        const zoomfactor = event.deltaY > 0 ? 0.9 : 1.1;
        scale *= zoomfactor;

        const point_x = (event.clientX - offsetX) / scale;
        const point_y = (event.clientY - offsetY) / scale;

        offsetX = event.clientX - point_x * scale;
        offsetY = event.clientY - point_y * scale;
        // offsetX = translate_coords.x;
        // offsetY = translate_coords.y;

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

const clearCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {

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

            case Shapes.LINE:
                drawLine(ctx, shape.x_start, shape.y_start, shape.x_end, shape.y_end);
                break;

            case Shapes.PENCIL:
                drawPencil(ctx, shape.points);
                break;

            default:
                break;
        }
    })
}

const redraw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // clear the canvas
    clearCanvas(canvas, ctx);
    // set the current canvas view
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    // draw shapes
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

const drawLine = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) => {
    ctx.beginPath(); // Start a new path
    ctx.moveTo(startX, startY); // Move to (startX, startY)
    ctx.lineTo(endX, endY); // Draw a line to (endX, endY)
    ctx.stroke();
}

const drawPencil = (ctx: CanvasRenderingContext2D, points: {x: number, y: number}[]) => {
    ctx.beginPath();   	
    ctx.lineCap = 'round';   	
  
    // // The position of the cursor gets updated as we move the mouse around.
    // points.push({x: x_coord, y:y_coord});
    points.forEach((point, index) => {
        if(index == 0) {
            // The cursor to start drawing moves to this coordinate
            ctx.moveTo(point.x, point.y);  
        } else {
            // A line is traced from previous coordinate to this coordinate
            ctx.lineTo(point.x, point.y);  
        }
    }) 
    	
    // Draws the line.
    ctx.stroke();
}