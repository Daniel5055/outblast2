import { Actions, Interpolations } from 'pixi-actions';
import { Orbital } from './Orbital';
import { BulletSchema } from './schemas/BulletSchema';
import * as PIXI from 'pixi.js';

export class Bullet extends Orbital<BulletSchema> {
    create() {
        const sprite = super.create();
        return sprite;
    }
    baseColor(): number {
        return 0xffffff;
    }
    move(x: number, y: number): void {
        super.move(x, y);
    }

    explode(): PIXI.Container {
        const explosion = new PIXI.Graphics()
            .star(0, 0, 11, this.data.radius, this.data.radius / 2, 2)
            .fill('#eb9e23')
            .star(0, 0, 4, this.data.radius - 1, this.data.radius / 2, 2)
            .fill('#ed4815');

        explosion.position.set(this.data.x, this.data.y);
        explosion.alpha = 0;

        Actions.sequence(
            Actions.parallel(
                Actions.fadeTo(explosion, 0.7, 0.2, Interpolations.pow2out),
                Actions.scaleTo(explosion, 4, 4, 0.1, Interpolations.pow2out)
            ),
            Actions.fadeOutAndRemove(explosion, 0.5, Interpolations.pow2out)
        ).play();

        return explosion;
    }
}
