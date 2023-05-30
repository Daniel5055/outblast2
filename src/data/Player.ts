import { SmoothGraphics } from '@pixi/graphics-smooth';
import { Body } from './Body';
import { Orbital } from './Orbital';
import { PlayerSchema } from './schemas/PlayerSchema';
import { Easing, ease } from 'pixi-ease';

export class Player extends Orbital<PlayerSchema> {
    bTarget: Body | null = null;
    #cannon: SmoothGraphics | undefined;
    #rotate: Easing | undefined;

    removeCannon() {
        this.graphics()?.removeChild(this.#cannon!);
    }
    addCannon(angle: number) {
        this.graphics()?.addChild(this.getCannon());
        this.getCannon()!.rotation = angle;
        //console.log(this.data.targetAngle / Math.PI)
    }
    getCannon() {
        if (this.#cannon === undefined) {
            const x = -this.data.cannonWidth / 2;
            const y = 0;

            this.#cannon = new SmoothGraphics();
            this.#cannon.beginFill(0x777777, 1.0, false);
            this.#cannon.drawRect(x, y, this.data.cannonWidth, this.data.cannonHeight);
            this.#cannon.endFill();
        }
        return this.#cannon;
    }

    moveCannon(angle: number) {
        this.#rotate = ease.add(
            this.getCannon(),
            { rotation: -this.data.targetAngle - angle },
            { duration: 50, ease: 'linear' }
        );
    }

    constructor(p: PlayerSchema, bodies: Body[]) {
        super(p);

        if (p.target !== -1) {
            this.bTarget = bodies[p.target];
        }
    }

    update(p: PlayerSchema): void {
        super.update(p);
        p.target !== -1 && this.moveCannon(p.cannonAngle);
    }
}
