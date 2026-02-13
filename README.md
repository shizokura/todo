# Todo App

A cross-platform Todo application built with React Native, Expo, and Redux Toolkit.

## Features

- Cross-platform support (iOS, Android, Web)
- Offline-first with local SQLite database
- Task management with CRUD operations
- Category organization
- Priority levels
- Due dates and reminders
- Dark/Light theme
- Material Design 3 UI with React Native Paper

## Tech Stack

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit + RTK Query
- **Database**: SQLite (expo-sqlite)
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **Language**: TypeScript

## Project Structure

```
todo-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation configuration
│   ├── store/           # Redux store and slices
│   ├── services/        # Database, API services
│   ├── models/          # Data models/types
│   ├── utils/           # Helper functions
│   └── constants/       # App constants
├── android/             # Android native code
├── ios/                 # iOS native code
└── web/                 # Web platform files
```

## Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

### Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on Web
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
npm run test       # Run tests
npm run typecheck  # Run TypeScript check
```

## Development

### State Management

The app uses Redux Toolkit for state management with the following slices:

- **tasksSlice**: Task CRUD operations
- **categoriesSlice**: Category management
- **filtersSlice**: Search and filter state
- **uiSlice**: Theme and UI state

### Database

Local SQLite database with tables for:
- Tasks
- Categories
- Subtasks
- Attachments
- Reminders

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

## Building

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

### Web
```bash
npm run build:web
```

## License

MIT
