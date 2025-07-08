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
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import NewProjectModal from "./NewProjectModal";

const ProjectSidebar = () => {
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
    { id: 'personal', name: 'Personal Tasks', icon: User, color: 'bg-primary' },
    { id: 'agile', name: 'Agile Sprint', icon: FolderKanban, color: 'bg-accent' },
    { id: 'finance', name: 'Finance Management', icon: DollarSign, color: 'bg-warning' },
    { id: 'shipbuilding', name: 'Shipbuilding', icon: Anchor, color: 'bg-destructive' }
  ];

  const projects = [
    { name: 'Mobile App Redesign', progress: 75, status: 'active' },
    { name: 'Q1 Budget Planning', progress: 40, status: 'active' },
    { name: 'Website Migration', progress: 90, status: 'review' }
  ];

  return (
    <div className="w-64 bg-background-secondary border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">ProjectFlow</h1>
            <p className="text-xs text-muted-foreground">Management Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-primary-light text-primary hover:bg-primary-light">
            <LayoutDashboard className="w-4 h-4 mr-3" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-secondary">
            <FolderKanban className="w-4 h-4 mr-3" />
            Projects
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-secondary">
            <Calendar className="w-4 h-4 mr-3" />
            Calendar
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-secondary">
            <Users className="w-4 h-4 mr-3" />
            Team
          </Button>
        </nav>

        {/* Project Templates Section */}
        <div className="pt-4">
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto hover:bg-secondary"
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
                  className="w-full justify-start text-sm py-2 hover:bg-secondary"
                >
                  <div className={`w-2 h-2 rounded-full ${template.color} mr-3`} />
                  {template.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Active Projects */}
        <div className="pt-4">
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto hover:bg-secondary"
            onClick={() => toggleSection('projects')}
          >
            <span className="text-sm font-medium text-foreground">Active Projects</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.projects ? 'rotate-180' : ''}`} />
          </Button>
          
          {expandedSections.projects && (
            <div className="ml-2 mt-2 space-y-2">
              {projects.map((project, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-sm py-3 h-auto hover:bg-secondary"
                >
                  <div className="flex-1 text-left">
                    <div className="font-medium">{project.name}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button 
          className="w-full bg-gradient-primary hover:opacity-90 text-white"
          onClick={() => setShowNewProjectModal(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          New Project
        </Button>
        
        <Button variant="ghost" className="w-full justify-start mt-2 hover:bg-secondary">
          <Settings className="w-4 h-4 mr-3" />
          Settings
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