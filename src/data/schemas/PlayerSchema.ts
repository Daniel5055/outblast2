import { OrbitalSchema } from './OrbitalSchema';

export class PlayerSchema extends OrbitalSchema {
    cannonWidth: number = 0; //Player.cannonWidth;
    cannonHeight: number = 0; //Player.cannonHeight;

    // Index to target
    target: number = -1;
    targetAngle: number = 0;
    cannonAngle: number = 0;

    type = 'Player' as 'Player';
}
