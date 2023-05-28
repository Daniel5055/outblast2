import { SmoothGraphics } from '@pixi/graphics-smooth';
import { Easing, ease } from 'pixi-ease';
import { Sprite } from 'pixi.js';
import { OrbitalSchema } from './schemas/OrbitalSchema';
import { GameObject } from './GameObject';
import { Schema } from '@colyseus/schema';

export abstract class Orbital<T extends OrbitalSchema> extends GameObject<T> {
    #graphics: SmoothGraphics | undefined;
    #sprite: Sprite | undefined;
    #easing: Easing | undefined;

    update(t: T) {
        super.update(t);
        console.log(t.x, t.y);
        this.move(t.x, t.y);
    }

    create() {
        this.#graphics = new SmoothGraphics();
        this.#graphics.beginFill(0xff0000, 1.0, true);
        this.#graphics.drawCircle(0, 0, this.data.radius);

        this.#sprite = new Sprite();
        this.#sprite.addChild(this.#graphics);
        this.#sprite.position.x = this.data.x;
        this.#sprite.position.y = this.data.y;

        return this.#sprite;
    }

    graphics() {
        return this.#sprite;
    }
    move(x: number, y: number) {
        this.#easing = ease.add(this.#sprite!, { x: x, y: y }, { duration: 50, ease: 'linear' });
    }
    stopMoving() {
        this.#easing?.remove(this.#sprite);
    }
    destroy() {
        this.#easing?.remove(this.#graphics);
        this.#graphics?.destroy();
        this.#sprite?.destroy();
    }
}
