import { WS_BACKEND } from "@/config";
import { useEffect, useState } from "react"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) return () => {};
        console.log(token);
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZmQwNjAzNC0xNzhiLTQ4MGItOTE3Yi03MzgyZDIwNDlhNDUiLCJpYXQiOjE3NDExMDQ2NDF9.0HSA8Ur-4XU54VTxSh6Los8kLzsf7LZNnuNqYxfINWg
        const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);
        
        ws.onopen = () => {
            setSocket(ws);
            setLoading(false);
        }
        
        return () => { 
            if(ws.readyState === ws.OPEN) {
                ws.close();
            }
        };
    }, []);

    return {
        socket,
        loading
    }
}