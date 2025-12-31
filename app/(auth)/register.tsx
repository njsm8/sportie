import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { register } = useAuth();
    const router = useRouter();

    const showError = (message: string) => {
        setErrorMessage(message);
        setShowErrorModal(true);
    };

    const handleRegister = async () => {
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }

        if (username.length < 3) {
            showError('Username must be at least 3 characters');
            return;
        }

        if (password.length < 4) {
            showError('Password must be at least 4 characters');
            return;
        }

        const success = await register(username);
        if (success) {
            setShowSuccessModal(true);
        } else {
            showError('Username already taken.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-8 justify-center">
            <View className="items-center mb-10">
                <View className="mb-6 bg-blue-50 p-6 rounded-full">
                    <Ionicons name="person-add" size={60} color="#2563eb" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Sign Up</Text>
                <Text className="text-gray-500 text-sm text-center">Use proper information to continue</Text>
            </View>

            <View className="space-y-8">
                {/* Username Input */}
                <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm">
                    <Ionicons name="person-outline" size={20} color="#9ca3af" className="mr-3" />
                    <TextInput
                        className="flex-1 text-gray-700 font-sans text-base ml-2"
                        placeholder="User name"
                        placeholderTextColor="#9ca3af"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                {/* Password Input */}
                <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm">
                    <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" className="mr-3" />
                    <TextInput
                        className="flex-1 text-gray-700 font-sans text-base ml-2"
                        placeholder="Password"
                        placeholderTextColor="#9ca3af"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity>
                        <Ionicons name="eye-off-outline" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                {/* Terms and Privacy */}
                <Text className="text-center text-gray-400 text-xs px-4 leading-5 mt-2">
                    By signing up, you are agree to our <Text className="text-blue-600 font-bold">Terms & Conditions</Text> and <Text className="text-blue-600 font-bold">Privacy Policy</Text>
                </Text>

                {/* Sign Up Button */}
                <TouchableOpacity
                    className="w-full bg-blue-600 py-4 rounded-full items-center shadow-lg shadow-blue-200 active:bg-blue-700 mt-2"
                    onPress={handleRegister}
                >
                    <Text className="text-white font-bold text-lg">Create Account</Text>
                </TouchableOpacity>

                {/* Login Link */}
                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-500 text-sm">Already have an account? </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold text-sm">Sign in</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>

            {/* Success Modal */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white p-6 rounded-2xl w-full items-center">
                        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                            <Ionicons name="checkmark" size={32} color="green" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 mb-2">Account Created!</Text>
                        <Text className="text-gray-500 text-center mb-6">Welcome to Sportie! You can now create and join sports events.</Text>

                        <TouchableOpacity
                            className="bg-blue-600 w-full p-4 rounded-xl items-center"
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.replace('/(tabs)');
                            }}
                        >
                            <Text className="text-white font-bold">Get Started</Text>
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
