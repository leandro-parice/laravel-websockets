export interface User {
    id: number;
    name: string;
}

export interface Move {
    id: number;
    game_id: number;
    user_id: number;
    position: number;
}

export interface Game {
    id: number;
    user1: User;
    user2: User | null;
    moves: Move[],
    status: string;
    created_at: string;
}