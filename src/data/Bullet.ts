import { Orbital } from './Orbital';
import { BulletSchema } from './schemas/BulletSchema';
import { GlowFilter } from '@pixi/filter-glow';

export class Bullet extends Orbital<BulletSchema> {
    create() {
        const sprite = super.create();
        sprite.filters = [
            new GlowFilter({
                outerStrength: 1,
                innerStrength: 0.5,
                color: 0xc7c424,
            }),
        ];
        return sprite;
    }
    baseColor(): number {
        return 0xffffff;
    }
}
