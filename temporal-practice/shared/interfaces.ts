export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
}

export interface OrderDetails {
    orderId: string;
    product: string;
    amount: number;
    status: string;
    timestamp: number;
}

export interface SubscriptionState {
    subscriptionId: string;
    email: string;
    status: SubscriptionStatus;
    iteration: number;
    orders: OrderDetails[];
    lastPaymentDate?: number;
}

export interface StartSubscriptionParams {
    email: string;
    product: string;
    amount: number;
    intervalMs: number;
    maxIterations: number;
}

export const TASK_QUEUE = 'subscription-tasks';
