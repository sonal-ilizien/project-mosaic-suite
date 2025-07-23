import { useState, useEffect } from "react";
import { 
  BarChart3, 
  LayoutGrid, 
  List, 
  Calendar, 
  Filter, 
  Search, 
  Plus, 
  SortAsc,
  Menu,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import Dashboard from "./Dashboard";
import KanbanBoard from "./KanbanBoard";
import ListView from "./ListView";
import CalendarView from "./CalendarView";
import Analytics from "./Analytics";
import TemplateSelector from "./TemplateSelector";
import ProjectOverview from "./ProjectOverview";
import ChartConfiguration from "./ChartConfiguration";
import TemplateComparison from "./TemplateComparison";
import SharedWhiteboard from "./SharedWhiteboard";
import NewProjectModal from "./NewProjectModal";
import TemplateGallery from "./TemplateGallery";
import AddTaskModal from "./AddTaskModal";

type ViewType = 'dashboard' | 'kanban' | 'list' | 'calendar' | 'templates' | 'analytics' | 'project-overview' | 'chart-config' | 'template-comparison' | 'whiteboard';

interface ViewSelectorProps {
  activeView?: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
  mobileSidebarOpen?: boolean;
}

const ViewSelector = ({ 
  activeView: propActiveView, 
  sidebarCollapsed = false, 
  onToggleSidebar,
  isMobile = false,
  mobileSidebarOpen = false
}: ViewSelectorProps) => {
  const [activeView, setActiveView] = useState<ViewType>((propActiveView as ViewType) || 'dashboard');

  useEffect(() => {
    if (propActiveView && propActiveView !== activeView) {
      setActiveView(propActiveView as ViewType);
    }
  }, [propActiveView]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Record<string, unknown> | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{id: string; name: string; description?: string} | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [tasks, setTasks] = useState<unknown[]>([]);

  const views = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
    { id: 'kanban', name: 'Kanban', icon: LayoutGrid, description: 'Visual Task Board' },
    { id: 'list', name: 'List', icon: List, description: 'Detailed Task List' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'Timeline View' },
    { id: 'templates', name: 'Templates', icon: Filter, description: 'Project Templates' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'Charts & Reports' }
  ];

  const handleProjectCreate = (project: any) => {
    setSelectedProject(project);
    setActiveView('project-overview');
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setShowNewProjectModal(true);
  };

  const handleBrowseTemplates = () => {
    setShowTemplateGallery(true);
  };

  const handleTaskCreate = (task: any) => {
    setTasks(prev => [...prev, task]);
  };

  const renderActiveView = () => {
    switch (activeView) {
              case 'dashboard':
          return <Dashboard onProjectSelect={(project) => {
            // Check if this is a navigation request (like "View All")
            if (project && typeof project === 'object' && 'type' in project) {
              if (project.type === 'list') {
                setActiveView('list');
                return;
              } else if (project.type === 'templates') {
                setActiveView('templates');
                return;
              }
            }
            // Otherwise, treat as project selection for overview
            setSelectedProject(project as Record<string, unknown>);
            setActiveView('project-overview');
          }} />;
      case 'kanban':
        return <KanbanBoard />;
      case 'templates':
        return <TemplateSelector 
          onBrowseTemplates={handleBrowseTemplates} 
          onProjectCreate={handleProjectCreate}
        />;
      case 'list':
        return <ListView onProjectSelect={(project) => {
          setSelectedProject(project as unknown as Record<string, unknown>);
          setActiveView('project-overview');
        }} />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <Analytics />;
      case 'chart-config':
        return <ChartConfiguration />;
      case 'template-comparison':
        return <TemplateComparison />;
      case 'whiteboard':
        return <SharedWhiteboard />;
      case 'project-overview':
        return selectedProject ? (
          <ProjectOverview 
            project={selectedProject} 
            onBack={() => setActiveView('dashboard')} 
          />
        ) : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col min-w-0 text-sharp">
        {/* Top Navigation Bar */}
        <div className="bg-background border-b border-border p-3 sm:p-4 flex-shrink-0 sticky top-0 z-50 relative overflow-hidden navbar-morph navbar-particles navbar-orbs navbar-no-blur">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32 float-animation"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-24 translate-y-24 float-animation" style={{ animationDelay: '2s' }}></div>
          
          {/* Additional animated elements */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '3s' }}></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 min-w-0 relative z-10">
            {/* Mobile Layout - Hamburger and Search in first row, Action Buttons in second row */}
            <div className="w-full sm:hidden">
              {/* First row - Hamburger and Search */}
              <div className="flex items-center space-x-2 mb-2">
                {onToggleSidebar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleSidebar}
                    className="hover:bg-primary/20 hover:text-foreground flex-shrink-0 ripple-effect icon-animated text-foreground"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                )}
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search projects, tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full glow-border bg-background text-foreground"
                  />
                </div>
              </div>
              
              {/* Second row - Action Buttons in right corner */}
              <div className="flex items-center justify-end space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-border text-foreground hover:bg-accent hover:text-accent-foreground ripple-effect magnetic-hover"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Quick Actions</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-border text-foreground hover:bg-accent hover:text-accent-foreground ripple-effect magnetic-hover"
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter Options</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between w-full">
              {/* Left side with view tabs */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {/* Sidebar Toggle Button for Desktop/Medium when collapsed */}
                {sidebarCollapsed && onToggleSidebar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleSidebar}
                    className="hover:bg-primary/20 hover:text-foreground flex-shrink-0 text-white/90 hover:text-white"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                )}
                
                {/* View Tabs */}
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
                  {views.map((view) => (
                    <Button
                      key={view.id}
                      variant={activeView === view.id ? "default" : "ghost"}
                      size="sm"
                      className={`flex-shrink-0 transition-all duration-300 hover:scale-105 group menu-item-animated ripple-effect ${
                        activeView === view.id 
                          ? "bg-primary text-primary-foreground shadow-xl border border-primary/40 font-medium wave-active glow-border" 
                          : "text-foreground hover:bg-accent hover:text-accent-foreground border border-transparent"
                      }`}
                      onClick={() => setActiveView(view.id as ViewType)}
                    >
                      <view.icon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 icon-animated" />
                      <span className="font-medium">{view.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Right side - Search and Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Search Bar */}
                <div className="relative hidden md:block">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search projects, tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64 bg-background border-border text-foreground placeholder:text-muted-foreground focus:bg-accent focus:border-primary glow-border"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-border text-foreground hover:bg-accent hover:text-accent-foreground ripple-effect magnetic-hover floating-action"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Quick Actions</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-border text-foreground hover:bg-accent hover:text-accent-foreground ripple-effect magnetic-hover"
                      >
                        <Filter className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter Options</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-border text-foreground hover:bg-accent hover:text-accent-foreground ripple-effect magnetic-hover sparkle"
                      >
                        <User className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>User Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {renderActiveView()}
        </div>

        {/* Modals */}
        <NewProjectModal
          open={showNewProjectModal}
          onOpenChange={setShowNewProjectModal}
          selectedTemplate={selectedTemplate}
          onProjectCreate={handleProjectCreate}
        />

        <TemplateGallery
          open={showTemplateGallery}
          onOpenChange={setShowTemplateGallery}
          onTemplateSelect={handleTemplateSelect}
        />

        <AddTaskModal
          open={showAddTaskModal}
          onOpenChange={setShowAddTaskModal}
          onTaskCreate={handleTaskCreate}
        />
      </div>
    </TooltipProvider>
  );
};

export default ViewSelector;