import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState, TaskStatus, TaskPriority } from '../../models/types';

interface FilterStateWithId extends FilterState {
  id?: string;
}

interface FiltersState {
  currentFilter: FilterState;
  savedFilters: FilterStateWithId[];
}

const initialState: FiltersState = {
  currentFilter: {},
  savedFilters: [],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<TaskStatus | undefined>) => {
      state.currentFilter.status = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<TaskPriority | undefined>) => {
      state.currentFilter.priority = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | undefined>) => {
      state.currentFilter.categoryId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string | undefined>) => {
      state.currentFilter.searchQuery = action.payload;
    },
    setDateRangeFilter: (state, action: PayloadAction<{ from?: number; to?: number }>) => {
      state.currentFilter.dueDateFrom = action.payload.from;
      state.currentFilter.dueDateTo = action.payload.to;
    },
    clearFilters: (state) => {
      state.currentFilter = {};
    },
    saveFilter: (state, action: PayloadAction<FilterStateWithId>) => {
      state.savedFilters.push(action.payload);
    },
    deleteSavedFilter: (state, action: PayloadAction<string>) => {
      state.savedFilters = state.savedFilters.filter(f => f.id !== action.payload);
    },
    applySavedFilter: (state, action: PayloadAction<FilterState>) => {
      state.currentFilter = action.payload;
    },
  },
});

export const {
  setStatusFilter,
  setPriorityFilter,
  setCategoryFilter,
  setSearchQuery,
  setDateRangeFilter,
  clearFilters,
  saveFilter,
  deleteSavedFilter,
  applySavedFilter,
} = filtersSlice.actions;

export default filtersSlice.reducer;
