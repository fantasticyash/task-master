"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";

import { Button } from "@/components/ui/button";
import {
  LogOut,
  Sun,
  Bell,
  Search,
  Calendar,
  BarChart3,
  CheckSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchWeather } from "@/lib/features/weather/weatherSlice";
import { logout } from "@/lib/features/auth/authSlice";
import Sidebar from "./sidebar";
import WeatherWidget from "./weather-widget";
import TaskList from "./task-list";
import TaskInput from "./task-input";
import UserProfile from "./user-profile";

export default function Dashboard() {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    dispatch(fetchWeather());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const highPriorityTasks = tasks.filter((task) => task.priority === "high");
  const todayTasks = tasks.filter((task) => {
    const today = new Date().toISOString().split("T")[0];
    return new Date(task.createdAt).toISOString().split("T")[0] === today;
  });
  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <WeatherWidget />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${user?.name}`}
                      />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowUserProfile(true)}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome back, {user?.name?.split(" ")[0] || "User"}
                </h1>
                <p className="text-gray-600">Heres an overview of your tasks</p>
              </div>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Tasks</p>
                      <p className="text-3xl font-bold">{tasks.length}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <span
                      className={
                        pendingTasks.length > 0
                          ? "text-amber-500"
                          : "text-green-500"
                      }
                    >
                      {pendingTasks.length} pending
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Todays Tasks</p>
                      <p className="text-3xl font-bold">{todayTasks.length}</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <span className="text-purple-500">
                      {todayTasks.filter((t) => t.completed).length} completed
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="text-3xl font-bold">
                        {completedTasks.length}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckSquare className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <span className="text-green-500">
                      {Math.round(
                        (completedTasks.length / (tasks.length || 1)) * 100
                      )}
                      % completion rate
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">High Priority</p>
                      <p className="text-3xl font-bold">
                        {highPriorityTasks.length}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Sun className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <span
                      className={
                        highPriorityTasks.length > 0
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {highPriorityTasks.filter((t) => !t.completed).length}{" "}
                      need attention
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tasks Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Tabs defaultValue="all">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="all">All Tasks</TabsTrigger>
                      <TabsTrigger value="today">Today</TabsTrigger>
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="all" className="space-y-6">
                    <TaskInput />
                    <TaskList filter="all" searchQuery={searchQuery} />
                  </TabsContent>

                  <TabsContent value="today" className="space-y-6">
                    <TaskInput />
                    <TaskList filter="today" searchQuery={searchQuery} />
                  </TabsContent>

                  <TabsContent value="upcoming" className="space-y-6">
                    <TaskInput />
                    <TaskList filter="upcoming" searchQuery={searchQuery} />
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Sun className="mr-2 h-5 w-5 text-yellow-500" />
                      Todays Overview
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Completed Tasks</p>
                        <p className="text-2xl font-bold">
                          {completedTasks.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pending Tasks</p>
                        <p className="text-2xl font-bold">
                          {pendingTasks.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">High Priority</p>
                        <p className="text-2xl font-bold">
                          {highPriorityTasks.length}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium mb-2">
                          Recent Activity
                        </h3>
                        <div className="space-y-2">
                          {tasks.slice(0, 3).map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center text-sm"
                            >
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  task.completed
                                    ? "bg-green-500"
                                    : "bg-amber-500"
                                } mr-2`}
                              ></div>
                              <p className="text-gray-600 truncate">
                                {task.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showUserProfile && (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      )}
    </div>
  );
}
