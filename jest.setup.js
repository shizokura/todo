import '@testing-library/jest-native/extend-expect';

global.__DEV__ = true;

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
