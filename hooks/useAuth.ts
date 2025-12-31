import { useStore } from './useStore';

export const useAuth = () => {
    const { user, login, register, logout } = useStore();
    return { user, login, register, logout, isAuthenticated: !!user };
};
