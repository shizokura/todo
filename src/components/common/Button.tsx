import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../../constants/theme';
import { useTheme } from '../../utils/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  accessibilityLabel,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const getBackgroundColor = (): string => {
    if (disabled || loading) return theme.text.disabled;

    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'outline':
      case 'text':
        return 'transparent';
      case 'danger':
        return theme.error;
      default:
        return theme.primary;
    }
  };

  const getTextColor = (): string => {
    if (disabled || loading) return theme.text.inverse;

    switch (variant) {
      case 'outline':
      case 'text':
        return theme.primary;
      case 'danger':
        return theme.text.inverse;
      default:
        return theme.text.inverse;
    }
  };

  const getBorderColor = (): string => {
    if (variant === 'outline') {
      return disabled ? theme.text.disabled : theme.primary;
    }
    return 'transparent';
  };

  const getPadding = (): { paddingHorizontal: number; paddingVertical: number } => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs };
      case 'large':
        return { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md };
      case 'medium':
      default:
        return { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return FONT_SIZES.small;
      case 'large':
        return FONT_SIZES.large;
      case 'medium':
      default:
        return FONT_SIZES.medium;
    }
  };

  const { paddingHorizontal, paddingVertical } = getPadding();
  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor();
  const borderColor = getBorderColor();
  const fontSize = getFontSize();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          paddingHorizontal,
          paddingVertical,
          borderColor,
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: disabled || loading ? 0.5 : 1,
          width: fullWidth ? '100%' : 'auto',
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;
