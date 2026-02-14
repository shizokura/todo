import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACING, FONT_SIZES, TASK_STATUS_COLORS } from '../constants/theme';
import { Task } from '../models/types';
import { useAppDispatch, useAppSelector, useTheme } from '../utils';
import { deleteTask, updateTask } from '../store/slices/tasksSlice';
import { formatDate, formatDateTime, isOverdue, getDueDateLabel } from '../utils/dateUtils';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { showToast } from '../components/common/Toast';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';

type RootStackParamList = {
  TaskDetail: { taskId: string };
  TaskForm: { taskId?: string };
  TaskList: undefined;
};

type TaskDetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TaskDetailScreen: React.FC = () => {
  const route = useRoute<TaskDetailRouteProp>();
  const navigation = useNavigation<TaskDetailNavigationProp>();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const taskId = route.params.taskId;
  const tasks = useAppSelector((state) => state.tasks.items);
  const categories = useAppSelector((state) => state.categories.items);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadTask();
  }, [taskId, tasks]);

  const loadTask = () => {
    const foundTask = tasks.find((t) => t.id === taskId);
    setTask(foundTask || null);
    setLoading(false);
  };

  const handleEdit = () => {
    navigation.navigate('TaskForm', { taskId });
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteTask(taskId));
    showToast('Task deleted successfully', 'success');
    navigation.goBack();
  };

  const toggleStatus = () => {
    if (!task) return;
    const newStatus = task.status === 'completed' ? 'incomplete' : 'completed';
    dispatch(updateTask({ id: taskId, updates: { status: newStatus } }));
    setTask({ ...task, status: newStatus });
    showToast(newStatus === 'completed' ? 'Task completed!' : 'Task reopened', 'success');
  };

  const renderCategory = () => {
    if (!task?.categoryId) return null;

    const category = categories.find((c) => c.id === task.categoryId);
    if (!category) return null;

    return (
      <View style={[styles.categoryBadge, { backgroundColor: theme.background.paper }]}>
        <View
          style={[styles.categoryDot, { backgroundColor: category.color }]}
        />
        <Text style={[styles.categoryText, { color: theme.text.primary }]}>{category.name}</Text>
      </View>
    );
  };

  const renderDueDate = () => {
    if (!task?.dueDate) return null;

    const overdue = isOverdue(task.dueDate);
    const label = getDueDateLabel(task.dueDate);

    return (
      <View style={styles.infoRow}>
        <Icon
          name="schedule"
          size={20}
          color={overdue ? theme.error : theme.info}
        />
        <View>
          <Text
            style={[
              styles.dueDateText,
              { color: overdue ? theme.error : theme.text.primary },
            ]}
          >
            {label}
          </Text>
          <Text style={[styles.dueDateTimeText, { color: theme.text.secondary }]}>
            {formatDateTime(task.dueDate)}
          </Text>
        </View>
      </View>
    );
  };

  const renderPriorityBadge = () => {
    if (!task) return null;

    return (
      <View style={[styles.priorityBadge, { backgroundColor: theme.priority[task.priority] }]}>
        <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
      </View>
    );
  };

  const renderStatusBadge = () => {
    if (!task) return null;

    const labels = {
      incomplete: 'Incomplete',
      in_progress: 'In Progress',
      completed: 'Completed',
      archived: 'Archived',
    };

    return (
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: TASK_STATUS_COLORS[task.status] },
        ]}
      >
        <Text style={styles.statusText}>{labels[task.status]}</Text>
      </View>
    );
  };

  if (loading) {
    return <Loading message="Loading task..." />;
  }

  if (!task) {
    return (
      <EmptyState
        title="Task Not Found"
        message="The task you're looking for doesn't exist or has been deleted."
        actionLabel="Go Back"
        onAction={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background.default }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text.primary }]}>{task.title}</Text>
            {task.status === 'completed' && (
              <Icon name="check-circle" size={28} color={theme.success} />
            )}
          </View>

          <View style={styles.badgesRow}>
            {renderStatusBadge()}
            {renderPriorityBadge()}
          </View>
        </View>

        <View style={styles.section}>
          {renderDueDate()}
          {renderCategory()}
        </View>

        {task.description && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>Description</Text>
            <Text style={[styles.description, { color: theme.text.primary }]}>{task.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>Created:</Text>
            <Text style={[styles.detailValue, { color: theme.text.primary }]}>
              {formatDate(task.createdAt)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>Updated:</Text>
            <Text style={[styles.detailValue, { color: theme.text.primary }]}>
              {formatDate(task.updatedAt)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background.default, borderTopColor: theme.text.disabled }]}>
        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: theme.background.paper }]}
          onPress={toggleStatus}
          activeOpacity={0.7}
        >
          <Icon
            name={task.status === 'completed' ? 'refresh' : 'check-circle'}
            size={24}
            color={task.status === 'completed' ? theme.info : theme.success}
          />
          <Text style={[styles.quickActionText, { color: theme.text.primary }]}>
            {task.status === 'completed' ? 'Reopen Task' : 'Complete Task'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <Icon name="edit" size={20} color={theme.text.inverse} />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.error }]}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Icon name="delete" size={20} color={theme.text.inverse} />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmationDialog
        visible={showDeleteDialog}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        destructive
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    marginRight: SPACING.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  statusText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
  },
  priorityText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
  },
  priorityText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  priorityText: {
    fontSize: FONT_SIZES.small,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.medium,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dueDateText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
  dueDateOverdue: {
  },
  dueDateTimeText: {
    fontSize: FONT_SIZES.small,
    marginLeft: SPACING.sm + 24,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  categoryText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  detailLabel: {
    fontSize: FONT_SIZES.small,
  },
  detailValue: {
    fontSize: FONT_SIZES.small,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    padding: SPACING.md,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  quickActionText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: SPACING.md,
  },
});

export default TaskDetailScreen;
