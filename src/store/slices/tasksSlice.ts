import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus } from '../../models/types';

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  selectedTaskId: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  selectedTaskId: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.items.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.items[taskIndex] = { ...state.items[taskIndex], ...updates, updatedAt: Date.now() };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(task => task.id !== action.payload);
    },
    toggleTaskStatus: (state, action: PayloadAction<string>) => {
      const task = state.items.find(task => task.id === action.payload);
      if (task) {
        task.status = task.status === 'completed' ? 'incomplete' : 'completed';
        task.updatedAt = Date.now();
      }
    },
    setTaskStatus: (state, action: PayloadAction<{ id: string; status: TaskStatus }>) => {
      const task = state.items.find(task => task.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.updatedAt = Date.now();
      }
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
    },
    selectTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  setTaskStatus,
  setTasks,
  selectTask,
  setLoading,
  setError,
} = tasksSlice.actions;

export default tasksSlice.reducer;
