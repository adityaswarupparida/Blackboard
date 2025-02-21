import RoomCanvas from "@/components/RoomCanvas";

const Cannvas = async ({ params }: {
    params: {
        roomId: number
    }
}) => {

    const roomId = (await params).roomId;
    return <RoomCanvas roomId={roomId} />
}

export default Cannvas;