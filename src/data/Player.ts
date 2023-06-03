import { SmoothGraphics } from '@pixi/graphics-smooth';
import { Body } from './Body';
import { Orbital } from './Orbital';
import { PlayerSchema } from './schemas/PlayerSchema';
import { Easing, ease } from 'pixi-ease';

export class Player extends Orbital<PlayerSchema> {
    bTarget: Body | null = null;
    #cannon: SmoothGraphics | undefined;
    #rotate: Easing | undefined;

    baseColor(): number {
        return 0xd4336e;
    }

    removeCannon() {
        this.graphics().removeChild(this.getCannon());
    }
    addCannon() {
        this.graphics().addChildAt(this.getCannon(), 0);
        this.getCannon().rotation = Math.PI - this.data.targetAngle + this.data.cannonAngle;
    }
    getCannon() {
        return this.#cannon!;
    }
    create() {
        // Also creating cannon asset
        const x = -this.data.cannonWidth / 2;
        const y = 0;

        this.#cannon = new SmoothGraphics();
        this.#cannon.beginFill(0x777777, 1.0, false);
        this.#cannon.drawRect(x, y, this.data.cannonWidth, this.data.cannonHeight);
        this.#cannon.endFill();

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
        console.log('move', p.x, p.y);
    }
}
