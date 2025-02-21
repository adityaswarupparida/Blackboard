"use client"
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";
import Canvas from "./Canvas";

const RoomCanvas = ({ roomId }: { roomId: number }) => {
    const { socket, loading } = useSocket();

    useEffect(() => {
        if(socket && !loading) {
            socket.send(JSON.stringify({
                type: "join_room",
                payload: {
                    roomId: Number(roomId)
                }
            }))
        }
    }, [socket, loading])

    if(!socket) {
        return <div>Loading...</div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}

export default RoomCanvas;