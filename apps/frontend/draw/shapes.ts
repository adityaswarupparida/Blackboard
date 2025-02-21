export enum Shapes {
    RECTANGLE,
    CIRCLE,
    LINE
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
    radius: number
}