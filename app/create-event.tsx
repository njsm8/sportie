import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../hooks/useEvents';

export default function CreateEventScreen() {
    const router = useRouter();
    const { createEvent } = useEvents();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 2 * 60 * 60 * 1000)); // Default 2 hours later
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState('');
    const [description, setDescription] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Pickers state
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const showError = (message: string) => {
        setErrorMessage(message);
        setShowErrorModal(true);
    };

    const handleCreate = async () => {
        // Validations
        if (!title || !category || !location || !capacity) {
            showError('Please fill in all required fields');
            return;
        }

        if (title.length > 50) {
            showError('Title should be less than 50 characters');
            return;
        }

        if (category.length > 20) {
            showError('Category should be less than 20 characters');
            return;
        }

        if (location.length > 50) {
            showError('Location should be less than 50 characters');
            return;
        }

        if (description.length > 200) {
            showError('Description should be less than 200 characters');
            return;
        }

        const capacityNum = parseInt(capacity, 10);
        if (isNaN(capacityNum) || capacityNum <= 0 || capacityNum > 50) {
            showError('Capacity must be between 1 and 50');
            return;
        }

        try {
            await createEvent({
                title,
                category,
                date: date.toISOString(),
                startTime: format(startTime, 'hh:mm a'),
                endTime: format(endTime, 'hh:mm a'),
                location,
                capacity: capacityNum,
                description
            });
            setShowSuccessModal(true);
        } catch (e) {
            showError('Failed to create event.');
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    const onStartTimeChange = (event: any, selectedDate?: Date) => {
        setShowStartTimePicker(false);
        if (selectedDate) setStartTime(selectedDate);
    };

    const onEndTimeChange = (event: any, selectedDate?: Date) => {
        setShowEndTimePicker(false);
        if (selectedDate) setEndTime(selectedDate);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">Create Event</Text>
            </View>

            <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 50 }}>

                <Text className="label">Event Title *</Text>
                <TextInput className="input" value={title} onChangeText={setTitle} placeholder="e.g. Sunday Football" />
                {title.length > 50 && <Text className="text-red-500 text-xs mt-1">Title limit exceeded ({title.length}/50)</Text>}

                <Text className="label">Category *</Text>
                <TextInput className="input" value={category} onChangeText={setCategory} placeholder="e.g. Football" />
                {category.length > 20 && <Text className="text-red-500 text-xs mt-1">Category limit exceeded ({category.length}/20)</Text>}

                <Text className="label">Date *</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} className="input justify-center">
                    <Text>{format(date, 'yyyy-MM-dd')}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} minimumDate={new Date()} />
                )}

                <View className="flex-row gap-4">
                    <View className="flex-1">
                        <Text className="label">Start Time *</Text>
                        <TouchableOpacity onPress={() => setShowStartTimePicker(true)} className="input justify-center">
                            <Text>{format(startTime, 'hh:mm a')}</Text>
                        </TouchableOpacity>
                        {showStartTimePicker && (
                            <DateTimePicker value={startTime} mode="time" display="default" onChange={onStartTimeChange} />
                        )}
                    </View>
                    <View className="flex-1">
                        <Text className="label">End Time</Text>
                        <TouchableOpacity onPress={() => setShowEndTimePicker(true)} className="input justify-center">
                            <Text>{format(endTime, 'hh:mm a')}</Text>
                        </TouchableOpacity>
                        {showEndTimePicker && (
                            <DateTimePicker value={endTime} mode="time" display="default" onChange={onEndTimeChange} />
                        )}
                    </View>
                </View>

                <Text className="label">Location *</Text>
                <TextInput className="input" value={location} onChangeText={setLocation} placeholder="e.g. Central Park" />
                {location.length > 50 && <Text className="text-red-500 text-xs mt-1">Location limit exceeded ({location.length}/50)</Text>}

                <Text className="label">Capacity (Max 50) *</Text>
                <TextInput className="input" value={capacity} onChangeText={setCapacity} placeholder="e.g. 10" keyboardType="numeric" />
                {parseInt(capacity || '0') > 50 && <Text className="text-red-500 text-xs mt-1">Capacity cannot exceed 50</Text>}


                <Text className="label">Description</Text>
                <TextInput
                    className="input h-24 align-top"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Additional details..."
                    multiline
                    textAlignVertical="top"
                />
                {description.length > 200 && <Text className="text-red-500 text-xs mt-1">Description limit exceeded ({description.length}/200)</Text>}

                <TouchableOpacity
                    className="bg-blue-600 p-4 rounded-xl items-center mt-6 shadow-md active:bg-blue-700"
                    onPress={handleCreate}
                >
                    <Text className="text-white font-bold text-lg">Create Event</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Success Modal */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white p-6 rounded-2xl w-full items-center">
                        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                            <Ionicons name="checkmark" size={32} color="green" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 mb-2">Event Created Successfully!</Text>
                        <Text className="text-gray-500 text-center mb-6">Your event is now live and other users can request to join.</Text>

                        <TouchableOpacity
                            className="bg-blue-600 w-full p-4 rounded-xl items-center"
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.replace('/(tabs)');
                            }}
                        >
                            <Text className="text-white font-bold">Go to Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Error Modal */}
            <Modal visible={showErrorModal} transparent animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white p-6 rounded-2xl w-full items-center">
                        <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                            <Ionicons name="alert-circle" size={32} color="#dc2626" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 mb-2">Error</Text>
                        <Text className="text-gray-500 text-center mb-6">{errorMessage}</Text>

                        <TouchableOpacity
                            className="bg-gray-100 w-full p-4 rounded-xl items-center"
                            onPress={() => setShowErrorModal(false)}
                        >
                            <Text className="text-gray-700 font-bold">OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
