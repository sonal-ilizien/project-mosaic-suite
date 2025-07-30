import { useState, useEffect } from "react";
import { 
  Calendar, 
  Users, 
  Folder, 
  X, 
  ArrowRight,
  Sun,
  MoreHorizontal,
  User,
  UserPlus,
  Target,
  Tag,
  Plus,
  Circle,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Star,
  Settings,
  FileText,
  Loader2
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
import { ComponentType } from "react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/apiService";

interface Template {
  id: string;
  name: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  color?: string;
  gradient?: string;
  features?: string[];
  useCase?: string;
  complexity?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  template: string;
  startDate?: Date;
  endDate?: Date;
  team: string[];
  createdAt: Date;
  status: string;
  progress: number;
  priority?: string;
}

interface CreateProjectPayload {
  name: string;
  description: string;
  overview_doc: string;
  template_id: number;
  lead: number;
  status: string;
  start_date?: string;
  end_date?: string;
  labels: string[];
  members: string[];
}

interface CreateMilestonePayload {
  project: number;
  name: string;
  target_date: string;
  status: string;
}

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate?: Template;
  editingProject?: Project;
  onProjectCreate: (project: Project) => void;
}

const NewProjectModal = ({ open, onOpenChange, selectedTemplate, editingProject, onProjectCreate }: NewProjectModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [projectData, setProjectData] = useState({
    name: '',
    summary: '',
    description: '',
    template: '',
    priority: 'no-priority',
    status: 'backlog',
    lead: '',
    members: [] as string[],
    startDate: undefined as Date | undefined,
    targetDate: undefined as Date | undefined,
    labels: [] as string[],
    milestones: [] as Array<{id: string; name: string; date: Date | undefined; completed: boolean}>
  });

  const [showMilestoneInput, setShowMilestoneInput] = useState(false);
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneDate, setMilestoneDate] = useState<Date | undefined>(undefined);
  const [newLabel, setNewLabel] = useState('');

  // Update template when selectedTemplate prop changes
  useEffect(() => {
    if (selectedTemplate?.id) {
      setProjectData(prev => ({
        ...prev,
        template: selectedTemplate.id
      }));
    } else {
      // Set default template if none selected
      setProjectData(prev => ({
        ...prev,
        template: 'development'
      }));
    }
  }, [selectedTemplate]);

  // Populate form when editing an existing project
  useEffect(() => {
    if (editingProject) {
      setProjectData({
        name: editingProject.name,
        summary: '',
        description: editingProject.description || '',
        template: editingProject.template,
        priority: editingProject.priority || 'no-priority',
        status: editingProject.status || 'backlog',
        lead: editingProject.team?.[0] || '',
        members: editingProject.team || [],
        startDate: editingProject.startDate,
        targetDate: editingProject.endDate,
        labels: [],
        milestones: []
      });
    } else {
      // Reset form for new project
      setProjectData({
        name: '',
        summary: '',
        description: '',
        template: '',
        priority: 'no-priority',
        status: 'backlog',
        lead: '',
        members: [],
        startDate: undefined,
        targetDate: undefined,
        labels: [],
        milestones: []
      });
    }
  }, [editingProject]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setProjectData({
        name: '',
        summary: '',
        description: '',
        template: '',
        priority: 'no-priority',
        status: 'backlog',
        lead: '',
        members: [],
        startDate: undefined,
        targetDate: undefined,
        labels: [],
        milestones: []
      });
    }
  }, [open]);

  const templates = [
    { id: 'personal', name: 'Personal Productivity' },
    { id: 'agile', name: 'Agile Development' },
    { id: 'finance', name: 'Finance Management' },
    { id: 'shipbuilding', name: 'Shipbuilding Projects' },
    { id: 'event', name: 'Event Planning' },
    { id: 'hr', name: 'HR / Recruitment' },
    { id: 'construction', name: 'Construction / Real Estate' },
    { id: 'consulting', name: 'Client Service / Consulting' },
    { id: 'education', name: 'Education / Course Planning' },
    { id: 'product', name: 'Product Launch Roadmaps' }
  ];

  const priorities = [
    { id: 'no-priority', name: 'No priority', icon: MoreHorizontal },
    { id: 'urgent', name: 'Urgent', icon: Target },
    { id: 'high', name: 'High', icon: Sun },
    { id: 'medium', name: 'Medium', icon: Circle },
    { id: 'low', name: 'Low', icon: Clock }
  ];

  const statuses = [
    { id: 'backlog', name: 'Backlog', icon: Circle, color: 'text-orange-500' },
    { id: 'planned', name: 'Planned', icon: Circle, color: 'text-gray-400' },
    { id: 'in-progress', name: 'In Progress', icon: Clock, color: 'text-yellow-500' },
    { id: 'completed', name: 'Completed', icon: CheckCircle, color: 'text-blue-500' },
    { id: 'canceled', name: 'Canceled', icon: XCircle, color: 'text-red-500' }
  ];

  const teamMembers = [
    { id: 'john', name: 'John Doe', avatar: 'JD' },
    { id: 'jane', name: 'Jane Smith', avatar: 'JS' },
    { id: 'mike', name: 'Mike Johnson', avatar: 'MJ' },
    { id: 'sarah', name: 'Sarah Wilson', avatar: 'SW' }
  ];

  const labels = [
    { id: 'frontend', name: 'Frontend', color: 'bg-blue-500' },
    { id: 'backend', name: 'Backend', color: 'bg-green-500' },
    { id: 'design', name: 'Design', color: 'bg-purple-500' },
    { id: 'bug', name: 'Bug', color: 'bg-red-500' },
    { id: 'feature', name: 'Feature', color: 'bg-yellow-500' }
  ];

  // API Service Functions
  const createProject = async (projectPayload: CreateProjectPayload) => {
    try {
      const response = await apiService.post('/projects/', projectPayload);
      return response;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const createMilestone = async (milestonePayload: CreateMilestonePayload) => {
    try {
      const response = await apiService.post('/projects/milestones/', milestonePayload);
      return response;
    } catch (error) {
      console.error('Error creating milestone:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.name) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Submitting project with milestones:', projectData.milestones);
      
      // Prepare project payload
      const projectPayload: CreateProjectPayload = {
        name: projectData.name,
        description: projectData.summary, // Short summary goes to description
        overview_doc: projectData.description, // Description textarea goes to overview_doc
        template_id: parseInt(projectData.template) || 1,
        lead: parseInt(projectData.lead) || 1,
        status: "Active",
        start_date: projectData.startDate ? projectData.startDate.toISOString() : undefined,
        end_date: projectData.targetDate ? projectData.targetDate.toISOString() : undefined,
        labels: projectData.labels,
        members: projectData.members
      };

      // Create project
      const projectResponse = await createProject(projectPayload);
      
      // Extract project ID from the response structure
      // API returns: { message: "Project created successfully!", data: { id: 7, ... } }
      const projectId = projectResponse.data?.id || projectResponse.id || projectResponse.project_id;
      
      if (!projectId) {
        throw new Error('Project ID not found in response');
      }

      // Create milestones if any exist
      if (projectData.milestones.length > 0) {
        console.log(`Creating ${projectData.milestones.length} milestones for project ${projectId}`);
        for (const milestone of projectData.milestones) {
          if (milestone.name && milestone.date) {
            const milestonePayload: CreateMilestonePayload = {
              project: projectId,
              name: milestone.name,
              target_date: format(milestone.date, 'yyyy-MM-dd'),
              status: "Planned"
            };
            console.log('Creating milestone:', milestonePayload);
            await createMilestone(milestonePayload);
            console.log('Milestone created successfully');
          }
        }
      }

      // Show success toast with the message from API response
      toast({
        title: "Success",
        description: projectResponse.message || "Project created successfully!",
      });

      onProjectCreate({
        id: projectId.toString(),
        name: projectData.name,
        description: projectData.description,
        template: projectData.template,
        startDate: projectData.startDate,
        endDate: projectData.targetDate,
        team: projectData.members,
        createdAt: new Date(),
        status: 'active',
        progress: 0
      });

      onOpenChange(false);
      
      // Reset form
      setProjectData({
        name: '',
        summary: '',
        description: '',
        template: '',
        priority: 'no-priority',
        status: 'backlog',
        lead: '',
        members: [],
        startDate: undefined,
        targetDate: undefined,
        labels: [],
        milestones: []
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMilestone = () => {
    if (!milestoneName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a milestone name.",
        variant: "destructive",
      });
      return;
    }

    // Add milestone to local state only
    const newMilestone = {
      id: Date.now().toString(),
      name: milestoneName,
      date: milestoneDate,
      completed: false
    };

    console.log('Adding milestone to local state:', newMilestone);
    setProjectData(prev => {
      const updatedMilestones = [...prev.milestones, newMilestone];
      console.log('Updated milestones:', updatedMilestones);
      return {
        ...prev,
        milestones: updatedMilestones
      };
    });

    toast({
      title: "Success",
      description: "Milestone added to project!",
    });

    // Reset milestone inputs
    setMilestoneName('');
    setMilestoneDate(undefined);
    setShowMilestoneInput(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-8xl w-[98vw] max-h-[98vh] overflow-hidden p-0 rounded-none animate-in fade-in-0 zoom-in-95 duration-500">
        <div className="flex h-full max-h-[95vh]">
          {/* Left Side - Project Form */}
          <div className="w-[70%] overflow-y-auto p-6 min-w-0">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 font-medium">DEE</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900 font-semibold text-lg">
                      {editingProject ? 'Edit project' : 'New project'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedTemplate && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {selectedTemplate.name}
                    </Badge>
                  )}
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Icon and Name */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Folder className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={projectData.name}
                      onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Project name"
                      className="text-xl font-semibold border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                    <Input
                      value={projectData.summary}
                      onChange={(e) => setProjectData(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="Add a short summary..."
                      className="text-sm text-muted-foreground border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </div>

                              {/* Attributes Row */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-primary" />
                    Project Attributes
                  </h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <Select value={projectData.status} onValueChange={(value) => setProjectData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-auto text-sm h-9 px-3 bg-white border-gray-200 hover:border-gray-300 hover:bg-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="!bg-white !border-gray-200 min-w-[200px] [&>*]:!bg-white">
                      {statuses.map((status) => (
                        <SelectItem key={status.id} value={status.id} className="!text-gray-900 py-2 text-sm hover:!bg-gray-50">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <status.icon className={`w-4 h-4 mr-2 ${status.color}`} />
                              <span>{status.name}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={projectData.priority} onValueChange={(value) => setProjectData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="w-auto text-sm h-9 px-3 bg-white border-gray-200 hover:border-gray-300 hover:bg-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="!bg-white !border-gray-200 [&>*]:!bg-white">
                      {priorities.map((priority) => (
                        <SelectItem key={priority.id} value={priority.id} className="!text-gray-900 text-sm hover:!bg-gray-50">
                          <div className="flex items-center">
                            <priority.icon className="w-4 h-4 mr-2" />
                            <span>{priority.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={projectData.lead} onValueChange={(value) => setProjectData(prev => ({ ...prev, lead: value }))}>
                    <SelectTrigger className="w-auto text-sm h-9 px-3 bg-white border-gray-200 hover:border-gray-300 hover:bg-primary/20">
                      <User className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Lead" />
                    </SelectTrigger>
                    <SelectContent className="!bg-white !border-gray-200 min-w-[200px] [&>*]:!bg-white">
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id} className="!text-gray-900 py-2 text-sm hover:!bg-gray-50">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs mr-2">
                              {member.avatar}
                            </div>
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-sm h-9 px-3 bg-white border-gray-200 hover:border-gray-300 hover:bg-primary/20 hover:text-black">
                        <UserPlus className="w-4 h-4 mr-2" />
                        {projectData.members.length > 0 ? `${projectData.members.length} Members` : 'Members'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="start">
                      <div className="space-y-3">
                        <div>
                          <Input
                            placeholder="Search members..."
                            className="w-full text-sm"
                          />
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {teamMembers.map((member) => (
                            <div key={member.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={member.id}
                                checked={projectData.members.includes(member.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setProjectData(prev => ({
                                      ...prev,
                                      members: [...prev.members, member.id]
                                    }));
                                  } else {
                                    setProjectData(prev => ({
                                      ...prev,
                                      members: prev.members.filter(id => id !== member.id)
                                    }));
                                  }
                                }}
                                className="rounded"
                              />
                              <label htmlFor={member.id} className="flex items-center space-x-2 cursor-pointer flex-1">
                                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                                  {member.avatar}
                                </div>
                                <span className="text-sm">{member.name}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-sm h-9 px-3 bg-white border-gray-200 hover:border-gray-300 hover:bg-primary/20 hover:text-black">
                        <Calendar className="w-4 h-4 mr-2" />
                        {projectData.startDate ? format(projectData.startDate, 'MMM dd') : 'Start'}
                        {projectData.startDate && (
                          <div 
                            className="ml-2 w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectData(prev => ({ ...prev, startDate: undefined }));
                            }}
                          >
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={projectData.startDate}
                        onSelect={(date) => setProjectData(prev => ({ ...prev, startDate: date }))}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-sm h-9 px-3 bg-white border-gray-200 hover:border-gray-300 hover:bg-primary/20 hover:text-black">
                        <Target className="w-4 h-4 mr-2" />
                        {projectData.targetDate ? format(projectData.targetDate, 'MMM dd') : 'Target'}
                        {projectData.targetDate && (
                          <div 
                            className="ml-2 w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectData(prev => ({ ...prev, targetDate: undefined }));
                            }}
                          >
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={projectData.targetDate}
                        onSelect={(date) => setProjectData(prev => ({ ...prev, targetDate: date }))}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-sm h-9 px-3 bg-white border-gray-200 hover:border-gray-300 hover:bg-primary/20 hover:text-black">
                        <Tag className="w-4 h-4 mr-2" />
                        {projectData.labels.length > 0 ? `${projectData.labels.length} Labels` : 'Labels'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="start">
                      <div className="space-y-3">
                        <div>
                          <Input
                            placeholder="Add labels..."
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newLabel.trim()) {
                                if (!projectData.labels.includes(newLabel.trim())) {
                                  setProjectData(prev => ({
                                    ...prev,
                                    labels: [...prev.labels, newLabel.trim()]
                                  }));
                                }
                                setNewLabel('');
                              }
                            }}
                            className="w-full text-sm"
                          />
                        </div>
                        
                        {projectData.labels.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">Added Labels:</p>
                            <div className="flex flex-wrap gap-2">
                              {projectData.labels.map((label, index) => (
                                <Badge 
                                  key={index} 
                                  variant="secondary" 
                                  className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                                >
                                  {label}
                                  <button
                                    onClick={() => {
                                      setProjectData(prev => ({
                                        ...prev,
                                        labels: prev.labels.filter((_, i) => i !== index)
                                      }));
                                    }}
                                    className="ml-1 hover:text-red-500"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 text-gray-500 text-xs">
                          <Plus className="w-3 h-3" />
                          <span>Press Enter to add a new label</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground">Description</Label>
                <Textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Write a description, a project brief, or collect ideas..."
                  className="min-h-[120px] text-sm resize-none border-gray-200 focus:border-primary"
                />
              </div>

              {/* Milestones Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-foreground">Milestones</Label>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    className="text-sm"
                    onClick={() => setShowMilestoneInput(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add milestone
                  </Button>
                </div>
                
                                  {showMilestoneInput ? (
                    <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                      <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-primary rotate-45"></div>
                        </div>
                        <Input
                          placeholder="Milestone name"
                          value={milestoneName}
                          onChange={(e) => setMilestoneName(e.target.value)}
                          className="text-sm pl-8 bg-white border-gray-200"
                        />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="text-sm relative pr-8 bg-white border-gray-200">
                            <Calendar className="w-4 h-4 mr-2" />
                            {milestoneDate ? format(milestoneDate, 'MMM dd') : 'Target date'}
                            {milestoneDate && (
                              <div 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMilestoneDate(undefined);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </div>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <CalendarComponent
                            mode="single"
                            selected={milestoneDate}
                            onSelect={(date) => setMilestoneDate(date)}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-gray-600 p-2"
                        onClick={handleAddMilestone}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-gray-600 p-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowMilestoneInput(false);
                          setMilestoneName('');
                          setMilestoneDate(undefined);
                        }}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                                  ) : projectData.milestones.length > 0 ? (
                    <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                      {projectData.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-primary rotate-45"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{milestone.name}</p>
                              {milestone.date && (
                                <p className="text-xs text-gray-500">{format(milestone.date, 'MMM dd, yyyy')}</p>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 hover:text-red-500 p-1"
                            onClick={() => {
                              setProjectData(prev => ({
                                ...prev,
                                milestones: prev.milestones.filter((_, i) => i !== index)
                              }));
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <FileText className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 text-sm">No milestones added yet</p>
                    </div>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="bg-white border-gray-200 text-gray-700 hover:bg-primary/20 hover:text-gray-700 px-5"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-primary/20 text-white px-6 shadow-lg"
                  disabled={!projectData.name || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {editingProject ? 'Update project' : 'Create project'}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Side - Template Info */}
          <div className="w-[30%] border-l border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex flex-col min-w-0 h-full">
            <div className="space-y-4">
              {/* Template Header */}
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-1">Using Template</h2>
                <p className="text-muted-foreground text-sm">
                  {selectedTemplate ? selectedTemplate.name : (editingProject ? `${editingProject.template} Template` : 'Development Template')}
                </p>
              </div>

              {/* Template Features */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-foreground mb-3 flex items-center text-sm">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  Template Features
                </h3>
                <div className="space-y-2">
                  {selectedTemplate?.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-foreground">{feature}</span>
                    </div>
                  )) || (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-foreground">Pre-configured task board</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-foreground">Custom fields and forms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-foreground">Progress tracking</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-foreground">Team collaboration tools</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Tips */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center text-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Pro Tips
                </h3>
                <div className="space-y-1 text-xs text-blue-800">
                  <p>• Add team members early to improve collaboration</p>
                  <p>• Set realistic milestones to track progress</p>
                  <p>• Use labels to organize and categorize tasks</p>
                  <p>• Regular updates keep everyone informed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;