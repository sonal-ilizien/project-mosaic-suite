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
import { useProjects } from "../contexts/ProjectContext";

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
  const { projects, addProject } = useProjects();

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

  // Using projects from context instead of local array

  return (
    <div 
      className={`${isMobile ? 'w-full' : 'w-64'} bg-background-secondary border-r border-border h-screen flex flex-col relative sticky top-0`}
      style={{
        background: '#5F9EA0'
      }}
    >
      {/* Close button for mobile */}
      {isMobile && onToggleCollapse && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
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
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 bg-white/10 hover:bg-white/30 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}
      
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/20" style={{ background: '#5F9EA0' }}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-white text-sm sm:text-base truncate">ProjectFlow</h1>
            <p className="text-xs text-white/70 truncate">Management Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2 force-scrollbar-white">
        <nav className="space-y-1">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'dashboard' ? 'bg-white/20 text-white hover:bg-white/30' : 'text-white/90 hover:bg-white/20 hover:text-white'
            }`}
            onClick={() => onViewChange?.('dashboard')}
          >
            <LayoutDashboard className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Dashboard</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'kanban' ? 'bg-white/20 text-white hover:bg-white/30' : 'text-white/90 hover:bg-white/20 hover:text-white'
            }`}
            onClick={() => onViewChange?.('kanban')}
          >
            <FolderKanban className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Kanban</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'list' ? 'bg-white/20 text-white hover:bg-white/30' : 'text-white/90 hover:bg-white/20 hover:text-white'
            }`}
            onClick={() => onViewChange?.('list')}
          >
            <List className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Tasks</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'calendar' ? 'bg-white/20 text-white hover:bg-white/30' : 'text-white/90 hover:bg-white/20 hover:text-white'
            }`}
            onClick={() => onViewChange?.('calendar')}
          >
            <Calendar className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Calendar</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'templates' ? 'bg-white/20 text-white hover:bg-white/30' : 'text-white/90 hover:bg-white/20 hover:text-white'
            }`}
            onClick={() => onViewChange?.('templates')}
          >
            <Filter className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Templates</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'analytics' ? 'bg-white/20 text-white hover:bg-white/30' : 'text-white/90 hover:bg-white/20 hover:text-white'
            }`}
            onClick={() => onViewChange?.('analytics')}
          >
            <BarChart3 className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Analytics</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'chart-config' ? 'bg-white/20 text-white hover:bg-white/30' : 'text-white/90 hover:bg-white/20 hover:text-white'
            }`}
            onClick={() => onViewChange?.('chart-config')}
          >
            <TrendingUp className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Charts</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'template-comparison' ? 'bg-white/20 text-white hover:bg-white/30' : 'text-white/90 hover:bg-white/20 hover:text-white'
            }`}
            onClick={() => onViewChange?.('template-comparison')}
          >
            <GitCompare className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Compare</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
              activeView === 'whiteboard' ? 'bg-white/20 text-white hover:bg-white/30' : 'text-white/90 hover:bg-white/20 hover:text-white'
            }`}
            onClick={() => onViewChange?.('whiteboard')}
          >
            <MessageSquare className="w-4 h-4 mr-2 sm:mr-3" />
            <span className="truncate">Board</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sm sm:text-base ${
                activeView === 'team' ? 'bg-white/20 text-white hover:bg-white/30' : 'text-white/90 hover:bg-white/20 hover:text-white'
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
            className="w-full justify-between p-2 h-auto text-white/90 hover:bg-white/20 hover:text-white"
            onClick={() => toggleSection('templates')}
          >
            <span className="text-sm font-medium text-white">Templates</span>
            <ChevronDown className={`w-4 h-4 transition-transform text-white ${expandedSections.templates ? 'rotate-180' : ''}`} />
          </Button>
          
          {expandedSections.templates && (
            <div className="ml-2 mt-2 space-y-1">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant="ghost"
                  className="w-full justify-start text-xs sm:text-sm py-2 text-white/80 hover:bg-white/20 hover:text-white"
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
            className="w-full justify-between p-2 h-auto text-white/90 hover:bg-white/20 hover:text-white"
            onClick={() => toggleSection('projects')}
          >
            <span className="text-sm font-medium text-white">Recent Projects</span>
            <ChevronDown className={`w-4 h-4 transition-transform text-white ${expandedSections.projects ? 'rotate-180' : ''}`} />
          </Button>
          
          {expandedSections.projects && (
            <div className="ml-2 mt-2 space-y-2">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <div className="mb-1">
                    <h4 className="text-xs sm:text-sm font-medium text-white truncate mb-1">{project.name}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs font-medium ${
                        project.status === 'In Progress' ? 'bg-blue-500 text-white' : 
                        project.status === 'Completed' ? 'bg-green-500 text-white' : 
                        project.status === 'Review' ? 'bg-yellow-500 text-white' : 
                        'bg-gray-500 text-white'
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-white/20 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all ${
                          project.progress >= 100 ? 'bg-green-500' :
                          project.progress >= 75 ? 'bg-blue-500' :
                          project.progress >= 50 ? 'bg-yellow-500' :
                          project.progress >= 25 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/70">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 sm:p-4 border-t border-white/20">
        <Button 
          className="w-full bg-white/20 hover:bg-white/30 text-white text-sm sm:text-base border border-white/30"
          onClick={() => setShowNewProjectModal(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          <span className="truncate">New Project</span>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start mt-2 text-white/90 hover:bg-white/20 hover:text-white text-sm sm:text-base">
          <Settings className="w-4 h-4 mr-2 sm:mr-3" />
          <span className="truncate">Settings</span>
        </Button>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
        onProjectCreate={(project) => {
          // Convert modal project to context project format
          const newProject = {
            id: Date.now(),
            name: project.name,
            type: project.template || 'General',
            status: project.status === 'backlog' ? 'Planning' : 
                    project.status === 'in-progress' ? 'In Progress' : 
                    project.status === 'completed' ? 'Completed' : 'Planning',
            priority: project.priority || 'Medium',
            assignee: project.team[0] || 'Unassigned',
            dueDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
            progress: 0,
            tasks: 0,
            completedTasks: 0,
            description: project.description
          };
          addProject(newProject);
          setShowNewProjectModal(false);
        }}
      />
    </div>
  );
};

export default ProjectSidebar;