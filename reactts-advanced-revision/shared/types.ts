/**
 * SHARED TYPES - Demonstrating Advanced TypeScript Concepts
 * These types are shared between the frontend (React) and backend (Node.js).
 */

// 1. Enum: Named constants for order status
export enum ApiResponseStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  PENDING = "PENDING"
}

// 2. Union Type: A value that can be one of several types
export type UserRole = "ADMIN" | "USER" | "GUEST";

// 3. Interface with Generics: Reusable structure for API responses
export interface ApiResponse<T> {
  status: ApiResponseStatus;
  data: T;
  message?: string;
  timestamp: number;
}

// 4. Interface for a User
export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

// 5. Intersection Type: Combining two types
// Using standard library Type "Partial" as well
export type UserWithPreferences = User & {
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
};

// 6. Conditional Type: Deciding a type based on a condition
// If T is a string, it's a 'TextResponse', otherwise 'DataResponse'
export type ServerResponse<T> = T extends string 
  ? { type: "text"; content: string } 
  : { type: "json"; payload: T };

// 7. Generic constraints: T must have a 'length' property
export function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
