import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Task, TaskStatus } from '../models/types';
import { useAppDispatch, useAppSelector, useTheme } from '../utils';
import { SPACING, FONT_SIZES } from '../constants/theme';
import { setTaskStatus } from '../store/slices/tasksSlice';
import EmptyState from '../components/common/EmptyState';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { showToast } from '../components/common/Toast';
import { TaskItem } from './TaskListScreen';

type RootStackParamList = {
  TaskDetail: { taskId: string };
  TaskForm: { taskId?: string };
  TaskList: undefined;
  ArchivedTasks: undefined;
};

type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

const ArchivedTasksScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigation>();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const tasks = useAppSelector((state) => state.tasks.items);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);

  const archivedTasks = tasks.filter(
    (task) => task.status === 'archived'
  );

  const handleRestore = (taskId: string) => {
    dispatch(setTaskStatus({ id: taskId, status: 'incomplete' }));
    showToast('Task restored', 'success');
  };

  const handleBulkRestore = () => {
    archivedTasks.forEach((task) => {
      dispatch(setTaskStatus({ id: task.id, status: 'incomplete' }));
    });
    showToast(`${archivedTasks.length} tasks restored`, 'success');
  };

  const handleDelete = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      // Dispatch delete action
      setShowDeleteDialog(false);
      setTaskToDelete(null);
      showToast('Task permanently deleted', 'success');
    }
  };

  const renderArchivedTask = ({ item }: { item: Task }) => (
    <View style={styles.archivedTaskItem}>
      <TaskItem task={item} onPress={() => {}} />
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRestore(item.id)}
        >
          <Icon name="restore" size={20} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: `${theme.error}15` }]}
          onPress={() => handleDelete(item)}
        >
          <Icon name="delete" size={20} color={theme.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.default }]}>
      <View style={[styles.header, { borderBottomColor: theme.background.paper === '#F5F5F5' ? '#E0E0E0' : '#2A2A2A' }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Archived Tasks</Text>
          <Text style={[styles.headerSubtitle, { color: theme.text.secondary }]}>
            {archivedTasks.length} tasks archived
          </Text>
        </View>
        {archivedTasks.length > 0 && (
          <TouchableOpacity
            style={[styles.restoreAllButton, { backgroundColor: theme.primary }]}
            onPress={handleBulkRestore}
          >
            <Icon name="restore-from-trash" size={20} color={theme.text.inverse} />
            <Text style={[styles.restoreAllText, { color: theme.text.inverse }]}>Restore All</Text>
          </TouchableOpacity>
        )}
      </View>

      {archivedTasks.length === 0 ? (
        <EmptyState
          title="No Archived Tasks"
          message="Archived tasks will appear here"
        />
      ) : (
        <FlatList
          data={archivedTasks}
          renderItem={renderArchivedTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <ConfirmationDialog
        visible={showDeleteDialog}
        title="Permanently Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
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
  restoreAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  restoreAllText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  listContent: {
    padding: SPACING.md,
  },
  archivedTaskItem: {
    marginBottom: SPACING.sm,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: SPACING.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
});

export default ArchivedTasksScreen;
