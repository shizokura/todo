import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACING, FONT_SIZES } from '../constants/theme';
import { Task, TaskStatus } from '../models/types';
import { useAppDispatch, useAppSelector, useTheme } from '../utils';
import EmptyState from '../components/common/EmptyState';
import TaskItem from './TaskListScreen';

const TodayScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigation>();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const tasks = useAppSelector((state) => state.tasks.items);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000 - 1;

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      task.dueDate < todayStart &&
      (task.status === 'incomplete' || task.status === 'in_progress')
  );

  const dueTodayTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      task.dueDate >= todayStart &&
      task.dueDate <= todayEnd &&
      (task.status === 'incomplete' || task.status === 'in_progress')
  );

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status === 'in_progress' &&
      (!task.dueDate || task.dueDate > todayEnd)
  );

  const allTodayTasks = [...overdueTasks, ...dueTodayTasks, ...inProgressTasks];
  const completedCount = tasks.filter(
    (task) =>
      task.status === 'completed' &&
      task.dueDate &&
      task.dueDate >= todayStart &&
      task.dueDate <= todayEnd
  ).length;

  const handleAddTask = () => {
    navigation.navigate('TaskForm' as any);
  };

  const renderSectionHeader = (title: string, count: number) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>{title}</Text>
      <View style={[styles.countBadge, { backgroundColor: theme.info }]}>
        <Text style={[styles.countText, { color: theme.text.inverse }]}>{count}</Text>
      </View>
    </View>
  );

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskItem task={item} onPress={() => {}} />
  );

  const keyExtractor = (item: Task) => item.id;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.default }]}>
      <View style={[styles.header, { borderBottomColor: theme.background.paper === '#F5F5F5' ? '#E0E0E0' : '#2A2A2A' }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Today</Text>
          <Text style={[styles.headerSubtitle, { color: theme.text.secondary }]}>
            {allTodayTasks.length} tasks, {completedCount} completed
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handleAddTask}
        >
          <Icon name="add" size={28} color={theme.text.inverse} />
        </TouchableOpacity>
      </View>

      {allTodayTasks.length === 0 ? (
        <EmptyState
          title="No Tasks for Today"
          message="You're all caught up! Enjoy your day."
          actionLabel="Add Task"
          onAction={handleAddTask}
        />
      ) : (
        <FlatList
          data={allTodayTasks}
          renderItem={renderTaskItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              {overdueTasks.length > 0 && (
                <>
                  {renderSectionHeader('Overdue', overdueTasks.length)}
                </>
              )}
              {dueTodayTasks.length > 0 && (
                <>
                  {renderSectionHeader('Due Today', dueTodayTasks.length)}
                </>
              )}
              {inProgressTasks.length > 0 && (
                <>
                  {renderSectionHeader('In Progress', inProgressTasks.length)}
                </>
              )}
            </View>
          }
        />
      )}
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
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  countBadge: {
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
  },
});

export default TodayScreen;
