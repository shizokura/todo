import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../utils/useTheme';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { Task } from '../../../models/types';
import { getDueDateLabel, isOverdue } from '../../../utils/dateUtils';

interface SwipeableTaskItemProps {
  task: Task;
  onPress: () => void;
  onComplete: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const TaskItem: React.FC<{ task: Task; onPress: () => void }> = ({ task, onPress }) => {
  const theme = useTheme();
  const isTaskOverdue = task.dueDate ? isOverdue(task.dueDate) : false;

  return (
    <TouchableOpacity style={[styles.taskItem, { backgroundColor: theme.background.paper }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.taskLeft}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={
            task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'
          }
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.status === 'completed' }}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: theme.text.disabled },
              task.status === 'completed' && { backgroundColor: theme.primary, borderColor: theme.primary },
            ]}
          >
            {task.status === 'completed' && (
              <Icon name="check" size={16} color={theme.text.inverse} />
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskTitle,
              { color: task.status === 'completed' ? theme.text.secondary : theme.text.primary },
              task.status === 'completed' && styles.taskTitleCompleted,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          {task.description && (
            <Text style={[styles.taskDescription, { color: theme.text.secondary }]} numberOfLines={1}>
              {task.description}
            </Text>
          )}
          {task.dueDate && (
            <Text
              style={[
                styles.taskDate,
                { color: isTaskOverdue ? theme.error : theme.info },
              ]}
            >
              {getDueDateLabel(task.dueDate)}
            </Text>
          )}
        </View>
      </View>
      <View
        style={[
          styles.priorityIndicator,
          { backgroundColor: theme.priority[task.priority as keyof typeof theme.priority] },
        ]}
      />
    </TouchableOpacity>
  );
};

const SwipeableTaskItem: React.FC<SwipeableTaskItemProps> = ({
  task,
  onPress,
  onComplete,
  onArchive,
  onDelete,
  onToggleStatus,
}) => {
  const theme = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, -50, -200],
    });

    return (
      <Animated.View style={[{ transform: [{ translateX: trans }] }, styles.leftAction]}>
        <TouchableOpacity
          style={[styles.leftActionComplete, { backgroundColor: theme.success }]}
          onPress={() => {
            onComplete();
            closeSwipe();
          }}
          accessibilityLabel="Complete task"
        >
          <Icon name="check-circle" size={28} color="#FFFFFF" />
          <Text style={[styles.actionText, { color: '#FFFFFF' }]}>Complete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-101, -100, -50, 0],
      outputRange: [-200, -50, 0, 200],
    });

    return (
      <Animated.View style={[{ transform: [{ translateX: trans }] }, styles.rightActions]}>
        <TouchableOpacity
          style={[styles.rightActionArchive, { backgroundColor: theme.warning }]}
          onPress={() => {
            onArchive();
            closeSwipe();
          }}
          accessibilityLabel="Archive task"
        >
          <Icon name="archive" size={24} color="#FFFFFF" />
          <Text style={[styles.actionText, { color: '#FFFFFF' }]}>Archive</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rightActionDelete, { backgroundColor: theme.error }]}
          onPress={() => {
            onDelete();
            closeSwipe();
          }}
          accessibilityLabel="Delete task"
        >
          <Icon name="delete" size={24} color="#FFFFFF" />
          <Text style={[styles.actionText, { color: '#FFFFFF' }]}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const closeSwipe = () => {
    swipeableRef.current?.close();
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
      >
        <TaskItem task={task} onPress={onPress} />
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '500',
    marginBottom: 2,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: FONT_SIZES.small,
    marginBottom: 4,
  },
  taskDate: {
    fontSize: FONT_SIZES.small,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  leftAction: {
    width: 100,
    flexDirection: 'row',
  },
  leftActionComplete: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  rightActions: {
    width: 150,
    flexDirection: 'row',
  },
  rightActionArchive: {
    width: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightActionDelete: {
    width: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SwipeableTaskItem;
