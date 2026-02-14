import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppSelector, useTheme } from '../utils';
import { toggleTaskStatus, deleteTask } from '../store/slices/tasksSlice';
import { SPACING, FONT_SIZES } from '../constants/theme';
import { getDueDateLabel, isOverdue } from '../utils/dateUtils';
import { Task } from '../models/types';
import { RootStackNavigation } from '../navigation/AppNavigator';
import EmptyState from '../components/common/EmptyState';
import { ConfirmationDialog } from '../components/common';
import { showToast } from '../components/common/Toast';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigation>();
  const theme = useTheme();
  const isTaskOverdue = task.dueDate ? isOverdue(task.dueDate) : false;

  const handleToggleStatus = () => {
    const newStatus = task.status === 'completed' ? 'incomplete' : 'completed';
    dispatch(toggleTaskStatus(task.id));
    showToast(
      newStatus === 'completed' ? 'Task completed!' : 'Task reopened',
      newStatus === 'completed' ? 'success' : 'info'
    );
  };

  return (
    <TouchableOpacity style={[styles.taskItem, { backgroundColor: theme.background.paper }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.taskLeft}>
        <TouchableOpacity
          onPress={handleToggleStatus}
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
              task.status === 'completed' && [styles.checkboxChecked, { backgroundColor: theme.primary, borderColor: theme.primary }],
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

const TaskListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigation>();
  const theme = useTheme();

  const tasks = useAppSelector((state) => state.tasks.items);

  const incompleteTasks = tasks.filter(
    (task) => task.status === 'incomplete' || task.status === 'in_progress'
  );
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleAddTask = () => {
    navigation.navigate('TaskForm');
  };

  const handleTaskPress = useCallback(
    (taskId: string) => {
      navigation.navigate('TaskDetail', { taskId });
    },
    [navigation]
  );

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete.id));
      showToast('Task deleted successfully', 'success');
      setShowDeleteDialog(false);
      setTaskToDelete(null);
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem task={item} onPress={() => handleTaskPress(item.id)} />
  );

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.default }]}>
      <View style={[styles.header, { borderBottomColor: theme.background.paper === '#F5F5F5' ? '#E0E0E0' : '#2A2A2A' }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text.primary }]}>My Tasks</Text>
          <Text style={[styles.headerSubtitle, { color: theme.text.secondary }]}>
            {incompleteTasks.length} incomplete, {completedTasks.length} completed
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handleAddTask}
          activeOpacity={0.7}
          accessibilityLabel="Add new task"
          accessibilityRole="button"
        >
          <Icon name="add" size={28} color={theme.text.inverse} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={incompleteTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No tasks yet"
            message="Create your first task to get started!"
            actionLabel="Create Task"
            onAction={handleAddTask}
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {completedTasks.length > 0 && (
        <View style={[styles.completedSection, { borderTopColor: theme.background.paper === '#F5F5F5' ? '#E0E0E0' : '#2A2A2A' }]}>
          <TouchableOpacity
            onPress={() => {}}
            style={[styles.completedHeader, { backgroundColor: theme.background.paper }]}
          >
            <Text style={[styles.completedTitle, { color: theme.text.secondary }]}>
              Completed ({completedTasks.length})
            </Text>
            <Icon name="expand-more" size={24} color={theme.text.secondary} />
          </TouchableOpacity>
          <FlatList
            data={completedTasks.slice(0, 5)}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
          {completedTasks.length > 5 && (
            <TouchableOpacity style={styles.showMoreButton}>
              <Text style={[styles.showMoreText, { color: theme.primary }]}>
                Show {completedTasks.length - 5} more completed tasks
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ConfirmationDialog
        visible={showDeleteDialog}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
        destructive
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.small,
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
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
  checkboxChecked: {
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
  taskDateOverdue: {
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  completedSection: {
    borderTopWidth: 1,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  completedTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  showMoreButton: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  showMoreText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '500',
  },
});

export { TaskItem };
export default TaskListScreen;
