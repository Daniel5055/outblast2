import { SmoothGraphics } from '@pixi/graphics-smooth';
import { Body } from './Body';
import { Orbital } from './Orbital';
import { PlayerSchema } from './schemas/PlayerSchema';
import { OrbitalSchema } from './schemas/OrbitalSchema';

export class Player extends Orbital<PlayerSchema> {
    #cannon: SmoothGraphics | undefined;

    removeCannon() {
        this.graphics()?.removeChild(this.#cannon!);
    }
    addCannon() {
        if (this.#cannon === undefined) {
            const x = -this.data.cannonWidth / 2;
            const y = 0;

            this.#cannon = new SmoothGraphics();
            this.#cannon.beginFill(0x777777, 1.0, false);
            this.#cannon.drawRect(x, y, this.data.cannonWidth, this.data.cannonHeight);
            this.#cannon.rotation = this.data.targetAngle;
            this.#cannon.endFill();
        }

        this.graphics()?.addChildAt(this.#cannon, 0);
        console.log(this.graphics()?.children, this.data.cannonWidth, this.data.cannonHeight);
    }
    bTarget: Body | null = null;

    constructor(p: PlayerSchema, bodies: Body[]) {
        super(p);

        if (p.target !== -1) {
            this.bTarget = bodies[p.target];
        }
    }

    update(p: PlayerSchema): void {
        super.update(p);
    }
}
