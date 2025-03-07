"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import type { Task } from "@/lib/types"
import { toggleTask, deleteTask, updateTaskPriority, toggleFavorite } from "@/lib/features/tasks/tasksSlice"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Trash, MoreVertical, Flag, Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const [showActions, setShowActions] = useState(false)
  const dispatch = useDispatch()

  const handleToggleTask = () => {
    dispatch(toggleTask(task.id))
  }

  const handleDeleteTask = () => {
    dispatch(deleteTask(task.id))
  }

  const handleUpdatePriority = (priority: string) => {
    dispatch(updateTaskPriority({ id: task.id, priority }))
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(task.id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Flag className="h-3 w-3 text-red-600 mr-1" />
      case "medium":
        return <Flag className="h-3 w-3 text-yellow-600 mr-1" />
      case "low":
        return <Flag className="h-3 w-3 text-green-600 mr-1" />
      default:
        return null
    }
  }

  return (
    <div
      className={`flex items-start p-3 rounded-lg border ${
        task.completed ? "bg-gray-50" : "bg-white"
      } hover:bg-gray-50 transition-colors`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Checkbox checked={task.completed} onCheckedChange={handleToggleTask} className="mt-1" />
      <div className="ml-3 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
              {task.text}
            </p>
            <div className="flex items-center flex-wrap mt-1 gap-2">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(task.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                <span className="flex items-center">
                  {getPriorityIcon(task.priority)}
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </Badge>
              {task.categories?.map((category) => (
                <Badge key={category} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          <div className={`flex items-center transition-opacity ${showActions ? "opacity-100" : "opacity-0"}`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className={`h-8 w-8 ${task.favorite ? "text-yellow-500" : "text-gray-400"} hover:text-yellow-600 hover:bg-yellow-50`}
            >
              <Star className={`h-4 w-4 ${task.favorite ? "fill-yellow-500" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteTask}
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleUpdatePriority("high")}>
                  <Flag className="h-4 w-4 text-red-500 mr-2" />
                  High Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdatePriority("medium")}>
                  <Flag className="h-4 w-4 text-yellow-500 mr-2" />
                  Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdatePriority("low")}>
                  <Flag className="h-4 w-4 text-green-500 mr-2" />
                  Low Priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

