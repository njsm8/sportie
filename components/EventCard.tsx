import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Event } from '../constants/types';

interface EventCardProps {
    event: Event;
    onPress: () => void;
    status?: string;
    hasPendingRequests?: boolean; // For creators to see pending requests indicator
}

export const EventCard = ({ event, onPress, status, hasPendingRequests }: EventCardProps) => {
    const formattedDate = format(new Date(event.date), 'dd MMM yyyy');
    const formattedTime = event.startTime;

    // Check if event is expired (date has passed)
    const isExpired = event.status === 'expired' || new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
    const isDeleted = event.status === 'deleted';

    let badgeColor = 'bg-blue-100 text-blue-800';
    let badgeText = event.category.toUpperCase();

    if (isExpired) {
        badgeColor = 'bg-gray-200 text-gray-600';
        badgeText = 'EXPIRED';
    } else if (isDeleted) {
        badgeColor = 'bg-red-100 text-red-800';
        badgeText = 'DELETED';
    } else if (status === 'creator') {
        badgeColor = 'bg-purple-100 text-purple-800';
        badgeText = 'YOUR EVENT';
    } else if (status === 'joined') {
        badgeColor = 'bg-green-100 text-green-800';
        badgeText = 'JOINED';
    } else if (status === 'full') {
        badgeColor = 'bg-red-100 text-red-800';
        badgeText = 'FULL';
    } else if (status === 'pending') {
        badgeColor = 'bg-yellow-100 text-yellow-800';
        badgeText = 'PENDING';
    }

    return (
        <TouchableOpacity
            className={`bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100 ${isExpired || isDeleted ? 'opacity-60' : ''}`}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center">
                    <View className={`px-3 py-1 rounded-full ${badgeColor.split(' ')[0]}`}>
                        <Text className={`text-xs font-bold ${badgeColor.split(' ')[1]}`}>
                            {badgeText}
                        </Text>
                    </View>
                    {/* Pending requests dot indicator for creators */}
                    {hasPendingRequests && status === 'creator' && !isExpired && !isDeleted && (
                        <View className="ml-2 flex-row items-center bg-orange-100 px-2 py-1 rounded-full">
                            <View className="w-2 h-2 bg-orange-500 rounded-full mr-1" />
                            <Text className="text-xs font-bold text-orange-600">
                                {event.pendingUserIds.length} pending
                            </Text>
                        </View>
                    )}
                </View>
                <Text className="text-gray-400 text-xs">{formattedDate}</Text>
            </View>

            <Text className="text-lg font-bold text-gray-900 mb-1">{event.title}</Text>
            <Text className="text-gray-500 text-sm mb-3">{event.location}</Text>

            <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={14} color="gray" />
                    <Text className="text-gray-600 text-xs font-medium ml-1">{formattedTime}</Text>
                </View>
                <View className="bg-gray-50 rounded-full px-2 py-1">
                    <Text className="text-xs text-gray-500">
                        {event.joinedUserIds.length}/{event.capacity} Joined
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
