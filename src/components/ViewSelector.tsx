import { useState } from "react";
import { 
  LayoutGrid, 
  List, 
  Calendar, 
  BarChart3,
  Filter,
  Search,
  SortAsc,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Dashboard from "./Dashboard";
import KanbanBoard from "./KanbanBoard";
import TemplateSelector from "./TemplateSelector";
import ListView from "./ListView";
import CalendarView from "./CalendarView";
import ProjectOverview from "./ProjectOverview";
import NewProjectModal from "./NewProjectModal";
import TemplateGallery from "./TemplateGallery";
import Analytics from "./Analytics";
import AddTaskModal from "./AddTaskModal";

type ViewType = 'dashboard' | 'kanban' | 'list' | 'calendar' | 'templates' | 'analytics' | 'project-overview';

const ViewSelector = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

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
          setSelectedProject(project);
          setActiveView('project-overview');
        }} />;
      case 'kanban':
        return <KanbanBoard tasks={tasks} />;
      case 'templates':
        return <TemplateSelector onBrowseTemplates={handleBrowseTemplates} />;
      case 'list':
        return <ListView tasks={tasks} />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'analytics':
        return <Analytics />;
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
    <div className="flex-1 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          {/* View Tabs */}
          <div className="flex items-center space-x-2">
            {views.map((view) => (
              <Button
                key={view.id}
                variant={activeView === view.id ? "default" : "ghost"}
                size="sm"
                className={`${
                  activeView === view.id 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary"
                }`}
                onClick={() => setActiveView(view.id as ViewType)}
              >
                <view.icon className="w-4 h-4 mr-2" />
                {view.name}
              </Button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects, tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <Button variant="outline" size="sm">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort
            </Button>
            
            <Button 
              size="sm" 
              className="bg-gradient-primary hover:opacity-90"
              onClick={() => setShowAddTaskModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* View Description */}
        {activeView !== 'dashboard' && (
          <div className="mt-3 flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {views.find(v => v.id === activeView)?.description}
            </Badge>
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                Searching: "{searchQuery}"
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-background-secondary">
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
  );
};

export default ViewSelector;