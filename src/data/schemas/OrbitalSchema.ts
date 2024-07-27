import { Schema } from '@colyseus/schema';

export class OrbitalSchema extends Schema {
    name: string = 'Orbital';
    mass: number = 0;
    radius: number = 0;
    type: 'Player' | 'Bullet' | 'None' = 'None';
    x: number = 0;
    y: number = 0;

    vx: number = 0;
    vy: number = 0;
}
