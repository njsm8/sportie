import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventCard } from '../../components/EventCard';
import { Event } from '../../constants/types';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { myEvents, joinedEvents } = useEvents();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'hosted' | 'joined'>('hosted');

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    const displayedEvents = activeTab === 'hosted' ? myEvents : joinedEvents;

    const getEventStatus = (event: Event, isHosted: boolean) => {
        if (isHosted) return 'creator';
        return 'joined';
    };

    const hasPendingRequests = (event: Event) => {
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const isExpired = event.status === 'expired' || new Date(event.date) < today;
        return event.pendingUserIds.length > 0 && event.status !== 'deleted' && !isExpired;
    };

    // Helper to check if event is expired
    const isEventExpired = (event: Event) => {
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        return event.status === 'expired' || new Date(event.date) < today;
    };

    // Sort events: active first, then expired/deleted
    const sortedEvents = [...displayedEvents].sort((a, b) => {
        const getOrder = (e: Event) => {
            if (e.status === 'deleted') return 2;
            if (isEventExpired(e)) return 1;
            return 0;
        };
        return getOrder(a) - getOrder(b);
    });

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-6 border-b border-gray-100">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-3xl font-bold text-gray-900">Profile</Text>
                    <TouchableOpacity onPress={handleLogout} className="bg-gray-100 p-2 rounded-full">
                        <Ionicons name="log-out-outline" size={24} color="gray" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center">
                    <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mr-4">
                        <Text className="text-2xl font-bold text-blue-600">{user?.username ? user.username.charAt(0).toUpperCase() : '?'}</Text>
                    </View>
                    <View>
                        <Text className="text-xl font-bold text-gray-900">{user?.username}</Text>
                        <Text className="text-gray-500">Sports Enthusiast</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row border-b border-gray-100">
                <TouchableOpacity
                    className={`flex-1 p-4 items-center ${activeTab === 'hosted' ? 'border-b-2 border-blue-600' : ''}`}
                    onPress={() => setActiveTab('hosted')}
                >
                    <View className="flex-row items-center">
                        <Text className={`font-bold ${activeTab === 'hosted' ? 'text-blue-600' : 'text-gray-500'}`}>Hosted Events</Text>
                        <View className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                            <Text className="text-xs text-gray-600">{myEvents.length}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 p-4 items-center ${activeTab === 'joined' ? 'border-b-2 border-blue-600' : ''}`}
                    onPress={() => setActiveTab('joined')}
                >
                    <View className="flex-row items-center">
                        <Text className={`font-bold ${activeTab === 'joined' ? 'text-blue-600' : 'text-gray-500'}`}>Joined Events</Text>
                        <View className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                            <Text className="text-xs text-gray-600">{joinedEvents.length}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <FlatList
                data={sortedEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <EventCard
                        event={item}
                        onPress={() => router.push(`/event/${item.id}`)}
                        status={getEventStatus(item, activeTab === 'hosted')}
                        hasPendingRequests={activeTab === 'hosted' && hasPendingRequests(item)}
                    />
                )}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                ListEmptyComponent={
                    <View className="items-center justify-center mt-10">
                        <Ionicons name={activeTab === 'hosted' ? 'calendar-outline' : 'people-outline'} size={48} color="#d1d5db" />
                        <Text className="text-gray-400 mt-4">
                            {activeTab === 'hosted' ? 'You haven\'t hosted any events yet.' : 'You haven\'t joined any events yet.'}
                        </Text>
                        {activeTab === 'hosted' && (
                            <TouchableOpacity onPress={() => router.push('/create-event')} className="mt-4">
                                <Text className="text-blue-600 font-bold">Create your first event</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />
        </SafeAreaView>
    );
}
