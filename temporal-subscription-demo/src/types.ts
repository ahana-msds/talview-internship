export interface SubscriptionInput {
    email: string;
    planId: string;
    trialPeriod: string; // e.g., '10s' for demo purposes
    billingPeriod: string; // e.g., '10s' for demo purposes
}

export interface ChargeInput {
    customerId: string;
    amount: number;
}

export interface EmailInput {
    email: string;
    subject: string;
    body: string;
}

export interface SubscriptionState {
    isActive: boolean;
    billingCycleCount: number;
}
