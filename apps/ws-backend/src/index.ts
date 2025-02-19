import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket, request) => {
    // ws://localhost:8000?token=2b78coy78xbo8nnxo89
    const url = request.url ?? "";
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") ?? "";

    const decodedData = jwt.verify(token, JWT_SECRET);

    if(!decodedData || !(decodedData as JwtPayload).userId) {
        socket.close();
        return;
    }

    socket.on("message", (data) => {
        socket.send("Connected to Websocket");
    })
})

