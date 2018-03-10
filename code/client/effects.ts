import { Point } from "./horizon/drawable"

export class Effect
{
    target: HTMLElement;
    effect: EffectEnum;
    lifeInit: number; // initial life/duration
    lifeCurrent: number; // current time left
    countInit: number; // initial count
    countCurrent: number; // current count left
    origin: Point; // starting point for moveTo()
    destination: Point; // ending point for moveTo()

    constructor(target: HTMLElement, effect: EffectEnum, life: number = 0, count: number = 0, destination: Point = undefined)
    {
        this.target = target;
        this.effect = effect;
        this.lifeInit = life;
        this.lifeCurrent = life;
        this.countInit = count;
        this.countCurrent = count;
        this.destination = destination;
        this.origin = this.getOrigin(destination, target);
    }

    advance(): boolean
    {
        let scale1 = this.lifeCurrent / this.lifeInit;
        let scale2 = 1 - this.lifeCurrent / this.lifeInit;
        switch (this.effect)
        {
            case EffectEnum.blink:
                let currentCount = Math.floor(scale1 * this.countInit)
                if (currentCount < this.countCurrent)
                {
                    if (1 === this.countCurrent % 2)
                    {
                        this.target.style.display = "none";
                    }
                    else
                    {
                        this.target.style.display = "inline";
                    }
                    this.countCurrent--;
                }

                if (this.lifeCurrent === 1)
                {
                    this.target.style.display = "inline";
                }

                break;
            case EffectEnum.fadeIn:
                this.target.style.opacity = `${scale2}`;
                break;
            case EffectEnum.fadeOut:
                this.target.style.opacity = `${scale1}`;
                break;
            case EffectEnum.makeInvisible:
                this.target.style.display = "none";
                break;
            case EffectEnum.makeVisible:
                this.target.style.display = "inline";
                break;
            case EffectEnum.moveTo:
                // target.style top/bottom, left/right values must be set for this to work
                let dx = scale2 * (this.destination.x - this.origin.x); // delta x
                let dy = scale2 * (this.destination.y - this.origin.y); // delta y

                if (this.target.style.left !== "")
                {
                    this.target.style.left = `${this.origin.x + Math.ceil(dx)}px`;
                }
                else if (this.target.style.right !== "")
                {
                    this.target.style.right = `${this.origin.x + Math.ceil(dx)}px`;
                }

                if (this.target.style.top !== "")
                {
                    this.target.style.top = `${this.origin.y + Math.ceil(dy)}px`;
                }
                else if (this.target.style.bottom !== "")
                {
                    this.target.style.bottom = `${this.origin.y + Math.ceil(dy)}px`;
                }
                break;
        }
        return 0 < this.lifeCurrent--;
    }

    getOrigin(destination: Point, target: HTMLElement): Point
    {
        if (destination)
        {
            this.destination = destination;

            // Use whatever positional values are set:
            let x, y: number;

            if (this.target.style.left !== "")
            {
                x = parseInt(target.style.left)
            }
            else if (this.target.style.right !== "")
            {
                x = parseInt(target.style.right)
            }

            if (this.target.style.top !== "")
            {
                y = parseInt(target.style.top)
            }
            else if (this.target.style.bottom !== "")
            {
                y = parseInt(target.style.bottom)
            }

            return { x: x, y: y };
        }
        else
        {
            return undefined;
        }
    }
}

export enum EffectEnum
{
    blink,
    fadeIn,
    fadeOut,
    makeVisible,
    makeInvisible,
    moveTo
}