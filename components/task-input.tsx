"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addTask } from "@/lib/features/tasks/tasksSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PlusCircle, Tag, Calendar } from "lucide-react"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export default function TaskInput() {
  const [taskText, setTaskText] = useState("")
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const dispatch = useDispatch()

  const categories = [
    { id: "personal", label: "Personal" },
    { id: "work", label: "Work" },
    { id: "shopping", label: "Shopping" },
    { id: "health", label: "Health" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskText.trim()) {
      dispatch(
        addTask({
          id: Date.now().toString(),
          text: taskText,
          completed: false,
          priority,
          createdAt: new Date().toISOString(),
          dueDate: dueDate?.toISOString(),
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          favorite: false,
        }),
      )
      setTaskText("")
      setPriority("medium")
      setDueDate(undefined)
      setSelectedCategories([])
    }
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Add a new task..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="flex-1"
            />
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" type="button" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Set due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" type="button" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {selectedCategories.length > 0 ? `${selectedCategories.length} categories` : "Add categories"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px]">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <Label htmlFor={`category-${category.id}`}>{category.label}</Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full sm:w-auto sm:self-end">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

