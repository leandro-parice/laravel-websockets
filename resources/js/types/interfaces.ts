export interface User {
    id: number;
    name: string;
}

export interface Game {
    id: number;
    user1: User;
    user2: User | null;
    status: string;
    created_at: string;
}