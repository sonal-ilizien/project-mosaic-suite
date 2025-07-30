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
import Team from "./Team";
import UserProfileDropdown from "./UserProfileDropdown";
import AgileTestDashboard from "./AgileTestDashboard";
import CompanyDashboard from "./CompanyDashboard";

type ViewType = 'dashboard' | 'company-dashboard' | 'kanban' | 'list' | 'calendar' | 'templates' | 'analytics' | 'project-overview' | 'chart-config' | 'template-comparison' | 'whiteboard' | 'team' | 'agile-dashboard';

interface ViewSelectorProps {
  activeView?: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
  mobileSidebarOpen?: boolean;
  selectedProjectFromSidebar?: Record<string, unknown> | null;
  onViewChange?: (view: string) => void;
}

const ViewSelector = ({ 
  activeView: propActiveView, 
  sidebarCollapsed = false, 
  onToggleSidebar,
  isMobile = false,
  mobileSidebarOpen = false,
  selectedProjectFromSidebar,
  onViewChange
}: ViewSelectorProps) => {
  const [activeView, setActiveView] = useState<ViewType>((propActiveView as ViewType) || 'dashboard');

  const setActiveViewAndNotify = (view: ViewType) => {
    setActiveView(view);
    onViewChange?.(view);
  };

  useEffect(() => {
    if (propActiveView && propActiveView !== activeView) {
      setActiveView(propActiveView as ViewType);
    }
  }, [propActiveView]);

  // Handle project selection from sidebar
  useEffect(() => {
    if (selectedProjectFromSidebar) {
      setSelectedProject(selectedProjectFromSidebar);
      setActiveViewAndNotify('project-overview');
    }
  }, [selectedProjectFromSidebar]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Record<string, unknown> | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{id: string; name: string; description?: string} | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [tasks, setTasks] = useState<unknown[]>([]);



  const handleProjectCreate = (project: any) => {
    setSelectedProject(project);
    setActiveViewAndNotify('project-overview');
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
                setActiveViewAndNotify('list');
                return;
              } else if (project.type === 'templates') {
                setActiveViewAndNotify('templates');
                return;
              }
            }
            // Otherwise, treat as project selection for overview
            setSelectedProject(project as Record<string, unknown>);
            setActiveViewAndNotify('project-overview');
          }} />;
      case 'company-dashboard':
        return <CompanyDashboard />;
      case 'kanban':
        return <KanbanBoard />;
      case 'templates':
        return <TemplateSelector 
          onBrowseTemplates={handleBrowseTemplates} 
          onProjectCreate={handleProjectCreate}
          onBackToDashboard={() => setActiveViewAndNotify('dashboard')}
        />;
      case 'list':
        return <ListView onProjectSelect={(project) => {
          setSelectedProject(project as unknown as Record<string, unknown>);
          setActiveViewAndNotify('project-overview');
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
      case 'team':
        return <Team />;
      case 'project-overview':
        return selectedProject ? (
          <ProjectOverview 
            project={selectedProject as any} 
            onBack={() => setActiveViewAndNotify('dashboard')} 
            onNavigateToAgile={() => setActiveViewAndNotify('agile-dashboard')}
          />
        ) : <Dashboard />;
      case 'agile-dashboard':
        return selectedProject ? (
          <AgileTestDashboard 
            projectId={(selectedProject as any).id || 1} 
            projectName={(selectedProject as any).name || 'Agile Project'} 
            onBack={() => setActiveViewAndNotify('project-overview')}
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
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search projects, tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
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
                
                <UserProfileDropdown />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between w-full">
              {/* Left side - Sidebar Toggle */}
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
                    className="pl-9 w-56 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
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
                  
                  <UserProfileDropdown />
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