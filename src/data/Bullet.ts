import { Orbital } from './Orbital';
import { BulletSchema } from './schemas/BulletSchema';

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
}
