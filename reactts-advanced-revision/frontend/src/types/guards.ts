import { User, ApiResponse } from '../../../shared/types';

/**
 * TYPE GUARD: A function that narrows the type of a variable at runtime.
 * It uses the 'parameter is Type' syntax.
 * If this function returns true, TypeScript knows that 'obj' is of type 'User'.
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
 * Assertions are useful when you know more about the data than TypeScript can infer.
 * However, they bypass TypeScript's safety checks, so use them carefully.
 */
export function assertApiResponse<T>(response: any): ApiResponse<T> {
    if (response && typeof response === 'object' && 'status' in response && 'timestamp' in response) {
        return response as ApiResponse<T>;
    }
    throw new Error("Invalid API Response format: Missing status or timestamp");
}

/**
 * ADVANCED TYPES: Utility Types
 */

// RequiredUser: Makes all fields in User required (they are already required in the interface, but this is a demo)
export type RequiredUser = Required<User>;

// ReadonlyUser: Makes all fields in User readonly (cannot be modified after creation)
export type ReadonlyUser = Readonly<User>;

/**
 * CONDITIONAL TYPE DEMO in UI Logic
 * ComponentVariant determines the structure of ButtonProps.
 */
export type ComponentVariant = "primary" | "secondary";
export type ButtonProps<T extends ComponentVariant> = T extends "primary"
    ? { label: string; primary: true }
    : { label: string; secondary: true };