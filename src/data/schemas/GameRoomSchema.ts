import { ArraySchema, MapSchema, Schema } from '@colyseus/schema';
import { OrbitalSchema } from './OrbitalSchema';
import { BodySchema } from './BodySchema';
import { PlayerSchema } from './PlayerSchema';

export class GameRoomState extends Schema {
    orbitals = new ArraySchema<OrbitalSchema>();
    bodies = new ArraySchema<BodySchema>();
    players = new MapSchema<PlayerSchema>();
}
