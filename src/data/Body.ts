import { Container, Graphics, Text } from 'pixi.js';
import { GameObject } from './GameObject';
import { BodySchema } from './schemas/BodySchema';
import { Player } from './Player';
import { Action, Actions, Interpolations } from 'pixi-actions';

export class Body extends GameObject<BodySchema> {
    //players: Set<Player> = new Set<Player>();
    #sprite: Container | undefined;
    #container: Container | undefined;
    #count: Text | undefined;
    #moveAction: Action | undefined;
    #rotateAction: Action | undefined;

    constructor(b: BodySchema) {
        super(b);
    }

    create() {
        const graphics = new Graphics();
        graphics.circle(0, 0, this.data.radius);
        graphics.fill(0xcccccc);

        const spot = new Graphics();
        spot.circle(0, this.data.radius - 20, 5);
        spot.fill(0x444444);

        this.#count = new Text({
            text: this.data.bulletCount,
            style: {
                fontFamily: 'Arial',
                fontSize: this.data.radius / 2,
                fill: 0x444444,
                align: 'center',
                fontWeight: 'bold',
            },
        });
        this.#count.anchor.set(0.5);

        this.#sprite = new Container();
        this.#sprite.addChild(graphics);
        this.#sprite.addChild(spot);

        this.#container = new Container();
        this.#container.addChild(this.#sprite);
        this.#container.addChild(this.#count);
        this.#container.position.x = this.data.x;
        this.#container.position.y = this.data.y;

        return this.#container;
    }

    graphics() {
        return this.#sprite!;
    }

    update(b: BodySchema): void {
        super.update(b);
        this.move(b.x, b.y);
        this.rotate(b.rotationAngle);
        this.#count!.text = Math.floor(b.bulletCount);
    }

    move(x: number, y: number) {
        this.#moveAction?.stop();
        this.#moveAction = Actions.moveTo(
            this.#container!,
            x,
            y,
            0.02,
            Interpolations.linear
        ).play();
    }
    rotate(rotation: number) {
        this.#rotateAction?.stop();
        this.#rotateAction = Actions.rotateTo(
            this.#sprite!,
            -rotation,
            0.02,
            Interpolations.linear
        ).play();
    }
    attach(p: Player) {
        const playerGraphics = p.graphics();
        playerGraphics.removeFromParent();
        this.graphics().addChildAt(p.graphics(), 0);

        p.stopMoving();
        playerGraphics.position.set(p.data.x, p.data.y);
        p.addCannon();
    }
    detach(p: Player) {
        if (this.graphics().removeChild(p.graphics()) !== null) {
            p.graphics().position.set(p.data.x, p.data.y);
            p.removeCannon();
            return true;
        }
        return false;
    }
}
