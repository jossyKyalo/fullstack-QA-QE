import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../../utils/types/userTypes";
import asyncHandler from "../asyncHandler";

export const roleGuard = (allowedRoles: string[]) => 
    asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.user_type) {
            res.status(403).json({ message: "Access denied: Insufficient permissions" });
            return
        }
        
        if (!allowedRoles.includes(req.user.user_type)) {
            res.status(403).json({ message: "Access denied: Insufficient permissions" });
            return
        }
        
        next();
    });

 
export const jobSeekerGuard = roleGuard(["job_seeker"]);
export const recruiterGuard = roleGuard(["recruiter"]);
export const adminGuard = roleGuard(["admin"]);

// //combined guards  
// export const staffGuard = roleGuard(["Admin", "Librarian"]);
// export const anyUserGuard = roleGuard(["Admin", "Librarian", "Borrower"]);
