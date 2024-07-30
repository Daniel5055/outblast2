import * as PIXI from 'pixi.js';
import { Client } from 'colyseus.js';
import { GameRoomState } from './data/schemas/GameRoomSchema';
import { Body } from './data/Body';
import { Viewport } from 'pixi-viewport';
import { Orbital } from './data/Orbital';
import { Player } from './data/Player';
import { Bullet } from './data/Bullet';
import { OrbitalSchema } from './data/schemas/OrbitalSchema';
import { Actions } from 'pixi-actions';

// Create app
const app = new PIXI.Application();
await app.init({
    background: '#15162b',
    resizeTo: window,
    antialias: true,
});
document.body.appendChild(app.canvas);

// Create viewport
const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,
    events: app.renderer.events,
});

viewport.moveCenter(500, 500);
app.stage.addChild(viewport);

// Internal state
let bodies: Body[] = [];
let orbitals: Map<string, Orbital<OrbitalSchema>> = new Map();
let players: Map<string, Player> = new Map();
let bullets: Map<string, Bullet> = new Map();

let myPlayer: Player | undefined = undefined;

let inputs = { w: false, a: false, s: false, d: false };

let updateEvents: (() => void)[] = [];
let actionEvents: (() => void)[] = [];

app.ticker.add((tick) => Actions.tick(tick.deltaTime / 60));
app.ticker.add((ticker) => {
    let delta = ticker.deltaTime;
    delta *= 16;
    if (inputs.w) {
        inputs.w = false;
        if (myPlayer && myPlayer.data.target !== -1) {
            const b = bodies[myPlayer.data.target];

            const rotAngle = myPlayer.data.targetAngle + b.data.rotationAngle;

            // Calculated new player position
            myPlayer.data.x = b.data.x + Math.cos(rotAngle) * b.data.radius;
            myPlayer.data.y = b.data.y - Math.sin(rotAngle) * b.data.radius;

            if (b.detach(myPlayer)) {
                viewport.addChildAt(myPlayer.graphics(), 0);
            }

            // Calculate new speed
            let vx = Math.cos(rotAngle + myPlayer.data.cannonAngle - Math.PI / 2) * 0.06 * 17;
            let vy = -Math.sin(rotAngle + myPlayer.data.cannonAngle - Math.PI / 2) * 0.06 * 17;

            myPlayer.data.x = myPlayer.data.x + (vx * delta) / 8;
            myPlayer.data.y = myPlayer.data.y + (vy * delta) / 8;

            for (const body of bodies) {
                // The angle at which the body is from the orbital
                const angle =
                    Math.atan((body.data.y - myPlayer.data.y) / -(body.data.x - myPlayer.data.x)) +
                    (body.data.x > myPlayer.data.x ? Math.PI : 0);

                // Distance between them squared
                const rSq =
                    Math.pow(body.data.x - myPlayer.data.x, 2) +
                    Math.pow(body.data.y - myPlayer.data.y, 2);

                // Acceleration due to gravity
                //const g = 0.01 * body.mass * orbital.mass / rSq
                const g = ((40 / 100000) * body.data.mass) / Math.sqrt(rSq);

                vx += (Math.cos(angle + Math.PI) * g * delta) / 8;
                vy += (-Math.sin(angle + Math.PI) * g * delta) / 8;
            }

            myPlayer.data.x = myPlayer.data.x + (vx * delta) / 8;
            myPlayer.data.y = myPlayer.data.y + (vy * delta) / 8;
            myPlayer.data.target = -1;
        }
    }

    const cannonMovementTick = 0.05 / 17;
    const cannonEdge = 0.5;

    if (myPlayer && inputs.a) {
        if (myPlayer.data.cannonAngle < Math.PI - cannonEdge) {
            myPlayer.data.cannonAngle += cannonMovementTick * delta;

            myPlayer.data.target !== -1 && myPlayer.moveCannon(myPlayer.data.cannonAngle);
        }
    }
    if (myPlayer && inputs.d) {
        if (myPlayer.data.cannonAngle > cannonEdge) {
            myPlayer.data.cannonAngle -= cannonMovementTick * delta;

            myPlayer.data.target !== -1 && myPlayer.moveCannon(myPlayer.data.cannonAngle);
        }
    }

    for (const o of orbitals.values()) {
        if (o.data.vx !== 0 || o.data.vy !== 0) {
            updateEvents.push(() => o.simulate(delta));
        }
    }

    // Controlling when movement occurs
    // Prevents stuff like moving before detaching etc.
    actionEvents.forEach((f) => f());
    updateEvents.forEach((f) => f());

    actionEvents = [];
    updateEvents = [];
});

const client = new Client('ws://localhost:2567');
client.joinOrCreate<GameRoomState>('my_room').then((room) => {
    room.state.players.onAdd((p, i) => {
        const player = new Player(p, bodies);
        viewport.addChildAt(player.create(), 0);
        if (i == room.sessionId) {
            myPlayer = player;
        }

        players.set(i, player);
        orbitals.set(i, player);

        p.onChange(() => updateEvents.push(() => player.update(p)));
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

        b.onChange(() => updateEvents.push(() => bullet.update(b)));
    });
    room.state.bullets.onRemove((_, i) => {
        bullets.get(i)!.destroy();
        bullets.delete(i);
    });
    // Bodies
    room.state.bodies.onAdd((b, i) => {
        const body = new Body(b);
        bodies[i] = body;
        viewport.addChild(body.create());

        b.onChange(() => updateEvents.push(() => bodies[i].update(room.state.bodies[i])));
        b.players.onAdd(
            (p) => players.get(p) && actionEvents.push(() => bodies[i].attach(players.get(p)!))
        );
        b.players.onRemove((p) => {
            actionEvents.push(() => {
                if (bodies[i].detach(players.get(p)!)) {
                    viewport.addChildAt(players.get(p)!.graphics(), 0);
                }
            });
        });
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
