import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES } from '../../constants/theme';
import { useTheme } from '../../utils/useTheme';
import Modal from './Modal';
import Button from './Button';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} onClose={onCancel}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.text.secondary }]}>{message}</Text>

        <View style={styles.buttonContainer}>
          <Button
            title={cancelText}
            onPress={onCancel}
            variant="outline"
            style={styles.button}
          />
          <Button
            title={confirmText}
            onPress={onConfirm}
            variant={destructive ? 'danger' : 'primary'}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: FONT_SIZES.medium,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  button: {
    flex: 1,
  },
});

export default ConfirmationDialog;
