import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Users,
  PlusCircle,
  ChevronDown,
  Briefcase,
  BarChart3,
  List,
  Filter,
  GitCompare,
  MessageSquare,
  TrendingUp,
  Menu,
  X,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NewProjectModal from "./NewProjectModal";
import { useProjects } from "../contexts/ProjectContext";

interface ProjectSidebarProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
  onProjectSelect?: (project: Record<string, unknown>) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

const ProjectSidebar = ({
  activeView = "dashboard",
  onViewChange,
  onProjectSelect,
  collapsed = false,
  onToggleCollapse,
  isMobile = false,
}: ProjectSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    projects: true,
  });
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const { projects, addProject } = useProjects();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  // Using projects from context instead of local array

  return (
    <div
      className={`${
        isMobile ? "w-full" : "w-64"
      } bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 border-r border-white/20 h-screen flex flex-col relative sticky top-0 shadow-2xl sidebar-glow sidebar-morph sidebar-text sidebar-no-blur`}
    >
      {/* Close button for mobile */}
      {isMobile && onToggleCollapse && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 ripple-effect icon-animated"
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
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 ripple-effect icon-animated"
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}

      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 float-animation"></div>
        <div
          className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 float-animation"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Additional morphing elements */}
        <div
          className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 shadow-lg glow-border">
            <Briefcase className="w-5 h-5 text-white icon-animated" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-white text-lg sm:text-xl truncate">
              ProjectFlow
            </h1>
            <p className="text-xs text-white/90 truncate font-medium">
              Management Suite
            </p>
          </div>
        </div>
      </div>

      {/*----------------------------------- Navigation Menu --------------------------------------*/}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2 force-scrollbar-white">
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base transition-all duration-300 hover:scale-105 group menu-item-animated ripple-effect ${
              activeView === "dashboard"
                ? "bg-white/30 text-white hover:bg-white/40 shadow-xl border border-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black border border-transparent"
            }`}
            onClick={() => onViewChange?.("dashboard")}
          >
            <LayoutDashboard className="w-4 h-4 mr-2 sm:mr-3 transition-transform group-hover:scale-110 icon-animated" />
            <span className="truncate font-medium">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base transition-all duration-300 hover:scale-105 group menu-item-animated ripple-effect ${
              activeView === "company-dashboard"
                ? "bg-white/30 text-white hover:bg-white/40 shadow-xl border border-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black border border-transparent"
            }`}
            onClick={() => onViewChange?.("company-dashboard")}
          >
            <Building className="w-4 h-4 mr-2 sm:mr-3 transition-transform group-hover:scale-110 icon-animated" />
            <span className="truncate font-medium">Company Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base transition-all duration-300 hover:scale-105 group menu-item-animated ripple-effect ${
              activeView === "tasks-list"
                ? "bg-white/30 text-white hover:bg-white/40 shadow-xl border border-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black border border-transparent"
            }`}
            onClick={() => onViewChange?.("tasks-list")}
          >
            <FolderKanban className="w-4 h-4 mr-2 sm:mr-3 transition-transform group-hover:scale-110 icon-animated" />
            <span className="truncate font-medium">Tasks</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base transition-all duration-300 hover:scale-105 group menu-item-animated ripple-effect ${
              activeView === "list"
                ? "bg-white/30 text-white hover:bg-white/40 shadow-xl border border-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black border border-transparent"
            }`}
            onClick={() => onViewChange?.("list")}
          >
            <List className="w-4 h-4 mr-2 sm:mr-3 transition-transform group-hover:scale-110 icon-animated" />
            <span className="truncate font-medium">Projects</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base transition-all duration-300 hover:scale-105 group menu-item-animated ripple-effect ${
              activeView === "calendar"
                ? "bg-white/30 text-white hover:bg-white/40 shadow-xl border border-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black border border-transparent"
            }`}
            onClick={() => onViewChange?.("calendar")}
          >
            <Calendar className="w-4 h-4 mr-2 sm:mr-3 transition-transform group-hover:scale-110 icon-animated" />
            <span className="truncate font-medium">Calendar</span>
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base transition-all duration-300 hover:scale-105 group menu-item-animated ripple-effect ${
              activeView === "templates"
                ? "bg-white/30 text-white hover:bg-white/40 shadow-xl border border-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black border border-transparent"
            }`}
            onClick={() => onViewChange?.("templates")}
          >
            <Filter className="w-4 h-4 mr-2 sm:mr-3 transition-transform group-hover:scale-110 icon-animated" />
            <span className="truncate font-medium">Templates</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base transition-all duration-300 hover:scale-105 group menu-item-animated ripple-effect ${
              activeView === "analytics"
                ? "bg-white/30 text-white hover:bg-white/40 shadow-xl border border-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black border border-transparent"
            }`}
            onClick={() => onViewChange?.("analytics")}
          >
            <BarChart3 className="w-4 h-4 mr-2 sm:mr-3 transition-transform group-hover:scale-110 icon-animated" />
            <span className="truncate font-medium">Analytics</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base transition-all duration-300 hover:scale-105 group menu-item-animated ripple-effect ${
              activeView === "chart-config"
                ? "bg-white/30 text-white hover:bg-white/40 shadow-xl border border-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black border border-transparent"
            }`}
            onClick={() => onViewChange?.("chart-config")}
          >
            <TrendingUp className="w-4 h-4 mr-2 sm:mr-3 transition-transform group-hover:scale-110 icon-animated" />
            <span className="truncate font-medium">Charts</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base transition-all duration-300 hover:scale-105 group menu-item-animated ripple-effect ${
              activeView === "template-comparison"
                ? "bg-white/30 text-white hover:bg-white/40 shadow-xl border border-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black border border-transparent"
            }`}
            onClick={() => onViewChange?.("template-comparison")}
          >
            <GitCompare className="w-4 h-4 mr-2 sm:mr-3 transition-transform group-hover:scale-110 icon-animated" />
            <span className="truncate font-medium">Compare</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base menu-item-animated ripple-effect ${
              activeView === "whiteboard"
                ? "bg-white/20 text-white hover:bg-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black"
            }`}
            onClick={() => onViewChange?.("whiteboard")}
          >
            <MessageSquare className="w-4 h-4 mr-2 sm:mr-3 icon-animated" />
            <span className="truncate">Board</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm sm:text-base menu-item-animated ripple-effect ${
              activeView === "team"
                ? "bg-white/20 text-white hover:bg-white/30 wave-active glow-border"
                : "text-white/95 hover:bg-white/20 hover:text-black"
            }`}
            onClick={() => onViewChange?.("team")}
          >
            <Users className="w-4 h-4 mr-2 sm:mr-3 icon-animated" />
            <span className="truncate">Team</span>
          </Button>
        </nav>

        {/* Recent Projects */}
        <div className="pt-4">
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto text-white/95 hover:bg-white/20 hover:text-black menu-item-animated ripple-effect"
            onClick={() => toggleSection("projects")}
          >
            <span className="text-sm font-medium text-white">
              Recent Projects
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform text-white icon-animated ${
                expandedSections.projects ? "rotate-180" : ""
              }`}
            />
          </Button>

          {expandedSections.projects && (
            <div className="ml-2 mt-2 space-y-1">
              {projects.slice(0, 5).map((project) => (
                <Button
                  key={project.id}
                  variant="ghost"
                  className="w-full justify-start text-xs sm:text-sm py-2 text-white/90 hover:bg-white/20 hover:text-black menu-item-animated ripple-effect"
                  onClick={() =>
                    onProjectSelect?.(
                      project as unknown as Record<string, unknown>
                    )
                  }
                >
                  <div className="w-2 h-2 rounded-full bg-white/60 mr-2 sm:mr-3" />
                  <span className="truncate">{project.name}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/20 bg-gradient-to-r from-blue-600/50 to-indigo-600/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/95 hover:bg-white/20 hover:text-black menu-item-animated ripple-effect"
          onClick={() => setShowNewProjectModal(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2 sm:mr-3 icon-animated" />
          <span className="text-sm font-medium">New Project</span>
        </Button>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
        onProjectCreate={(projectData) => {
          const project = {
            id: Date.now(),
            name: projectData.name,
            type: projectData.template || "General",
            status: projectData.status || "Planning",
            priority: projectData.priority || "Medium",
            assignee: "Unassigned",
            dueDate: projectData.endDate
              ? new Date(projectData.endDate).toISOString().split("T")[0]
              : "",
            progress: 0,
            tasks: 0,
            completedTasks: 0,
            description: projectData.description || "",
          };
          addProject(project);
          setShowNewProjectModal(false);
        }}
      />
    </div>
  );
};

export default ProjectSidebar;
