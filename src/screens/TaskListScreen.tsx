import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../utils/reduxHooks';
import { selectTask } from '../store/slices/tasksSlice';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { getDueDateLabel, isOverdue } from '../utils/dateUtils';
import { Task } from '../models/types';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
  const dispatch = useAppDispatch();
  const isTaskOverdue = task.dueDate ? isOverdue(task.dueDate) : false;

  return (
    <TouchableOpacity style={styles.taskItem} onPress={onPress}>
      <View style={styles.taskLeft}>
        <TouchableOpacity onPress={() => dispatch(selectTask(task.id))}>
          <View style={[styles.checkbox, task.status === 'completed' && styles.checkboxChecked]} />
        </TouchableOpacity>
        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, task.status === 'completed' && styles.taskTitleCompleted]}>
            {task.title}
          </Text>
          {task.description && (
            <Text style={styles.taskDescription} numberOfLines={1}>
              {task.description}
            </Text>
          )}
          {task.dueDate && (
            <Text style={[styles.taskDate, isTaskOverdue && styles.taskDateOverdue]}>
              {getDueDateLabel(task.dueDate)}
            </Text>
          )}
        </View>
      </View>
      <View style={[styles.priorityIndicator, { backgroundColor: COLORS.priority[task.priority as keyof typeof COLORS.priority] }]} />
    </TouchableOpacity>
  );
};

const TaskListScreen: React.FC = () => {
  const tasks = useAppSelector(state => state.tasks.items);

  const incompleteTasks = tasks.filter(task => task.status === 'incomplete');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem task={item} onPress={() => {}} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={incompleteTasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks yet. Create your first task!</Text>
          </View>
        }
      />

      {completedTasks.length > 0 && (
        <View style={styles.completedSection}>
          <Text style={styles.completedTitle}>Completed ({completedTasks.length})</Text>
          <FlatList
            data={completedTasks}
            renderItem={renderTask}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background.default,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.text.inverse,
    fontWeight: '600',
    fontSize: FONT_SIZES.medium,
  },
  listContent: {
    padding: SPACING.md,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background.paper,
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
    borderColor: COLORS.text.disabled,
    borderRadius: 4,
    marginRight: SPACING.md,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.text.secondary,
  },
  taskDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  taskDate: {
    fontSize: FONT_SIZES.small,
    color: COLORS.info,
  },
  taskDateOverdue: {
    color: COLORS.error,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  completedSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: COLORS.background.paper,
  },
  completedTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.secondary,
    padding: SPACING.md,
    backgroundColor: COLORS.background.paper,
  },
});

export default TaskListScreen;
