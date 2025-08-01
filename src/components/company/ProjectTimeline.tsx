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
  User,
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
  Trash2 as Trash2Icon10,
  X
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
import { CommonDialog, CommonInput, CommonSelect, CommonTextarea, CommonFormGrid, CommonFormActions, CommonButton } from "@/components/ui/common-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
  isAtRisk: boolean;
  tags: string[];
}

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

// Mock task data for each project
const mockTasks: { [projectId: number]: Task[] } = {
  1: [ // Mobile App Redesign
    {
      id: 1,
      title: "UI Design Implementation",
      description: "Implement the new UI design components and layouts",
      status: "in-progress",
      priority: "high",
      assignee: "Sarah Johnson",
      dueDate: "2024-02-20",
      estimatedHours: 16,
      actualHours: 12,
      isAtRisk: true,
      tags: ["design", "ui"]
    },
    {
      id: 2,
      title: "Performance Optimization",
      description: "Optimize app performance and reduce loading times",
      status: "todo",
      priority: "high",
      assignee: "Mike Chen",
      dueDate: "2024-02-25",
      estimatedHours: 20,
      actualHours: 0,
      isAtRisk: true,
      tags: ["performance", "optimization"]
    },
    {
      id: 3,
      title: "User Testing",
      description: "Conduct user testing sessions and gather feedback",
      status: "todo",
      priority: "medium",
      assignee: "Alex Rodriguez",
      dueDate: "2024-03-01",
      estimatedHours: 12,
      actualHours: 0,
      isAtRisk: true,
      tags: ["testing", "ux"]
    },
    {
      id: 4,
      title: "Documentation Update",
      description: "Update technical documentation for the new features",
      status: "completed",
      priority: "low",
      assignee: "Sarah Johnson",
      dueDate: "2024-02-15",
      estimatedHours: 8,
      actualHours: 8,
      isAtRisk: false,
      tags: ["documentation"]
    }
  ],
  2: [ // E-commerce Platform
    {
      id: 1,
      title: "Payment Gateway Integration",
      description: "Integrate multiple payment gateways (Stripe, PayPal)",
      status: "in-progress",
      priority: "critical",
      assignee: "David Kim",
      dueDate: "2024-03-10",
      estimatedHours: 24,
      actualHours: 16,
      isAtRisk: true,
      tags: ["payment", "integration"]
    },
    {
      id: 2,
      title: "Inventory Management System",
      description: "Build inventory tracking and management features",
      status: "in-progress",
      priority: "high",
      assignee: "Emma Wilson",
      dueDate: "2024-03-15",
      estimatedHours: 32,
      actualHours: 20,
      isAtRisk: true,
      tags: ["inventory", "backend"]
    },
    {
      id: 3,
      title: "Security Audit",
      description: "Conduct comprehensive security audit and fix vulnerabilities",
      status: "todo",
      priority: "critical",
      assignee: "David Kim",
      dueDate: "2024-03-20",
      estimatedHours: 16,
      actualHours: 0,
      isAtRisk: true,
      tags: ["security", "audit"]
    },
    {
      id: 4,
      title: "Mobile Responsive Design",
      description: "Ensure the platform works perfectly on mobile devices",
      status: "todo",
      priority: "high",
      assignee: "Emma Wilson",
      dueDate: "2024-03-25",
      estimatedHours: 20,
      actualHours: 0,
      isAtRisk: true,
      tags: ["mobile", "responsive"]
    },
    {
      id: 5,
      title: "API Documentation",
      description: "Create comprehensive API documentation for developers",
      status: "completed",
      priority: "medium",
      assignee: "John Smith",
      dueDate: "2024-02-28",
      estimatedHours: 12,
      actualHours: 12,
      isAtRisk: false,
      tags: ["api", "documentation"]
    }
  ],
  3: [ // Design System
    {
      id: 1,
      title: "Component Library Review",
      description: "Final review and approval of all design components",
      status: "in-progress",
      priority: "high",
      assignee: "Alex Rodriguez",
      dueDate: "2024-02-25",
      estimatedHours: 8,
      actualHours: 6,
      isAtRisk: true,
      tags: ["components", "review"]
    },
    {
      id: 2,
      title: "Design Tokens Implementation",
      description: "Implement design tokens for consistent theming",
      status: "completed",
      priority: "medium",
      assignee: "Sarah Johnson",
      dueDate: "2024-02-20",
      estimatedHours: 12,
      actualHours: 12,
      isAtRisk: false,
      tags: ["tokens", "theming"]
    },
    {
      id: 3,
      title: "Accessibility Audit",
      description: "Ensure all components meet accessibility standards",
      status: "completed",
      priority: "medium",
      assignee: "Alex Rodriguez",
      dueDate: "2024-02-18",
      estimatedHours: 10,
      actualHours: 10,
      isAtRisk: false,
      tags: ["accessibility", "audit"]
    }
  ],
  4: [ // Marketing Website
    {
      id: 1,
      title: "Homepage Design",
      description: "Create compelling homepage with lead capture forms",
      status: "completed",
      priority: "high",
      assignee: "Emma Wilson",
      dueDate: "2024-02-20",
      estimatedHours: 16,
      actualHours: 16,
      isAtRisk: false,
      tags: ["design", "homepage"]
    },
    {
      id: 2,
      title: "SEO Optimization",
      description: "Implement SEO best practices and meta tags",
      status: "in-progress",
      priority: "medium",
      assignee: "David Kim",
      dueDate: "2024-03-10",
      estimatedHours: 12,
      actualHours: 8,
      isAtRisk: false,
      tags: ["seo", "optimization"]
    },
    {
      id: 3,
      title: "Content Creation",
      description: "Write compelling copy for all website pages",
      status: "todo",
      priority: "medium",
      assignee: "Emma Wilson",
      dueDate: "2024-03-15",
      estimatedHours: 20,
      actualHours: 0,
      isAtRisk: false,
      tags: ["content", "copywriting"]
    }
  ]
};

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
  },
  {
    id: 4,
    name: "Marketing Website",
    progress: 60,
    startDate: "2024-02-01",
    endDate: "2024-03-30",
    status: "active",
    priority: "medium",
    description: "Create a new marketing website with lead generation and analytics",
    team: ["Emma Wilson", "David Kim"],
    totalTasks: 25,
    completedTasks: 15,
    tasksAtRisk: 0,
    budget: 30000,
    spentBudget: 18000,
    tags: ["marketing", "website", "seo"],
    milestones: [
      { id: 1, title: "Design & Wireframes", status: "completed", date: "2024-02-10", estimatedHours: 40, actualHours: 38 },
      { id: 2, title: "Development", status: "in-progress", date: "2024-02-25", estimatedHours: 80, actualHours: 45 },
      { id: 3, title: "Content Creation", status: "pending", date: "2024-03-15", estimatedHours: 60, actualHours: 0 },
      { id: 4, title: "Launch & SEO", status: "pending", date: "2024-03-30", estimatedHours: 40, actualHours: 0 }
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
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    startDate: '',
    endDate: '',
    budget: '',
    spentBudget: '',
    totalTasks: '',
    completedTasks: '',
    tasksAtRisk: '',
    team: '',
    tags: ''
  });

  // Milestone management
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    date: '',
    status: '',
    estimatedHours: '',
    actualHours: '',
    description: '',
    assignee: ''
  });
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [selectedProjectForMilestone, setSelectedProjectForMilestone] = useState<Project | null>(null);
  
  // Team member management
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [selectedProjectForTeam, setSelectedProjectForTeam] = useState<Project | null>(null);
  const [newTeamMember, setNewTeamMember] = useState('');
  
  // Tasks modal
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedProjectForTasks, setSelectedProjectForTasks] = useState<Project | null>(null);
  const [taskFilter, setTaskFilter] = useState<'all' | 'at-risk' | 'completed' | 'in-progress' | 'todo'>('all');

  const handleFilterChange = (key: string, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters as Record<string, string | boolean>);
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
    setShowAddModal(true);
  };

  const handleProjectFormChange = (field: string, value: string) => {
    setProjectForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProjectSubmit = () => {
    const newProject: Project = {
      id: Math.max(...projects.map(p => p.id)) + 1,
      name: projectForm.name,
      description: projectForm.description,
      status: projectForm.status as 'active' | 'completed' | 'on-hold' | 'cancelled',
      priority: projectForm.priority as 'high' | 'medium' | 'low',
      startDate: projectForm.startDate,
      endDate: projectForm.endDate,
      progress: projectForm.completedTasks && projectForm.totalTasks 
        ? (parseInt(projectForm.completedTasks) / parseInt(projectForm.totalTasks)) * 100 
        : 0,
      totalTasks: parseInt(projectForm.totalTasks) || 0,
      completedTasks: parseInt(projectForm.completedTasks) || 0,
      tasksAtRisk: parseInt(projectForm.tasksAtRisk) || 0,
      team: projectForm.team ? projectForm.team.split(',').map(t => t.trim()) : [],
      budget: projectForm.budget ? parseFloat(projectForm.budget) : undefined,
      spentBudget: projectForm.spentBudget ? parseFloat(projectForm.spentBudget) : undefined,
      tags: projectForm.tags ? projectForm.tags.split(',').map(t => t.trim()) : [],
      milestones: []
    };
    
    setProjects(prev => [...prev, newProject]);
    setProjectForm({
      name: '',
      description: '',
      status: '',
      priority: '',
      startDate: '',
      endDate: '',
      budget: '',
      spentBudget: '',
      totalTasks: '',
      completedTasks: '',
      tasksAtRisk: '',
      team: '',
      tags: ''
    });
    setShowAddModal(false);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description || '',
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget?.toString() || '',
      spentBudget: project.spentBudget?.toString() || '',
      totalTasks: project.totalTasks.toString(),
      completedTasks: project.completedTasks.toString(),
      tasksAtRisk: project.tasksAtRisk.toString(),
      team: project.team.join(', '),
      tags: project.tags?.join(', ') || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    if (!editingProject) return;
    
    const updatedProject: Project = {
      ...editingProject,
      name: projectForm.name,
      description: projectForm.description,
      status: projectForm.status as 'active' | 'completed' | 'on-hold' | 'cancelled',
      priority: projectForm.priority as 'high' | 'medium' | 'low',
      startDate: projectForm.startDate,
      endDate: projectForm.endDate,
      progress: projectForm.completedTasks && projectForm.totalTasks 
        ? (parseInt(projectForm.completedTasks) / parseInt(projectForm.totalTasks)) * 100 
        : 0,
      totalTasks: parseInt(projectForm.totalTasks) || 0,
      completedTasks: parseInt(projectForm.completedTasks) || 0,
      tasksAtRisk: parseInt(projectForm.tasksAtRisk) || 0,
      team: projectForm.team ? projectForm.team.split(',').map(t => t.trim()) : [],
      budget: projectForm.budget ? parseFloat(projectForm.budget) : undefined,
      spentBudget: projectForm.spentBudget ? parseFloat(projectForm.spentBudget) : undefined,
      tags: projectForm.tags ? projectForm.tags.split(',').map(t => t.trim()) : []
    };
    
    setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
    setShowEditModal(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleShareProject = (project: Project) => {
    const shareText = `${project.name}\n${project.description}\nProgress: ${Math.round(project.progress)}%\nStatus: ${project.status}\nPriority: ${project.priority}`;
    
    if (navigator.share) {
      navigator.share({
        title: project.name,
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  // Milestone management functions
  const handleAddMilestone = (project: Project) => {
    setSelectedProjectForMilestone(project);
    setMilestoneForm({
      title: '',
      date: '',
      status: '',
      estimatedHours: '',
      actualHours: '',
      description: '',
      assignee: ''
    });
    setShowMilestoneModal(true);
  };

  const handleMilestoneFormChange = (field: string, value: string) => {
    setMilestoneForm(prev => ({ ...prev, [field]: value }));
  };

  const handleMilestoneSubmit = () => {
    if (!selectedProjectForMilestone) return;

    const newMilestone: Milestone = {
      id: Math.max(...selectedProjectForMilestone.milestones.map(m => m.id)) + 1,
      title: milestoneForm.title,
      date: milestoneForm.date,
      status: milestoneForm.status as 'completed' | 'in-progress' | 'pending' | 'overdue',
      estimatedHours: milestoneForm.estimatedHours ? parseInt(milestoneForm.estimatedHours) : undefined,
      actualHours: milestoneForm.actualHours ? parseInt(milestoneForm.actualHours) : undefined,
      description: milestoneForm.description || undefined,
      assignee: milestoneForm.assignee || undefined
    };

    const updatedProject = {
      ...selectedProjectForMilestone,
      milestones: [...selectedProjectForMilestone.milestones, newMilestone]
    };

    setProjects(prev => prev.map(p => p.id === selectedProjectForMilestone.id ? updatedProject : p));
    setShowMilestoneModal(false);
    setSelectedProjectForMilestone(null);
  };

  const handleEditMilestone = (project: Project, milestone: Milestone) => {
    setSelectedProjectForMilestone(project);
    setEditingMilestone(milestone);
    setMilestoneForm({
      title: milestone.title,
      date: milestone.date,
      status: milestone.status,
      estimatedHours: milestone.estimatedHours?.toString() || '',
      actualHours: milestone.actualHours?.toString() || '',
      description: milestone.description || '',
      assignee: milestone.assignee || ''
    });
    setShowMilestoneModal(true);
  };

  const handleMilestoneEditSubmit = () => {
    if (!selectedProjectForMilestone || !editingMilestone) return;

    const updatedMilestone: Milestone = {
      ...editingMilestone,
      title: milestoneForm.title,
      date: milestoneForm.date,
      status: milestoneForm.status as 'completed' | 'in-progress' | 'pending' | 'overdue',
      estimatedHours: milestoneForm.estimatedHours ? parseInt(milestoneForm.estimatedHours) : undefined,
      actualHours: milestoneForm.actualHours ? parseInt(milestoneForm.actualHours) : undefined,
      description: milestoneForm.description || undefined,
      assignee: milestoneForm.assignee || undefined
    };

    const updatedProject = {
      ...selectedProjectForMilestone,
      milestones: selectedProjectForMilestone.milestones.map(m => 
        m.id === editingMilestone.id ? updatedMilestone : m
      )
    };

    setProjects(prev => prev.map(p => p.id === selectedProjectForMilestone.id ? updatedProject : p));
    setShowMilestoneModal(false);
    setSelectedProjectForMilestone(null);
    setEditingMilestone(null);
  };

  const handleDeleteMilestone = (projectId: number, milestoneId: number) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, milestones: project.milestones.filter(m => m.id !== milestoneId) }
        : project
    ));
  };

  const handleAddTeamMember = (project: Project) => {
    setSelectedProjectForTeam(project);
    setNewTeamMember('');
    setShowAddTeamMemberModal(true);
  };

  const handleAddTeamMemberSubmit = () => {
    if (!selectedProjectForTeam || !newTeamMember.trim()) return;
    
    setProjects(prev => prev.map(project => {
      if (project.id === selectedProjectForTeam.id) {
        return {
          ...project,
          team: [...project.team, newTeamMember.trim()]
        };
      }
      return project;
    }));
    
    setNewTeamMember('');
    setShowAddTeamMemberModal(false);
    setSelectedProjectForTeam(null);
  };

  const handleRemoveTeamMember = (projectId: number, memberName: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          team: project.team.filter(member => member !== memberName)
        };
      }
      return project;
    }));
  };

  const handleViewTasks = (project: Project) => {
    setSelectedProjectForTasks(project);
    setTaskFilter('all');
    setShowTasksModal(true);
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
      <Card key={project.id} className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:rounded-3xl hover:shadow-blue-500/25 hover:shadow-xl hover:scale-105 transform-gpu">
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
                <DropdownMenuItem onClick={() => handleViewDetails(project)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewTasks(project)}>
                  <FileText className="w-4 h-4 mr-2" />
                  View All Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditProject(project)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddMilestone(project)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShareProject(project)}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
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
              <h5 className="font-medium text-sm text-foreground">Project Phases</h5>
              <Badge variant="outline" className="text-xs">
                {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {project.milestones.slice(0, 4).map((milestone) => (
                <div key={milestone.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
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
              {project.milestones.length > 4 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{project.milestones.length - 4} more phases
                </div>
              )}
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-blue-100"
                onClick={() => handleAddTeamMember(project)}
              >
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

  const renderProjectListItem = (project: Project) => {
    const daysRemaining = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;
    
    return (
      <Card key={project.id} className="p-4 hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {project.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-foreground text-base truncate">{project.name}</h4>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <Badge className={getPriorityColor(project.priority)}>
                  {project.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate mb-2">{project.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{project.team.length} members</span>
                </div>
                {project.budget && (
                  <div className="flex items-center space-x-1">
                    <span>${project.spentBudget?.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">{Math.round(project.progress)}%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${project.tasksAtRisk > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {project.tasksAtRisk}
              </div>
              <div className="text-xs text-muted-foreground">At Risk</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleViewDetails(project)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewTasks(project)}>
                  <FileText className="w-4 h-4 mr-2" />
                  View All Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditProject(project)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddMilestone(project)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShareProject(project)}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mt-3 space-y-2">
          <h5 className="font-medium text-sm text-foreground">Team</h5>
          <div className="flex items-center space-x-2">
            {project.team.map((member, index) => (
              <Avatar key={index} className="w-6 h-6">
                <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {member.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-blue-100"
              onClick={() => handleAddTeamMember(project)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="mt-3 flex items-center space-x-2">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
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
        {view === 'timeline' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => renderProjectCard(project))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project) => renderProjectListItem(project))}
          </div>
        )}

        {/* Add Project Modal */}
        <CommonDialog
          open={showAddModal}
          onOpenChange={setShowAddModal}
          title="Add New Project"
          subtitle="Create a new project with timeline and milestones"
          icon={Target}
          maxWidth="max-w-6xl"
        >
          <div className="space-y-6">
            <CommonFormGrid cols={2}>
              <CommonInput
                id="name"
                label="Project Name"
                value={projectForm.name}
                onChange={(value) => handleProjectFormChange('name', value)}
                placeholder="Enter project name"
                required
              />
              <CommonSelect
                id="status"
                label="Status"
                value={projectForm.status}
                onValueChange={(value) => handleProjectFormChange('status', value)}
                placeholder="Select status"
                required
                options={[
                  { value: "active", label: "Active" },
                  { value: "completed", label: "Completed" },
                  { value: "on-hold", label: "On Hold" },
                  { value: "cancelled", label: "Cancelled" }
                ]}
              />
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800">
                      <Calendar className="w-4 h-4 mr-2" />
                      {projectForm.startDate ? format(new Date(projectForm.startDate), "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={projectForm.startDate ? new Date(projectForm.startDate) : undefined}
                      onSelect={(date) => handleProjectFormChange('startDate', date ? format(date, 'yyyy-MM-dd') : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800">
                      <Calendar className="w-4 h-4 mr-2" />
                      {projectForm.endDate ? format(new Date(projectForm.endDate), "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={projectForm.endDate ? new Date(projectForm.endDate) : undefined}
                      onSelect={(date) => handleProjectFormChange('endDate', date ? format(date, 'yyyy-MM-dd') : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <CommonSelect
                id="priority"
                label="Priority"
                value={projectForm.priority}
                onValueChange={(value) => handleProjectFormChange('priority', value)}
                placeholder="Select priority"
                required
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" }
                ]}
              />
              <CommonInput
                id="budget"
                label="Budget"
                value={projectForm.budget}
                onChange={(value) => handleProjectFormChange('budget', value)}
                placeholder="50000"
                type="number"
              />
              <CommonInput
                id="spentBudget"
                label="Spent Budget"
                value={projectForm.spentBudget}
                onChange={(value) => handleProjectFormChange('spentBudget', value)}
                placeholder="37500"
                type="number"
              />
              <CommonInput
                id="totalTasks"
                label="Total Tasks"
                value={projectForm.totalTasks}
                onChange={(value) => handleProjectFormChange('totalTasks', value)}
                placeholder="45"
                type="number"
                required
              />
              <CommonInput
                id="completedTasks"
                label="Completed Tasks"
                value={projectForm.completedTasks}
                onChange={(value) => handleProjectFormChange('completedTasks', value)}
                placeholder="34"
                type="number"
                required
              />
              <CommonInput
                id="tasksAtRisk"
                label="Tasks at Risk"
                value={projectForm.tasksAtRisk}
                onChange={(value) => handleProjectFormChange('tasksAtRisk', value)}
                placeholder="3"
                type="number"
              />
              <CommonInput
                id="team"
                label="Team Members"
                value={projectForm.team}
                onChange={(value) => handleProjectFormChange('team', value)}
                placeholder="John Doe, Jane Smith, Mike Johnson"
              />
              <CommonInput
                id="tags"
                label="Tags"
                value={projectForm.tags}
                onChange={(value) => handleProjectFormChange('tags', value)}
                placeholder="mobile, design, ux"
              />
            </CommonFormGrid>
            
            <CommonTextarea
              id="description"
              label="Description"
              value={projectForm.description}
              onChange={(value) => handleProjectFormChange('description', value)}
              placeholder="Describe the project in detail..."
              required
              rows={4}
            />
            
            <CommonFormActions>
              <CommonButton
                variant="outline"
                onClick={() => {
                  setProjectForm({
                    name: '',
                    description: '',
                    status: '',
                    priority: '',
                    startDate: '',
                    endDate: '',
                    budget: '',
                    spentBudget: '',
                    totalTasks: '',
                    completedTasks: '',
                    tasksAtRisk: '',
                    team: '',
                    tags: ''
                  });
                  setShowAddModal(false);
                }}
              >
                Cancel
              </CommonButton>
              <CommonButton
                onClick={handleAddProjectSubmit}
              >
                Add Project
              </CommonButton>
            </CommonFormActions>
          </div>
        </CommonDialog>

        {/* Project Details Modal */}
        <CommonDialog
          open={showProjectDetails}
          onOpenChange={setShowProjectDetails}
          title={selectedProject?.name || "Project Details"}
          subtitle="View complete project information"
          icon={Eye}
          maxWidth="max-w-4xl"
        >
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <p className="text-sm">{selectedProject.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                  <p className="text-sm">{selectedProject.priority}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                  <p className="text-sm">{new Date(selectedProject.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                  <p className="text-sm">{new Date(selectedProject.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Progress</Label>
                  <p className="text-sm">{Math.round(selectedProject.progress)}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tasks at Risk</Label>
                  <p className="text-sm">{selectedProject.tasksAtRisk}</p>
                </div>
                {selectedProject.budget && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                    <p className="text-sm">${selectedProject.spentBudget?.toLocaleString()} / ${selectedProject.budget.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Team Members</Label>
                  <p className="text-sm">{selectedProject.team.length} members</p>
                </div>
              </div>
              
              {/* Team Members Section */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Team Members</Label>
                <div className="space-y-2 mt-2">
                  {selectedProject.team.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {selectedProject.team.map((member, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {member.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">{member}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3 text-gray-500">
                      <Users className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                      <p className="text-xs">No team members assigned</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm mt-1">{selectedProject.description}</p>
              </div>
              
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProject.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <CommonFormActions>
                <CommonButton
                  variant="outline"
                  onClick={() => setShowProjectDetails(false)}
                >
                  Close
                </CommonButton>
                <CommonButton
                  onClick={() => {
                    setShowProjectDetails(false);
                    handleEditProject(selectedProject);
                  }}
                >
                  Edit Project
                </CommonButton>
              </CommonFormActions>
            </div>
          )}
        </CommonDialog>

        {/* Edit Project Modal */}
        <CommonDialog
          open={showEditModal}
          onOpenChange={setShowEditModal}
          title="Edit Project"
          subtitle="Modify project information"
          icon={Edit}
          maxWidth="max-w-6xl"
        >
          <div className="space-y-6">
            <CommonFormGrid cols={2}>
              <CommonInput
                id="name"
                label="Project Name"
                value={projectForm.name}
                onChange={(value) => handleProjectFormChange('name', value)}
                placeholder="Enter project name"
                required
              />
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800">
                      <Calendar className="w-4 h-4 mr-2" />
                      {projectForm.startDate ? format(new Date(projectForm.startDate), "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={projectForm.startDate ? new Date(projectForm.startDate) : undefined}
                      onSelect={(date) => handleProjectFormChange('startDate', date ? format(date, 'yyyy-MM-dd') : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <CommonSelect
                id="status"
                label="Status"
                value={projectForm.status}
                onValueChange={(value) => handleProjectFormChange('status', value)}
                placeholder="Select status"
                required
                options={[
                  { value: "active", label: "Active" },
                  { value: "completed", label: "Completed" },
                  { value: "on-hold", label: "On Hold" },
                  { value: "cancelled", label: "Cancelled" }
                ]}
              />
              <CommonSelect
                id="priority"
                label="Priority"
                value={projectForm.priority}
                onValueChange={(value) => handleProjectFormChange('priority', value)}
                placeholder="Select priority"
                required
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" }
                ]}
              />
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800">
                      <Calendar className="w-4 h-4 mr-2" />
                      {projectForm.endDate ? format(new Date(projectForm.endDate), "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={projectForm.endDate ? new Date(projectForm.endDate) : undefined}
                      onSelect={(date) => handleProjectFormChange('endDate', date ? format(date, 'yyyy-MM-dd') : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <CommonInput
                id="budget"
                label="Budget"
                value={projectForm.budget}
                onChange={(value) => handleProjectFormChange('budget', value)}
                placeholder="50000"
                type="number"
              />
              <CommonInput
                id="spentBudget"
                label="Spent Budget"
                value={projectForm.spentBudget}
                onChange={(value) => handleProjectFormChange('spentBudget', value)}
                placeholder="37500"
                type="number"
              />
              <CommonInput
                id="totalTasks"
                label="Total Tasks"
                value={projectForm.totalTasks}
                onChange={(value) => handleProjectFormChange('totalTasks', value)}
                placeholder="45"
                type="number"
                required
              />
              <CommonInput
                id="completedTasks"
                label="Completed Tasks"
                value={projectForm.completedTasks}
                onChange={(value) => handleProjectFormChange('completedTasks', value)}
                placeholder="34"
                type="number"
                required
              />
              <CommonInput
                id="tasksAtRisk"
                label="Tasks at Risk"
                value={projectForm.tasksAtRisk}
                onChange={(value) => handleProjectFormChange('tasksAtRisk', value)}
                placeholder="3"
                type="number"
              />
              <CommonInput
                id="team"
                label="Team Members"
                value={projectForm.team}
                onChange={(value) => handleProjectFormChange('team', value)}
                placeholder="John Doe, Jane Smith, Mike Johnson"
              />
              <CommonInput
                id="tags"
                label="Tags"
                value={projectForm.tags}
                onChange={(value) => handleProjectFormChange('tags', value)}
                placeholder="mobile, design, ux"
              />
            </CommonFormGrid>
            
            <CommonTextarea
              id="description"
              label="Description"
              value={projectForm.description}
              onChange={(value) => handleProjectFormChange('description', value)}
              placeholder="Describe the project in detail..."
              required
              rows={4}
            />
            
            <CommonFormActions>
              <CommonButton
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </CommonButton>
              <CommonButton
                onClick={handleEditSubmit}
              >
                Update Project
              </CommonButton>
            </CommonFormActions>
          </div>
        </CommonDialog>

        {/* Milestone Modal */}
        <CommonDialog
          open={showMilestoneModal}
          onOpenChange={setShowMilestoneModal}
          title={editingMilestone ? "Edit Milestone" : "Add New Milestone"}
          subtitle={editingMilestone ? "Modify milestone information" : "Create a new project milestone"}
          icon={Target}
          maxWidth="max-w-6xl"
        >
          <div className="space-y-6">
            <CommonFormGrid cols={2}>
              <CommonInput
                id="title"
                label="Milestone Title"
                value={milestoneForm.title}
                onChange={(value) => handleMilestoneFormChange('title', value)}
                placeholder="e.g., Design Phase, Development Phase"
                required
              />
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">Due Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800">
                      <Calendar className="w-4 h-4 mr-2" />
                      {milestoneForm.date ? format(new Date(milestoneForm.date), "PPP") : "Select due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={milestoneForm.date ? new Date(milestoneForm.date) : undefined}
                      onSelect={(date) => handleMilestoneFormChange('date', date ? format(date, 'yyyy-MM-dd') : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <CommonSelect
                id="status"
                label="Status"
                value={milestoneForm.status}
                onValueChange={(value) => handleMilestoneFormChange('status', value)}
                placeholder="Select status"
                required
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "completed", label: "Completed" },
                  { value: "overdue", label: "Overdue" }
                ]}
              />
              <CommonInput
                id="assignee"
                label="Assignee"
                value={milestoneForm.assignee}
                onChange={(value) => handleMilestoneFormChange('assignee', value)}
                placeholder="John Doe"
              />
              <CommonInput
                id="estimatedHours"
                label="Estimated Hours"
                value={milestoneForm.estimatedHours}
                onChange={(value) => handleMilestoneFormChange('estimatedHours', value)}
                placeholder="80"
                type="number"
              />
              <CommonInput
                id="actualHours"
                label="Actual Hours"
                value={milestoneForm.actualHours}
                onChange={(value) => handleMilestoneFormChange('actualHours', value)}
                placeholder="75"
                type="number"
              />
            </CommonFormGrid>
            
            <CommonTextarea
              id="description"
              label="Description"
              value={milestoneForm.description}
              onChange={(value) => handleMilestoneFormChange('description', value)}
              placeholder="Describe the milestone in detail..."
              rows={3}
            />
            
            <CommonFormActions>
              <CommonButton
                variant="outline"
                onClick={() => {
                  setMilestoneForm({
                    title: '',
                    date: '',
                    status: '',
                    estimatedHours: '',
                    actualHours: '',
                    description: '',
                    assignee: ''
                  });
                  setShowMilestoneModal(false);
                  setSelectedProjectForMilestone(null);
                  setEditingMilestone(null);
                }}
              >
                Cancel
              </CommonButton>
              <CommonButton
                onClick={editingMilestone ? handleMilestoneEditSubmit : handleMilestoneSubmit}
              >
                {editingMilestone ? "Update Milestone" : "Add Milestone"}
              </CommonButton>
            </CommonFormActions>
          </div>
        </CommonDialog>

        {/* Add Team Member Modal */}
        <CommonDialog
          open={showAddTeamMemberModal}
          onOpenChange={setShowAddTeamMemberModal}
          title="Add Team Member"
          subtitle="Add a new member to the project team"
          icon={UserPlus}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <CommonInput
              id="teamMember"
              label="Team Member Name"
              value={newTeamMember}
              onChange={(value) => setNewTeamMember(value)}
              placeholder="Enter team member name"
              required
            />
            
            <CommonFormActions>
              <CommonButton
                variant="outline"
                onClick={() => {
                  setShowAddTeamMemberModal(false);
                  setNewTeamMember('');
                  setSelectedProjectForTeam(null);
                }}
              >
                Cancel
              </CommonButton>
              <CommonButton
                onClick={handleAddTeamMemberSubmit}
                disabled={!newTeamMember.trim()}
              >
                Add Member
              </CommonButton>
            </CommonFormActions>
          </div>
        </CommonDialog>

        {/* Tasks Modal */}
        <CommonDialog
          open={showTasksModal}
          onOpenChange={setShowTasksModal}
          title={selectedProjectForTasks?.name || "Project Tasks"}
          subtitle="View and manage all project tasks"
          icon={FileText}
          maxWidth="max-w-6xl"
        >
          <div className="space-y-6">
            {/* Filter Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={taskFilter} onValueChange={(value) => setTaskFilter(value as 'all' | 'at-risk' | 'completed' | 'in-progress' | 'todo')}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="at-risk">Tasks at Risk</SelectItem>
                    <SelectItem value="completed">Completed Tasks</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  {selectedProjectForTasks ? mockTasks[selectedProjectForTasks.id]?.length || 0 : 0} Total Tasks
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {selectedProjectForTasks ? mockTasks[selectedProjectForTasks.id]?.filter(t => t.isAtRisk).length || 0 : 0} At Risk
                </Badge>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedProjectForTasks && mockTasks[selectedProjectForTasks.id] ? (
                mockTasks[selectedProjectForTasks.id]
                  .filter(task => {
                    if (taskFilter === 'all') return true;
                    if (taskFilter === 'at-risk') return task.isAtRisk;
                    if (taskFilter === 'completed') return task.status === 'completed';
                    if (taskFilter === 'in-progress') return task.status === 'in-progress';
                    if (taskFilter === 'todo') return task.status === 'todo';
                    return true;
                  })
                  .map((task) => (
                    <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold text-foreground">{task.title}</h4>
                            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                              {task.status}
                            </Badge>
                            {task.isAtRisk && (
                              <Badge variant="destructive" className="text-xs">
                                At Risk
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{task.assignee}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{task.actualHours || 0}h / {task.estimatedHours}h</span>
                            </div>
                          </div>
                          
                          {task.tags.length > 0 && (
                            <div className="flex items-center space-x-2">
                              {task.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks found for this project.</p>
                </div>
              )}
            </div>
          </div>
        </CommonDialog>
      </Card>
    </TooltipProvider>
  );
};

export default ProjectTimeline; 