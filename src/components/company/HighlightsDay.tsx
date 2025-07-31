import React, { useState } from 'react';
import { 
  Zap,
  Calendar,
  Users,
  ThumbsUp,
  AlertTriangle,
  Bell,
  Clock,
  MessageSquare,
  User,
  BarChart3,
  Target,
  Flag,
  Star,
  Heart,
  TrendingUp,
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
  X,
  PlayCircle,
  PauseCircle,
  StopCircle,
  RotateCcw,
  RefreshCw,
  Settings,
  BellRing,
  CheckCircle,
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
import { CommonDialog, CommonInput, CommonSelect, CommonTextarea, CommonFormGrid, CommonFormActions, CommonButton } from "@/components/ui/common-dialog";

interface Highlight {
  id: number;
  type: 'meeting' | 'kudos' | 'delay' | 'reminder' | 'achievement' | 'announcement';
  title: string;
  description: string;
  time: string;
  status: 'upcoming' | 'completed' | 'pending' | 'overdue';
  priority?: 'high' | 'medium' | 'low';
  attendees?: number;
  employee?: string;
  project?: string;
  department?: string;
  icon?: string;
  color?: string;
}

interface HighlightsDayProps {
  onExport?: () => void;
  onAddHighlight?: () => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onHighlightUpdate?: (highlight: Highlight) => void;
}

const mockHighlights: Highlight[] = [
  {
    id: 1,
    type: "meeting",
    title: "All-Hands Meeting",
    description: "Company-wide meeting discussing Q1 results and Q2 goals. All departments invited.",
    time: "10:00 AM",
    status: "upcoming",
    priority: "high",
    attendees: 45,
    department: "All Departments",
    icon: "📅",
    color: "#3B82F6"
  },
  {
    id: 2,
    type: "kudos",
    title: "Team Recognition",
    description: "Engineering team received client appreciation for quick bug fixes and excellent support.",
    employee: "Engineering Team",
    time: "Yesterday",
    status: "completed",
    priority: "medium",
    department: "Engineering",
    icon: "🏆",
    color: "#10B981"
  },
  {
    id: 3,
    type: "delay",
    title: "Project Delay",
    description: "Mobile app redesign delayed by 2 days due to design revisions and feedback integration.",
    project: "Mobile App Redesign",
    time: "2 days ago",
    status: "completed",
    priority: "medium",
    department: "Design",
    icon: "⚠️",
    color: "#F59E0B"
  },
  {
    id: 4,
    type: "reminder",
    title: "Performance Reviews",
    description: "Annual performance reviews due by end of month. Managers to complete assessments.",
    time: "Due in 5 days",
    status: "pending",
    priority: "high",
    department: "HR",
    icon: "📋",
    color: "#8B5CF6"
  },
  {
    id: 5,
    type: "achievement",
    title: "Sales Target Met",
    description: "Q1 sales target exceeded by 15%. Congratulations to the sales team!",
    employee: "Sales Team",
    time: "Today",
    status: "completed",
    priority: "high",
    department: "Sales",
    icon: "🎯",
    color: "#EF4444"
  },
  {
    id: 6,
    type: "announcement",
    title: "New Office Opening",
    description: "New office location opening in San Francisco. Team expansion planned for Q2.",
    time: "1 hour ago",
    status: "pending",
    priority: "medium",
    department: "Operations",
    icon: "🏢",
    color: "#06B6D4"
  },
  {
    id: 7,
    type: "meeting",
    title: "Product Strategy Session",
    description: "Quarterly product strategy planning with stakeholders and product managers.",
    time: "2:00 PM",
    status: "upcoming",
    priority: "high",
    attendees: 12,
    department: "Product",
    icon: "💡",
    color: "#8B5CF6"
  },
  {
    id: 8,
    type: "kudos",
    title: "Customer Success Story",
    description: "Customer testimonial received highlighting excellent support experience.",
    employee: "Support Team",
    time: "3 hours ago",
    status: "completed",
    priority: "medium",
    department: "Customer Success",
    icon: "⭐",
    color: "#F59E0B"
  }
];

const HighlightsDay: React.FC<HighlightsDayProps> = ({ 
  onExport, 
  onAddHighlight, 
  onFilterChange,
  onHighlightUpdate 
}) => {
  const [highlights, setHighlights] = useState<Highlight[]>(mockHighlights);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHighlightDetails, setShowHighlightDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);
  const [editingHighlight, setEditingHighlight] = useState<Highlight | null>(null);
  
  // Form state
  const [highlightForm, setHighlightForm] = useState({
    title: '',
    description: '',
    type: '',
    status: '',
    priority: '',
    time: '',
    employee: '',
    project: '',
    department: '',
    attendees: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleExport = () => {
    const data = {
      highlights,
      filters,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `highlights-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onExport?.();
  };

  const handleAddHighlight = () => {
    setShowAddModal(true);
  };

  const handleHighlightFormChange = (field: string, value: string) => {
    setHighlightForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddHighlightSubmit = () => {
    const newHighlight: Highlight = {
      id: Math.max(...highlights.map(h => h.id)) + 1,
      title: highlightForm.title,
      description: highlightForm.description,
      type: highlightForm.type as 'meeting' | 'kudos' | 'delay' | 'reminder' | 'achievement' | 'announcement',
      status: highlightForm.status as 'upcoming' | 'completed' | 'pending' | 'overdue',
      priority: highlightForm.priority as 'high' | 'medium' | 'low' | undefined,
      time: highlightForm.time,
      employee: highlightForm.employee || undefined,
      project: highlightForm.project || undefined,
      department: highlightForm.department || undefined,
      attendees: highlightForm.attendees ? parseInt(highlightForm.attendees) : undefined,
      icon: "📅",
      color: "#3B82F6"
    };
    
    setHighlights(prev => [...prev, newHighlight]);
    setHighlightForm({
      title: '',
      description: '',
      type: '',
      status: '',
      priority: '',
      time: '',
      employee: '',
      project: '',
      department: '',
      attendees: ''
    });
    setShowAddModal(false);
  };

  const handleViewDetails = (highlight: Highlight) => {
    setSelectedHighlight(highlight);
    setShowHighlightDetails(true);
  };

  const handleEditHighlight = (highlight: Highlight) => {
    setEditingHighlight(highlight);
    setHighlightForm({
      title: highlight.title,
      description: highlight.description,
      type: highlight.type,
      status: highlight.status,
      priority: highlight.priority || '',
      time: highlight.time,
      employee: highlight.employee || '',
      project: highlight.project || '',
      department: highlight.department || '',
      attendees: highlight.attendees?.toString() || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    if (!editingHighlight) return;
    
    const updatedHighlight: Highlight = {
      ...editingHighlight,
      title: highlightForm.title,
      description: highlightForm.description,
      type: highlightForm.type as 'meeting' | 'kudos' | 'delay' | 'reminder' | 'achievement' | 'announcement',
      status: highlightForm.status as 'upcoming' | 'completed' | 'pending' | 'overdue',
      priority: highlightForm.priority as 'high' | 'medium' | 'low' | undefined,
      time: highlightForm.time,
      employee: highlightForm.employee || undefined,
      project: highlightForm.project || undefined,
      department: highlightForm.department || undefined,
      attendees: highlightForm.attendees ? parseInt(highlightForm.attendees) : undefined
    };
    
    setHighlights(prev => prev.map(h => h.id === editingHighlight.id ? updatedHighlight : h));
    setShowEditModal(false);
    setEditingHighlight(null);
  };

  const handleDeleteHighlight = (highlightId: number) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
  };

  const handleShareHighlight = (highlight: Highlight) => {
    const shareText = `${highlight.title}\n${highlight.description}\nTime: ${highlight.time}\nStatus: ${highlight.status}`;
    
    if (navigator.share) {
      navigator.share({
        title: highlight.title,
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const handleHighlightUpdate = (highlightId: number, updates: Partial<Highlight>) => {
    const updatedHighlights = highlights.map(highlight => 
      highlight.id === highlightId ? { ...highlight, ...updates } : highlight
    );
    setHighlights(updatedHighlights);
    onHighlightUpdate?.(updatedHighlights.find(highlight => highlight.id === highlightId)!);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
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

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'kudos':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delay':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'reminder':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'announcement':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter highlights
  const filteredHighlights = highlights.filter(highlight => {
    const matchesType = filters.type === 'all' || highlight.type === filters.type;
    const matchesStatus = filters.status === 'all' || highlight.status === filters.status;
    const matchesPriority = filters.priority === 'all' || highlight.priority === filters.priority;
    const matchesSearch = highlight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         highlight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         highlight.employee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         highlight.project?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesPriority && matchesSearch;
  });

  const renderHighlightCard = (highlight: Highlight) => {
    return (
      <Card key={highlight.id} className="p-4 hover:shadow-lg transition-all duration-300 group border border-gray-200 hover:border-blue-300 hover:rounded-3xl hover:shadow-blue-500/25 hover:shadow-xl hover:scale-105 transform-gpu">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg" style={{ backgroundColor: highlight.color }}>
                {highlight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-base group-hover:text-blue-600 transition-colors">
                  {highlight.title}
                </h4>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleViewDetails(highlight)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditHighlight(highlight)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Highlight
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShareHighlight(highlight)}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => handleDeleteHighlight(highlight.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={`text-sm ${getTypeColor(highlight.type)}`}>
                {highlight.type}
              </Badge>
              <Badge className={`text-sm ${getStatusColor(highlight.status)}`}>
                {highlight.status}
              </Badge>
              {highlight.priority && (
                <Badge className={`text-sm ${getPriorityColor(highlight.priority)}`}>
                  {highlight.priority}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{highlight.time}</span>
            </div>
          </div>
          
          {highlight.attendees && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{highlight.attendees} attendees</span>
            </div>
          )}
          
          {highlight.employee && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{highlight.employee}</span>
            </div>
          )}
          
          {highlight.project && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span>{highlight.project}</span>
            </div>
          )}
          
          {highlight.department && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Building className="w-4 h-4" />
              <span>{highlight.department}</span>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <TooltipProvider>
      <Card className="p-6 border-0 shadow-xl" style={{ 
        background: 'linear-gradient(135deg, #F7FEE7 0%, #ECFCCB 100%)',
        border: '1px solid #BEF264'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Highlights of the Day</h3>
              <p className="text-xs text-muted-foreground">Daily summary and important updates</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddHighlight}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Highlight</span>
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
            <Label className="text-xs font-medium">Type</Label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="kudos">Kudos</SelectItem>
                <SelectItem value="delay">Delay</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-medium">Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
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
            <Label className="text-xs font-medium">Search</Label>
            <Input
              placeholder="Search highlights..."
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
            >
              Grid
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              List
            </Button>
          </div>
          <Badge variant="outline" className="text-xs">
            {filteredHighlights.length} highlights
          </Badge>
        </div>

        {/* Highlights Grid */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHighlights.map((highlight) => renderHighlightCard(highlight))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredHighlights.map((highlight) => renderHighlightCard(highlight))}
          </div>
        )}

        {/* Add Highlight Modal */}
        <CommonDialog
          open={showAddModal}
          onOpenChange={setShowAddModal}
          title="Add New Highlight"
          subtitle="Create a new highlight for the day"
          icon={Zap}
          maxWidth="max-w-6xl"
        >
          <div className="space-y-6">
            <CommonFormGrid cols={2}>
              <CommonInput
                id="title"
                label="Highlight Title"
                value={highlightForm.title}
                onChange={(value) => handleHighlightFormChange('title', value)}
                placeholder="Enter highlight title"
                required
              />
              <CommonInput
                id="time"
                label="Time"
                value={highlightForm.time}
                onChange={(value) => handleHighlightFormChange('time', value)}
                placeholder="10:00 AM"
                required
              />
              <CommonSelect
                id="type"
                label="Type"
                value={highlightForm.type}
                onValueChange={(value) => handleHighlightFormChange('type', value)}
                placeholder="Select type"
                required
                options={[
                  { value: "meeting", label: "Meeting" },
                  { value: "kudos", label: "Kudos" },
                  { value: "delay", label: "Delay" },
                  { value: "reminder", label: "Reminder" },
                  { value: "achievement", label: "Achievement" },
                  { value: "announcement", label: "Announcement" }
                ]}
              />
              <CommonSelect
                id="status"
                label="Status"
                value={highlightForm.status}
                onValueChange={(value) => handleHighlightFormChange('status', value)}
                placeholder="Select status"
                required
                options={[
                  { value: "upcoming", label: "Upcoming" },
                  { value: "completed", label: "Completed" },
                  { value: "pending", label: "Pending" },
                  { value: "overdue", label: "Overdue" }
                ]}
              />
              <CommonSelect
                id="priority"
                label="Priority"
                value={highlightForm.priority}
                onValueChange={(value) => handleHighlightFormChange('priority', value)}
                placeholder="Select priority"
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" }
                ]}
              />
              <CommonInput
                id="attendees"
                label="Attendees"
                value={highlightForm.attendees}
                onChange={(value) => handleHighlightFormChange('attendees', value)}
                placeholder="Number of attendees"
                type="number"
              />
              <CommonInput
                id="employee"
                label="Employee"
                value={highlightForm.employee}
                onChange={(value) => handleHighlightFormChange('employee', value)}
                placeholder="Employee name"
              />
              <CommonInput
                id="project"
                label="Project"
                value={highlightForm.project}
                onChange={(value) => handleHighlightFormChange('project', value)}
                placeholder="Project name"
              />
              <CommonInput
                id="department"
                label="Department"
                value={highlightForm.department}
                onChange={(value) => handleHighlightFormChange('department', value)}
                placeholder="Department name"
              />
            </CommonFormGrid>
            
            <CommonTextarea
              id="description"
              label="Description"
              value={highlightForm.description}
              onChange={(value) => handleHighlightFormChange('description', value)}
              placeholder="Describe the highlight in detail..."
              required
              rows={4}
            />
            
            <CommonFormActions>
              <CommonButton
                variant="outline"
                onClick={() => {
                  setHighlightForm({
                    title: '',
                    description: '',
                    type: '',
                    status: '',
                    priority: '',
                    time: '',
                    employee: '',
                    project: '',
                    department: '',
                    attendees: ''
                  });
                  setShowAddModal(false);
                }}
              >
                Cancel
              </CommonButton>
              <CommonButton
                onClick={handleAddHighlightSubmit}
              >
                Add Highlight
              </CommonButton>
            </CommonFormActions>
          </div>
        </CommonDialog>

        {/* Highlight Details Modal */}
        <CommonDialog
          open={showHighlightDetails}
          onOpenChange={setShowHighlightDetails}
          title={selectedHighlight?.title || "Highlight Details"}
          subtitle="View complete highlight information"
          icon={Eye}
          maxWidth="max-w-2xl"
        >
          {selectedHighlight && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="text-sm">{selectedHighlight.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <p className="text-sm">{selectedHighlight.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                  <p className="text-sm">{selectedHighlight.time}</p>
                </div>
                {selectedHighlight.priority && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                    <p className="text-sm">{selectedHighlight.priority}</p>
                  </div>
                )}
                {selectedHighlight.employee && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Employee</Label>
                    <p className="text-sm">{selectedHighlight.employee}</p>
                  </div>
                )}
                {selectedHighlight.project && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Project</Label>
                    <p className="text-sm">{selectedHighlight.project}</p>
                  </div>
                )}
                {selectedHighlight.department && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                    <p className="text-sm">{selectedHighlight.department}</p>
                  </div>
                )}
                {selectedHighlight.attendees && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Attendees</Label>
                    <p className="text-sm">{selectedHighlight.attendees}</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm mt-1">{selectedHighlight.description}</p>
              </div>
              
              <CommonFormActions>
                <CommonButton
                  variant="outline"
                  onClick={() => setShowHighlightDetails(false)}
                >
                  Close
                </CommonButton>
                <CommonButton
                  onClick={() => {
                    setShowHighlightDetails(false);
                    handleEditHighlight(selectedHighlight);
                  }}
                >
                  Edit Highlight
                </CommonButton>
              </CommonFormActions>
            </div>
          )}
        </CommonDialog>

        {/* Edit Highlight Modal */}
        <CommonDialog
          open={showEditModal}
          onOpenChange={setShowEditModal}
          title="Edit Highlight"
          subtitle="Modify highlight information"
          icon={Edit}
          maxWidth="max-w-6xl"
        >
          <div className="space-y-6">
            <CommonFormGrid cols={2}>
              <CommonInput
                id="title"
                label="Highlight Title"
                value={highlightForm.title}
                onChange={(value) => handleHighlightFormChange('title', value)}
                placeholder="Enter highlight title"
                required
              />
              <CommonInput
                id="time"
                label="Time"
                value={highlightForm.time}
                onChange={(value) => handleHighlightFormChange('time', value)}
                placeholder="10:00 AM"
                required
              />
              <CommonSelect
                id="type"
                label="Type"
                value={highlightForm.type}
                onValueChange={(value) => handleHighlightFormChange('type', value)}
                placeholder="Select type"
                required
                options={[
                  { value: "meeting", label: "Meeting" },
                  { value: "kudos", label: "Kudos" },
                  { value: "delay", label: "Delay" },
                  { value: "reminder", label: "Reminder" },
                  { value: "achievement", label: "Achievement" },
                  { value: "announcement", label: "Announcement" }
                ]}
              />
              <CommonSelect
                id="status"
                label="Status"
                value={highlightForm.status}
                onValueChange={(value) => handleHighlightFormChange('status', value)}
                placeholder="Select status"
                required
                options={[
                  { value: "upcoming", label: "Upcoming" },
                  { value: "completed", label: "Completed" },
                  { value: "pending", label: "Pending" },
                  { value: "overdue", label: "Overdue" }
                ]}
              />
              <CommonSelect
                id="priority"
                label="Priority"
                value={highlightForm.priority}
                onValueChange={(value) => handleHighlightFormChange('priority', value)}
                placeholder="Select priority"
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" }
                ]}
              />
              <CommonInput
                id="attendees"
                label="Attendees"
                value={highlightForm.attendees}
                onChange={(value) => handleHighlightFormChange('attendees', value)}
                placeholder="Number of attendees"
                type="number"
              />
              <CommonInput
                id="employee"
                label="Employee"
                value={highlightForm.employee}
                onChange={(value) => handleHighlightFormChange('employee', value)}
                placeholder="Employee name"
              />
              <CommonInput
                id="project"
                label="Project"
                value={highlightForm.project}
                onChange={(value) => handleHighlightFormChange('project', value)}
                placeholder="Project name"
              />
              <CommonInput
                id="department"
                label="Department"
                value={highlightForm.department}
                onChange={(value) => handleHighlightFormChange('department', value)}
                placeholder="Department name"
              />
            </CommonFormGrid>
            
            <CommonTextarea
              id="description"
              label="Description"
              value={highlightForm.description}
              onChange={(value) => handleHighlightFormChange('description', value)}
              placeholder="Describe the highlight in detail..."
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
                Update Highlight
              </CommonButton>
            </CommonFormActions>
          </div>
        </CommonDialog>
      </Card>
    </TooltipProvider>
  );
};

export default HighlightsDay; 