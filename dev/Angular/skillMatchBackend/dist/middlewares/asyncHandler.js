"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @desc- avoid the problem of try catch not automatically passed to asynchronous
 * @param fn The asynchronous function to wrap async functions
 * @returns A function that executes the async function and catches the error
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
