import { Schema } from '@colyseus/schema';

export abstract class OrbitalSchema extends Schema {
    name: string = 'orbital';
    mass: number = 10;
    radius: number = 10;
    type: 'Player' | 'Bullet' | 'None' = 'None';

    x: number = 0;
    y: number = 0;
}
