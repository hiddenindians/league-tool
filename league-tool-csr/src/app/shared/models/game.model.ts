export interface Game {
    _id: string,
    name: string,
    active: boolean,
    leagues: [{
        name: string,
        active: boolean
    }]
}