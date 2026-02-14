import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { useTheme } from '../../../utils/useTheme';
import { Task, TaskStatus } from '../../../models/types';

interface TaskContextMenuProps {
  visible: boolean;
  task: Task;
  onDismiss: () => void;
  onAction: (action: string) => void;
}

type MenuAction = {
  id: string;
  label: string;
  icon: string;
  color?: string;
  destructive?: boolean;
};

const TaskContextMenu: React.FC<TaskContextMenuProps> = ({
  visible,
  task,
  onDismiss,
  onAction,
}) => {
  const theme = useTheme();

  const actions: MenuAction[] = [
    {
      id: 'edit',
      label: 'Edit Task',
      icon: 'edit',
      color: theme.primary,
    },
    {
      id: 'duplicate',
      label: 'Duplicate Task',
      icon: 'content-copy',
      color: theme.info,
    },
    {
      id: 'complete',
      label:
        task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete',
      icon: task.status === 'completed' ? 'refresh' : 'check-circle',
      color: theme.success,
    },
    {
      id: 'archive',
      label: 'Archive Task',
      icon: 'archive',
      color: theme.warning,
    },
    {
      id: 'delete',
      label: 'Delete Task',
      icon: 'delete',
      color: theme.error,
      destructive: true,
    },
  ];

  const handleActionPress = (action: MenuAction) => {
    onAction(action.id);
    onDismiss();
  };

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onDismiss}
    >
      <TouchableOpacity
        style={[styles.menu, { backgroundColor: theme.background.default }]}
        activeOpacity={1}
        onPress={(e) => e.stopPropagation()}
      >
        <View style={styles.menuHeader}>
          <Text style={[styles.menuTitle, { color: theme.text.primary }]}>
            {task.title}
          </Text>
          <TouchableOpacity onPress={onDismiss} hitSlop={10}>
            <Icon name="close" size={24} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>

        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.menuItem,
              action.destructive && { backgroundColor: `${theme.error}15` },
            ]}
            onPress={() => handleActionPress(action)}
            activeOpacity={0.7}
            accessibilityLabel={action.label}
          >
            <Icon
              name={action.icon}
              size={24}
              color={action.color || theme.text.secondary}
            />
            <Text
              style={[
                styles.menuItemText,
                action.destructive && { color: theme.error },
              ]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  menu: {
    borderRadius: 12,
    width: '80%',
    maxWidth: 300,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  menuTitle: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    marginRight: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  menuItemText: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    marginLeft: SPACING.md,
  },
});

export default TaskContextMenu;
