import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../models/types';

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [
    { id: 'personal', name: 'Personal', color: '#2196F3', createdAt: Date.now() },
    { id: 'work', name: 'Work', color: '#4CAF50', createdAt: Date.now() },
    { id: 'shopping', name: 'Shopping', color: '#FF9800', createdAt: Date.now() },
    { id: 'health', name: 'Health', color: '#E91E63', createdAt: Date.now() },
    { id: 'others', name: 'Others', color: '#9E9E9E', createdAt: Date.now() },
  ],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.items.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<{ id: string; updates: Partial<Category> }>) => {
      const { id, updates } = action.payload;
      const categoryIndex = state.items.findIndex(cat => cat.id === id);
      if (categoryIndex !== -1) {
        state.items[categoryIndex] = { ...state.items[categoryIndex], ...updates };
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(cat => cat.id !== action.payload);
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
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
  addCategory,
  updateCategory,
  deleteCategory,
  setCategories,
  setLoading,
  setError,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
