import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCourses,
  getCourseById,
  createCourse as createCourseApi,
  updateCourse as updateCourseApi,
  deleteCourse as deleteCourseApi,
} from '../../api/courseApi';

const initialState = {
  items: [],
  loading: false,
  error: null,
  currentCourse: null,
  currentCourseLoading: false,
  pagination: {
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  },
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async ({ search = '', page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      const response = await getCourses(search, page, limit);
      
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCourseById(id);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load course');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await createCourseApi(courseData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await updateCourseApi(id, updates);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCourseApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete course');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCourseError: (state) => { state.error = null; },
    clearCurrentCourse: (state) => { state.currentCourse = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        
        const responseData = action.payload?.data;

        if (Array.isArray(responseData)) {
          state.items = responseData;
        } else if (responseData && Array.isArray(responseData.courses)) {
          state.items = responseData.courses;
          if (responseData.pagination) {
            state.pagination = { ...state.pagination, ...responseData.pagination };
          }
        } else if (responseData && Array.isArray(responseData.data)) {
          state.items = responseData.data;
        } else {
          state.items = [];
        }
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = []; 
      })
      
      // FETCH COURSE BY ID
      .addCase(fetchCourseById.pending, (state) => {
        state.currentCourseLoading = true;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.currentCourseLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.currentCourseLoading = false;
        state.error = action.payload;
      })
      
      .addCase(createCourse.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      .addCase(updateCourse.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.items.findIndex(
          (c) => c.id === action.payload.id || c._id === action.payload._id
        );
        if (idx !== -1) state.items[idx] = action.payload;
        state.error = null;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (c) => c.id !== action.payload && c._id !== action.payload
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCourseError, clearCurrentCourse } = courseSlice.actions;

export const selectCourses = (state) => state.courses.items;
export const selectCoursesLoading = (state) => state.courses.loading;
export const selectCoursesError = (state) => state.courses.error;
export const selectCoursesPagination = (state) => state.courses.pagination;
export const selectCurrentCourse = (state) => state.courses.currentCourse;
export const selectCurrentCourseLoading = (state) => state.courses.currentCourseLoading;

export default courseSlice.reducer;