import { useState, useEffect } from "react";
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

// Utility function to generate initials from any name
const generateInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  
  // Split the name into parts and filter out empty strings
  const nameParts = name.trim().split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 0) return '';
  
  if (nameParts.length === 1) {
    // If only one name, take first two letters
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  
  // Take first letter of first name and first letter of last name
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  assignee: { name: string; avatar: string };
  dueDate: string;
  comments: number;
  attachments: number;
  tags: string[];
  status: string;
  parentId: string | null;
  subtasks: string[];
  attachmentsList?: Array<{
    name: string;
    size: string;
    type: string;
    url: string;
    description: string;
    file?: File;
  }>;
  commentsList?: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
  development?: {
    branches: number;
    commits: number;
    pullRequests: number;
  };
}

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreate: (task: Task) => void;
  defaultStatus?: string;
}

const AddTaskModal = ({ open, onOpenChange, onTaskCreate, defaultStatus }: AddTaskModalProps) => {
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    dueDate: undefined as Date | undefined,
    assignee: '',
    priority: '',
    project: '',
    status: defaultStatus || 'todo'
  });

  const statusOptions = [
    { id: 'todo', name: 'To Do', color: 'bg-muted' },
    { id: 'inprogress', name: 'In Progress', color: 'bg-primary' },
    { id: 'review', name: 'In Review', color: 'bg-warning' },
    { id: 'done', name: 'Done', color: 'bg-success' }
  ];

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
    { id: 'Low', name: 'Low', color: 'bg-muted' },
    { id: 'Medium', name: 'Medium', color: 'bg-primary' },
    { id: 'High', name: 'High', color: 'bg-warning' },
    { id: 'Critical', name: 'Critical', color: 'bg-destructive' }
  ];

  // Reset form when modal opens with new default status
  useEffect(() => {
    if (open && defaultStatus) {
      setTaskData(prev => ({
        ...prev,
        status: defaultStatus
      }));
    }
  }, [open, defaultStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskData.name || !taskData.project) return;

    // Get assignee name from the selected assignee ID
    const selectedAssignee = teamMembers.find(member => member.id === taskData.assignee);
    const assigneeName = selectedAssignee ? selectedAssignee.name : 'Unassigned';

    // Get project name from the selected project ID
    const selectedProject = projects.find(project => project.id === taskData.project);
    const projectName = selectedProject ? selectedProject.name : 'Unknown Project';

    // Create task with the correct structure expected by KanbanBoard
    const newTask = {
      id: Date.now().toString(),
      title: taskData.name,
      description: taskData.description,
      priority: taskData.priority || 'Medium',
      assignee: { 
        name: assigneeName, 
        avatar: generateInitials(assigneeName) 
      },
      dueDate: taskData.dueDate ? format(taskData.dueDate, 'MMM dd') : 'No due date',
      comments: 0,
      attachments: 0,
      tags: [projectName], // Use project name as a tag
      status: taskData.status,
      parentId: null,
      subtasks: [],
      attachmentsList: [],
      commentsList: [],
      development: {
        branches: 0,
        commits: 0,
        pullRequests: 0
      }
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
      <DialogContent className="max-w-6xl w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <span>Add New Task</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
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
              <Label htmlFor="status">Status (Column)</Label>
              <Select
                value={taskData.status}
                onValueChange={(value) => setTaskData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${status.color}`} />
                        <span>{status.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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