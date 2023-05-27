import { Application, Graphics, Sprite, Texture } from 'pixi.js';
import { SmoothGraphics, LINE_SCALE_MODE, settings } from '@pixi/graphics-smooth';
import { Client } from 'colyseus.js';
import { GameRoomState } from './data/GameRoomState';
import { Body } from './data/Body';
import { Viewport } from 'pixi-viewport';

const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: devicePixelRatio,
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

const client = new Client('ws://localhost:2567');
client.joinOrCreate<GameRoomState>('my_room').then((room) => {
    room.state.bodies.onAdd((b, i) => {
        const body = new Body(b);
        bodies[i] = body;
        viewport.addChild(body.graphics());
    });
});
