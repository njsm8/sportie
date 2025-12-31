import { useStore } from './useStore';

export const useEvents = () => {
    const { events, createEvent, updateEvent, deleteEvent, joinEvent, cancelJoin, acceptRequest, rejectRequest, user, users } = useStore();

    const getMyEvents = () => {
        if (!user) return [];
        return events.filter(e => e.creatorId === user.id);
    };

    const getJoinedEvents = () => {
        if (!user) return [];
        return events.filter(e => e.joinedUserIds.includes(user.id) && e.creatorId !== user.id);
    };

    return {
        events,
        createEvent,
        updateEvent,
        deleteEvent,
        joinEvent,
        cancelJoin,
        acceptRequest,
        rejectRequest,
        users,
        myEvents: getMyEvents(),
        joinedEvents: getJoinedEvents(),
    };
};
