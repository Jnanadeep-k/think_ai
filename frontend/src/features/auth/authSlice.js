<<<<<<< HEAD
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "./authService";

const token = localStorage.getItem("token");

const initialState = {
  user: token
    ? {
        role: token.replace("mock-jwt-token-", ""),
      }
    : null,
  token: token || null,
  isAuthenticated: !!token,
=======
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getUsers,
  createUser as createUserApi,
  updateUserRole as updateUserRoleApi,
} from '../../api/adminUserApi'

const initialState = {
  items: [],
>>>>>>> 854d340 (Updated: Admin dashboard, Users & Courses)
  loading: false,
  error: null,
};

<<<<<<< HEAD
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);

      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
=======
export const fetchUsers = createAsyncThunk(
  'adminUsers/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsers()
      const payload = response.data?.data
      return Array.isArray(payload) ? payload : []
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load users')
>>>>>>> 854d340 (Updated: Admin dashboard, Users & Courses)
    }
  }
);

<<<<<<< HEAD
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await registerApi(formData);

      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
=======
export const createUser = createAsyncThunk(
  'adminUsers/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await createUserApi(userData)
      return response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create user')
>>>>>>> 854d340 (Updated: Admin dashboard, Users & Courses)
    }
  }
);

<<<<<<< HEAD
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },

    clearAuthError(state) {
      state.error = null;
=======
export const updateUserRole = createAsyncThunk(
  'adminUsers/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await updateUserRoleApi(userId, role)
      return response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update role')
    }
  }
)

const adminUserSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearAdminUserError: (state) => {
      state.error = null
>>>>>>> 854d340 (Updated: Admin dashboard, Users & Courses)
    },
  },

  extraReducers: (builder) => {
    builder
<<<<<<< HEAD

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
=======
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload)
        }
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        if (!action.payload) return
        const index = state.items.findIndex((u) => u.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
      })
>>>>>>> 854d340 (Updated: Admin dashboard, Users & Courses)
  },
});

<<<<<<< HEAD
export const { logout, clearAuthError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
=======
export const { clearAdminUserError } = adminUserSlice.actions

export const selectAdminUsers = (state) => state.adminUsers.items
export const selectAdminUsersLoading = (state) => state.adminUsers.loading
export const selectAdminUsersError = (state) => state.adminUsers.error

export default adminUserSlice.reducer
>>>>>>> 854d340 (Updated: Admin dashboard, Users & Courses)
