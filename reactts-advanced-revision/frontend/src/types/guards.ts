import { User, ApiResponse } from '../../../shared/types';
/**
 * TYPE GUARD: A function that narrows the type of a variable at runtime.
 * Usage: if (isUser(obj)) { ... }
 */
export function isUser(obj: any): obj is User {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'role' in obj &&
        ['ADMIN', 'USER', 'GUEST'].includes(obj.role)
    );
}
/**
 * TYPE ASSERTION: Telling TS that we are sure about a type.
 * Use with caution!
 */
export function assertApiResponse<T>(response: any): ApiResponse<T> {
    if (response.status && response.timestamp) {
        return response as ApiResponse<T>;
    }
    throw new Error("Invalid API Response format");
}
/**
 * ADVANCED TYPES: Conditional & Utility Types
 */
// RequiredUser: Makes all fields required (standard Utility)
export type RequiredUser = Required<User>;
// ReadonlyUser: Makes all fields readonly
export type ReadonlyUser = Readonly<User>;
// Demo of Conditional Type in UI Logic
export type ComponentVariant = "primary" | "secondary";
export type ButtonProps<T extends ComponentVariant> = T extends "primary"
    ? { label: string; primary: true }
    : { label: string; secondary: true };