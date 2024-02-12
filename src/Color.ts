export enum Color {
    White = "w",
    Black = "b"
}

export function getOppositeColor(color: Color): Color {
    return color === Color.White ? Color.Black : Color.White;
}