# Development Setup Guide

## Prerequisites

### Required Software

1. **Node.js** (version 20 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

### Platform-Specific Requirements

#### Android Development

1. **Android Studio**
   - Download from [developer.android.com/studio](https://developer.android.com/studio)
   - Install Android SDK (API level 34+)
   - Enable Android SDK Platform-Tools
   - Set up Android Virtual Device (AVD) or connect physical device

2. **Java Development Kit (JDK)** (version 17)
   - Comes with Android Studio

3. **Environment Variables**
   ```bash
   ANDROID_HOME=/path/to/Android/sdk
   PATH=$PATH:$ANDROID_HOME/emulator
   PATH=$PATH:$ANDROID_HOME/tools
   PATH=$PATH:$ANDROID_HOME/tools/bin
   PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### iOS Development (macOS only)

1. **Xcode** (version 15+)
   - Install from Mac App Store
   - Install Xcode Command Line Tools: `xcode-select --install`
   - Install CocoaPods: `sudo gem install cocoapods`

2. **iOS Simulator**
   - Available within Xcode
   - Or connect physical iOS device

#### Web Development

1. **Modern web browser** (Chrome, Firefox, Safari, Edge)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

This will start the Expo development server and open the Expo DevTools in your browser.

### 4. Run on Your Target Platform

#### Android
```bash
npm run android
```
- Make sure an Android emulator is running or a physical device is connected
- Accept USB debugging prompt on physical device

#### iOS (macOS only)
```bash
npm run ios
```
- This will open the iOS Simulator
- For physical device, connect via USB and select from Xcode

#### Web
```bash
npm run web
```
- Opens in your default web browser
- Also accessible at http://localhost:19006

## Development Workflow

### Code Quality

Before committing code, run:

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Type checking
npm run typecheck

# Run tests
npm test
```

### Running Tests

```bash
# Run all tests once
npm test

# Run in watch mode
npm test -- --watch

# Generate coverage report
npm run test:coverage
```

### Building for Production

#### Android
```bash
npm run build:android
```

#### iOS
```bash
npm run build:ios
```

#### Web
```bash
npm run build:web
```

## IDE Setup

### Visual Studio Code (Recommended)

Install the following extensions:

1. **ES7+ React/Redux/React-Native snippets**
2. **TypeScript**
3. **ESLint**
4. **Prettier**
5. **Expenv** (for Expo environment variables)

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true
  }
}
```

## Troubleshooting

### Common Issues

#### "Metro bundler not starting"
- Stop the dev server (Ctrl+C)
- Clear cache: `npm start -- --clear`
- Restart dev server

#### "Android build failed"
- Clean build: `cd android && ./gradlew clean`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Java version (must be 17)

#### "iOS build failed"
- Clean build folders in Xcode (Product > Clean Build Folder)
- Reinstall pods: `cd ios && pod install`
- Check Xcode version compatibility

#### "React Native Vector Icons not showing"
- Link fonts: `npx react-native link react-native-vector-icons`
- For Expo, ensure `expo-splash-screen` is configured

#### "TypeScript errors"
- Run `npm run typecheck` to see all errors
- Update tsconfig.json if needed
- Check type imports

### Getting Help

1. Check [Expo documentation](https://docs.expo.dev/)
2. Check [React Native documentation](https://reactnative.dev/)
3. Search GitHub Issues for similar problems
4. Ask in project discussions or create an issue

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
EXPO_PUBLIC_API_URL=your-api-url
EXPO_PUBLIC_ANALYTICS_KEY=your-key
```

Access in code: `Constants.expoConfig.extra.apiUrl`

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(tasks): add task completion feature

Add checkbox to toggle task completion status and update database.

Closes #123
```

## Performance Tips

1. Use React.memo for expensive components
2. Implement virtualized lists for long lists
3. Optimize images and assets
4. Use Redux's createSelector for memoized selectors
5. Minimize unnecessary re-renders

## Security

1. Never commit sensitive data (API keys, passwords)
2. Use expo-secure-store for sensitive data
3. Enable database encryption in production
4. Keep dependencies updated

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native Paper](https://reactnativepaper.com/)
