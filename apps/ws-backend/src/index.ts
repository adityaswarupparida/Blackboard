import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-utils/config";
import { prisma } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

const users: {
    socket : WebSocket;
    userId : string;
    rooms  : number[];
}[] = []

const authenticateUser = (token: string): string | null => {
    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        // check typeof decodedData is string or not
        if(typeof decodedData == 'string') {
            return null;
        }

        if(!decodedData || !(decodedData as JwtPayload).userId) {
            return null;
        }
        return decodedData.userId;          
    } catch(e) {
        return null;
    }
}

wss.on("connection", (socket, request) => {
    // ws://localhost:8000?token=2b78coy78xbo8nnxo89
    const url = request.url ?? "";
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") ?? "";
    const userId = authenticateUser(token);

    if(!userId) {
        socket.close();
        return;
    }
    // Push the current user to users array
    users.push({
        socket: socket,
        userId: userId,
        rooms : []
    })
    /**
     * message: { "type": "join", "payload": { "roomId": "71DF327" } }
     * message: { "type": "leave", "payload": { "roomId": "71DF327" } }
     * message: { "type": "chat", "payload": { "roomId": "71DF327", "message": "Hey there" } }
     */
    socket.on("message", async (message) => {
        const parsedMsg = JSON.parse(message.toString());
        console.log(parsedMsg);
        switch (parsedMsg.type) {
            case 'join_room': {
                const user = users.find(user => socket === user.socket);
                user?.rooms.push(parsedMsg.payload.roomId)
                break;
            }
            case 'leave_room': {
                const user = users.find(user => socket === user.socket);
                if(!user) {
                    return;
                }
                user.rooms = user.rooms.filter(room => room !== parsedMsg.payload.roomId);
                break;
            }

            case 'chat': {
                await prisma.chat.create({
                    data: {
                        roomId : parsedMsg.payload.roomId,
                        message: parsedMsg.payload.message,
                        userId : userId
                    }
                })

                users.forEach(user => {
                    if(user.rooms.includes(parsedMsg.payload.roomId)) {
                        user.socket.send(JSON.stringify({
                            type : "chat-messages",
                            roomId : parsedMsg.payload.roomId,
                            message: parsedMsg.payload.message,
                        }))
                    }
                })
                break;
            }
            default:
                break;
        }

    })
})

