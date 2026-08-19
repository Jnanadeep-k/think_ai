import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotifications, markAsRead, markAllAsRead } from '../../api/notificationApi';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const loadNotifications = createAsyncThunk(
  'notifications/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchNotifications();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load notifications');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      await markAsRead(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to mark as read');
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await markAllAsRead();
      return true;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to mark all as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // For future socket push: dispatch this when a real-time event arrives.
    notificationReceived: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const n = state.items.find((item) => item.id === action.payload);
        if (n) n.read = true;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach((n) => { n.read = true; });
      });
  },
});

export const { notificationReceived } = notificationSlice.actions;

export const selectNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) =>
  state.notifications.items.filter((n) => !n.read).length;
export const selectNotificationsLoading = (state) => state.notifications.loading;

export default notificationSlice.reducer;