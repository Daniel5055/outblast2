import { Application, Graphics, Loader, Sprite, Texture } from 'pixi.js';
import { SmoothGraphics, LINE_SCALE_MODE, settings } from '@pixi/graphics-smooth';
import { Client } from 'colyseus.js';
import { GameRoomState } from './data/schemas/GameRoomSchema';
import { Body } from './data/Body';
import { Viewport } from 'pixi-viewport';
import { Orbital } from './data/Orbital';
import { Player } from './data/Player';
import { PlayerSchema } from './data/schemas/PlayerSchema';
import { BulletSchema } from './data/schemas/BulletSchema';
import { Bullet } from './data/Bullet';
import { OrbitalSchema } from './data/schemas/OrbitalSchema';

const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: devicePixelRatio,
    antialias: true,
});

// @ts-ignore
app.view.style!.position = 'fixed';
app.view.style!.width = '100vw';
app.view.style!.height = '100vh';
// @ts-ignore
app.view.style!.top = 0;
// @ts-ignore
app.view.style!.left = 0;
// @ts-ignore
document.body.appendChild(app.view);

const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,
    events: app.renderer.events,
});
viewport.moveCenter(500, 500);

app.stage.addChild(viewport);

window.onresize = () => {
    console.log('resize');
    app.renderer.resize(window.innerWidth, window.innerHeight);
    viewport.resize(window.innerWidth, window.innerHeight);
};

settings.LINE_SCALE_MODE = LINE_SCALE_MODE.NONE;

// Internal state
let bodies: Body[] = [];
let orbitals: Map<string, Orbital<OrbitalSchema>> = new Map();
let players: Map<string, Player> = new Map();
let bullets: Map<string, Bullet> = new Map();

let inputs = { w: false, a: false, s: false, d: false };

const client = new Client('ws://localhost:2567');
client.joinOrCreate<GameRoomState>('my_room').then((room) => {
    // Bodies
    room.state.bodies.onAdd((b, i) => {
        const body = new Body(b);
        bodies[i] = body;
        viewport.addChild(body.create());

        b.onChange(() => bodies[i].update(room.state.bodies[i]));
        b.players.onAdd((p) => {
            bodies[i].attach(players.get(p.name)!);
        });
        b.players.onRemove((p) => {
            bodies[i].detach(players.get(p.name)!);
            viewport.addChildAt(players.get(p.name)!.graphics(), 0);
        });
    });

    room.state.orbitals.onAdd((o) => {
        orbitals.get(o.name)?.graphics().position.set(o.x, o.y);
        o.onChange(() => orbitals.get(o.name)!.move(o.x, o.y));
    });

    // Players
    room.state.players.onAdd((p, i) => {
        const player = new Player(p, bodies);
        console.log('added');
        viewport.addChildAt(player.create(), 0);

        players.set(i, player);
        orbitals.set(i, player);

        p.onChange(() => players.get(i)!.update(p));
    });

    room.state.players.onRemove((_, i) => {
        players.get(i)!.destroy();
        players.delete(i);
    });

    // Bullets
    room.state.bullets.onAdd((b, i) => {
        const bullet = new Bullet(b);
        viewport.addChildAt(bullet.create(), 0);

        bullets.set(i, bullet);
        orbitals.set(i, bullet);

        b.onChange(() => bullets.get(i)!.update(b));
    });
    room.state.bullets.onRemove((_, i) => {
        bullets.get(i)!.destroy();
        bullets.delete(i);
    });

    function onKeyDown(e: KeyboardEvent) {
        switch (e.key) {
            case 'w':
                inputs.w = true;
                break;
            case 'a':
                inputs.a = true;
                break;
            case 's':
                inputs.s = true;
                break;
            case 'd':
                inputs.d = true;
                break;
        }
        room.send(0, inputs);
    }
    function onKeyUp(e: KeyboardEvent) {
        switch (e.key) {
            case 'w':
                inputs.w = false;
                break;
            case 'a':
                inputs.a = false;
                break;
            case 's':
                inputs.s = false;
                break;
            case 'd':
                inputs.d = false;
                break;
        }
        room.send(0, inputs);
    }

    window.onkeydown = onKeyDown;
    window.onkeyup = onKeyUp;
});
