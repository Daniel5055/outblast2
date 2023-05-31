import { Container } from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { Easing, ease } from 'pixi-ease';
import { GameObject } from './GameObject';
import { BodySchema } from './schemas/BodySchema';
import { Player } from './Player';

export class Body extends GameObject<BodySchema> {
    #graphics: SmoothGraphics | undefined;
    #sprite: Container | undefined;
    #easing: Easing | undefined;
    #rotate: Easing | undefined;

    constructor(b: BodySchema) {
        super(b);
    }

    create() {
        this.#graphics = new SmoothGraphics();
        this.#graphics.beginFill(0xbbbbbb, 1.0, true);
        this.#graphics.drawCircle(0, 0, this.data.radius);

        this.#sprite = new Container();
        this.#sprite.addChild(this.#graphics);
        this.#sprite.position.x = this.data.x;
        this.#sprite.position.y = this.data.y;

        return this.#sprite;
    }

    graphics() {
        return this.#sprite;
    }

    update(b: BodySchema): void {
        super.update(b);
        this.move(b.x, b.y);
        this.rotate(b.rotationAngle);
    }

    move(x: number, y: number) {
        this.#easing = ease.add(this.#sprite!, { x, y }, { duration: 50, ease: 'linear' });
    }
    rotate(rotation: number) {
        this.#rotate = ease.add(
            this.#sprite!,
            { rotation: -rotation },
            { duration: 50, ease: 'linear' }
        );
    }
    attach(p: Player) {
        const playerGraphics = p.graphics();
        playerGraphics.removeFromParent();
        this.#sprite!.addChildAt(p.graphics(), 0);

        p.stopMoving();
        playerGraphics?.position.set(p.data.x, p.data.y);

        p.addCannon();
    }
    detach(p: Player) {
        p.graphics().removeFromParent();
        p.graphics().position.set(p.data.x, p.data.y);
        p.removeCannon();
    }
}
