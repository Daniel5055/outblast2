import { Container, Text } from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { Easing, ease } from 'pixi-ease';
import { GameObject } from './GameObject';
import { BodySchema } from './schemas/BodySchema';
import { Player } from './Player';

export class Body extends GameObject<BodySchema> {
    //players: Set<Player> = new Set<Player>();
    #sprite: Container | undefined;
    #container: Container | undefined;
    #count: Text | undefined;
    #easing: Easing | undefined;
    #rotate: Easing | undefined;

    constructor(b: BodySchema) {
        super(b);
    }

    create() {
        const graphics = new SmoothGraphics();
        graphics.beginFill(0xcccccc, 1.0, true);
        graphics.drawCircle(0, 0, this.data.radius);

        const spot = new SmoothGraphics();
        spot.beginFill(0x444444, 1.0, true);
        spot.drawCircle(0, this.data.radius - 20, 5);

        this.#count = new Text(this.data.bulletCount, {
            fontFamily: 'Arial',
            fontSize: this.data.radius / 2,
            fill: 0x444444,
            align: 'center',
            fontWeight: 'bold',
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
        this.#easing = ease.add(this.#container!, { x, y }, { duration: 50, ease: 'linear' });
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
        this.graphics().addChildAt(p.graphics(), 0);

        p.stopMoving();
        playerGraphics?.position.set(p.data.x, p.data.y);
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
