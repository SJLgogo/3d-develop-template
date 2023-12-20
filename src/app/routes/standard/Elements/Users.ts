import { Clock, Group } from "three";
import User from "./User";
import Physics from "./Physics";
import { tapable } from '../utiles/Tapable'

export class Users {

    main: Group = new Group()

    users: Map<string, User> = new Map();

    isReady: boolean = false

    declare physics: Physics;

    declare resources: any;

    declare clock: Clock;

    constructor(physics: Physics, clock: Clock) {
        this.physics = physics
        this.clock = clock
    }

    build(config: UsersConfig): void {
        this.resources = config.resources
        this.isReady = true
    }

    addUser(params: MqttUserParams): void {
        const user = new User({
            userId: params.userId,
            physics: this.physics,
            coordinate: params.coordinate!
        }, this.resources)
        user.bulid(this.resources['man'], params.coordinate!)
        this.users.set(params.userId, user)
        this.main.add(user.model)
    }


    update(): void {
        const users: User[] = Array.from(this.users.values());
        const deltaTime = this.clock.getDelta();

        users.forEach((user: User) => {
            user.update(deltaTime)

            if (!user.eventQueue.isEmpty() && user.eventIsReady) {
                const params: MqttUserParams = user.eventQueue.dequeue()

                if (params.destory) {
                    this.delUser(params.userId)
                    user?.destory()
                    return
                }

                if (params.coordinate) {
                    user?.twoPointMoveEvent(params.coordinate)
                    return
                }

                if (params.lineCoordinate) {
                    user?.lineMoveEvent(params.lineCoordinate)
                    return
                }
            }

        })
    }


    delUser(userId: string): void {
        const user = this.getUser(userId)
        this.remove(user?.model)
        this.users.delete(userId)
    }

    getUser(userId: string): User | undefined {
        return this.users.get(userId)
    }

    remove(model: any): void {
        this.main.remove(model);
    }


}




interface UserInfo {
    userId: string,
    coordinate: number[]
}


interface UsersConfig {
    resources: any
}


export interface MqttUserParams {
    userId: string;
    destory?: boolean;
    coordinate?: number[];
    lineCoordinate?: number[][];
}