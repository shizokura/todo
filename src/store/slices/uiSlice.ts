import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';
type ViewMode = 'list' | 'kanban';

interface UIState {
  theme: Theme;
  currentView: ViewMode;
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
}

const initialState: UIState = {
  theme: 'light',
  currentView: 'list',
  isSidebarOpen: false,
  isSearchOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setView: (state, action: PayloadAction<ViewMode>) => {
      state.currentView = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setView,
  toggleSidebar,
  setSidebarOpen,
  toggleSearch,
  setSearchOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
