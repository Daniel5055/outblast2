import { Schema, SetSchema } from '@colyseus/schema';
import { PlayerSchema } from './PlayerSchema';

export class BodySchema extends Schema {
    // Mutable data
    name: string = 'Body';
    mass: number = 100;
    radius: number = 100;
    x: number = 0;
    y: number = 0;
    rotationAngle: number = 0;
    players: SetSchema<PlayerSchema> = new SetSchema<PlayerSchema>();
}
