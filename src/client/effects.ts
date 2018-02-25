export class Effect
{
    target: HTMLElement;
    effect: EffectEnum;
    lifeMax: number; // initial life
    lifeCurrent: number; // current time left

    constructor(target: HTMLElement, effect: EffectEnum, lifeMax: number)
    {
        this.target = target;
        this.effect = effect;
        this.lifeMax = lifeMax;
        this.lifeCurrent = lifeMax;
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
        }

        return 0 < this.lifeCurrent--;
    }

}

export enum EffectEnum
{
    blink,
    fadeIn,
    fadeOut
}