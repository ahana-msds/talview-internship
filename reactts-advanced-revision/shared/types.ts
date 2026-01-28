/**
 * SHARED TYPES - Demonstrating Advanced TypeScript Concepts
 * These types are shared between the frontend (React) and backend (Node.js).
 */

// 1. Enum: Named constants for API response status
// Enums provide a way to define a set of named constants, making the code more readable and self-documenting.
export enum ApiResponseStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  PENDING = "PENDING"
}

// 2. Union Type: A value that can be one of several types
// This allows the variable to hold values of different specified types.
export type UserRole = "ADMIN" | "USER" | "GUEST";

// 3. Interface with Generics: Reusable structure for API responses
// Generics <T> allow us to create components/interfaces that work with a variety of types.
// ApiResponse<T> can wrap any data type (User, Product, etc.) while keeping the response structure consistent.
export interface ApiResponse<T> {
  status: ApiResponseStatus;
  data: T;
  message?: string;
  timestamp: number;
}

// 4. Interface for a User
// Defines the shape of a User object.
export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

// 5. Intersection Type: Combining two types
// The '&' operator creates a new type by combining all properties of existing types.
// Here, UserWithPreferences has everything from User PLUS the preferences object.
export type UserWithPreferences = User & {
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
};

// 6. Conditional Type: Deciding a type based on a condition
// USES THE 'extends' keyword. If T is a string, ServerResponse becomes a text-based object.
// Otherwise, it becomes a payload-based (JSON) object.
export type ServerResponse<T> = T extends string
  ? { type: "text"; content: string }
  : { type: "json"; payload: T };

// 7. Generic constraints: T must have a 'length' property
// Ensures that the generic type T passed to the function satisfies a specific structure.
export function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
