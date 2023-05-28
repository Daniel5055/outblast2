import { OrbitalSchema } from './OrbitalSchema';

export class BulletSchema extends OrbitalSchema {
    static bulletRadius = 5;
    static bulletMass = 5;

    type = 'Bullet' as 'Bullet';
}
