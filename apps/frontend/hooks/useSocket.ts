import { WS_BACKEND } from "@/config";
import { useEffect, useState } from "react"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ws = new WebSocket(`${WS_BACKEND}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMzg5YjJmYy0yODkzLTQ0MTItYThiOC02NmMzNmNhZWFmYjYiLCJpYXQiOjE3NDAwNjAyMzJ9.ZV7YwDW7JlSMrKOxAs0CNqGJknJFTnqfGB1aLQgce2s`);
        
        ws.onopen = () => {
            setSocket(ws);
            setLoading(false);
        }
        
        return () => ws.close();
    }, []);

    return {
        socket,
        loading
    }
}