export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    roles: string;
    token?: string;
}
