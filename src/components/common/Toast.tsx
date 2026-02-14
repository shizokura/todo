import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../../constants/theme';
import { useTheme } from '../../utils/useTheme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top' | 'bottom';
  onClose?: () => void;
  onShow?: () => void;
}

interface ToastConfig {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

const toasts = new Map<string, ToastConfig>();
let nextToastId = 0;

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  position = 'top',
  onClose,
  onShow,
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onShow?.();
    });

    const timer = setTimeout(() => {
      hide();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hide = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const getColor = (): string => {
    switch (type) {
      case 'success':
        return theme.success;
      case 'error':
        return theme.error;
      case 'warning':
        return theme.warning;
      case 'info':
      default:
        return theme.info;
    }
  };

  const backgroundColor = getColor();
  const topPosition = position === 'top' ? 50 : Dimensions.get('window').height - 100;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={hide}
      style={[
        styles.toastContainer,
        {
          top: topPosition,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.toast, { backgroundColor }]}>
        <Text style={[styles.message, { color: theme.text.inverse }]}>{message}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    minWidth: 200,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  message: {
    fontSize: FONT_SIZES.medium,
    textAlign: 'center',
  },
});

export const showToast = (
  message: string,
  type: ToastType = 'info',
  duration: number = 3000,
  position: 'top' | 'bottom' = 'top'
): void => {
  const id = `toast-${nextToastId++}`;
  toasts.set(id, { id, message, type, duration });
};

export default Toast;
