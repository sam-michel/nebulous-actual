
import { Drawable } from './drawable';

/* Uses layered canvases to render an animated horizon scene. */
export class Horizon
{
    //#region constants
    private readonly skyColor: string;
    private readonly landSpeed: number;
    private readonly starMax: number[];
    private readonly starDensity: number;
    private readonly starsToDrawPerUpdate: number;
    //#endregion
    //#region private properties
    private starContextOnScreen: CanvasRenderingContext2D;
    private starContextOffScreen: CanvasRenderingContext2D;
    private starCount: number[];
    private skyContext: CanvasRenderingContext2D;
    private landContext: CanvasRenderingContext2D[];
    private offScreenContext: CanvasRenderingContext2D;
    private updateCount: number;
    //private time: number; // minute in the day 0 - 1440
    //#endregion

    constructor()
    {
        // Initialize constants:
        this.skyColor = "#f00";
        this.landSpeed = 1;
        this.starDensity = 2;
        this.starMax = [50000 * this.starDensity, 2500 * this.starDensity, 100 * this.starDensity, 10 * this.starDensity, 1 * this.starDensity];
        this.starsToDrawPerUpdate = 1000;

        // Initialize privates:
        this.starCount = [0, 0, 0, 0, 0];
        this.updateCount = 0;
        this.starContextOnScreen = Horizon.newCanvas(document.body, window.innerWidth, window.innerHeight);
        this.starContextOffScreen = Horizon.newCanvas();
        this.skyContext = Horizon.newCanvas(document.body);
        //this.landContext = [Horizon.newCanvas(document.body, 4000, 2000), Horizon.newCanvas(document.body, 4000, 2000), Horizon.newCanvas(document.body, 4000, 2000)];
        this.landContext = [Horizon.newCanvas(document.body, 4000, 2000)];
        this.offScreenContext = Horizon.newCanvas(undefined, 4000, 2000);
    }

    static newCanvas(element: HTMLElement = undefined, width: number = 2000, height: number = 2000): CanvasRenderingContext2D
    {
        let canvas = document.createElement("canvas")
        let canvasContext = canvas.getContext("2d");
        canvas.innerHTML = "Your browser does not support the canvas element.";
        canvas.width = width;
        canvas.height = height;
        canvas.style.backgroundColor = "rgba(0,0,0,0)";
        if (element)
        {
            canvas.style.border = "0";
            canvas.style.padding = "0";
            canvas.style.position = "absolute";
            canvas.style.bottom = "0px";
            canvas.style.left = "0px"
            document.body.appendChild(canvas);
        }
        return canvas.getContext("2d");
    }

    public resize = (event) =>
    {
        this.starContextOnScreen.canvas.width = window.innerWidth;
        this.starContextOnScreen.canvas.height = window.innerHeight;
    }

    /** Redraws horizon canvases as needed. Called once per frame. */
    public update()
    {
        // draw more stars on starContextOffScreen unless we've reached the max number of stars
        this.drawStars(this.starContextOffScreen);

        // Move stars:
        let period = 4;
        let speed = 1; // this is pointless while I'm using this.updateCount / period
        if (0 === this.updateCount % period)
        {
            let srcY = Math.floor(this.updateCount / period) % this.starContextOffScreen.canvas.height;
            let w = this.starContextOnScreen.canvas.width;
            let h = Math.min(this.starContextOnScreen.canvas.height, this.starContextOffScreen.canvas.height - srcY);
            this.starContextOnScreen.drawImage(this.starContextOffScreen.canvas, 0, srcY, w, h, 0, 0, w, h);

            // Check for wrap:
            if (h < this.starContextOnScreen.canvas.height)
            {
                let h2 = this.starContextOnScreen.canvas.height - h;
                this.starContextOnScreen.drawImage(this.starContextOffScreen.canvas, 0, 0, w, h2, 0, h, w, h2);
            }
        }

        // Move land:
        period = 4;
        if (0 === this.updateCount % period)
        {
            for (let i = 0; i < this.landContext.length; i++)
            {
                // Draw translated land to off-screen canvas then swap on/off screen canvases:
                speed = this.landSpeed * (i + 1) ** 2;
                this.offScreenContext.clearRect(0, 0, this.offScreenContext.canvas.width, this.offScreenContext.canvas.height);
                this.offScreenContext.drawImage(this.landContext[i].canvas, -speed, 0);
                this.offScreenContext.drawImage(this.landContext[i].canvas, 0, 0, speed, this.offScreenContext.canvas.height,
                    this.offScreenContext.canvas.width - speed, 0, speed, this.offScreenContext.canvas.height
                );
                this.landContext[i].clearRect(0, 0, this.landContext[i].canvas.width, this.landContext[i].canvas.height);
                this.landContext[i].drawImage(this.offScreenContext.canvas, 0, 0);
            }
        }

        // Update sky:
        // I want the sky color to fade between bounds based on the give "time"
        // In this case time will simply be a value between 0 and 1 where 0 is one bound and 1 is the other.
        let time = .5 * (1 + Math.sin(this.updateCount / 4000)); // slowly oscillate between 0 and 1
        this.drawSky(this.skyContext, time);


        this.updateCount++;
    }

    draw()
    {
        //this.drawSky(this.skyContext);
        this.drawLand(this.landContext);
    }

    private drawSky(context: CanvasRenderingContext2D, time: number)
    {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        let gradient = context.createLinearGradient(0, context.canvas.height, 0, context.canvas.height - window.innerHeight);
        let y: number, r: number, g: number, b: number, a: number;

        y = 0;
        r = 255;
        g = Math.floor(196 * time);
        b = 0
        a = 1;
        gradient.addColorStop(y, `rgba(${r},${g},${b},${a})`);

        y = Math.min(.8, time);
        r = Math.floor(255 * (1 - time));
        g = 0;
        b = Math.floor(255 * time);
        a = .7 + (.3 * time); // range from .5 - 1
        gradient.addColorStop(y, `rgba(${r},${g},${b},${a})`);

        y = Math.min(.9, time + .2);
        r = Math.floor(255 * (1 - time));
        g = Math.floor(153 * (1 - time));
        b = Math.floor(255 * 5 * Math.max(0, time - .6));
        a = time;
        gradient.addColorStop(y, `rgba(${r},${g},${b},${a})`);

        y = 1;
        r = 0;
        g = 0;
        b = Math.min(255, Math.floor(255 * time));
        a = time //.3 + (.7 * time);
        gradient.addColorStop(y, `rgba(${r},${g},${b},${a})`);

        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    /** Draws a land layer for each given canvas context from back to front. */
    private drawLand(contextArray: CanvasRenderingContext2D[])
    {
        for (let i = 0; i < contextArray.length; i++)
        {
            let context = contextArray[i];
            context.canvas.style.backgroundColor = "rgba(0,0,0,0)";

            let yOffset = .77 + (i * .05); // .77
            let yDeviation = 1 / (i + 1); // .1
            let xMaxDelta = 20 / (i + 1); // 20
            let yMaxDelta = 5 / (i + 1); // 5

            let screenOffset = context.canvas.height - window.innerHeight;
            let x = -10;
            let y = screenOffset + yOffset * window.innerHeight;
            let yInit = y;
            let minY = screenOffset + (yOffset - yDeviation) * window.innerHeight;
            let maxY = screenOffset + (yOffset + yDeviation) * window.innerHeight;

            context.beginPath();
            context.moveTo(x, y);

            // generate horizon line:
            do
            {
                x += Math.ceil(xMaxDelta * Math.random());
                if (x >= context.canvas.width)
                {
                    y = yInit;
                }
                else
                {
                    y += yMaxDelta - Math.floor((1 + yMaxDelta * 2) * Math.random()); // I want a value between -5 and 5 (inclusive)
                    //y = yInit + Math.floor(3 * Math.sin(x / 2)); // wavy
                    //y = yInit; // flat
                }
                y = Math.max(minY, Math.min(maxY, y));
                context.lineTo(x, y);
            } while (x < context.canvas.width);  // stop when right side is hit

            context.lineTo(x, context.canvas.height); // bottom right corner
            context.lineTo(0, context.canvas.height); // bottom left corner
            context.closePath();
            let lightness = i * .1;
            let rgba = `rgba(${Math.floor(255 * lightness)},${Math.floor(191 * lightness)},${Math.floor(0 * lightness)},1)`;
            console.log(rgba);
            context.fillStyle = rgba;
            context.fill();

            // use a gradient to get an anti-aliasing/blurring effect on the horizon line:
            //let gradient = context.createLinearGradient(0, maxY, 0, minY);
            //gradient.addColorStop(0, "black");
            //gradient.addColorStop(1, "rgba(0,0,0,.5)");
            //context.strokeStyle = gradient;
            //context.lineWidth = 3; // 3
            //context.stroke();
        }
    }

    /** Draws stars incrementally to allow for faster page loading. Smallest stars are drawn first. */
    private drawStars(context: CanvasRenderingContext2D)
    {
        // What about:
        //  twinkling stars
        //  meteor showers

        // Local constants: -- these should be factored out but horizon is getting pretty full -> time for another class
        let baseRedShift = .5;
        let baseGreenShift = .5;
        let baseBlueShift = .5;
        let baseBrightness = -.2;
        let baseStarSize = .5;

        if (this.starCount[0] === 0)
        {
            // first call to drawStars so draw space background:
            context.fillStyle = "black";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }

        let starsDrawn = 0;
        for (let i = 0; i < this.starCount.length; i++)
        {
            if (this.starCount[i] < this.starMax[i])
            {
                for (; starsDrawn < Math.min(this.starsToDrawPerUpdate, this.starMax[i]); starsDrawn++)
                {
                    this.starCount[i]++;
                    let redShift = baseRedShift + .1 * i;
                    let greenShift = baseGreenShift + .1 * i;
                    let blueShift = baseBlueShift + .1 * i;
                    let brightness = baseBrightness + [-.2, .0, .2, .3, .4][i];
                    let starSize = baseStarSize * (1 + i);
                    let star = new Star(context.canvas, redShift, greenShift, blueShift, brightness, starSize);
                    star.draw();
                }
            }
        }
    }
}

/** A star. */
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
