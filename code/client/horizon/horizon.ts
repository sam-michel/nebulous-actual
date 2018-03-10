/***********************************************************************\
 * Uses layered canvases to render an animated horizon scene. *
\***********************************************************************/

import { Drawable } from './drawable';

export class Horizon
{
    skyColor: string = "#f00"; // default = "#f00", "#3dd" = day blue
    landSpeed = 1;


    starContext: CanvasRenderingContext2D;
    private skyContext: CanvasRenderingContext2D;
    private landContext: CanvasRenderingContext2D[];
    private offScreenContext: CanvasRenderingContext2D;
    private updateCount: number;
    //time: number; // minute in the day 0 - 1440

    constructor()
    {
        let element = document.body;
        this.starContext = Horizon.newCanvas(element);
        this.skyContext = Horizon.newCanvas(element);
        this.landContext = [Horizon.newCanvas(element, 4000, 1000), Horizon.newCanvas(element)];
        this.offScreenContext = Horizon.newCanvas(undefined, 4000, 1000);
        this.updateCount = 0;
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
            canvas.onmousemove = Horizon.mouseMove;
            canvas.onkeypress = Horizon.keyPress;
            document.body.appendChild(canvas);
        }
        return canvas.getContext("2d");
    }

    /***********************************************************************\
     * Called once per frame
    \***********************************************************************/
    update()
    {
        let period = 4;
        let speed = 1;
        if (0 === this.updateCount % period)
        {
            this.starContext.drawImage(this.starContext.canvas, 0, -speed);
            this.starContext.drawImage(this.starContext.canvas, 0, this.starContext.canvas.height - speed);
        }

        period = 4;
        speed = this.landSpeed;
        if (0 === this.updateCount % period)
        {
            // Draw translated land to off-screen canvas then swap on/off screen canvases:
            this.offScreenContext.clearRect(0, 0, this.offScreenContext.canvas.width, this.offScreenContext.canvas.height);
            this.offScreenContext.drawImage(this.landContext[0].canvas, -speed, 0);
            this.offScreenContext.drawImage(this.landContext[0].canvas, 0, 0, speed, this.offScreenContext.canvas.height,
                this.offScreenContext.canvas.width - speed, 0, speed, this.offScreenContext.canvas.height
            );
            this.landContext[0].clearRect(0, 0, this.landContext[0].canvas.width, this.landContext[0].canvas.height);
            this.landContext[0].drawImage(this.offScreenContext.canvas, 0, 0);
        }

        this.updateCount++;
    }
    static keyPress(k: KeyboardEvent)
    {
        console.log(`{key pressed on canvas: ${k.key}}`)
        if (k.key === "Enter")
        {
            //app.focusTarget = app.terminal.input;
            //app.effectsQueue.push([new Effect(app.terminal.form, EffectEnum.moveTo, 20, { x: 0, y: 0 })]);

        }
    }

    static mouseMove(mouseEvent: MouseEvent): boolean
    {
        // mouse moved over canvas...
        return true;
    }

    draw()
    {
        //this.drawSpace(); this seems pointless, I can just draw a black box on the star layer
        this.drawStars(this.starContext);
        this.drawSky(this.skyContext);
        this.drawLand(this.landContext[0]);
        //this.drawLand2(this.landLayer);
    }

    private drawSky(context: CanvasRenderingContext2D)
    {
        let brightness = .45; // 0 - 1, .6 default
        let gradient = context.createLinearGradient(0, context.canvas.height, 0, context.canvas.height - window.innerHeight);
        gradient.addColorStop(0, this.skyColor);
        gradient.addColorStop(Math.max(0, brightness - .2), "rgba(255,0,0,.5)"); //"rgba(255,0,0,.5)"
        gradient.addColorStop(Math.min(1, brightness + -.1), "rgba(255,153,0,.3)"); //"rgba(255,153,0,.3)"
        gradient.addColorStop(Math.min(1, brightness + .2), "rgba(0,0,0,0)"); // "rgba(48,180,240,.5)" = sky blue
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    private drawLand(context: CanvasRenderingContext2D)
    {
        // I want to allow for multiple land layers to add depth for parallax scrolling
        // land layers will be evenly vertically divided
        // land layer colors will evenly range from darkest in the back to lightest in the front
        //   - foregroundColor, backgroundColor
        context.canvas.style.backgroundColor = "rgba(0,0,0,0)";

        let yOffset = .77; // .77
        let yDeviation = .2; // .1
        let xMaxDelta = 15; // 20
        let yMaxDelta = 15; // 5

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
            }
            y = Math.max(minY, Math.min(maxY, y));
            context.lineTo(x, y);
        } while (x < context.canvas.width);  // stop when right side is hit

        context.lineTo(x, context.canvas.height); // bottom right corner
        context.lineTo(0, context.canvas.height); // bottom left corner
        context.closePath();
        context.fillStyle = "black"
        context.fill();

        // use a gradient to get an anti-aliasing/blurring effect on the horizon line:
        let gradient = context.createLinearGradient(0, maxY, 0, minY);
        gradient.addColorStop(0, "black");
        gradient.addColorStop(1, "rgba(0,0,0,.5)");
        context.strokeStyle = gradient;
        context.lineWidth = 3; // 3
        context.stroke();

        //this.landImage.src = context.canvas.toDataURL('image/jpeg');
    }

    private drawStars(context: CanvasRenderingContext2D)
    {
        context.fillStyle = "black";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        // Stars should be drawn over a short duration so as not to block page load
        // Stars need to be drawn on a background canvas so they don't get redrawn when foreground elements change (atmosphere light,
        // land line movement, twinkling stars, etc).
        // To allow for star movement I actually need two background canvases
        //   - they both need to be bigger than the window,
        //   - they should be arbitrarily large to avoid having to redraw stars on resize
        //   - star movement will only be up/down for now (what about panning view...?)

        // I want additional canvas layers to draw moving "stars", meteor showers, etc.
        let starDensity = 2; // 4
        let starSize = .5;
        let redShift = .5;
        let greenShift = .5;
        let blueShift = .5;
        let brightness = -.2;
        this.drawStarLayer(context.canvas, redShift, greenShift, blueShift, brightness - .2, starSize, starDensity * 50000);
        this.drawStarLayer(context.canvas, .1 + redShift, .1 + greenShift, .1 + blueShift, brightness + .0, 2 * starSize, starDensity * 2500);
        this.drawStarLayer(context.canvas, .2 + redShift, .2 + greenShift, .2 + blueShift, brightness + .2, 3 * starSize, starDensity * 100);
        this.drawStarLayer(context.canvas, .3 + redShift, .3 + greenShift, .3 + blueShift, brightness + .3, 4 * starSize, starDensity * 10);
        this.drawStarLayer(context.canvas, .4 + redShift, .4 + greenShift, .4 + blueShift, brightness + .4, 5 * starSize, starDensity * 1);
        //this.drawStarLayer(this.canvas, redShift, greenShift, blueShift, 1, 10 * starSize, 1); // draw a moon, need a radial gradient for this...

        // capture starCanvas as an image:
        //this.starImage.src = context.canvas.toDataURL('image/jpeg');
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
