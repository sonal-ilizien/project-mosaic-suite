import { useState, useEffect } from "react";
import { 
  Calendar, 
  User, 
  Target, 
  Clock, 
  CheckCircle,
  X,
  Plus,
  Loader2,
  Sparkles,
  BarChart3,
  AlertCircle,
  FileText,
  Users,
  Tag,
  Star
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { agileAPI, CreateTaskPayload } from "./AgileAPI";

interface Sprint {
  id: number;
  project: number;
  project_name: string;
  name: string;
  start_date: string;
  end_date: string;
  goal: string;
  tasks_count: number;
  completed_tasks_count: number;
  total_story_points: number;
  completed_story_points: number;
  progress_percentage: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: number;
  status: string;
  priority: string;
  due_date: string;
  start_date: string;
  sprint: number;
  story_points: number;
  epic: string;
  man_days: string;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AgileTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  projectName: string;
  onTaskCreated?: (task: Task) => void;
  editingTask?: Task;
}

interface TaskData {
  title: string;
  description: string;
  assignee: number;
  status: string;
  priority: string;
  dueDate: Date | undefined;
  startDate: Date | undefined;
  sprint: number;
  storyPoints: number;
  epic: string;
  manDays: string;
}

const AgileTaskModal = ({ 
  open, 
  onOpenChange, 
  projectId, 
  projectName, 
  onTaskCreated,
  editingTask 
}: AgileTaskModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    assignee: 0,
    status: 'Open',
    priority: 'Medium',
    dueDate: undefined,
    startDate: undefined,
    sprint: 0,
    storyPoints: 0,
    epic: '',
    manDays: ''
  });

  // Load sprints and team members when modal opens
  useEffect(() => {
    if (open && projectId) {
      loadSprints();
      loadTeamMembers();
    }
  }, [open, projectId]);

  // Load editing task data if provided
  useEffect(() => {
    if (editingTask) {
      setTaskData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        assignee: editingTask.assignee || 0,
        status: editingTask.status || 'Open',
        priority: editingTask.priority || 'Medium',
        dueDate: editingTask.due_date ? new Date(editingTask.due_date) : undefined,
        startDate: editingTask.start_date ? new Date(editingTask.start_date) : undefined,
        sprint: editingTask.sprint || 0,
        storyPoints: editingTask.story_points || 0,
        epic: editingTask.epic || '',
        manDays: editingTask.man_days || ''
      });
    }
  }, [editingTask]);

  const loadSprints = async () => {
    try {
      const response = await agileAPI.getSprints(projectId);
      // Handle the nested response structure: { results: { data: [...] } }
      const sprintsData = response.results?.data || response.data || [];
      setSprints(sprintsData);
    } catch (error) {
      console.error('Error loading sprints:', error);
    }
  };

  const loadTeamMembers = async () => {
    // Mock team members for now - replace with actual API call
    setTeamMembers([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'QA Engineer' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Product Manager' }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskData.title || !taskData.description || !taskData.assignee) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const taskPayload: CreateTaskPayload = {
        project: projectId,
        title: taskData.title,
        description: taskData.description,
        assignee: taskData.assignee,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.dueDate ? format(taskData.dueDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        start_date: taskData.startDate ? format(taskData.startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        sprint: taskData.sprint,
        story_points: taskData.storyPoints,
        epic: taskData.epic,
        man_days: taskData.manDays
      };

      console.log('Creating task:', taskPayload);
      const response = await agileAPI.createTask(taskPayload);
      console.log('Task created successfully:', response);

      toast({
        title: "Success",
        description: response.message || "Task created successfully!",
      });

      // Reset form
      setTaskData({
        title: '',
        description: '',
        assignee: 0,
        status: 'Open',
        priority: 'Medium',
        dueDate: undefined,
        startDate: undefined,
        sprint: 0,
        storyPoints: 0,
        epic: '',
        manDays: ''
      });

      // Call callback if provided
      if (onTaskCreated) {
        onTaskCreated(response.data || response);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const storyPointOptions = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const statusOptions = ['Open', 'In Progress', 'Review', 'Testing', 'Done'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[98vw] max-h-[95vh] overflow-hidden p-0 rounded-none border-0 shadow-none [&_.absolute]:text-white [&_.absolute_button]:text-white [&_.absolute_svg]:text-white [&_.absolute_button:hover]:bg-white/20 [&_.absolute_button]:opacity-100 [&_.absolute_button]:hover:opacity-100">
        <div className="backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/85 border-0 shadow-2xl overflow-hidden rounded-none">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h2>
                  <p className="text-white/90">{projectName}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Agile Task
              </Badge>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="flex h-full">
            {/* Left Side - Task Creation Form */}
            <div className="w-[70%] overflow-y-auto p-8 max-h-[calc(95vh-120px)]">

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Task Basic Info */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Task Information
                </h3>
                
                <div className="space-y-3">
                  <Label htmlFor="task-title" className="text-sm font-semibold text-gray-700">
                    Task Title *
                  </Label>
                  <div className="relative">
                    <Input
                      id="task-title"
                      value={taskData.title}
                      onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Implement user authentication"
                      className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="task-description" className="text-sm font-semibold text-gray-700">
                    Description *
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="task-description"
                      value={taskData.description}
                      onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the task in detail..."
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900 resize-none min-h-[120px]"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Task Assignment */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  Assignment & Status
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="task-assignee" className="text-sm font-semibold text-gray-700">
                      Assignee *
                    </Label>
                    <div className="relative">
                      <Select
                        value={taskData.assignee.toString()}
                        onValueChange={(value) => setTaskData(prev => ({ ...prev, assignee: parseInt(value) }))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                              <div className="flex items-center space-x-2">
                                <span>{member.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {member.role}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="task-status" className="text-sm font-semibold text-gray-700">
                      Status
                    </Label>
                    <div className="relative">
                      <Select
                        value={taskData.status}
                        onValueChange={(value) => setTaskData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="task-priority" className="text-sm font-semibold text-gray-700">
                      Priority
                    </Label>
                    <div className="relative">
                      <Select
                        value={taskData.priority}
                        onValueChange={(value) => setTaskData(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          {priorityOptions.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="task-sprint" className="text-sm font-semibold text-gray-700">
                      Sprint
                    </Label>
                    <div className="relative">
                      <Select
                        value={taskData.sprint.toString()}
                        onValueChange={(value) => setTaskData(prev => ({ ...prev, sprint: parseInt(value) }))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select sprint" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          <SelectItem value="0">No Sprint</SelectItem>
                          {sprints.map((sprint) => (
                            <SelectItem key={sprint.id} value={sprint.id.toString()}>
                              {sprint.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agile Specific Fields */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  Agile Metrics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="story-points" className="text-sm font-semibold text-gray-700">
                      Story Points
                    </Label>
                    <div className="relative">
                      <Select
                        value={taskData.storyPoints.toString()}
                        onValueChange={(value) => setTaskData(prev => ({ ...prev, storyPoints: parseInt(value) }))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select points" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          {storyPointOptions.map((points) => (
                            <SelectItem key={points} value={points.toString()}>
                              {points === 0 ? 'No Points' : points.toString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="epic" className="text-sm font-semibold text-gray-700">
                      Epic
                    </Label>
                    <div className="relative">
                      <Input
                        id="epic"
                        value={taskData.epic}
                        onChange={(e) => setTaskData(prev => ({ ...prev, epic: e.target.value }))}
                        placeholder="e.g., User Management"
                        className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="man-days" className="text-sm font-semibold text-gray-700">
                      Man Days
                    </Label>
                    <div className="relative">
                      <Input
                        id="man-days"
                        value={taskData.manDays}
                        onChange={(e) => setTaskData(prev => ({ ...prev, manDays: e.target.value }))}
                        placeholder="e.g., 3"
                        className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  Timeline
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-start text-left font-normal bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {taskData.startDate ? format(taskData.startDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={taskData.startDate}
                          onSelect={(date) => setTaskData(prev => ({ ...prev, startDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-start text-left font-normal bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {taskData.dueDate ? format(taskData.dueDate, 'PPP') : 'Pick a date'}
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
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="font-semibold transition-all duration-200 rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="font-semibold transition-all duration-200 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 shadow-lg hover:shadow-xl px-6 py-3"
                  disabled={isLoading || !taskData.title || !taskData.description || !taskData.assignee}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {editingTask ? 'Update Task' : 'Create Task'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Side - Task Preview */}
          <div className="w-[30%] border-l border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-8 max-h-[calc(95vh-120px)] overflow-y-auto">
            <div className="space-y-6">
              {/* Header matching left side structure */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Task Preview</h2>
                    <p className="text-sm text-muted-foreground">Live Preview</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Preview
                </Badge>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">{taskData.title || 'Task Title'}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {taskData.description || 'Task description will appear here...'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {teamMembers.find(m => m.id === taskData.assignee)?.name || 'Unassigned'}
                    </span>
                  </div>
                  <Badge className={`text-xs ${
                    taskData.priority === 'Critical' ? 'bg-red-500' :
                    taskData.priority === 'High' ? 'bg-orange-500' :
                    taskData.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  } text-white`}>
                    {taskData.priority}
                  </Badge>
                </div>
                
                {taskData.storyPoints > 0 && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{taskData.storyPoints} story points</span>
                  </div>
                )}
                
                {taskData.epic && (
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{taskData.epic}</span>
                  </div>
                )}
                
                {taskData.sprint > 0 && (
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      {sprints.find(s => s.id === taskData.sprint)?.name || 'Sprint'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  );
};

export default AgileTaskModal; 