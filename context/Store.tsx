import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Event, User } from '../constants/types';

interface StoreContextType {
    user: User | null;
    events: Event[];
    users: User[]; // Mock database of users
    login: (username: string) => Promise<boolean>;
    register: (username: string) => Promise<boolean>;
    logout: () => Promise<void>;
    createEvent: (event: Omit<Event, 'id' | 'creatorId' | 'joinedUserIds' | 'pendingUserIds' | 'status'>) => Promise<void>;
    updateEvent: (eventId: string, updates: Partial<Omit<Event, 'id' | 'creatorId'>>) => Promise<void>;
    deleteEvent: (eventId: string) => Promise<void>;
    joinEvent: (eventId: string) => Promise<void>;
    cancelJoin: (eventId: string) => Promise<void>;
    acceptRequest: (eventId: string, userId: string) => Promise<void>;
    rejectRequest: (eventId: string, userId: string) => Promise<void>;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    // Cleanup expired events' pending requests periodically
    useEffect(() => {
        if (events.length > 0) {
            cleanupExpiredEventRequests();
        }
    }, [events.length]); // Run when events change

    // Helper function to clear pending requests from expired events
    const cleanupExpiredEventRequests = async () => {
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        let needsUpdate = false;

        const cleanedEvents = events.map(event => {
            const isExpired = event.status === 'expired' || new Date(event.date) < today;
            // If event is expired and has pending requests, clear them
            if (isExpired && event.pendingUserIds.length > 0) {
                needsUpdate = true;
                return { ...event, pendingUserIds: [], status: 'expired' as const };
            }
            // Mark as expired if date passed but status wasn't updated
            if (isExpired && event.status === 'active') {
                needsUpdate = true;
                return { ...event, status: 'expired' as const };
            }
            return event;
        });

        if (needsUpdate) {
            setEvents(cleanedEvents);
            await AsyncStorage.setItem('events', JSON.stringify(cleanedEvents));
        }
    };

    const loadData = async () => {
        try {
            const storedUsers = await AsyncStorage.getItem('users');
            const storedEvents = await AsyncStorage.getItem('events');
            const currentUser = await AsyncStorage.getItem('currentUser');

            if (storedUsers) setUsers(JSON.parse(storedUsers));
            if (storedEvents) {
                // Migrate legacy events that don't have status field
                const parsedEvents: Event[] = JSON.parse(storedEvents);
                const today = new Date(new Date().setHours(0, 0, 0, 0));

                const migratedEvents = parsedEvents.map(event => {
                    const isExpired = new Date(event.date) < today;
                    return {
                        ...event,
                        status: event.status || (isExpired ? 'expired' : 'active'), // Set proper status
                        pendingUserIds: isExpired ? [] : event.pendingUserIds, // Clear pending for expired
                    };
                });
                setEvents(migratedEvents);

                // Save migrated/cleaned events back
                const needsUpdate = parsedEvents.some(e =>
                    !e.status ||
                    (new Date(e.date) < today && e.pendingUserIds.length > 0)
                );
                if (needsUpdate) {
                    await AsyncStorage.setItem('events', JSON.stringify(migratedEvents));
                }
            }
            if (currentUser) setUser(JSON.parse(currentUser));
        } catch (e) {
            console.error('Failed to load data', e);
        } finally {
            setIsLoaded(true);
        }
    };

    const saveData = async (key: string, value: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Failed to save data', e);
        }
    };

    const login = async (username: string) => {
        const foundUser = users.find(u => u.username === username);
        if (foundUser) {
            setUser(foundUser);
            await saveData('currentUser', foundUser);
            return true;
        }
        return false;
    };

    const register = async (username: string) => {
        if (users.find(u => u.username === username)) return false;
        const newUser: User = { id: Date.now().toString(), username };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setUser(newUser);
        await saveData('users', updatedUsers);
        await saveData('currentUser', newUser);
        return true;
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('currentUser');
    };

    const createEvent = async (eventData: Omit<Event, 'id' | 'creatorId' | 'joinedUserIds' | 'pendingUserIds' | 'status'>) => {
        if (!user) return;
        const newEvent: Event = {
            ...eventData,
            id: Date.now().toString(),
            creatorId: user.id,
            joinedUserIds: [user.id], // Creator joins automatically
            pendingUserIds: [],
            status: 'active', // New events are active by default
        };
        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);
        await saveData('events', updatedEvents);
    };

    const updateEvent = async (eventId: string, updates: Partial<Omit<Event, 'id' | 'creatorId'>>) => {
        if (!user) return;
        const updatedEvents = events.map(e => {
            if (e.id === eventId && e.creatorId === user.id) {
                return { ...e, ...updates };
            }
            return e;
        });
        setEvents(updatedEvents);
        await saveData('events', updatedEvents);
    };

    const deleteEvent = async (eventId: string) => {
        if (!user) return;
        const updatedEvents = events.map(e => {
            if (e.id === eventId && e.creatorId === user.id) {
                return { ...e, status: 'deleted' as const };
            }
            return e;
        });
        setEvents(updatedEvents);
        await saveData('events', updatedEvents);
    };

    const joinEvent = async (eventId: string) => {
        if (!user) return;
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const updatedEvents = events.map(e => {
            if (e.id === eventId) {
                // Don't allow joining if event is deleted, expired, or full
                const isExpired = e.status === 'expired' || new Date(e.date) < today;
                const isFull = e.joinedUserIds.length >= e.capacity;
                if (e.status === 'deleted' || isExpired || isFull) {
                    return e;
                }
                if (!e.pendingUserIds.includes(user.id) && !e.joinedUserIds.includes(user.id)) {
                    return { ...e, pendingUserIds: [...e.pendingUserIds, user.id] };
                }
            }
            return e;
        });
        setEvents(updatedEvents);
        await saveData('events', updatedEvents);
    };

    const cancelJoin = async (eventId: string) => {
        if (!user) return;
        const updatedEvents = events.map(e => {
            if (e.id === eventId) {
                return {
                    ...e,
                    pendingUserIds: e.pendingUserIds.filter(id => id !== user.id),
                    joinedUserIds: e.joinedUserIds.filter(id => id !== user.id), // Also allow leaving if already joined? Requirement says "cancel request", but leaving is implied if game hasn't started.
                };
            }
            return e;
        });
        setEvents(updatedEvents);
        await saveData('events', updatedEvents);
    };

    const acceptRequest = async (eventId: string, userId: string) => {
        const updatedEvents = events.map(e => {
            if (e.id === eventId) {
                // Move from pending to joined
                if (e.joinedUserIds.length < e.capacity) {
                    return {
                        ...e,
                        pendingUserIds: e.pendingUserIds.filter(id => id !== userId),
                        joinedUserIds: [...e.joinedUserIds, userId]
                    };
                }
            }
            return e;
        });
        setEvents(updatedEvents);
        await saveData('events', updatedEvents);
    };

    const rejectRequest = async (eventId: string, userId: string) => {
        const updatedEvents = events.map(e => {
            if (e.id === eventId) {
                return {
                    ...e,
                    pendingUserIds: e.pendingUserIds.filter(id => id !== userId),
                };
            }
            return e;
        });
        setEvents(updatedEvents);
        await saveData('events', updatedEvents);
    };

    return (
        <StoreContext.Provider
            value={{
                user,
                events,
                users,
                login,
                register,
                logout,
                createEvent,
                updateEvent,
                deleteEvent,
                joinEvent,
                cancelJoin,
                acceptRequest,
                rejectRequest,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};
