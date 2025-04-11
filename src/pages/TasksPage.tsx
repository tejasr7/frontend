
import React, { useState, useEffect } from 'react';
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { getTasks, saveTask, updateTask, deleteTask } from "@/services/chat-service";
import type { Task } from "@/services/chat-service";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: undefined as Date | undefined,
  });
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  };

  const openNewTaskDialog = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      dueDate: undefined,
    });
    setIsDialogOpen(true);
  };

  const openEditTaskDialog = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      // Update existing task
      updateTask(editingTask.id, { 
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate
      });
      toast({
        title: "Task Updated",
        description: "Your task has been updated successfully.",
      });
    } else {
      // Create new task
      saveTask({
        title: formData.title,
        description: formData.description,
        completed: false,
        dueDate: formData.dueDate,
      });
      toast({
        title: "Task Created",
        description: "Your new task has been created successfully.",
      });
    }
    
    loadTasks();
    setIsDialogOpen(false);
  };

  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, { completed: !task.completed });
    loadTasks();
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    loadTasks();
    toast({
      title: "Task Deleted",
      description: "Your task has been deleted successfully.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
            <Button onClick={openNewTaskDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Incomplete Tasks */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>To Do</CardTitle>
                <CardDescription>Tasks that need completion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks
                  .filter(task => !task.completed)
                  .map(task => (
                    <div key={task.id} className="p-4 border rounded-lg flex items-start gap-3">
                      <Checkbox 
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <label 
                            htmlFor={`task-${task.id}`}
                            className="font-medium cursor-pointer text-base"
                          >
                            {task.title}
                          </label>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openEditTaskDialog(task)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1 mt-2 text-xs">
                            <CalendarIcon className="h-3 w-3" />
                            <span>Due: {format(task.dueDate, 'PPP')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                {tasks.filter(task => !task.completed).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending tasks
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completed Tasks */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Completed</CardTitle>
                <CardDescription>Tasks you've accomplished</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks
                  .filter(task => task.completed)
                  .map(task => (
                    <div key={task.id} className="p-4 border rounded-lg flex items-start gap-3 bg-muted/30">
                      <Checkbox 
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <label 
                            htmlFor={`task-${task.id}`}
                            className="font-medium cursor-pointer text-base line-through"
                          >
                            {task.title}
                          </label>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-through">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                {tasks.filter(task => task.completed).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No completed tasks
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {editingTask 
                ? 'Update your task details below.' 
                : 'Add details for your new task.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Task title"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Task description"
                  className="mt-1 min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <div className="flex mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dueDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? (
                          format(formData.dueDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {formData.dueDate && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => setFormData(prev => ({ ...prev, dueDate: undefined }))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.title.trim()}>
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;