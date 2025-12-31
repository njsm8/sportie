import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventCard } from '../../components/EventCard';
import { Event } from '../../constants/types';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';

export default function HomeScreen() {
  const { events } = useEvents();
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Filter out deleted and expired events from main list and sort by date
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const visibleEvents = events
    .filter(event => {
      // Hide deleted events
      if (event.status === 'deleted') return false;
      // Hide expired events (date is in the past)
      if (event.status === 'expired' || new Date(event.date) < today) return false;
      return true;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getEventStatus = (event: Event) => {
    if (!user) return undefined;
    if (event.creatorId === user.id) return 'creator';
    if (event.joinedUserIds.includes(user.id)) return 'joined';
    if (event.pendingUserIds.includes(user.id)) return 'pending';
    if (event.joinedUserIds.length >= event.capacity) return 'full';
    return undefined;
  };

  const hasPendingRequests = (event: Event) => {
    if (!user) return false;
    return event.creatorId === user.id && event.pendingUserIds.length > 0;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app we would fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4">
      <View className="flex-row justify-between items-center py-4 mb-2">
        <View>
          <Text className="text-gray-500 text-sm font-medium">Hello, {user?.username}!</Text>
          <Text className="text-2xl font-bold text-gray-900">Discover Events</Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100"
          onPress={() => { /* Notification feature later */ }}
        >
          <Ionicons name="notifications-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={visibleEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => router.push(`/event/${item.id}`)}
            status={getEventStatus(item)}
            hasPendingRequests={hasPendingRequests(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-400">No events found</Text>
            <TouchableOpacity onPress={() => router.push('/create-event')} className="mt-4">
              <Text className="text-blue-600 font-bold">Create one?</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button for Creating Event */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/create-event')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
