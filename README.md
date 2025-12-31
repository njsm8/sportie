# 🏃‍♂️ Sportie

A modern React Native mobile application for sports enthusiasts to discover, create, and manage sports events in their community.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0.30-000020?style=flat-square&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat-square&logo=typescript)
![NativeWind](https://img.shields.io/badge/NativeWind-4.2.1-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ Features

### 🔐 Authentication
- **User Registration** - Create a new account with username and password
- **Secure Login** - Access your account with your credentials
- **Persistent Sessions** - Stay logged in across app restarts
- **Profile Management** - View and manage your user profile

### 📅 Event Management
- **Create Events** - Organize sports events with details like:
  - Event title and description
  - Sport category
  - Date and time (start/end)
  - Location
  - Player capacity
- **Edit Events** - Modify your event details anytime
- **Delete Events** - Remove events you've created
- **Event Lifecycle** - Automatic status tracking (active, expired, deleted)

### 👥 Participant Management
- **Join Events** - Request to join events created by others
- **Pending Requests** - View your pending join requests
- **Accept/Reject Requests** - Event creators can manage participant requests
- **Cancel Participation** - Withdraw from events you've joined
- **Capacity Tracking** - Events automatically track available spots

### 🏠 Event Discovery
- **Browse Events** - View all available sports events
- **Event Cards** - Clean, informative event previews
- **Event Details** - Full event information with participant lists
- **Filter by Status** - See events you've created or joined

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile development |
| **Expo** | Development tooling and native APIs |
| **TypeScript** | Type-safe JavaScript |
| **Expo Router** | File-based routing |
| **NativeWind** | Tailwind CSS for React Native |
| **AsyncStorage** | Local data persistence |
| **React Context** | Global state management |
| **Date-fns** | Date manipulation and formatting |
| **Poppins Font** | Modern typography |

## 📁 Project Structure

```
sportie/
├── app/                    # Application screens (file-based routing)
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   └── register.tsx   # Registration screen
│   ├── (tabs)/            # Main tab navigation
│   │   ├── index.tsx      # Home/Events feed
│   │   └── profile.tsx    # User profile
│   ├── event/             # Event detail screens
│   ├── edit-event/        # Event editing screens
│   ├── create-event.tsx   # Event creation screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── EventCard.tsx      # Event card component
│   ├── ui/                # Base UI components
│   └── ...
├── context/               # React Context providers
│   └── Store.tsx          # Global state store
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   ├── useEvents.ts       # Events management hook
│   └── useStore.ts        # Store access hook
├── constants/             # App constants
│   └── types.ts           # TypeScript type definitions
├── assets/                # Images and static assets
└── utils/                 # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/njsm8/sportie.git
   cd sportie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run the app**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Press `a` to open in Android emulator
   - Press `i` to open in iOS simulator
   - Press `w` to open in web browser

## 📱 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo development server |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint for code quality |
| `npm run reset-project` | Reset to a fresh project state |

## 🎨 Design System

The app uses **NativeWind** (Tailwind CSS for React Native) with a custom design system featuring:

- **Modern Typography** - Poppins font family
- **Dark Mode Support** - Automatic theme switching
- **Responsive Layouts** - Adaptive to all screen sizes
- **Smooth Animations** - React Native Reanimated
- **Haptic Feedback** - Tactile button responses

## 📦 Key Dependencies

```json
{
  "expo": "~54.0.30",
  "react-native": "0.81.5",
  "expo-router": "~6.0.21",
  "nativewind": "^4.2.1",
  "tailwindcss": "^3.4.19",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "react-native-reanimated": "~4.1.1",
  "date-fns": "^4.1.0",
  "@expo-google-fonts/poppins": "^0.4.1"
}
```

## 🗄️ Data Storage

All data is stored locally using **AsyncStorage**:
- User accounts and authentication state
- Event data with full CRUD operations
- Participant and pending request lists

> **Note**: This is a demo application. In production, you would integrate with a backend API for secure data storage and real-time synchronization.

---

<p align="center">
  Built with ❤️ using React Native & Expo
</p>
<p align="center">
  <em>Assignment Project</em>
</p>
