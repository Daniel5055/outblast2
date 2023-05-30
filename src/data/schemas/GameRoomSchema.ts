import { ArraySchema, MapSchema, Schema } from '@colyseus/schema';
import { OrbitalSchema } from './OrbitalSchema';
import { BodySchema } from './BodySchema';
import { PlayerSchema } from './PlayerSchema';
import { BulletSchema } from './BulletSchema';

export class GameRoomState extends Schema {
    orbitals = new MapSchema<OrbitalSchema>();
    players = new MapSchema<PlayerSchema>();
    bullets = new MapSchema<BulletSchema>();
    bodies = new ArraySchema<BodySchema>();
}
