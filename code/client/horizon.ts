import { Drawable } from './drawable';

/**
 * roughness:
 */
export class Horizon extends Drawable
{
    skyColor: string = "#f00"; // default = "#f00", "#3dd" = day blue

    /* Some of these properties might be interesting... most are crap:
    landColor: string = "black";
    landSpeed: number; // moving horizon could be cool...
    skySpeed: number;
    time: number; // minute in the day 0 - 1440 */

    draw()
    {
        this.drawSpace();
        this.drawStars();
        this.drawAtmosphere();
        this.drawLand()
    }

    private drawAtmosphere()
    {
        let atmosphereBrightness = .45; // 0 - 1, .6 default
        let gradient = this.canvasContext.createLinearGradient(0, window.innerHeight, 0, 0);
        gradient.addColorStop(0, this.skyColor);
        gradient.addColorStop(Math.max(0, atmosphereBrightness - .2), "rgba(255,0,0,.5)");
        gradient.addColorStop(Math.min(1, atmosphereBrightness + -.1), "rgba(255,153,0,.3)");
        gradient.addColorStop(Math.min(1, atmosphereBrightness + .2), "rgba(0,0,0,0)"); // "rgba(48,180,240,.5)" = sky blue
        this.canvasContext.fillStyle = gradient;
        this.canvasContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    private drawLand()
    {
        // I want to allow for multiple land layers to add depth for parallax scrolling
        // land layers will be evenly vertically divided
        // land layer colors will evenly range from darkest in the back to lightest in the front
        //   - foregroundColor, backgroundColor

        let yOffset = .77; // .77
        let yDeviation = .1; // .1
        let xMaxDelta = 20; // 20
        let yMaxDelta = 5; // 5

        let x = -10;
        let y = yOffset * window.innerHeight;
        let minY = (yOffset - yDeviation) * window.innerHeight;
        let maxY = (yOffset + yDeviation) * window.innerHeight;

        this.canvasContext.beginPath();
        this.canvasContext.moveTo(x, y);

        // generate horizon line:
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

        // use a gradient to get an anti-aliasing/blurring effect on the horizon line:
        let gradient = this.canvasContext.createLinearGradient(0, maxY, 0, minY);
        gradient.addColorStop(0, "black");
        gradient.addColorStop(1, "rgba(100,0,0,.5)");
        this.canvasContext.strokeStyle = gradient;
        this.canvasContext.lineWidth = 0; // 3
        this.canvasContext.stroke();
    }

    private drawSpace()
    {
        this.canvasContext.fillStyle = "black";
        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawStars()
    {
        // Stars need to be drawn on a background canvas so they don't get redrawn when foreground elements change (atmosphere light,
        // land line movement, twinkling stars, etc).
        // To allow for star movement I actually need two background canvases
        //   - they both need to be bigger than the window,
        //   - they should be arbitrarily large to avoid having to redraw stars on resize
        //   - star movement will only be up/down for now (what about panning view...?)

        // I want additional canvas layers to draw moving "stars", meteor showers, etc.
        let starDensity = 1;
        let starSize = .5;
        let redShift = .5;
        let greenShift = .5;
        let blueShift = .5;
        let brightness = 0;
        this.drawStarLayer(this.canvas, redShift, greenShift, blueShift, brightness, starSize, starDensity * 20000);
        this.drawStarLayer(this.canvas, .1 + redShift, .1 + greenShift, .1 + blueShift, .1 + brightness, 2 * starSize, starDensity * 1000);
        this.drawStarLayer(this.canvas, .2 + redShift, .2 + greenShift, .2 + blueShift, .2 + brightness, 3 * starSize, starDensity * 100);
        this.drawStarLayer(this.canvas, .3 + redShift, .3 + greenShift, .3 + blueShift, .3 + brightness, 4 * starSize, starDensity * 10);
        this.drawStarLayer(this.canvas, .4 + redShift, .4 + greenShift, .4 + blueShift, .4 + brightness, 5 * starSize, starDensity * 1);
        //this.drawStarLayer(this.canvas, redShift, greenShift, blueShift, 1, 10 * starSize, 1); // draw a moon, need a radial gradient for this...
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
