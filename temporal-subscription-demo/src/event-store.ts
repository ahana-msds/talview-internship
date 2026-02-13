import { EventEmitter } from 'events';

export interface ActivityEvent {
    workflowId: string;
    timestamp: string;
    type: 'email' | 'charge' | 'workflow' | 'timer';
    action: string;
    details: any;
    emailPreviewUrl?: string;
}

class EventStore extends EventEmitter {
    private events: Map<string, ActivityEvent[]> = new Map();

    addEvent(event: ActivityEvent) {
        const workflowEvents = this.events.get(event.workflowId) || [];
        workflowEvents.push(event);
        this.events.set(event.workflowId, workflowEvents);
        this.emit('activity', event);
    }

    getEvents(workflowId: string): ActivityEvent[] {
        return this.events.get(workflowId) || [];
    }

    getAllWorkflows(): string[] {
        return Array.from(this.events.keys());
    }

    clearEvents(workflowId: string) {
        this.events.delete(workflowId);
    }
}

export const eventStore = new EventStore();
