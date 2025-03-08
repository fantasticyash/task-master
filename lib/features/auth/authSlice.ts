"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "@/lib/types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Mock users for demo purposes
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    bio: "Frontend developer with a passion for UI/UX design",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    bio: "Product manager and tech enthusiast",
    location: "New York, NY",
    phone: "+1 (555) 987-6543",
  },
];

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = mockUsers.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        return rejectWithValue("Invalid email or password");
      }

      // Store auth in localStorage
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
      };

      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          user: userData,
        })
      );

      return userData;
    } catch (error) {
      return rejectWithValue("Login failed. Please try again.");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === userData.email);
      if (existingUser) {
        return rejectWithValue("Email already in use");
      }

      // Create new user (in a real app, this would be saved to a database)
      const newUser = {
        id: (mockUsers.length + 1).toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        bio: "",
        location: "",
        phone: "",
      };

      mockUsers.push(newUser);

      // Store auth in localStorage
      const newUserData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        location: newUser.location,
        phone: newUser.phone,
      };

      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          user: newUserData,
        })
      );

      return newUserData;
    } catch (error) {
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // Get auth from localStorage
      const auth = localStorage.getItem("auth");
      if (!auth) {
        return rejectWithValue("Not authenticated");
      }

      const { user } = JSON.parse(auth);
      return user;
    } catch (error) {
      return rejectWithValue("Authentication check failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Remove auth from localStorage
      localStorage.removeItem("auth");
      return null;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData: Partial<User>, { getState, rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue("User not found");
      }

      // Update user in mock database
      const userIndex = mockUsers.findIndex((u) => u.id === currentUser.id);
      if (userIndex >= 0) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          name: userData.name || mockUsers[userIndex].name,
          email: userData.email || mockUsers[userIndex].email,
          bio: userData.bio || mockUsers[userIndex].bio,
          location: userData.location || mockUsers[userIndex].location,
          phone: userData.phone || mockUsers[userIndex].phone,
        };
      }

      // Update user in localStorage
      const updatedUser = {
        ...currentUser,
        ...userData,
      };

      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          user: updatedUser,
        })
      );

      return updatedUser;
    } catch (error) {
      return rejectWithValue("Failed to update user profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
