import { Drawable } from './drawable';

/**
 * roughness:
 */
export class Horizon extends Drawable
{
    roughness: number; // slope change per segment
    slopeMirrorFrequency: number; // how frequently slope changes from positive <=> negative 0 - 1
    maxSlope: number; // max steepness in degrees 0 - 360 --radians better here?
    minSlope: number; // min steepness
    maxSegmentLength: number; // max length of horizon line segment
    minSegmentLength: number;
    horizonColor: string = "#000";
    horizonSpeed: number;
    skyColor: string = "#3dd"; // default = "#d30"
    skySpeed: number;
    skyDirection: number; // 0 - 360
    starDensity: number;
    time: number; // minute in the day 0 - 1440

    draw()
    {
        this.drawSpace();
        this.drawStars();
        this.drawAtmosphere();
        this.drawLand()
    }

    private drawAtmosphere()
    {
        let atmosphereBrightness = 1; // 0 - 1, .6 default
        var gradient = this.canvasContext.createLinearGradient(0, this.canvas.height, 0, 0);
        gradient.addColorStop(0, this.skyColor);
        gradient.addColorStop(atmosphereBrightness, "rgba(48,180,240,0)"); // "rgba(0,0,0,0)"
        this.canvasContext.fillStyle = gradient;
        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawLand()
    {
        let yOffset = .77;
        let yDeviation = .1;
        let xMaxDelta = 20;
        let yMaxDelta = 5;

        let x = 0;
        let y = yOffset * this.canvas.height;
        let minY = (yOffset - yDeviation) * this.canvas.height;
        let maxY = (yOffset + yDeviation) * this.canvas.height;

        this.canvasContext.beginPath();
        this.canvasContext.moveTo(x, y);

        // draw horizon line:
        do
        {
            x += Math.ceil(xMaxDelta * Math.random());
            y += yMaxDelta - Math.floor((1 + yMaxDelta * 2) * Math.random()); // I want a value between -5 and 5 (inclusive)
            y = Math.max(minY, Math.min(maxY, y));
            this.canvasContext.lineTo(x, y);
        } while (x < this.canvas.width);  // stop when right side is hit

        this.canvasContext.lineTo(x, this.canvas.height); // bottom right corner
        this.canvasContext.lineTo(0, this.canvas.height); // bottom left corner
        this.canvasContext.closePath();
        this.canvasContext.fillStyle = "black"
        this.canvasContext.fill();
    }

    private drawSpace()
    {
        this.canvasContext.fillStyle = "black";
        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawStars()
    {
        let starDensity = 2;
        let starSize = .5;
        let redShift = .5;
        let greenShift = .5;
        let blueShift = .5;
        let brightness = 0;
        this.drawStarLayer(this.canvas, redShift, greenShift, blueShift, brightness, starSize, starDensity * 10000);
        this.drawStarLayer(this.canvas, .1 + redShift, .1 + greenShift, .1 + blueShift, .1 + brightness, 2 * starSize, starDensity * 1000);
        this.drawStarLayer(this.canvas, .2 + redShift, .2 + greenShift, .2 + blueShift, .2 + brightness, 3 * starSize, starDensity * 100);
        this.drawStarLayer(this.canvas, .3 + redShift, .3 + greenShift, .3 + blueShift, .3 + brightness, 4 * starSize, starDensity * 10);
        this.drawStarLayer(this.canvas, .4 + redShift, .4 + greenShift, .4 + blueShift, .4 + brightness, 5 * starSize, starDensity * 1);
        //this.drawStarLayer(this.canvas, redShift, greenShift, blueShift, 1, 10 * starSize, 1); // draw a moon
    }

    private drawStarLayer(canvas: HTMLCanvasElement, redShift: number, greenShift: number, blueShift: number, brightnessWeight: number, radius: number, count: number)
    {
        for (let i = 0; i < count; i++)
        {
            let star = new Star(canvas, redShift, greenShift, blueShift, brightnessWeight, radius);
            star.draw();
        }
    }
}

/**
 * A star.
 */
class Star extends Drawable
{
    radius: number; // 1px - 5px
    red: number; // 0 - 255
    green: number; // 0 - 255
    blue: number; // 0 - 255
    alpha: number; // 0 - 1
    x: number // 0 - 1
    y: number // 0 - 1

    /**
     * Creates a new star with randomness.
     * @param canvas canvas element on which to draw star
     * @param redShift value between -1 and 1
     * @param greenShift value between -1 and 1
     * @param blueShift value between -1 and 1
     * @param brightnessWeight value between -1 and 1
     * @param radius star radius in px
     */
    constructor(canvas: HTMLCanvasElement, redShift: number, greenShift: number, blueShift: number, brightnessWeight: number, radius: number)
    {
        super(canvas);
        this.radius = radius
        this.x = Math.random();
        this.y = Math.random();

        let cap = 256
        this.red = Math.max(0, Math.min(cap, Math.floor(cap * (redShift + Math.random()))));
        this.green = Math.max(0, Math.min(cap, Math.floor(cap * (greenShift + Math.random()))));
        this.blue = Math.max(0, Math.min(cap, Math.floor(cap * (blueShift + Math.random()))));
        this.alpha = brightnessWeight + Math.random();
    }

    draw()
    {
        this.canvasContext.beginPath();
        this.canvasContext.arc(this.x * this.canvas.width, this.y * this.canvas.height, this.radius, 0, 2 * Math.PI);
        this.canvasContext.fillStyle = `rgba(${this.red},${this.green},${this.blue},${this.alpha})`;
        this.canvasContext.fill();
    }

}
