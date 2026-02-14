import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SPACING, FONT_SIZES } from '../../constants/theme';
import { useTheme } from '../../utils/useTheme';

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  minHeight?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  minHeight = 100,
  maxLength,
  showCharacterCount = false,
  value,
  onChangeText,
  placeholder,
  ...props
}) => {
  const theme = useTheme();
  const currentLength = value?.length || 0;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: error ? theme.error : theme.text.primary }]}>{label}</Text>
        </View>
      )}

      <View
        style={[
          styles.textAreaContainer,
          { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
          { minHeight },
          error && { borderColor: theme.error },
        ]}
      >
        <TextInput
          style={[styles.textArea, inputStyle, { color: theme.text.primary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.text.disabled}
          multiline
          numberOfLines={4}
          maxLength={maxLength}
          textAlignVertical="top"
          accessibilityLabel={label || placeholder}
          {...props}
        />
      </View>

      {(showCharacterCount || error || helperText) && (
        <View style={styles.footerRow}>
          {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
          {helperText && !error && (
            <Text style={[styles.helperText, { color: theme.text.secondary }]}>{helperText}</Text>
          )}
          {showCharacterCount && maxLength && (
            <Text style={[styles.characterCount, { color: theme.text.secondary }]}>
              {currentLength}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
  },
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  textArea: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    minHeight: 44,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  errorText: {
    fontSize: FONT_SIZES.small,
  },
  helperText: {
    fontSize: FONT_SIZES.small,
  },
  characterCount: {
    fontSize: FONT_SIZES.small,
  },
});

export default TextArea;
