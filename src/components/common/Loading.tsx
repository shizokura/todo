import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SPACING, FONT_SIZES } from '../../constants/theme';
import { useTheme } from '../../utils/useTheme';

interface LoadingProps {
  size?: 'small' | 'large';
  message?: string;
  fullScreen?: boolean;
  style?: any;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  message,
  fullScreen = false,
  style,
}) => {
  const theme = useTheme();

  const content = (
    <View style={[styles.container, fullScreen && [styles.fullScreen, { backgroundColor: theme.background.default }], style]}>
      <ActivityIndicator
        size={size}
        color={theme.primary}
        accessibilityLabel="Loading"
      />
      {message && <Text style={[styles.message, { color: theme.text.secondary }]}>{message}</Text>}
    </View>
  );

  return content;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.medium,
    textAlign: 'center',
  },
});

export default Loading;
