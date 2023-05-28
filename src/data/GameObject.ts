import { Schema } from '@colyseus/schema';

export abstract class GameObject<T extends Schema> {
    data: T;
    constructor(t: T) {
        this.data = t;
    }

    update(t: T) {
        this.data = t;
    }
}
