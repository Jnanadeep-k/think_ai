import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPreferences, updatePreferences } from '../../api/preferencesApi';

const DEFAULT_PREFS = {
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
  categories: {
    courseUpdates: true,
    forumReplies: true,
    paymentAlerts: true,
    systemAnnouncements: true,
  },
};

const initialState = {
  data: null,
  loading: false,
  saving: false,
  error: null,
};

export const loadPreferences = createAsyncThunk(
  'preferences/load',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getPreferences(userId);
      return res.data.data;
    } catch (err) {
      if (err.response?.status === 404) {
        // No preferences saved yet — fall back to defaults, not an error state.
        return DEFAULT_PREFS;
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to load preferences');
    }
  }
);

export const savePreferences = createAsyncThunk(
  'preferences/save',
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      const res = await updatePreferences(userId, updates);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save preferences');
    }
  }
);

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    clearPreferencesError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(savePreferences.pending, (state) => {
        state.saving = true;
      })
      .addCase(savePreferences.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
      })
      .addCase(savePreferences.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearPreferencesError } = preferencesSlice.actions;

export const selectPreferences = (state) => state.preferences.data;
export const selectPreferencesLoading = (state) => state.preferences.loading;
export const selectPreferencesSaving = (state) => state.preferences.saving;
export const selectPreferencesError = (state) => state.preferences.error;

export default preferencesSlice.reducer;