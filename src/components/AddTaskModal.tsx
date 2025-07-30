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
import { 
  CommonDialog, 
  CommonInput, 
  CommonTextarea, 
  CommonSelect, 
  CommonButton, 
  CommonSectionHeader, 
  CommonFormGrid, 
  CommonFormActions
} from "@/components/ui/common-dialog";
import { useProjects } from "../contexts/ProjectContext";
import { taskDataStore } from "../lib/taskData";

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
  defaultProject?: string; // Add default project parameter
  projectId?: number; // Add project ID for direct integration
}

const AddTaskModal = ({ open, onOpenChange, onTaskCreate, defaultStatus, defaultProject, projectId }: AddTaskModalProps) => {
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    dueDate: undefined as Date | undefined,
    assignee: '',
    priority: '',
    project: defaultProject || '',
    status: defaultStatus || 'todo'
  });

  // Get projects from context instead of hardcoded list
  const { projects, addTaskToProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { id: 'todo', name: 'To Do', color: 'bg-muted' },
    { id: 'inprogress', name: 'In Progress', color: 'bg-primary' },
    { id: 'review', name: 'In Review', color: 'bg-warning' },
    { id: 'done', name: 'Done', color: 'bg-success' }
  ];

  // Use dynamic projects from context
  const projectOptions = projects.map(project => ({
    id: project.id.toString(),
    name: project.name
  }));

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
    if (!taskData.name || !taskData.project || isSubmitting) return;

    setIsSubmitting(true);

    // Get assignee name from the selected assignee ID
    const selectedAssignee = teamMembers.find(member => member.id === taskData.assignee);
    const assigneeName = selectedAssignee ? selectedAssignee.name : 'Unassigned';

    // Get project name from the selected project ID
    const selectedProject = projects.find(project => project.id.toString() === taskData.project);
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
      tags: [projectName, projectId?.toString() || ''], // Include both project name and ID
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

    // If we have a specific projectId, add the task directly to that project
    if (projectId && selectedProject) {
      console.log('AddTaskModal: Adding task to project:', projectId, 'Project:', selectedProject.name);
      addTaskToProject(projectId, newTask);
    } else {
      console.log('AddTaskModal: No projectId or selectedProject:', projectId, selectedProject);
    }

    // Also add to the task data store for Kanban board integration
    taskDataStore.addTask(newTask);

    // Also call the original onTaskCreate callback for backward compatibility
    onTaskCreate(newTask);
    onOpenChange(false);
    
    // Reset form
    setTaskData({
      name: '',
      description: '',
      dueDate: undefined,
      assignee: '',
      priority: '',
      project: defaultProject || '',
      status: 'todo'
    });

    // Reset submission state after a short delay
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <CommonDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Task"
      subtitle="Create a new task with all the necessary details"
      icon={FolderOpen}
      maxWidth="max-w-6xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <CommonFormGrid cols={2}>
          <CommonInput
            id="taskName"
            label="Task Name"
            value={taskData.name}
            onChange={(value) => setTaskData(prev => ({ ...prev, name: value }))}
            placeholder="Enter task name"
            required
          />

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800">
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

          <CommonSelect
            id="project"
            label="Project"
            value={taskData.project}
            onValueChange={(value) => setTaskData(prev => ({ ...prev, project: value }))}
            placeholder="Select project"
            required
            options={projectOptions.map(project => ({ value: project.id, label: project.name }))}
          />

          <CommonSelect
            id="assignee"
            label="Assignee"
            value={taskData.assignee}
            onValueChange={(value) => setTaskData(prev => ({ ...prev, assignee: value }))}
            placeholder="Select assignee"
            options={teamMembers.map(member => ({ value: member.id, label: member.name }))}
          />

          <CommonSelect
            id="priority"
            label="Priority"
            value={taskData.priority}
            onValueChange={(value) => setTaskData(prev => ({ ...prev, priority: value }))}
            placeholder="Select priority"
            options={priorities.map(priority => ({ value: priority.id, label: priority.name }))}
          />

          <CommonSelect
            id="status"
            label="Status (Column)"
            value={taskData.status}
            onValueChange={(value) => setTaskData(prev => ({ ...prev, status: value }))}
            placeholder="Select status"
            options={statusOptions.map(status => ({ value: status.id, label: status.name }))}
          />
        </CommonFormGrid>

        <CommonTextarea
          id="description"
          label="Description"
          value={taskData.description}
          onChange={(value) => setTaskData(prev => ({ ...prev, description: value }))}
          placeholder="Describe the task..."
          rows={4}
        />

        <CommonFormActions>
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-gray-600">
              {taskData.name && taskData.project ? 'Ready to create task' : 'Please fill in required fields'}
            </p>
            <div className="flex items-center gap-3">
              <CommonButton
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </CommonButton>
              <CommonButton
                type="submit"
                disabled={!taskData.name || !taskData.project || isSubmitting}
                loading={isSubmitting}
              >
                Create Task
              </CommonButton>
            </div>
          </div>
        </CommonFormActions>
      </form>
    </CommonDialog>
  );
};

export default AddTaskModal;