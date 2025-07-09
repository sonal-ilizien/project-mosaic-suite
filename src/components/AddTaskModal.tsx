import { useState } from "react";
import { Calendar, User, Flag, FolderOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreate: (task: any) => void;
}

const AddTaskModal = ({ open, onOpenChange, onTaskCreate }: AddTaskModalProps) => {
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    dueDate: undefined as Date | undefined,
    assignee: '',
    priority: '',
    project: '',
    status: 'todo'
  });

  const projects = [
    { id: 'mobile-app', name: 'Mobile App Redesign' },
    { id: 'budget-planning', name: 'Q1 Budget Planning' },
    { id: 'website-migration', name: 'Website Migration' },
    { id: 'api-integration', name: 'API Integration' }
  ];

  const teamMembers = [
    { id: 'john', name: 'John Smith' },
    { id: 'sarah', name: 'Sarah Johnson' },
    { id: 'mike', name: 'Mike Chen' },
    { id: 'alex', name: 'Alex Rodriguez' }
  ];

  const priorities = [
    { id: 'low', name: 'Low', color: 'bg-muted' },
    { id: 'medium', name: 'Medium', color: 'bg-warning' },
    { id: 'high', name: 'High', color: 'bg-destructive' },
    { id: 'urgent', name: 'Urgent', color: 'bg-destructive' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskData.name || !taskData.project) return;

    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date(),
    };

    onTaskCreate(newTask);
    onOpenChange(false);
    
    // Reset form
    setTaskData({
      name: '',
      description: '',
      dueDate: undefined,
      assignee: '',
      priority: '',
      project: '',
      status: 'todo'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <span>Add New Task</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="taskName">Task Name *</Label>
              <Input
                id="taskName"
                value={taskData.name}
                onChange={(e) => setTaskData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter task name"
                required
              />
            </div>

            <div>
              <Label htmlFor="project">Project *</Label>
              <Select
                value={taskData.project}
                onValueChange={(value) => setTaskData(prev => ({ ...prev, project: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={taskData.assignee}
                onValueChange={(value) => setTaskData(prev => ({ ...prev, assignee: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={taskData.priority}
                onValueChange={(value) => setTaskData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${priority.color}`} />
                        <span>{priority.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    {taskData.dueDate ? format(taskData.dueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={taskData.dueDate}
                    onSelect={(date) => setTaskData(prev => ({ ...prev, dueDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={taskData.description}
                onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the task..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;