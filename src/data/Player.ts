import { OrbitalSchema } from './Orbital';

export class PlayerSchema extends OrbitalSchema {
    static playerRadius = 10;
    static playerMass = 10;
    static cannonWidth = 8;
    static cannonHeight = 20;

    cannonWidth: number = 0; //Player.cannonWidth;
    cannonHeight: number = 0; //Player.cannonHeight;

    // Index to target
    target: number = -1;
    targetAngle: number = 0;
    cannonAngle: number = 0;

    type = 'Player' as 'Player';
}

export class Player extends PlayerSchema {
    bTarget: Body | null = null;
}
