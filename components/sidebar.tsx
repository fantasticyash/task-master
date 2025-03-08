"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Calendar,
  Star,
  Settings,
  Menu,
  X,
  Home,
  PlusCircle,
  Clock,
  Tag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const favoriteCount = tasks.filter((task) => task.favorite).length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  const navItems = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/",
      count: tasks.length,
    },
    {
      title: "Today",
      icon: <Calendar className="h-5 w-5" />,
      href: "/today",
      count: tasks.filter((task) => {
        const today = new Date().toISOString().split("T")[0];
        return new Date(task.createdAt).toISOString().split("T")[0] === today;
      }).length,
    },
    {
      title: "Completed",
      icon: <CheckSquare className="h-5 w-5" />,
      href: "/completed",
      count: completedCount,
    },
    {
      title: "Favorites",
      icon: <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />,
      href: "/favorites",
      count: favoriteCount,
    },
    {
      title: "Upcoming",
      icon: <Clock className="h-5 w-5" />,
      href: "/upcoming",
      count: pendingCount,
    },
  ];

  const categories = [
    { name: "Personal", color: "bg-blue-500" },
    { name: "Work", color: "bg-green-500" },
    { name: "Shopping", color: "bg-purple-500" },
    { name: "Health", color: "bg-red-500" },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-[70px]" : "w-[280px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <CheckSquare className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">TaskMaster</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-100",
                collapsed && "justify-center"
              )}
            >
              {item.icon}
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1">{item.title}</span>
                  <Badge variant="outline">{item.count}</Badge>
                </>
              )}
            </Link>
          ))}
        </nav>

        {!collapsed && (
          <>
            <div className="mt-8 px-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Categories
                </h2>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <div
                      className={`h-3 w-3 rounded-full ${category.color} mr-3`}
                    ></div>
                    <span className="flex-1">{category.name}</span>
                    <Badge variant="outline">
                      {
                        tasks.filter((task) =>
                          task.categories?.includes(category.name.toLowerCase())
                        ).length
                      }
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 px-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tags
                </h2>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-gray-100">
                  <Tag className="h-3 w-3 mr-1" />
                  urgent
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  <Tag className="h-3 w-3 mr-1" />
                  home
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  <Tag className="h-3 w-3 mr-1" />
                  meeting
                </Badge>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        {collapsed ? (
          <Avatar className="h-10 w-10 mx-auto">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user?.name}`}
            />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${user?.name}`}
              />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
