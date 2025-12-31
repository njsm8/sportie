export interface User {
    id: string;
    username: string;
    password?: string; // For mock auth only
}

export type EventStatusType = 'active' | 'expired' | 'deleted';

export interface Event {
    id: string;
    title: string;
    category: string;
    description?: string;
    date: string; // ISO string
    startTime: string;
    endTime: string;
    location: string;
    capacity: number;
    creatorId: string;
    joinedUserIds: string[];
    pendingUserIds: string[]; // Users requesting to join
    status: EventStatusType; // Event lifecycle status
}

export type EventStatus = 'joined' | 'pending' | 'full' | 'rejected' | 'available' | 'creator';
