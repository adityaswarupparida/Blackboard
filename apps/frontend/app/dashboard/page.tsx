"use client"
import { useRouter } from "next/navigation";

const dashboard = () => {
    const router = useRouter();
    return <div>
        <button onClick={() => router.push(`/canvas/2`)}>Room 2</button>
    </div>
}

export default dashboard;