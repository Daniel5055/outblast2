import { ArraySchema, MapSchema, Schema } from '@colyseus/schema';
import { OrbitalSchema } from './Orbital';
import { PlayerSchema } from './Player';
import { BodySchema } from './Body';

export class GameRoomState extends Schema {
    orbitals = new ArraySchema<OrbitalSchema>();
    bodies = new ArraySchema<BodySchema>();
    players = new MapSchema<PlayerSchema>();
}
