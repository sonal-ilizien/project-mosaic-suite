import React, { useState, useEffect } from 'react';
import { 
  Building,
  RefreshCw,
  Settings,
  Bell,
  Calendar,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  RotateCcw,
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
import { Switch } from "@/components/ui/switch";

// Import separate components
import AchievementsCorner from './company/AchievementsCorner';
import IssuesChallenges from './company/IssuesChallenges';
import ProjectTimeline from './company/ProjectTimeline';
import HighlightsDay from './company/HighlightsDay';



const CompanyDashboard = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleExport = () => {
    console.log('Exporting dashboard data...');
  };

  const handleAddAchievement = () => {
    console.log('Adding new achievement...');
  };

  const handleAddIssue = () => {
    console.log('Adding new issue...');
  };

  const handleAddProject = () => {
    console.log('Adding new project...');
  };

  const handleAddHighlight = () => {
    console.log('Adding new highlight...');
  };

  const handleFilterChange = (filters: Record<string, string | boolean>) => {
    console.log('Filters changed:', filters);
  };

  const handleIssueUpdate = (issue: unknown) => {
    console.log('Issue updated:', issue);
  };

  const handleProjectUpdate = (project: unknown) => {
    console.log('Project updated:', project);
  };

  const handleHighlightUpdate = (highlight: unknown) => {
    console.log('Highlight updated:', highlight);
  };

  return (
    <TooltipProvider>
      <div 
        className="p-6 space-y-8 min-h-screen transform-gpu"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background-secondary)) 50%, hsl(var(--background-tertiary)) 100%)'
        }}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Company Dashboard</h1>
                <p className="text-muted-foreground text-lg">Real-time overview of company performance and achievements</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh" className="text-sm">Auto-refresh</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLastRefresh(new Date())}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
            <div className="text-xs text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {/* 1. Achievements Corner */}
          <div>
            <AchievementsCorner 
              onExport={handleExport}
              onAddAchievement={handleAddAchievement}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* 2. Issues & Challenges */}
          <div>
            <IssuesChallenges 
              onExport={handleExport}
              onAddIssue={handleAddIssue}
              onFilterChange={handleFilterChange}
              onIssueUpdate={handleIssueUpdate}
            />
          </div>

          {/* 3. Project Timeline & Progress */}
          <div>
            <ProjectTimeline 
              onExport={handleExport}
              onAddProject={handleAddProject}
              onFilterChange={handleFilterChange}
              onProjectUpdate={handleProjectUpdate}
            />
          </div>

          {/* 4. Highlights of the Day */}
          <div>
            <HighlightsDay 
              onExport={handleExport}
              onAddHighlight={handleAddHighlight}
              onFilterChange={handleFilterChange}
              onHighlightUpdate={handleHighlightUpdate}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CompanyDashboard; 