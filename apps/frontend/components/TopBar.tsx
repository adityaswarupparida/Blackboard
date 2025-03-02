import { Shapes } from "@/draw/shapes"
import { Circle, Hand, Minus, Pencil, Square } from "lucide-react";
import { IconButton } from "./IconButton";

export const TopBar = ({ selectedShape, setSelectedShape }: {
    selectedShape: Shapes;
    setSelectedShape: (Shapes: Shapes) => void;
}) => {
    return (<div className="absolute top-2 w-screen flex justify-center">
        <div className="flex gap-2 rounded-md justify-center bg-stone-800">
            <IconButton onclick={() => setSelectedShape(Shapes.DRAG)} 
                selected={selectedShape === Shapes.DRAG}>
                <Hand size={32}/>
            </IconButton>
            <IconButton onclick={() => setSelectedShape(Shapes.RECTANGLE)} 
                selected={selectedShape === Shapes.RECTANGLE}>
                <Square size={32}/>
            </IconButton>
            <IconButton onclick={() => setSelectedShape(Shapes.CIRCLE)} 
                selected={selectedShape === Shapes.CIRCLE}>
                <Circle size={32} />
            </IconButton>
            <IconButton onclick={() => setSelectedShape(Shapes.LINE)} 
                selected={selectedShape === Shapes.LINE}>
                <Minus size={32} />
            </IconButton>
            <IconButton onclick={() => setSelectedShape(Shapes.PENCIL)}
                selected={selectedShape === Shapes.PENCIL}>
                <Pencil size={32} />
            </IconButton>
        </div>
    </div>)
}