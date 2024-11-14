import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

// Async Thunks
export const adminRegister = createAsyncThunk(
  "auth/adminRegister",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/admin/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Admin registration failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue, getState  }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.post(`${API_URL}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data","x-access-token": token },
      });
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "User registration failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      dispatch(setLoggedIn({ user: response.data.user, token: response.data.token }));
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ password }, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.put(
        `${API_URL}/updatePassword`,  // Use backticks here
        { newPassword: password },
        { headers: { "x-access-token": token } }
      );
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Password update failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchDashboard = createAsyncThunk(
  "auth/fetchDashboard",
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: { "x-access-token": token },
      });
      return response?.data?.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch dashboard data";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const { token } = getState().auth; // Get the token from auth state
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        { headers: { "x-access-token": token } } // Include token in headers
      );
      dispatch(setLoggedOut());
      toast.success("Logged out successfully");
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const confirmEmail = createAsyncThunk(
  "auth/confirmEmail",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/confirmation/${email}/${token}`);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Email verification failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async ({email}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/forgotPassword`, { email });
      toast.success(response?.data?.message || "Password reset email sent");
      return response?.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send reset email";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/resetPassword/${token}`, { newPassword }, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(response?.data?.message || "Password reset successfully");
      return response?.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Password reset failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isLoggedIn: !!localStorage.getItem("token"),
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
      state.successMessage = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminRegister.pending, (state) => { state.loading = true; })
      .addCase(adminRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.successMessage = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePassword.pending, (state) => { state.loading = true; })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.user = action.payload.user;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => { state.loading = true; })
      .addCase(logoutUser.fulfilled, (state) => { state.loading = false; })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(confirmEmail.pending, (state) => { state.loading = true; })
      .addCase(confirmEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgetPassword.pending, (state) => { state.loading = true; })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(resetPassword.pending, (state) => { state.loading = true; })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoggedIn, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;
