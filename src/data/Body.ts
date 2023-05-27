import { ArraySchema, Schema } from '@colyseus/schema';
import { Player } from './Player';
import { Graphics } from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { Viewport } from 'pixi-viewport';

export class BodySchema extends Schema {
    // Mutable data
    name: string = 'Body';
    mass: number = 100;
    radius: number = 100;
    x: number = 0;
    y: number = 0;
    rotationAngle: number = 0;
    players: ArraySchema<Player> = new ArraySchema<Player>();

    constructor(b: BodySchema) {
        super();
        this.name = b.name;
        this.mass = b.mass;
        this.radius = b.radius;
        this.x = b.x;
        this.y = b.y;
        this.rotationAngle = b.rotationAngle;
        this.players = b.players;
    }
}

export class Body extends BodySchema {
    #graphics: SmoothGraphics | undefined;

    constructor(b: BodySchema) {
        super(b);
    }

    graphics() {
        this.#graphics = new SmoothGraphics();
        this.#graphics.beginFill(0xbbbbbb, 1.0, true);
        this.#graphics.drawCircle(this.x, this.y, this.radius);

        return this.#graphics;
    }
}
