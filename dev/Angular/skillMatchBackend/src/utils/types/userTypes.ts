import { Request } from "express";

 
export interface User {
    id: string;
    user_id: number,
    user_type: string;
    name: string;
    email: string;
    password?: string;  
    created_at?: Date;
    updated_at?: Date;
    last_login?: Date;
}


export interface UserRequest extends Request {
    user?: User;
}