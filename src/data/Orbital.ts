import { SmoothGraphics } from '@pixi/graphics-smooth';
import { Easing, ease } from 'pixi-ease';
import { Container } from 'pixi.js';
import { OrbitalSchema } from './schemas/OrbitalSchema';
import { GameObject } from './GameObject';

export abstract class Orbital<T extends OrbitalSchema> extends GameObject<T> {
    #graphics: SmoothGraphics | undefined;
    #sprite: Container | undefined;
    #easing: Easing | undefined;
    #moved: boolean = false;

    update(t: T) {
        super.update(t);
        this.#moved = false;
    }

    create() {
        this.#graphics = new SmoothGraphics();
        this.#graphics.beginFill(0xff0000, 1.0, true);
        this.#graphics.drawCircle(0, 0, this.data.radius);

        this.#sprite = new Container();
        this.#sprite.addChild(this.#graphics);
        this.#sprite.position.x = this.data.x;
        this.#sprite.position.y = this.data.y;
        this.#sprite.name = 'player';

        return this.#sprite;
    }

    graphics() {
        return this.#sprite!;
    }

    move(x: number, y: number) {
        if (!this.#moved) {
            this.#easing = ease.add(
                this.graphics(),
                { x: x, y: y },
                { duration: 50, ease: 'linear' }
            );
            this.#moved = true;
        }
    }
    stopMoving() {
        this.#easing?.remove(this.#sprite);
    }
    destroy() {
        this.#easing?.remove(this.#graphics);
        this.#graphics!.destroy();
        this.#sprite!.destroy();
    }
}
