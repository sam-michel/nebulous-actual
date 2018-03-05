export class Drawable
{
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d");
    }
}