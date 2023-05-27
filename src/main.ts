import { Application, Graphics } from 'pixi.js';
import { SmoothGraphics, LINE_SCALE_MODE, settings } from '@pixi/graphics-smooth';

const app = new Application({ width: 640, height: 360 });

// @ts-ignore
document.body.appendChild(app.view);

settings.LINE_SCALE_MODE = LINE_SCALE_MODE.NONE;

let obj = new SmoothGraphics();
obj.beginFill(0xff0000, 1.0, true);
obj.drawCircle(100, 200, 50);

app.stage.addChild(obj);
