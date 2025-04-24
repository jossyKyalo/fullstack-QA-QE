
import { Request } from 'express';
import { User } from './userTypes';  

declare module 'express' {
  interface Request {
    user?: User;
  }
}