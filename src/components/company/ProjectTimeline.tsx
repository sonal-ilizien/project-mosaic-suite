import React, { useState } from 'react';
import { 
  BarChart3,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  RotateCcw,
  RefreshCw,
  Settings,
  BellRing,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ArrowLeft,
  Minus,
  PlusCircle,
  XCircle,
  HelpCircle,
  Info,
  ExternalLink,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
  Building,
  Home,
  Briefcase,
  FolderOpen,
  FolderClosed,
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive as ArchiveIcon,
  Trash,
  Download as DownloadIcon,
  Upload,
  Share,
  Copy,
  Undo,
  Redo,
  Save,
  SaveAll,
  Printer,
  Mail,
  Phone,
  Video as VideoIcon,
  Camera,
  Mic,
  Headphones,
  Speaker,
  Volume,
  VolumeX,
  Volume1,
  Volume2,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  BatteryCharging,
  Power,
  PowerOff,
  Zap,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Compass,
  MapPin,
  Navigation,
  NavigationOff,
  Globe,
  Globe2,
  Map,
  MapPin as MapPinIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MessageCircle,
  MessageSquare as MessageSquareIcon,
  MessageCircle as MessageCircleIcon,
  MessageSquare as MessageSquareIcon2,
  MessageCircle as MessageCircleIcon2,
  MessageSquare as MessageSquareIcon3,
  MessageCircle as MessageCircleIcon3,
  MessageSquare as MessageSquareIcon4,
  MessageCircle as MessageCircleIcon4,
  MessageSquare as MessageSquareIcon5,
  MessageCircle as MessageCircleIcon5,
  MessageSquare as MessageSquareIcon6,
  MessageCircle as MessageCircleIcon6,
  MessageSquare as MessageSquareIcon7,
  MessageCircle as MessageCircleIcon7,
  MessageSquare as MessageSquareIcon8,
  MessageCircle as MessageCircleIcon8,
  MessageSquare as MessageSquareIcon9,
  MessageCircle as MessageCircleIcon9,
  MessageSquare as MessageSquareIcon10,
  MessageCircle as MessageCircleIcon10,
  Calendar,
  Users,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Tag,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Activity,
  Lightbulb,
  Heart,
  ThumbsUp,
  AlertCircle,
  CheckSquare,
  Square,
  MoreHorizontal,
  Edit,
  Trash2,
  Archive,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Eye as EyeIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Archive as ArchiveIcon2,
  Eye as EyeIcon2,
  Edit as EditIcon2,
  Trash2 as Trash2Icon2,
  Archive as ArchiveIcon3,
  Eye as EyeIcon3,
  Edit as EditIcon3,
  Trash2 as Trash2Icon3,
  Archive as ArchiveIcon4,
  Eye as EyeIcon4,
  Edit as EditIcon4,
  Trash2 as Trash2Icon4,
  Archive as ArchiveIcon5,
  Eye as EyeIcon5,
  Edit as EditIcon5,
  Trash2 as Trash2Icon5,
  Archive as ArchiveIcon6,
  Eye as EyeIcon6,
  Edit as EditIcon6,
  Trash2 as Trash2Icon6,
  Archive as ArchiveIcon7,
  Eye as EyeIcon7,
  Edit as EditIcon7,
  Trash2 as Trash2Icon7,
  Archive as ArchiveIcon8,
  Eye as EyeIcon8,
  Edit as EditIcon8,
  Trash2 as Trash2Icon8,
  Archive as ArchiveIcon9,
  Eye as EyeIcon9,
  Edit as EditIcon9,
  Trash2 as Trash2Icon9,
  Archive as ArchiveIcon10,
  Eye as EyeIcon10,
  Edit as EditIcon10,
  Trash2 as Trash2Icon10
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

interface Milestone {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending' | 'overdue';
  date: string;
  description?: string;
  assignee?: string;
  estimatedHours?: number;
  actualHours?: number;
}

interface Project {
  id: number;
  name: string;
  progress: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  milestones: Milestone[];
  tasksAtRisk: number;
  totalTasks: number;
  completedTasks: number;
  team: string[];
  budget?: number;
  spentBudget?: number;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  tags?: string[];
}

interface ProjectTimelineProps {
  onExport?: () => void;
  onAddProject?: () => void;
  onFilterChange?: (filters: Record<string, string | boolean>) => void;
  onProjectUpdate?: (project: Project) => void;
}

const mockProjects: Project[] = [
  {
    id: 1,
    name: "Mobile App Redesign",
    progress: 75,
    startDate: "2024-01-01",
    endDate: "2024-03-15",
    status: "active",
    priority: "high",
    description: "Complete redesign of the mobile application with improved UX and performance",
    team: ["Sarah Johnson", "Mike Chen", "Alex Rodriguez"],
    totalTasks: 45,
    completedTasks: 34,
    tasksAtRisk: 3,
    budget: 50000,
    spentBudget: 37500,
    tags: ["mobile", "design", "ux"],
    milestones: [
      { id: 1, title: "Design Phase", status: "completed", date: "2024-01-15", estimatedHours: 80, actualHours: 75 },
      { id: 2, title: "Development Phase", status: "in-progress", date: "2024-02-15", estimatedHours: 120, actualHours: 90 },
      { id: 3, title: "Testing Phase", status: "pending", date: "2024-03-01", estimatedHours: 60, actualHours: 0 },
      { id: 4, title: "Launch", status: "pending", date: "2024-03-15", estimatedHours: 40, actualHours: 0 }
    ]
  },
  {
    id: 2,
    name: "E-commerce Platform",
    progress: 45,
    startDate: "2024-01-10",
    endDate: "2024-04-30",
    status: "active",
    priority: "medium",
    description: "Build a new e-commerce platform with advanced features and integrations",
    team: ["David Kim", "Emma Wilson", "John Smith"],
    totalTasks: 78,
    completedTasks: 35,
    tasksAtRisk: 5,
    budget: 80000,
    spentBudget: 36000,
    tags: ["e-commerce", "platform", "backend"],
    milestones: [
      { id: 1, title: "Requirements Gathering", status: "completed", date: "2024-01-20", estimatedHours: 40, actualHours: 35 },
      { id: 2, title: "Architecture Design", status: "completed", date: "2024-02-01", estimatedHours: 60, actualHours: 55 },
      { id: 3, title: "Development", status: "in-progress", date: "2024-03-01", estimatedHours: 200, actualHours: 120 },
      { id: 4, title: "Testing & QA", status: "pending", date: "2024-04-15", estimatedHours: 80, actualHours: 0 },
      { id: 5, title: "Deployment", status: "pending", date: "2024-04-30", estimatedHours: 40, actualHours: 0 }
    ]
  },
  {
    id: 3,
    name: "Design System",
    progress: 90,
    startDate: "2024-01-05",
    endDate: "2024-02-28",
    status: "active",
    priority: "low",
    description: "Create a comprehensive design system for consistent UI/UX across all products",
    team: ["Alex Rodriguez", "Sarah Johnson"],
    totalTasks: 32,
    completedTasks: 29,
    tasksAtRisk: 1,
    budget: 25000,
    spentBudget: 22500,
    tags: ["design-system", "ui", "components"],
    milestones: [
      { id: 1, title: "Component Library", status: "completed", date: "2024-01-25", estimatedHours: 60, actualHours: 58 },
      { id: 2, title: "Documentation", status: "completed", date: "2024-02-10", estimatedHours: 40, actualHours: 42 },
      { id: 3, title: "Implementation", status: "in-progress", date: "2024-02-20", estimatedHours: 80, actualHours: 65 },
      { id: 4, title: "Final Review", status: "pending", date: "2024-02-28", estimatedHours: 20, actualHours: 0 }
    ]
  }
];

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ 
  onExport, 
  onAddProject, 
  onFilterChange,
  onProjectUpdate 
}) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    showTasksAtRisk: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'timeline' | 'list'>('timeline');

  const handleFilterChange = (key: string, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters as Record<string, string>);
  };

  const handleExport = () => {
    const data = {
      projects,
      filters,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onExport?.();
  };

  const handleAddProject = () => {
    onAddProject?.();
  };

  const handleProjectUpdate = (projectId: number, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    onProjectUpdate?.(updatedProjects.find(project => project.id === projectId)!);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Get milestone status color
  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesPriority = filters.priority === 'all' || project.priority === filters.priority;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRiskFilter = !filters.showTasksAtRisk || project.tasksAtRisk > 0;
    
    return matchesStatus && matchesPriority && matchesSearch && matchesRiskFilter;
  });

  const renderProjectCard = (project: Project) => {
    const daysRemaining = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;
    
    return (
      <Card key={project.id} className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="font-semibold text-foreground text-lg">{project.name}</h4>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <Badge className={getPriorityColor(project.priority)}>
                  {project.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{project.team.length} team members</span>
                </div>
                {project.budget && (
                  <div className="flex items-center space-x-1">
                    <span>${project.spentBudget?.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                <DropdownMenuItem>Add Milestone</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Export Report</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Delete Project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Progress</span>
              <span className="text-sm font-bold text-blue-600">{Math.round(project.progress)}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{project.completedTasks}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{project.totalTasks - project.completedTasks}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${project.tasksAtRisk > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {project.tasksAtRisk}
                </p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-sm text-foreground">Timeline</h5>
              <Badge variant="outline" className="text-xs">
                {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {project.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                  <div className="flex-shrink-0">
                    {milestone.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {milestone.status === 'in-progress' && <PlayCircle className="w-4 h-4 text-blue-600" />}
                    {milestone.status === 'pending' && <Clock className="w-4 h-4 text-yellow-600" />}
                    {milestone.status === 'overdue' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">{milestone.date}</p>
                  </div>
                  <Badge className={`text-xs ${getMilestoneStatusColor(milestone.status)}`}>
                    {milestone.status}
                  </Badge>
                  {milestone.estimatedHours && (
                    <div className="text-xs text-muted-foreground">
                      {milestone.actualHours || 0}h / {milestone.estimatedHours}h
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="space-y-2">
            <h5 className="font-medium text-sm text-foreground">Team</h5>
            <div className="flex items-center space-x-2">
              {project.team.map((member, index) => (
                <Avatar key={index} className="w-8 h-8">
                  <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {member.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <TooltipProvider>
      <Card className="p-6 border-0 shadow-xl" style={{ 
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
        border: '1px solid #BAE6FD'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Project Timeline & Progress</h3>
              <p className="text-xs text-muted-foreground">Track project milestones and progress</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="tasks-at-risk"
                checked={filters.showTasksAtRisk}
                onCheckedChange={(checked) => handleFilterChange('showTasksAtRisk', checked)}
              />
              <Label htmlFor="tasks-at-risk" className="text-sm">Show Tasks at Risk</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddProject}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExport}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-medium">Priority</Label>
            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-medium">View</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant={view === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('timeline')}
              >
                Timeline
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('list')}
              >
                List
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-medium">Search</Label>
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-6">
          {filteredProjects.map((project) => renderProjectCard(project))}
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default ProjectTimeline; 