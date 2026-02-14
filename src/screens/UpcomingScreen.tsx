import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACING, FONT_SIZES } from '../constants/theme';
import { Task } from '../models/types';
import { useAppSelector, useTheme } from '../utils';
import { formatDate, isOverdue } from '../utils/dateUtils';
import TaskItem from './TaskListScreen';

const UpcomingScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigation>();
  const tasks = useAppSelector((state) => state.tasks.items);
  const theme = useTheme();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = today.getTime() + 24 * 60 * 60 * 1000;

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const start = date.getTime();
      const end = start + 24 * 60 * 60 * 1000 - 1;

      const dayTasks = tasks.filter(
        (task) =>
          task.dueDate &&
          task.dueDate >= start &&
          task.dueDate <= end &&
          (task.status === 'incomplete' || task.status === 'in_progress')
      );

      days.push({
        date,
        start,
        end,
        tasks: dayTasks,
      });
    }
    return days;
  };

  const upcomingDays = getNext7Days();

  const handleAddTask = (date: Date) => {
    navigation.navigate('TaskForm' as any);
  };

  const renderDayItem = ({ item }: { item: any }) => {
    const isToday = item.date.toDateString() === today.toDateString();
    const dayLabel = isToday ? 'Today' : formatDate(item.date.getTime());
    const dayNumber = item.date.getDate();
    const monthLabel = item.date.toLocaleDateString('en-US', { month: 'short' });

    return (
      <View style={styles.daySection}>
        <TouchableOpacity
          style={[styles.dayHeader, { backgroundColor: theme.background.paper }]}
          onPress={() => handleAddTask(item.date)}
        >
          <View style={styles.dayInfo}>
            <Text style={[styles.dayNumber, { color: theme.primary }]}>{dayNumber}</Text>
            <Text style={[styles.dayMonth, { color: theme.text.primary }]}>{monthLabel}</Text>
            {isToday && (
              <View style={[styles.todayBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.todayBadgeText}>Today</Text>
              </View>
            )}
          </View>
          {item.tasks.length > 0 && (
            <View style={[styles.taskCountBadge, { backgroundColor: theme.info }]}>
              <Text style={styles.taskCountText}>{item.tasks.length}</Text>
            </View>
          )}
          <Icon name="add" size={20} color={theme.primary} />
        </TouchableOpacity>

        {item.tasks.length > 0 && (
          <FlatList
            data={item.tasks}
            renderItem={({ item: task }) => <TaskItem task={task} onPress={() => {}} />}
            keyExtractor={(task) => task.id}
            scrollEnabled={false}
          />
        )}

        {item.tasks.length === 0 && (
          <Text style={[styles.noTasksText, { color: theme.text.disabled }]}>No tasks scheduled</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.default }]}>
      <View style={[styles.header, { borderBottomColor: theme.background.paper === '#F5F5F5' ? '#E0E0E0' : '#2A2A2A' }]}>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Upcoming</Text>
      </View>

      <FlatList
        data={upcomingDays}
        renderItem={renderDayItem}
        keyExtractor={(item) => item.date.toDateString()}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
  },
  listContent: {
    padding: SPACING.md,
  },
  daySection: {
    marginBottom: SPACING.lg,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dayNumber: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'center',
  },
  dayMonth: {
    fontSize: FONT_SIZES.medium,
    marginLeft: SPACING.sm,
    textTransform: 'uppercase',
  },
  todayBadge: {
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginLeft: SPACING.sm,
  },
  todayBadgeText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
  },
  taskCountBadge: {
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginRight: SPACING.md,
  },
  taskCountText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
  },
  noTasksText: {
    fontSize: FONT_SIZES.small,
    fontStyle: 'italic',
    paddingVertical: SPACING.sm,
  },
});

export default UpcomingScreen;
