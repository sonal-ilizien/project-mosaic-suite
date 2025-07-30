import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Users, 
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  Plus,
  Star,
  Heart,
  Zap,
  Target,
  CheckCircle,
  Clock,
  User,
  Building,
  Briefcase,
  Eye,
  Edit,
  Trash2,
  Archive,
  GitBranch,
  GitCommit,
  GitPullRequest,
  FileText,
  Link,
  Tag,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Activity,
  Bell,
  ThumbsUp,
  AlertCircle,
  CheckSquare,
  Square,
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
  Home,
  FolderOpen,
  FolderClosed,
  File,
  FileText as FileTextIcon,
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
  Zap as ZapIcon,
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
  MessageCircle as MessageCircleIcon10
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
import {
  CommonDialog,
  CommonInput,
  CommonSelect,
  CommonTextarea,
  CommonFormGrid,
  CommonFormActions,
  CommonButton
} from "@/components/ui/common-dialog";

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  employee: string;
  department: string;
  project: string;
  badge: string;
  type: string;
  points?: number;
  category?: string;
  details?: string;
  approvedBy?: string;
  approvedDate?: string;
  tags?: string[];
}

interface LeaderboardMember {
  rank: number;
  name: string;
  department: string;
  achievements: number;
  avatar: string;
  points: number;
  change: string;
  email?: string;
  position?: string;
  joinDate?: string;
  achievementsList?: Achievement[];
  skills?: string[];
  bio?: string;
}

interface AchievementsCornerProps {
  onExport?: () => void;
  onAddAchievement?: () => void;
  onFilterChange?: (filters: Record<string, string>) => void;
}

const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: "Employee of the Month",
    description: "Outstanding performance in Q1 2024 with exceptional project delivery and team collaboration",
    date: "2024-01-15",
    employee: "Sarah Johnson",
    department: "Engineering",
    project: "Mobile App Redesign",
    badge: "🏆",
    type: "recognition",
    points: 100,
    category: "Excellence",
    details: "Sarah demonstrated exceptional leadership in the Mobile App Redesign project, delivering ahead of schedule while maintaining high code quality standards. Her innovative approach to problem-solving and mentorship of junior developers has significantly improved team productivity.",
    approvedBy: "John Smith",
    approvedDate: "2024-01-15",
    tags: ["leadership", "innovation", "mentorship"]
  },
  {
    id: 2,
    title: "Project Milestone Reached",
    description: "Successfully completed Phase 2 of E-commerce Platform ahead of schedule",
    date: "2024-01-20",
    employee: "Mike Chen",
    department: "Development",
    project: "E-commerce Platform",
    badge: "🎯",
    type: "milestone",
    points: 75,
    category: "Delivery",
    details: "Mike led the development team to complete Phase 2 of the E-commerce Platform 2 weeks ahead of schedule. His technical expertise and project management skills ensured smooth delivery with zero critical bugs.",
    approvedBy: "Sarah Johnson",
    approvedDate: "2024-01-20",
    tags: ["delivery", "technical", "project-management"]
  },
  {
    id: 3,
    title: "Innovation Award",
    description: "Best UI/UX Design Implementation with 40% improvement in user engagement",
    date: "2024-01-18",
    employee: "Alex Rodriguez",
    department: "Design",
    project: "Design System",
    badge: "💡",
    type: "innovation",
    points: 90,
    category: "Innovation",
    details: "Alex's innovative design approach resulted in a 40% improvement in user engagement metrics. The new design system has been adopted across all products, improving consistency and user experience.",
    approvedBy: "Emma Wilson",
    approvedDate: "2024-01-18",
    tags: ["design", "innovation", "user-experience"]
  },
  {
    id: 4,
    title: "Team Collaboration Excellence",
    description: "Cross-functional team collaboration award for successful product launch",
    date: "2024-01-22",
    employee: "Team Alpha",
    department: "All Departments",
    project: "Company-wide Initiative",
    badge: "🤝",
    type: "collaboration",
    points: 85,
    category: "Teamwork",
    details: "Team Alpha demonstrated exceptional collaboration across departments, successfully launching a major product initiative. The team's ability to work together seamlessly resulted in a successful launch with positive customer feedback.",
    approvedBy: "CEO",
    approvedDate: "2024-01-22",
    tags: ["collaboration", "teamwork", "launch"]
  },
  {
    id: 5,
    title: "Customer Satisfaction Champion",
    description: "Achieved 98% customer satisfaction score for Q1 support tickets",
    date: "2024-01-25",
    employee: "Emma Wilson",
    department: "Customer Success",
    project: "Support Optimization",
    badge: "⭐",
    type: "customer",
    points: 95,
    category: "Service",
    details: "Emma achieved an outstanding 98% customer satisfaction score for Q1 support tickets. Her dedication to customer success and innovative support processes have set new standards for customer service excellence.",
    approvedBy: "David Kim",
    approvedDate: "2024-01-25",
    tags: ["customer-success", "support", "excellence"]
  }
];

const mockLeaderboard: LeaderboardMember[] = [
  { 
    rank: 1, 
    name: "Sarah Johnson", 
    department: "Engineering", 
    achievements: 8, 
    avatar: "SJ", 
    points: 850, 
    change: "+150",
    email: "sarah.johnson@company.com",
    position: "Senior Software Engineer",
    joinDate: "2022-03-15",
    skills: ["React", "TypeScript", "Node.js", "Leadership", "Mentoring"],
    bio: "Experienced software engineer with 5+ years in full-stack development. Passionate about clean code and mentoring junior developers."
  },
  { 
    rank: 2, 
    name: "Mike Chen", 
    department: "Development", 
    achievements: 6, 
    avatar: "MC", 
    points: 720, 
    change: "+120",
    email: "mike.chen@company.com",
    position: "Lead Developer",
    joinDate: "2021-08-20",
    skills: ["Python", "Django", "AWS", "Project Management", "Agile"],
    bio: "Lead developer with expertise in backend systems and cloud architecture. Strong focus on scalable solutions and team productivity."
  },
  { 
    rank: 3, 
    name: "Alex Rodriguez", 
    department: "Design", 
    achievements: 5, 
    avatar: "AR", 
    points: 680, 
    change: "+80",
    email: "alex.rodriguez@company.com",
    position: "Senior UI/UX Designer",
    joinDate: "2022-01-10",
    skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems"],
    bio: "Creative designer with a passion for user-centered design. Specializes in creating intuitive and beautiful user experiences."
  },
  { 
    rank: 4, 
    name: "Emma Wilson", 
    department: "Customer Success", 
    achievements: 4, 
    avatar: "EW", 
    points: 650, 
    change: "+100",
    email: "emma.wilson@company.com",
    position: "Customer Success Manager",
    joinDate: "2021-11-05",
    skills: ["Customer Relations", "Problem Solving", "Product Knowledge", "Communication", "Analytics"],
    bio: "Dedicated customer success professional committed to ensuring customer satisfaction and product adoption."
  },
  { 
    rank: 5, 
    name: "David Kim", 
    department: "Marketing", 
    achievements: 3, 
    avatar: "DK", 
    points: 580, 
    change: "+60",
    email: "david.kim@company.com",
    position: "Marketing Manager",
    joinDate: "2022-06-12",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics", "Campaign Management"],
    bio: "Results-driven marketing professional with expertise in digital marketing and brand development."
  }
];

const AchievementsCorner: React.FC<AchievementsCornerProps> = ({ 
  onExport, 
  onAddAchievement, 
  onFilterChange 
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [leaderboard, setLeaderboard] = useState<LeaderboardMember[]>(mockLeaderboard);
  const [filters, setFilters] = useState({
    department: 'all',
    project: 'all',
    month: 'all',
    category: 'all'
  });
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState<LeaderboardMember | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAchievementDetails, setShowAchievementDetails] = useState<Achievement | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  
  // Form state for Add Achievement
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    employee: '',
    department: '',
    category: '',
    points: '',
    project: '',
    description: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleExport = (format: 'json' | 'csv' | 'pdf') => {
    const data = {
      achievements,
      leaderboard,
      filters,
      exportDate: new Date().toISOString()
    };
    
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch (format) {
      case 'json': {
        content = JSON.stringify(data, null, 2);
        filename = `achievements-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      }
      case 'csv': {
        const csvContent = [
          ['Title', 'Employee', 'Department', 'Project', 'Category', 'Points', 'Date'],
          ...achievements.map(a => [
            a.title,
            a.employee,
            a.department,
            a.project,
            a.category || '',
            a.points?.toString() || '0',
            a.date
          ])
        ].map(row => row.join(',')).join('\n');
        content = csvContent;
        filename = `achievements-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
        break;
      }
      case 'pdf': {
        // For PDF, we'll create a simple text representation
        content = `Achievements Report - ${new Date().toLocaleDateString()}\n\n` +
                 achievements.map(a => 
                   `${a.title} - ${a.employee} (${a.department}) - ${a.points} points`
                 ).join('\n');
        filename = `achievements-${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = 'text/plain';
        break;
      }
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onExport?.();
  };

  const handleAddAchievement = () => {
    setShowAddModal(true);
  };

  const handleViewAllUsers = () => {
    setShowAllUsers(true);
  };

  const handleUserClick = (user: LeaderboardMember) => {
    setShowUserDetails(user);
  };

  const handleAchievementFormChange = (field: string, value: string) => {
    setAchievementForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAchievementSubmit = () => {
    // Create new achievement object
    const newAchievement: Achievement = {
      id: Date.now(), // Simple ID generation
      title: achievementForm.title,
      description: achievementForm.description,
      date: new Date().toISOString().split('T')[0], // Current date
      employee: achievementForm.employee,
      department: achievementForm.department,
      project: achievementForm.project,
      badge: '🏆', // Default badge
      type: 'recognition', // Default type
      points: parseInt(achievementForm.points) || 0,
      category: achievementForm.category,
      details: achievementForm.description,
      approvedBy: 'Current User',
      approvedDate: new Date().toISOString().split('T')[0],
      tags: [achievementForm.category, achievementForm.department]
    };
    
    // Add to achievements list
    setAchievements(prev => [newAchievement, ...prev]);
    
    console.log('New achievement added:', newAchievement);
    
    // Reset form
    setAchievementForm({
      title: '',
      employee: '',
      department: '',
      category: '',
      points: '',
      project: '',
      description: ''
    });
    
    setShowAddModal(false);
  };

  const handleViewDetails = (achievement: Achievement) => {
    setShowAchievementDetails(achievement);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setAchievementForm({
      title: achievement.title,
      employee: achievement.employee,
      department: achievement.department,
      category: achievement.category || '',
      points: achievement.points?.toString() || '',
      project: achievement.project,
      description: achievement.description
    });
    setShowEditModal(true);
  };

  const handleShareAchievement = (achievement: Achievement) => {
    // Create shareable text
    const shareText = `${achievement.title} - ${achievement.employee} (${achievement.department}) - ${achievement.points} points`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Achievement Shared',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        console.log('Achievement details copied to clipboard');
        // You could add a toast notification here
      });
    }
  };

  const handleDeleteAchievement = (achievementId: number) => {
    setAchievements(prev => prev.filter(a => a.id !== achievementId));
    console.log('Achievement deleted:', achievementId);
  };

  const handleEditSubmit = () => {
    if (!editingAchievement) return;
    
    const updatedAchievement: Achievement = {
      ...editingAchievement,
      title: achievementForm.title,
      description: achievementForm.description,
      employee: achievementForm.employee,
      department: achievementForm.department,
      project: achievementForm.project,
      points: parseInt(achievementForm.points) || 0,
      category: achievementForm.category,
      details: achievementForm.description,
      tags: [achievementForm.category, achievementForm.department]
    };
    
    setAchievements(prev => prev.map(a => a.id === editingAchievement.id ? updatedAchievement : a));
    
    // Reset form and close modal
    setAchievementForm({
      title: '',
      employee: '',
      department: '',
      category: '',
      points: '',
      project: '',
      description: ''
    });
    setEditingAchievement(null);
    setShowEditModal(false);
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'recognition':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'milestone':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'innovation':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'collaboration':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'customer':
        return 'bg-gradient-to-r from-indigo-500 to-purple-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Excellence':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Innovation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Teamwork':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Service':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesDepartment = filters.department === 'all' || achievement.department === filters.department;
    const matchesProject = filters.project === 'all' || achievement.project === filters.project;
    const matchesMonth = filters.month === 'all' || achievement.date.startsWith(filters.month);
    const matchesCategory = filters.category === 'all' || achievement.category === filters.category;
    const matchesSearch = achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.employee.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDepartment && matchesProject && matchesMonth && matchesCategory && matchesSearch;
  });

  return (
    <TooltipProvider>
      <Card className="p-6 border-0 shadow-xl h-full" style={{ 
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '1px solid #BFDBFE'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Achievements Corner</h3>
              <p className="text-xs text-muted-foreground">Employee recognition and milestones</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddAchievement}
              className="flex items-center space-x-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Achievement</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Department</Label>
            <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Customer Success">Customer Success</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-medium">Project</Label>
            <Select value={filters.project} onValueChange={(value) => handleFilterChange('project', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="Mobile App Redesign">Mobile App Redesign</SelectItem>
                <SelectItem value="E-commerce Platform">E-commerce Platform</SelectItem>
                <SelectItem value="Design System">Design System</SelectItem>
                <SelectItem value="Support Optimization">Support Optimization</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-medium">Month</Label>
            <Select value={filters.month} onValueChange={(value) => handleFilterChange('month', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="2024-01">January 2024</SelectItem>
                <SelectItem value="2024-02">February 2024</SelectItem>
                <SelectItem value="2024-03">March 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-medium">Category</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Excellence">Excellence</SelectItem>
                <SelectItem value="Delivery">Delivery</SelectItem>
                <SelectItem value="Innovation">Innovation</SelectItem>
                <SelectItem value="Teamwork">Teamwork</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-medium">Search</Label>
            <Input
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('grid')}
              className="transition-all duration-200"
            >
              Grid
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
              className="transition-all duration-200"
            >
              List
            </Button>
          </div>
          <Badge variant="outline" className="text-xs">
            {filteredAchievements.length} achievements
          </Badge>
        </div>

        {/* Achievement Cards */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {filteredAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-4 hover:shadow-lg transition-all duration-300 group border border-gray-200 hover:border-blue-300 hover:rounded-3xl hover:shadow-blue-500/25 hover:shadow-xl hover:scale-105 transform-gpu">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${getAchievementColor(achievement.type)} rounded-lg flex items-center justify-center text-white text-xl shadow-lg transform-gpu`}>
                        {achievement.badge}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{achievement.employee}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                                              <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleViewDetails(achievement)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditAchievement(achievement)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Achievement
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShareAchievement(achievement)}>
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteAchievement(achievement.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getCategoryColor(achievement.category || '')}`}>
                        {achievement.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {achievement.points} pts
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(achievement.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{achievement.department}</span>
                    <span>•</span>
                    <span>{achievement.project}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {filteredAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:rounded-3xl hover:shadow-blue-500/25 hover:shadow-xl hover:scale-105 transform-gpu">
                <div className="flex items-center space-x-4">
                                     <div className={`w-12 h-12 ${getAchievementColor(achievement.type)} rounded-lg flex items-center justify-center text-white text-xl shadow-lg transform-gpu`}>
                     {achievement.badge}
                   </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                      <Badge className={`text-xs ${getCategoryColor(achievement.category || '')}`}>
                        {achievement.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>{achievement.employee}</span>
                        <span>•</span>
                        <span>{achievement.department}</span>
                        <span>•</span>
                        <span>{achievement.project}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {achievement.points} pts
                        </Badge>
                        <span>{new Date(achievement.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Leaderboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">Top Contributors</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewAllUsers}
              className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {leaderboard.map((member) => (
              <div 
                key={member.rank} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group cursor-pointer border border-transparent hover:border-blue-200"
                onClick={() => handleUserClick(member)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md transform-gpu">
                  {member.rank}
                </div>
                <Avatar className="w-10 h-10 shadow-md transform-gpu">
                  <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground group-hover:text-blue-600 transition-colors">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.department}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{member.points} pts</p>
                    <p className="text-xs text-green-600 font-medium">{member.change}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {member.achievements} achievements
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Achievement Modal */}
        <CommonDialog
          open={showAddModal}
          onOpenChange={setShowAddModal}
          title="Add New Achievement"
          subtitle="Recognize an employee's outstanding contribution or milestone"
          icon={Trophy}
          maxWidth="max-w-6xl"
        >
          <div className="space-y-6">
            <CommonFormGrid cols={2}>
              <CommonInput
                id="title"
                label="Achievement Title"
                value={achievementForm.title}
                onChange={(value) => handleAchievementFormChange('title', value)}
                placeholder="Enter achievement title"
                required
              />
              <CommonInput
                id="employee"
                label="Employee Name"
                value={achievementForm.employee}
                onChange={(value) => handleAchievementFormChange('employee', value)}
                placeholder="Enter employee name"
                required
              />
              <CommonSelect
                id="department"
                label="Department"
                value={achievementForm.department}
                onValueChange={(value) => handleAchievementFormChange('department', value)}
                placeholder="Select department"
                required
                options={[
                  { value: "engineering", label: "Engineering" },
                  { value: "development", label: "Development" },
                  { value: "design", label: "Design" },
                  { value: "customer-success", label: "Customer Success" },
                  { value: "marketing", label: "Marketing" }
                ]}
              />
              <CommonSelect
                id="category"
                label="Category"
                value={achievementForm.category}
                onValueChange={(value) => handleAchievementFormChange('category', value)}
                placeholder="Select category"
                required
                options={[
                  { value: "excellence", label: "Excellence" },
                  { value: "delivery", label: "Delivery" },
                  { value: "innovation", label: "Innovation" },
                  { value: "teamwork", label: "Teamwork" },
                  { value: "service", label: "Service" }
                ]}
              />
              <CommonInput
                id="points"
                label="Points"
                value={achievementForm.points}
                onChange={(value) => handleAchievementFormChange('points', value)}
                placeholder="100"
                type="number"
                required
              />
              <CommonInput
                id="project"
                label="Project"
                value={achievementForm.project}
                onChange={(value) => handleAchievementFormChange('project', value)}
                placeholder="Enter project name"
              />
            </CommonFormGrid>
            
            <CommonTextarea
              id="description"
              label="Description"
              value={achievementForm.description}
              onChange={(value) => handleAchievementFormChange('description', value)}
              placeholder="Describe the achievement in detail..."
              required
              rows={4}
            />
            
            <CommonFormActions>
              <CommonButton
                variant="outline"
                onClick={() => {
                  setAchievementForm({
                    title: '',
                    employee: '',
                    department: '',
                    category: '',
                    points: '',
                    project: '',
                    description: ''
                  });
                  setShowAddModal(false);
                }}
              >
                Cancel
              </CommonButton>
              <CommonButton
                onClick={handleAddAchievementSubmit}
              >
                Add Achievement
              </CommonButton>
            </CommonFormActions>
          </div>
        </CommonDialog>

        {/* User Details Modal */}
        <CommonDialog
          open={!!showUserDetails}
          onOpenChange={() => setShowUserDetails(null)}
          title="User Profile"
          subtitle={`Detailed information about ${showUserDetails?.name}`}
          icon={User}
          maxWidth="max-w-2xl"
        >
          {showUserDetails && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-lg font-medium bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {showUserDetails.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{showUserDetails.name}</h3>
                  <p className="text-sm text-muted-foreground">{showUserDetails.position}</p>
                  <p className="text-xs text-muted-foreground">{showUserDetails.email}</p>
                </div>
              </div>
              
              <CommonFormGrid cols={2}>
                <div>
                  <h4 className="font-medium text-sm mb-2">Department</h4>
                  <p className="text-sm text-muted-foreground">{showUserDetails.department}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Join Date</h4>
                  <p className="text-sm text-muted-foreground">
                    {showUserDetails.joinDate ? new Date(showUserDetails.joinDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Total Points</h4>
                  <p className="text-sm font-semibold text-blue-600">{showUserDetails.points} pts</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Achievements</h4>
                  <p className="text-sm text-muted-foreground">{showUserDetails.achievements} total</p>
                </div>
              </CommonFormGrid>

              {showUserDetails.bio && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">{showUserDetails.bio}</p>
                </div>
              )}

              {showUserDetails.skills && showUserDetails.skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {showUserDetails.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <CommonFormActions>
                <CommonButton onClick={() => setShowUserDetails(null)}>
                  Close
                </CommonButton>
              </CommonFormActions>
            </div>
          )}
        </CommonDialog>

        {/* View All Users Modal */}
        <CommonDialog
          open={showAllUsers}
          onOpenChange={setShowAllUsers}
          title="All Contributors"
          subtitle="Complete list of all team members and their achievements"
          icon={Users}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-3">
            {leaderboard.map((member) => (
              <div 
                key={member.rank} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                onClick={() => {
                  setShowAllUsers(false);
                  handleUserClick(member);
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {member.rank}
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.department}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{member.points} pts</p>
                    <p className="text-xs text-green-600">{member.change}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {member.achievements} achievements
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <CommonFormActions>
            <CommonButton onClick={() => setShowAllUsers(false)}>
              Close
            </CommonButton>
          </CommonFormActions>
        </CommonDialog>

        {/* Achievement Details Modal */}
        <CommonDialog
          open={!!showAchievementDetails}
          onOpenChange={() => setShowAchievementDetails(null)}
          title="Achievement Details"
          subtitle={`Details for ${showAchievementDetails?.title}`}
          icon={Trophy}
          maxWidth="max-w-3xl"
        >
          {showAchievementDetails && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${getAchievementColor(showAchievementDetails.type)} rounded-lg flex items-center justify-center text-white text-2xl shadow-lg`}>
                  {showAchievementDetails.badge}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{showAchievementDetails.title}</h3>
                  <p className="text-sm text-muted-foreground">{showAchievementDetails.employee}</p>
                  <p className="text-xs text-muted-foreground">{showAchievementDetails.date}</p>
                </div>
              </div>
              
              <CommonFormGrid cols={2}>
                <div>
                  <h4 className="font-medium text-sm mb-2">Department</h4>
                  <p className="text-sm text-muted-foreground">{showAchievementDetails.department}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Project</h4>
                  <p className="text-sm text-muted-foreground">{showAchievementDetails.project}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Category</h4>
                  <p className="text-sm text-muted-foreground">{showAchievementDetails.category}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Points</h4>
                  <p className="text-sm font-semibold text-blue-600">{showAchievementDetails.points} pts</p>
                </div>
              </CommonFormGrid>

              <div>
                <h4 className="font-medium text-sm mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{showAchievementDetails.description}</p>
              </div>

              {showAchievementDetails.details && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Full Details</h4>
                  <p className="text-sm text-muted-foreground">{showAchievementDetails.details}</p>
                </div>
              )}

              {showAchievementDetails.tags && showAchievementDetails.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {showAchievementDetails.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <CommonFormActions>
                <CommonButton onClick={() => setShowAchievementDetails(null)}>
                  Close
                </CommonButton>
              </CommonFormActions>
            </div>
          )}
        </CommonDialog>

        {/* Edit Achievement Modal */}
        <CommonDialog
          open={showEditModal}
          onOpenChange={setShowEditModal}
          title="Edit Achievement"
          subtitle="Update achievement details"
          icon={Edit}
          maxWidth="max-w-6xl"
        >
          <div className="space-y-6">
            <CommonFormGrid cols={2}>
              <CommonInput
                id="edit-title"
                label="Achievement Title"
                value={achievementForm.title}
                onChange={(value) => handleAchievementFormChange('title', value)}
                placeholder="Enter achievement title"
                required
              />
              <CommonInput
                id="edit-employee"
                label="Employee Name"
                value={achievementForm.employee}
                onChange={(value) => handleAchievementFormChange('employee', value)}
                placeholder="Enter employee name"
                required
              />
              <CommonSelect
                id="edit-department"
                label="Department"
                value={achievementForm.department}
                onValueChange={(value) => handleAchievementFormChange('department', value)}
                placeholder="Select department"
                required
                options={[
                  { value: "engineering", label: "Engineering" },
                  { value: "development", label: "Development" },
                  { value: "design", label: "Design" },
                  { value: "customer-success", label: "Customer Success" },
                  { value: "marketing", label: "Marketing" }
                ]}
              />
              <CommonSelect
                id="edit-category"
                label="Category"
                value={achievementForm.category}
                onValueChange={(value) => handleAchievementFormChange('category', value)}
                placeholder="Select category"
                required
                options={[
                  { value: "excellence", label: "Excellence" },
                  { value: "delivery", label: "Delivery" },
                  { value: "innovation", label: "Innovation" },
                  { value: "teamwork", label: "Teamwork" },
                  { value: "service", label: "Service" }
                ]}
              />
              <CommonInput
                id="edit-points"
                label="Points"
                value={achievementForm.points}
                onChange={(value) => handleAchievementFormChange('points', value)}
                placeholder="100"
                type="number"
                required
              />
              <CommonInput
                id="edit-project"
                label="Project"
                value={achievementForm.project}
                onChange={(value) => handleAchievementFormChange('project', value)}
                placeholder="Enter project name"
              />
            </CommonFormGrid>
            
            <CommonTextarea
              id="edit-description"
              label="Description"
              value={achievementForm.description}
              onChange={(value) => handleAchievementFormChange('description', value)}
              placeholder="Describe the achievement in detail..."
              required
              rows={4}
            />
            
            <CommonFormActions>
              <CommonButton
                variant="outline"
                onClick={() => {
                  setAchievementForm({
                    title: '',
                    employee: '',
                    department: '',
                    category: '',
                    points: '',
                    project: '',
                    description: ''
                  });
                  setEditingAchievement(null);
                  setShowEditModal(false);
                }}
              >
                Cancel
              </CommonButton>
              <CommonButton onClick={handleEditSubmit}>
                Update Achievement
              </CommonButton>
            </CommonFormActions>
          </div>
        </CommonDialog>
      </Card>
    </TooltipProvider>
  );
};

export default AchievementsCorner; 