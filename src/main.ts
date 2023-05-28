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

let bodies: Body[] = [];
let orbitals: Orbital<OrbitalSchema>[] = [];
let players: Map<string, Player> = new Map();

const client = new Client('ws://localhost:2567');
client.joinOrCreate<GameRoomState>('my_room').then((room) => {
    room.state.bodies.onAdd((b, i) => {
        const body = new Body(b);
        bodies[i] = body;
        viewport.addChild(body.create());

        b.onChange(() => bodies[i].update(room.state.bodies[i]));
        b.players.onAdd((p) => {
            bodies[i].attach(players.get(p.name)!);
        });
    });

    room.state.orbitals.onAdd((o, i) => {
        let orb;
        if (o.type === 'Player') {
            orb = new Player(o as PlayerSchema, bodies);
            players.set(orb.data.name, orb);
        } else {
            orb = new Bullet(o as BulletSchema);
        }

        orbitals[i] = orb;
        viewport.addChild(orb.create());

        o.onChange(() => orbitals[i]?.update(room.state.orbitals[i]));
    });
    room.state.orbitals.onRemove((o, i) => {
        console.log('removed', i);
        if (o.type === 'Bullet') {
            orbitals[i].destroy();
        }
        orbitals.splice(i, 1);
    });

    room.state.players.onRemove((p, i) => {
        players.get(i)?.destroy();
        players.delete(i);
    });
});
