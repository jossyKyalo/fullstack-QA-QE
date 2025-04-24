import { Request } from "express";

 
export interface User {
    id: number;
    user_id: number,
    user_type: string;
    full_name: string;
    email: string;
    password?: string;  
    created_at?: Date;
    updated_at?: Date;
    last_login?: Date;
}


export interface UserRequest extends Request {
    user?: User;
}