import { OrbitalSchema } from './Orbital';

export class BulletSchema extends OrbitalSchema {
    static bulletRadius = 5;
    static bulletMass = 5;

    type = 'Bullet' as 'Bullet';
}

export class Bullet extends BulletSchema {}
