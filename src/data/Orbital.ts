import { Container, Graphics } from 'pixi.js';
import { OrbitalSchema } from './schemas/OrbitalSchema';
import { GameObject } from './GameObject';
import { Action, Actions, Interpolations } from 'pixi-actions';

export abstract class Orbital<T extends OrbitalSchema> extends GameObject<T> {
    #graphics: Graphics | undefined;
    #sprite: Container | undefined;
    #action: Action | undefined;

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
        if (!this.graphics().destroyed) {
            this.#action?.stop();
            this.#action = Actions.moveTo(
                this.#sprite,
                x,
                y,
                0.016666,
                Interpolations.linear
            ).play();
        }
    }
    stopMoving() {
        Actions.clear(this.#graphics);
    }
    destroy() {
        this.#graphics!.destroy();
        this.#sprite!.destroy();
    }
}
