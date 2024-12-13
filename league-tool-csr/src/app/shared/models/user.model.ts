export interface User {
    _id: string,
    username: string,
    email: string, 
    password: string,
    accessToken: string, 
    role: string,
    total_points: number,
    total_redeemed: number,
    games: [{}],
    redemptions: [{}] 
}