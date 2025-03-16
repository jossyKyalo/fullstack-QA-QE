import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../../utils/types/userTypes";
import asyncHandler from "../asyncHandler";

// Middleware to enforce role-based access control
export const roleGuard = (allowedRoles: string[]) =>
    asyncHandler<void, UserRequest>(async (req: UserRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role_name)) {
            res.status(403).json({ message: "Access denied: Insufficient permissions" });
            return;
        }
        next();
    });

 
export const adminGuard = roleGuard(["Admin"]);          
export const managerGuard = roleGuard(["Manager"]);      
export const staffGuard = roleGuard(["Staff"]);          
export const customerGuard = roleGuard(["Customer"]);   
export const vendorGuard = roleGuard(["Vendor"]);        
