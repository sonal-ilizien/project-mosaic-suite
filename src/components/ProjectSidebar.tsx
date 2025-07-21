import { 
  LayoutDashboard, 
  FolderKanban, 
  Calendar, 
  Users, 
  Settings, 
  PlusCircle,
  ChevronDown,
  Briefcase,
  DollarSign,
  Anchor,
  User,
  BarChart3,
  List,
  Filter,
  GitCompare,
  MessageSquare,
  Clock,
  TrendingUp,
  Menu,
  X,
  UserCheck,
  Building,
  GraduationCap,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import NewProjectModal from "./NewProjectModal";

interface ProjectSidebarProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

const ProjectSidebar = ({ activeView = 'dashboard', onViewChange, collapsed = false, onToggleCollapse, isMobile = false }: ProjectSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    projects: true,
    templates: false
  });
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const templates = [
    { id: 'personal', name: 'Personal Productivity', icon: User, color: 'bg-primary' },
    { id: 'agile', name: 'Agile Development', icon: FolderKanban, color: 'bg-accent' },
    { id: 'finance', name: 'Finance Management', icon: DollarSign, color: 'bg-warning' },
    { id: 'shipbuilding', name: 'Shipbuilding Projects', icon: Anchor, color: 'bg-destructive' },
    { id: 'event', name: 'Event Planning', icon: Calendar, color: 'bg-purple-500' },
    { id: 'hr', name: 'HR / Recruitment', icon: UserCheck, color: 'bg-indigo-500' },
    { id: 'construction', name: 'Construction / Real Estate', icon: Building, color: 'bg-amber-500' },
    { id: 'consulting', name: 'Client Service / Consulting', icon: Briefcase, color: 'bg-teal-500' },
    { id: 'education', name: 'Education / Course Planning', icon: GraduationCap, color: 'bg-pink-500' },
    { id: 'product', name: 'Product Launch Roadmaps', icon: Rocket, color: 'bg-cyan-500' }
  ];

  const projects = [
    { name: 'Mobile App Redesign', progress: 75, status: 'active' },
    { name: 'Q1 Budget Planning', progress: 40, status: 'active' },
    { name: 'Website Migration', progress: 90, status: 'review' }
  ];

  return (
    <div 
      className={`${isMobile ? 'w-full' : 'w-64'} bg-background-secondary border-r border-border h-screen flex flex-col relative sticky top-0`}
      style={{
        background: 'linear-gradient(180deg, hsl(var(--sidebar-background)) 0%, hsl(var(--background-secondary)) 100%)'
      }}
    >
      {/* Close button for mobile */}
      {isMobile && onToggleCollapse && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="absolute top-4 right-4 z-10 hover:bg-primary/20 hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      {/* Collapse button for desktop */}
      {!isMobile && onToggleCollapse && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="absolute top-4 right-4 z-10 hover:bg-primary/20 hover:text-foreground"
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}
      
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-foreground text-sm sm:text-base truncate">ProjectFlow</h1>
            <p className="text-xs text-muted-foreground truncate">Management Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2">
        <nav className="space-y-1">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'dashboard' ? 'bg-primary-light text-primary hover:bg-primary/90 hover:text-white' : 'hover:bg-primary/20 hover:text-foreground'
            }`}
            onClick={() => onViewChange?.('dashboard')}
          >
            <LayoutDashboard className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Dashboard</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'kanban' ? 'bg-primary-light text-primary hover:bg-primary/90 hover:text-white' : 'hover:bg-primary/20 hover:text-foreground'
            }`}
            onClick={() => onViewChange?.('kanban')}
          >
            <FolderKanban className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Kanban</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'list' ? 'bg-primary-light text-primary hover:bg-primary/90 hover:text-white' : 'hover:bg-primary/20 hover:text-foreground'
            }`}
            onClick={() => onViewChange?.('list')}
          >
            <List className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Tasks</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'calendar' ? 'bg-primary-light text-primary hover:bg-primary/90 hover:text-white' : 'hover:bg-primary/20 hover:text-foreground'
            }`}
            onClick={() => onViewChange?.('calendar')}
          >
            <Calendar className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Calendar</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'templates' ? 'bg-primary-light text-primary hover:bg-primary/90 hover:text-white' : 'hover:bg-primary/20 hover:text-foreground'
            }`}
            onClick={() => onViewChange?.('templates')}
          >
            <Filter className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Templates</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'analytics' ? 'bg-primary-light text-primary hover:bg-primary/90 hover:text-white' : 'hover:bg-primary/20 hover:text-foreground'
            }`}
            onClick={() => onViewChange?.('analytics')}
          >
            <BarChart3 className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Analytics</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'chart-config' ? 'bg-primary-light text-primary hover:bg-primary/90 hover:text-white' : 'hover:bg-primary/20 hover:text-foreground'
            }`}
            onClick={() => onViewChange?.('chart-config')}
          >
            <TrendingUp className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Charts</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'template-comparison' ? 'bg-primary-light text-primary hover:bg-primary/90 hover:text-white' : 'hover:bg-primary/20 hover:text-foreground'
            }`}
            onClick={() => onViewChange?.('template-comparison')}
          >
            <GitCompare className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Compare</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'whiteboard' ? 'bg-primary-light text-primary hover:bg-primary/90 hover:text-white' : 'hover:bg-primary/20 hover:text-foreground'
            }`}
            onClick={() => onViewChange?.('whiteboard')}
          >
            <MessageSquare className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Board</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
                activeView === 'team' ? 'bg-primary-light text-primary hover:bg-primary/90 hover:text-white' : 'hover:bg-primary/20 hover:text-foreground'
            }`}
            onClick={() => onViewChange?.('team')}
          >
            <Users className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Team</span>
          </Button>
        </nav>

        {/* Project Templates Section */}
        <div className="pt-4">
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto hover:bg-primary/20 hover:text-foreground"
            onClick={() => toggleSection('templates')}
          >
            <span className="text-sm font-medium text-foreground">Templates</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.templates ? 'rotate-180' : ''}`} />
          </Button>
          
          {expandedSections.templates && (
            <div className="ml-2 mt-2 space-y-1">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant="ghost"
                  className="w-full justify-start text-xs sm:text-sm py-2 hover:bg-primary/20 hover:text-foreground"
                >
                  <div className={`w-2 h-2 rounded-full ${template.color} mr-2 sm:mr-3`} />
                  <span className="truncate">{template.name}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="pt-4">
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto hover:bg-primary/20 hover:text-foreground"
            onClick={() => toggleSection('projects')}
          >
            <span className="text-sm font-medium text-foreground">Recent Projects</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.projects ? 'rotate-180' : ''}`} />
          </Button>
          
          {expandedSections.projects && (
            <div className="ml-2 mt-2 space-y-2">
              {projects.map((project, index) => (
                <div key={index} className="p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs sm:text-sm font-medium text-foreground truncate">{project.name}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${project.status === 'active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 sm:p-4 border-t border-border">
        <Button 
          className="w-full bg-gradient-primary hover:opacity-90 text-white text-sm sm:text-base"
          onClick={() => setShowNewProjectModal(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          <span className="truncate">New Project</span>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start mt-2 hover:bg-primary/20 hover:text-foreground text-sm sm:text-base">
          <Settings className="w-4 h-4 mr-2 sm:mr-3" />
          <span className="truncate">Settings</span>
        </Button>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
        onProjectCreate={(project) => {
          console.log('Project created:', project);
          setShowNewProjectModal(false);
        }}
      />
    </div>
  );
};

export default ProjectSidebar;