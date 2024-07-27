import { Graphics } from 'pixi.js';
import { Body } from './Body';
import { Orbital } from './Orbital';
import { PlayerSchema } from './schemas/PlayerSchema';
import { Easing, ease } from 'pixi-ease';

export class Player extends Orbital<PlayerSchema> {
    bTarget: Body | null = null;
    #cannon: Graphics | undefined;
    #rotate: Easing | undefined;

    vx: number | null = null;
    vy: number | null = null;

    baseColor(): number {
        return 0xd4336e;
    }

    removeCannon() {
        this.graphics().removeChild(this.getCannon());
    }
    addCannon() {
        this.getCannon().rotation = Math.PI - this.data.targetAngle + this.data.cannonAngle;
        this.graphics().addChildAt(this.getCannon(), 0);
    }
    getCannon() {
        return this.#cannon!;
    }
    create() {
        // Also creating cannon asset
        const x = -this.data.cannonWidth / 2;
        const y = 0;

        this.#cannon = new Graphics();
        this.#cannon.rect(x, y, this.data.cannonWidth, this.data.cannonHeight);
        this.#cannon.fill(0x777777);

        return super.create();
    }
    destroy(): void {
        this.#cannon?.destroy();
        super.destroy();
    }
    moveCannon(angle: number) {
        this.#rotate = ease.add(
            this.getCannon(),
            { rotation: -this.data.targetAngle - angle },
            { duration: 50, ease: 'linear' }
        );
    }
    move(x: number, y: number) {
        if (this.data.target === -1) {
            super.move(x, y);
        } else {
            this.graphics().position.set(x, y);
        }
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
