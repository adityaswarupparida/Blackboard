export enum Shapes {
    RECTANGLE,
    CIRCLE,
    LINE,
    PENCIL,
    DRAG
}

export interface Rectangle {
    type: Shapes.RECTANGLE,
    x_cood: number,
    y_cood: number,
    width: number,
    height: number
}

export interface Circle {
    type: Shapes.CIRCLE,
    cx_cood: number,
    cy_cood: number,
    x_radius: number,
    y_radius: number
}

export interface Line {
    type: Shapes.LINE,
    x_start: number,
    y_start: number,
    x_end  : number,
    y_end  : number
}