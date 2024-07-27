import { Easing, ease } from 'pixi-ease';
import { Container, Graphics } from 'pixi.js';
import { OrbitalSchema } from './schemas/OrbitalSchema';
import { GameObject } from './GameObject';

export abstract class Orbital<T extends OrbitalSchema> extends GameObject<T> {
    #graphics: Graphics | undefined;
    #sprite: Container | undefined;
    #easing: Easing | undefined;

    update(t: T) {
        super.update(t);
        this.move(this.data.x, this.data.y);
    }

    baseColor() {
        return 0xffffff;
    }

    create() {
        this.#graphics = new Graphics();
        this.#graphics.circle(0, 0, this.data.radius).fill(this.baseColor());

        this.#sprite = new Container();
        this.#sprite.addChild(this.#graphics);
        this.#sprite.position.x = this.data.x;
        this.#sprite.position.y = this.data.y;
        this.#sprite.name = 'orbital';

        return this.#sprite;
    }

    graphics() {
        return this.#sprite!;
    }

    simulate(delta: number) {
        const dx = delta * this.data.vx;
        const dy = delta * this.data.vy;

        if (!this.graphics().destroyed) {
            this.move(this.graphics().x + dx, this.graphics().y + dy);
        }
    }

    move(x: number, y: number) {
        /*
        this.#easing = ease.add(
            this.graphics(),
            { x: x, y: y },
            { duration: 50, ease: 'linear' }
        );
        */
        if (!this.graphics().destroyed) {
            this.graphics().x = x;
            this.graphics().y = y;
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
