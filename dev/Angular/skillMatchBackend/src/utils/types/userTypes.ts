import { Request } from "express";

 
export interface User {
    id: string;
    user_id: number,
    user_type: string;
    name: string;
    email: string;
    password?: string;  
    role_id: number;
    role_name: string;
    created_at?: Date;
    updated_at?: Date;
}


export interface UserRequest extends Request {
    user?: User;
}