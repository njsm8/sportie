import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const showError = (message: string) => {
        setErrorMessage(message);
        setShowErrorModal(true);
    };

    const handleLogin = async () => {
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }
        const success = await login(username); // Password ignored for mock
        if (success) {
            router.replace('/(tabs)');
        } else {
            showError('User not found. Please register.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-8 justify-center">
            <View className="items-center mb-10">
                {/* Illustration placeholder or Logo */}
                <View className="mb-6 bg-blue-50 p-6 rounded-full">
                    <Ionicons name="football" size={60} color="#2563eb" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Sportie</Text>
                <Text className="text-gray-500 text-sm text-center">Create and join sports events near you</Text>
            </View>

            <View className="space-y-8">
                {/* Username Input */}
                <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-2 py-2 shadow-sm mb-4">
                    <Ionicons name="person-outline" size={20} color="#9ca3af" className="mr-3 ml-2" />
                    <TextInput
                        className="flex-1 text-gray-700 font-sans text-base ml-2"
                        placeholder="Username"
                        placeholderTextColor="#9ca3af"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                {/* Password Input */}
                <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-2 py-2 shadow-sm">
                    <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" className="mr-3 ml-2" />
                    <TextInput
                        className="flex-1 text-gray-700 font-sans text-base ml-2"
                        placeholder="Password"
                        placeholderTextColor="#9ca3af"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity>
                        <Ionicons name="eye-off-outline" size={20} color="#9ca3af" className="mr-3" />
                    </TouchableOpacity>
                </View>

                {/* Remember Me Checkbox */}
                <View className="flex-row items-center justify-between my-2">
                    <TouchableOpacity className='flex-row items-center'>
                        <Ionicons name="checkbox-outline" size={20} color="#9ca3af" className="mr-3" />
                        <Text className="text-gray-700 font-sans text-base ml-1">Remember me</Text>
                    </TouchableOpacity>


                    {/* Forgot Password */}
                    <TouchableOpacity className="items-end my-2">
                        <Text className="text-blue-600 font-medium text-sm">Forget password</Text>
                    </TouchableOpacity>
                </View>



                {/* Login Button */}
                <TouchableOpacity
                    className="w-full bg-blue-600 py-4 rounded-full items-center shadow-lg shadow-blue-200 active:bg-blue-700 mt-2"
                    onPress={handleLogin}
                >
                    <Text className="text-white font-bold text-lg">Login</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-500 text-sm">Haven't any account? </Text>
                    <Link href="/(auth)/register" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold text-sm">Sign up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>

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
