import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';

export default function EventDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { events, joinEvent, cancelJoin, acceptRequest, rejectRequest, deleteEvent, users } = useEvents();
    const { user } = useAuth();
    const router = useRouter();

    // Modal states
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalMessage, setModalMessage] = useState({ title: '', message: '' });

    const event = events.find(e => e.id === id);

    if (!event || !user) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <Text>Event not found or loading...</Text>
            </SafeAreaView>
        );
    }

    const isCreator = event.creatorId === user.id;
    const isJoined = event.joinedUserIds.includes(user.id);
    const isPending = event.pendingUserIds.includes(user.id);
    const isFull = event.joinedUserIds.length >= event.capacity;

    // Check if event is expired
    const isExpired = event.status === 'expired' || new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
    const isDeleted = event.status === 'deleted';

    const showModal = (title: string, message: string) => {
        setModalMessage({ title, message });
        setShowSuccessModal(true);
    };

    const handleJoin = async () => {
        if (isExpired) {
            showModal('Cannot Join', 'This event has expired.');
            return;
        }
        await joinEvent(event.id);
        showModal('Request Sent', 'Your join request has been sent to the host.');
    };

    const handleCancel = async () => {
        await cancelJoin(event.id);
        showModal('Request Cancelled', isJoined ? 'You have left the event.' : 'Your request has been cancelled.');
    };

    const handleAccept = async (userId: string) => {
        await acceptRequest(event.id, userId);
        showModal('Request Accepted', 'User has been added to the event.');
    };

    const handleReject = async (userId: string) => {
        await rejectRequest(event.id, userId);
        showModal('Request Rejected', 'The join request has been rejected.');
    };

    const handleDelete = async () => {
        await deleteEvent(event.id);
        setShowDeleteModal(false);
        router.replace('/(tabs)');
    };

    const getUserName = (userId: string) => {
        const u = users?.find(u => u.id === userId);
        return u ? u.username : `User ${userId.substring(0, 4)}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <Stack.Screen options={{ headerShown: true, title: 'Event Details', headerBackTitle: 'Back' }} />

            <ScrollView className="flex-1">
                {/* Header Image/Icon Area */}
                <View className={`h-48 items-center justify-center mb-4 border-b border-gray-100 ${isExpired ? 'bg-gray-100' : isDeleted ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <Ionicons
                        name={isExpired ? "time-outline" : isDeleted ? "trash-outline" : "trophy-outline"}
                        size={64}
                        color={isExpired ? "#6b7280" : isDeleted ? "#dc2626" : "#3b82f6"}
                    />
                    {(isExpired || isDeleted) && (
                        <View className={`mt-2 px-4 py-1 rounded-full ${isDeleted ? 'bg-red-100' : 'bg-gray-200'}`}>
                            <Text className={`font-bold ${isDeleted ? 'text-red-600' : 'text-gray-600'}`}>
                                {isDeleted ? 'EVENT DELETED' : 'EVENT EXPIRED'}
                            </Text>
                        </View>
                    )}
                </View>

                <View className="px-6 pb-20">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="bg-blue-100 px-3 py-1 rounded-full">
                            <Text className="text-xs font-bold text-blue-800 tracking-wider uppercase">{event.category}</Text>
                        </View>
                        <View className="flex-row items-center">
                            {isCreator && (
                                <View className="bg-purple-100 px-2 py-1 rounded mr-2">
                                    <Text className="text-xs text-purple-600 font-bold">YOU ARE HOST</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <Text className="text-3xl font-bold text-gray-900 mb-2">{event.title}</Text>

                    <View className="flex-row items-center mb-4 space-x-2">
                        <Ionicons name="calendar-outline" size={18} color="gray" />
                        <Text className="text-gray-600 text-base ml-2">
                            {format(new Date(event.date), 'EEEE, d MMMM yyyy')}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-4 space-x-2">
                        <Ionicons name="time-outline" size={18} color="gray" />
                        <Text className="text-gray-600 text-base ml-2">
                            {event.startTime} - {event.endTime}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-6 space-x-2">
                        <Ionicons name="location-outline" size={18} color="gray" />
                        <Text className="text-gray-600 text-base ml-2">{event.location}</Text>
                    </View>

                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-900 mb-2">About</Text>
                        <Text className="text-gray-600 leading-relaxed">{event.description || 'No description provided.'}</Text>
                    </View>

                    {/* Creator Actions - Edit & Delete */}
                    {isCreator && !isDeleted && (
                        <View className="mb-6 flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 bg-blue-50 p-4 rounded-xl flex-row items-center justify-center border border-blue-100"
                                onPress={() => router.push(`/edit-event/${event.id}` as any)}
                            >
                                <Ionicons name="create-outline" size={20} color="#3b82f6" />
                                <Text className="text-blue-600 font-bold ml-2">Edit Event</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-red-50 p-4 rounded-xl flex-row items-center justify-center border border-red-100"
                                onPress={() => setShowDeleteModal(true)}
                            >
                                <Ionicons name="trash-outline" size={20} color="#dc2626" />
                                <Text className="text-red-600 font-bold ml-2">Delete Event</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Participants */}
                    {(isCreator || isJoined) && (
                        <View className="mb-8">
                            <Text className="text-lg font-bold text-gray-900 mb-3">Participants ({event.joinedUserIds.length}/{event.capacity})</Text>
                            {event.joinedUserIds.length === 0 ? (
                                <Text className="text-gray-400 italic">No participants yet. Be the first to join!</Text>
                            ) : (
                                <View className="flex-row flex-wrap gap-2">
                                    {event.joinedUserIds.map(uid => (
                                        <View key={uid} className="flex-row items-center bg-gray-50 px-3 py-2 rounded-xl mb-2 border border-gray-100">
                                            <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-2">
                                                <Text className="text-xs font-bold text-blue-600">{getUserName(uid).charAt(0).toUpperCase()}</Text>
                                            </View>
                                            <Text className="text-gray-700 font-medium">{getUserName(uid)}</Text>
                                            {uid === event.creatorId && (
                                                <View className="ml-2 bg-purple-100 px-2 py-0.5 rounded">
                                                    <Text className="text-xs text-purple-600 font-bold">Host</Text>
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Pending Requests (Creator Only) */}
                    {isCreator && event.pendingUserIds.length > 0 && !isExpired && !isDeleted && (
                        <View className="mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <View className="flex-row items-center mb-3">
                                <View className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
                                <Ionicons name="people" size={20} color="#854d0e" />
                                <Text className="font-bold text-yellow-800 ml-2 text-lg">Pending Requests ({event.pendingUserIds.length})</Text>
                            </View>
                            {event.pendingUserIds.map(uid => (
                                <View key={uid} className="flex-row justify-between items-center mb-3 bg-white p-3 rounded-lg shadow-sm">
                                    <View className="flex-row items-center">
                                        <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center mr-3">
                                            <Text className="text-gray-600 font-bold">{getUserName(uid).charAt(0).toUpperCase()}</Text>
                                        </View>
                                        <Text className="font-bold text-gray-800 text-lg">{getUserName(uid)}</Text>
                                    </View>
                                    <View className="flex-row gap-2">
                                        <TouchableOpacity onPress={() => handleAccept(uid)} className="bg-green-500 px-4 py-2 rounded-lg">
                                            <Text className="text-white font-bold">Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleReject(uid)} className="bg-red-100 px-4 py-2 rounded-lg border border-red-200">
                                            <Text className="text-red-600 font-bold">Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Floating Bottom Action Bar */}
            {!isCreator && !isDeleted && (
                <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    {isExpired ? (
                        <View className="bg-gray-100 p-4 rounded-xl items-center">
                            <Text className="text-gray-500 font-bold text-lg">Event Has Expired</Text>
                        </View>
                    ) : isJoined ? (
                        <View className="bg-green-50 p-4 rounded-xl items-center flex-row justify-between border border-green-100">
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={24} color="green" />
                                <Text className="text-green-800 font-bold text-lg ml-2">You Joined</Text>
                            </View>
                            <TouchableOpacity onPress={handleCancel}>
                                <Text className="text-green-700 font-medium underline">Leave Event</Text>
                            </TouchableOpacity>
                        </View>
                    ) : isPending ? (
                        <View className="bg-yellow-50 p-4 rounded-xl items-center flex-row justify-between border border-yellow-100">
                            <View className="flex-row items-center">
                                <Ionicons name="time" size={24} color="orange" />
                                <Text className="text-yellow-800 font-bold text-lg ml-2">Request Pending</Text>
                            </View>
                            <TouchableOpacity onPress={handleCancel}>
                                <Text className="text-yellow-700 font-medium underline">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : isFull ? (
                        <View className="bg-gray-100 p-4 rounded-xl items-center">
                            <Text className="text-gray-500 font-bold text-lg">Event Full</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            className="bg-blue-600 p-4 rounded-xl items-center shadow-lg active:bg-blue-700 flex-row justify-center"
                            onPress={handleJoin}
                        >
                            <Text className="text-white font-bold text-lg mr-2">Request to Join</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Success/Info Modal */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white p-6 rounded-2xl w-full items-center">
                        <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                            <Ionicons name="checkmark" size={32} color="#3b82f6" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 mb-2">{modalMessage.title}</Text>
                        <Text className="text-gray-500 text-center mb-6">{modalMessage.message}</Text>
                        <TouchableOpacity
                            className="bg-blue-600 w-full p-4 rounded-xl items-center"
                            onPress={() => setShowSuccessModal(false)}
                        >
                            <Text className="text-white font-bold">OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal visible={showDeleteModal} transparent animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white p-6 rounded-2xl w-full items-center">
                        <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                            <Ionicons name="trash-outline" size={32} color="#dc2626" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 mb-2">Delete Event?</Text>
                        <Text className="text-gray-500 text-center mb-6">
                            This event will be marked as deleted. Participants will still be able to see it in their history.
                        </Text>
                        <View className="w-full flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 bg-gray-100 p-4 rounded-xl items-center"
                                onPress={() => setShowDeleteModal(false)}
                            >
                                <Text className="text-gray-700 font-bold">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-red-600 p-4 rounded-xl items-center"
                                onPress={handleDelete}
                            >
                                <Text className="text-white font-bold">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
