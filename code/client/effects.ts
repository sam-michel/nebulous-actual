import { Point } from "./drawable"

export class Effect
{
    target: HTMLElement;
    effect: EffectEnum;
    lifeMax: number; // initial life
    lifeCurrent: number; // current time left
    origin: Point;
    destination: Point;

    constructor(target: HTMLElement, effect: EffectEnum, lifeMax: number = 0, destination: Point = undefined)
    {
        this.target = target;
        this.effect = effect;
        this.lifeMax = lifeMax;
        this.lifeCurrent = lifeMax;
        this.origin = { x: parseInt(target.style.left), y: parseInt(target.style.top) }
        this.destination = destination;
    }

    advance(): boolean
    {
        let opacity;
        switch (this.effect)
        {
            case EffectEnum.blink:
                break;
            case EffectEnum.fadeIn:
                opacity = 1 - this.lifeCurrent / this.lifeMax;
                this.target.style.opacity = `${opacity}`;
                break;
            case EffectEnum.fadeOut:
                opacity = this.lifeCurrent / this.lifeMax;
                this.target.style.opacity = `${opacity}`;
                break;
            case EffectEnum.makeInvisible:
                this.target.style.display = "none";
                break;
            case EffectEnum.moveTo:
                let scale = 1 - this.lifeCurrent / this.lifeMax;
                let dx = scale * (this.destination.x - this.origin.x); // delta x
                let dy = scale * (this.destination.y - this.origin.y); // delta y
                this.target.style.left = `${this.origin.x + Math.ceil(dx)}px`;
                this.target.style.top = `${this.origin.y + Math.ceil(dy)}px`;
                break;
        }

        return 0 < this.lifeCurrent--;
    }

}

export enum EffectEnum
{
    blink,
    fadeIn,
    fadeOut,
    makeInvisible,
    moveTo
}