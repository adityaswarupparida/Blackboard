import { Shapes } from "@/draw/shapes"
import { Circle, Hand, Minus, Pencil, Square } from "lucide-react";
import { IconButton } from "./IconButton";
import { HandIcon } from "@/icons/hand";

export const TopBar = ({ selectedShape, setSelectedShape }: {
    selectedShape: Shapes;
    setSelectedShape: (Shapes: Shapes) => void;
}) => {
    return (<div className="absolute top-2 w-screen flex justify-center">
        <div className="flex gap-2 rounded-md justify-center bg-stone-800">
            <IconButton onclick={() => {
                setSelectedShape(Shapes.DRAG)
            }} selected={selectedShape === Shapes.DRAG}>
                <Hand />
            </IconButton>
            <IconButton onclick={() => {
                setSelectedShape(Shapes.RECTANGLE)
            }} selected={selectedShape === Shapes.RECTANGLE}>
                {/* <Square fill={`${selectedShape === Shapes.RECTANGLE ? `#f87171d9`: `none`}`}/> */}
                <Square />
            </IconButton>
            <IconButton onclick={() => {
                setSelectedShape(Shapes.CIRCLE)
            }} selected={selectedShape === Shapes.CIRCLE}>
                {/* <Circle fill={`${selectedShape === Shapes.CIRCLE ? `#f87171d9`: `none`}`}/> */}
                <Circle />
            </IconButton>
            <IconButton onclick={() => {
                setSelectedShape(Shapes.LINE)
            }} selected={selectedShape === Shapes.LINE}>
                {/* <Minus fill={`${selectedShape === Shapes.LINE ? `#f87171d7`: `none`}`}/> */}
                <Minus />
            </IconButton>
            <IconButton onclick={() => {
                setSelectedShape(Shapes.PENCIL)
            }} selected={selectedShape === Shapes.PENCIL}>
                {/* <Pencil fill={`${selectedShape === Shapes.PENCIL ? `#f87171d1`: `none`}`}/> */}
                <Pencil />
            </IconButton>
        </div>
    </div>)
}