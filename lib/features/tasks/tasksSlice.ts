"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Task } from "@/lib/types"

interface TasksState {
  tasks: Task[]
}

// Load tasks from localStorage if available
const loadTasks = (): Task[] => {
  if (typeof window !== "undefined") {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      return JSON.parse(savedTasks)
    }
  }
  return []
}

const initialState: TasksState = {
  tasks: loadTasks(),
}

// Helper function to save tasks to localStorage
const saveTasks = (tasks: Task[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload)
      saveTasks(state.tasks)
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload)
      if (task) {
        task.completed = !task.completed
        saveTasks(state.tasks)
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
      saveTasks(state.tasks)
    },
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: string }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.id)
      if (task) {
        task.priority = action.payload.priority
        saveTasks(state.tasks)
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload)
      if (task) {
        task.favorite = !task.favorite
        saveTasks(state.tasks)
      }
    },
  },
})

export const { addTask, toggleTask, deleteTask, updateTaskPriority, toggleFavorite } = tasksSlice.actions

export default tasksSlice.reducer

