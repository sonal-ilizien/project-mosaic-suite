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
  Menu
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <div className="bg-background border-b border-border p-3 sm:p-4 flex-shrink-0 sticky top-0 z-50" style={{ background: '#5F9EA0' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 min-w-0">
            {/* Mobile Layout - Hamburger and Search in first row, Action Buttons in second row */}
            <div className="w-full sm:hidden">
              {/* First row - Hamburger and Search */}
              <div className="flex items-center space-x-2 mb-2">
                {onToggleSidebar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleSidebar}
                    className="hover:bg-primary/20 hover:text-foreground flex-shrink-0 text-white/90 hover:text-white bg-white/10 hover:bg-white/20"
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
                    className="pl-9 w-full"
                  />
                </div>
              </div>
              
              {/* Second row - Action Buttons in right corner */}
              <div className="flex justify-end">
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" className="text-white border-white/30 hover:bg-white/20 hover:text-white bg-white/10" size="sm">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" className="text-white border-white/30 hover:bg-white/20 hover:text-white bg-white/10" size="sm">
                        <SortAsc className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sort</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                        onClick={() => setShowAddTaskModal(true)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Task</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
                      className={`flex-shrink-0 ${
                        activeView === view.id 
                          ? "bg-white/20 text-white" 
                          : "text-white/90 hover:bg-white/20 hover:text-white"
                      }`}
                      onClick={() => setActiveView(view.id as ViewType)}
                    >
                      <view.icon className="w-4 h-4 mr-2" />
                      <span>{view.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Right side - Search and Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search projects, tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-56"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="text-white border-white/30 hover:bg-white/20 hover:text-white bg-white/10" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    <span>Filter</span>
                  </Button>
                  
                  <Button variant="outline" className="text-white border-white/30 hover:bg-white/20 hover:text-white bg-white/10" size="sm">
                    <SortAsc className="w-4 h-4 mr-2" />
                    <span>Sort</span>
                  </Button>
                  
                  <Button 
                    size="sm" 
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    onClick={() => setShowAddTaskModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Add Task</span>
                  </Button>
                </div>
              </div>
            </div>
              

          </div>

          {/* View Description */}
          {activeView !== 'dashboard' && (
            <div className="mt-2 sm:mt-3 flex items-center space-x-2 overflow-x-auto scrollbar-hide">
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {views.find(v => v.id === activeView)?.description}
              </Badge>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  Searching: "{searchQuery}"
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-background-secondary min-w-0">
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