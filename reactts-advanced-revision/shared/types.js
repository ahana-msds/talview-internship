"use strict";
/**
 * SHARED TYPES - Demonstrating Advanced TypeScript Concepts
 * These types are shared between the frontend (React) and backend (Node.js).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseStatus = void 0;
exports.getLength = getLength;
// 1. Enum: Named constants for order status
var ApiResponseStatus;
(function (ApiResponseStatus) {
    ApiResponseStatus["SUCCESS"] = "SUCCESS";
    ApiResponseStatus["ERROR"] = "ERROR";
    ApiResponseStatus["PENDING"] = "PENDING";
})(ApiResponseStatus || (exports.ApiResponseStatus = ApiResponseStatus = {}));
// 7. Generic constraints: T must have a 'length' property
function getLength(item) {
    return item.length;
}
