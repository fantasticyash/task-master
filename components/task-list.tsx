"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import type { Task } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ListFilter } from "lucide-react";
import TaskItem from "./task-item";

interface TaskListProps {
  filter?: string;
  searchQuery?: string;
}

export default function TaskList({
  filter = "all",
  searchQuery = "",
}: TaskListProps) {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [viewFilter, setViewFilter] = useState("all");

  useEffect(() => {
    let result = [...tasks];

    // Apply main filter
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter(
        (task) => new Date(task.createdAt).toISOString().split("T")[0] === today
      );
    } else if (filter === "upcoming") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter(
        (task) => new Date(task.createdAt).toISOString().split("T")[0] > today
      );
    } else if (filter === "favorites") {
      result = result.filter((task) => task.favorite);
    }

    // Apply view filter
    if (viewFilter === "active") {
      result = result.filter((task) => !task.completed);
    } else if (viewFilter === "completed") {
      result = result.filter((task) => task.completed);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.text.toLowerCase().includes(query) ||
          task.priority.toLowerCase().includes(query) ||
          (task.categories &&
            task.categories.some((cat) => cat.toLowerCase().includes(query)))
      );
    }

    // Sort by priority and then by creation date
    result.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff =
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder];

      if (priorityDiff !== 0) return priorityDiff;

      // If same priority, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredTasks(result);
  }, [tasks, filter, viewFilter, searchQuery]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <ListFilter className="mr-2 h-5 w-5" />
            {filter === "today"
              ? "Today's Tasks"
              : filter === "upcoming"
              ? "Upcoming Tasks"
              : filter === "favorites"
              ? "Favorite Tasks"
              : "All Tasks"}
          </CardTitle>
          <Tabs
            defaultValue="all"
            value={viewFilter}
            onValueChange={setViewFilter}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery
              ? "No matching tasks found."
              : "No tasks found. Add some tasks to get started!"}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
