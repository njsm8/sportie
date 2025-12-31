import { format } from 'date-fns';

export const formatDate = (date: Date | string) => {
    return format(new Date(date), 'yyyy-MM-dd');
};

export const formatTime = (date: Date | string) => {
    return format(new Date(date), 'hh:mm a');
};
