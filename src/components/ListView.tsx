import { useState } from "react";
import { Search, Filter, ChevronDown, Calendar, User, MoreHorizontal, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import NewProjectModal from "./NewProjectModal";
import ProjectDetailsModal from "./ProjectDetailsModal";
import { useProjects } from "../contexts/ProjectContext";

interface Project {
  id: number;
  name: string;
  type: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  progress: number;
  tasks: number;
  completedTasks: number;
  description?: string;
}

interface ModalProject {
  id: string;
  name: string;
  description: string;
  template: string;
  startDate?: Date;
  endDate?: Date;
  team: string[];
  createdAt: Date;
  status: string;
  progress: number;
  priority?: string;
}

interface ListViewProps {
  tasks?: unknown[];
}

const ListView = ({ tasks = [] }: ListViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ModalProject | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<{id: string; name: string; description?: string} | null>(null);

  // Use shared project context
  const { projects, addProject, updateProject, deleteProject } = useProjects();

  const projectTypes = [
    'Design', 'Finance', 'Development', 'HR', 'Marketing', 'Sales', 'Research', 'Operations'
  ];

  const projectStatuses = [
    'Planning', 'In Progress', 'Review', 'Completed', 'On Hold', 'Cancelled'
  ];

  const projectPriorities = [
    'Low', 'Medium', 'High', 'Urgent'
  ];

  const teamMembers = [
    'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Emily Davis', 'Alex Chen'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success text-white';
      case 'In Progress': return 'bg-primary text-white';
      case 'Review': return 'bg-warning text-white';
      case 'Planning': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-destructive text-white';
      case 'Medium': return 'bg-warning text-white';
      case 'Low': return 'bg-success text-white';
      case 'Urgent': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    return matchesSearch && project.status.toLowerCase() === filterBy.toLowerCase();
  });

  const handleNewProject = () => {
    // Set a default template for new projects
    setSelectedTemplate({
      id: 'development',
      name: 'Development Template',
      description: 'Template for development projects'
    });
    setShowNewProjectModal(true);
  };

  const handleViewProjectDetails = (project: Project) => {
    setViewingProject(project);
    setShowViewDetailsModal(true);
  };

  const handleEditProject = (project: Project) => {
    // Convert ListView Project to NewProjectModal Project format
    const modalProject = {
      id: project.id.toString(),
      name: project.name,
      description: project.description || '',
      template: project.type,
      startDate: undefined,
      endDate: project.dueDate ? new Date(project.dueDate) : undefined,
      team: [project.assignee],
      createdAt: new Date(),
      status: project.status,
      progress: project.progress,
      priority: project.priority
    };
    
    setEditingProject(modalProject);
    
    // Set the template based on the project type
    const templateMap: { [key: string]: string } = {
      'Design': 'agile',
      'Development': 'agile',
      'Finance': 'finance',
      'HR': 'hr',
      'Marketing': 'product',
      'Construction': 'construction',
      'Consulting': 'consulting',
      'Education': 'education'
    };
    
    const templateId = templateMap[project.type] || 'personal';
    setSelectedTemplate({
      id: templateId,
      name: `${project.type} Template`,
      description: `Template for ${project.type} projects`
    });
    
    setShowNewProjectModal(true);
  };

  const handleCreateProject = (projectData: {name: string; template?: string; status?: string; priority?: string; lead?: string; endDate?: Date; description?: string}) => {
    if (editingProject) {
      // Update existing project - find the original project by name since IDs don't match
      const originalProject = projects.find(p => p.name === editingProject.name);
      if (originalProject) {
        const updatedProject: Project = {
          ...originalProject,
          name: projectData.name,
          type: projectData.template || originalProject.type,
          status: projectData.status || originalProject.status,
          priority: projectData.priority || originalProject.priority,
          assignee: projectData.lead || originalProject.assignee,
          dueDate: projectData.endDate ? new Date(projectData.endDate).toISOString().split('T')[0] : originalProject.dueDate,
          description: projectData.description || originalProject.description
        };

        updateProject(updatedProject);
      }
      setEditingProject(null);
    } else {
      // Create new project
      const project: Project = {
        id: Date.now(),
        name: projectData.name,
        type: projectData.template || 'General',
        status: projectData.status || 'Planning',
        priority: projectData.priority || 'Medium',
        assignee: projectData.lead || 'Unassigned',
        dueDate: projectData.endDate ? new Date(projectData.endDate).toISOString().split('T')[0] : '',
        progress: 0,
        tasks: 0,
        completedTasks: 0,
        description: projectData.description || ''
      };

      addProject(project);
    }

    setShowNewProjectModal(false);
    setSelectedTemplate(null);
  };



  const handleDeleteProject = (projectId: number) => {
    deleteProject(projectId);
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Project List</h1>
            <p className="text-muted-foreground">Manage and track all your projects</p>
          </div>
          <Button 
            className="bg-gradient-primary hover:opacity-90"
            onClick={handleNewProject}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects, assignees, or types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Filter: {filterBy === 'all' ? 'All' : filterBy}</span>
                      <ChevronDown className="w-4 h-4 sm:ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterBy('all')}>All Projects</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterBy('in progress')}>In Progress</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterBy('review')}>In Review</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterBy('completed')}>Completed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterBy('planning')}>Planning</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter Projects</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </Card>

        {/* Projects Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-background-secondary cursor-pointer">
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{project.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{project.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {project.completedTasks}/{project.tasks}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProjectDetails(project)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProject(project)}>
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem>Assign Team</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{projects.filter(p => p.status === 'Completed').length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{projects.filter(p => p.status === 'In Progress').length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{projects.filter(p => p.status === 'Planning').length}</div>
              <div className="text-sm text-muted-foreground">Planning</div>
            </div>
          </Card>
        </div>

        {/* New Project Modal */}
        <NewProjectModal
          open={showNewProjectModal}
          onOpenChange={setShowNewProjectModal}
          selectedTemplate={selectedTemplate}
          editingProject={editingProject}
          onProjectCreate={handleCreateProject}
        />

        {/* Project Details Modal */}
        <ProjectDetailsModal
          open={showViewDetailsModal}
          onOpenChange={setShowViewDetailsModal}
          project={viewingProject}
        />

      </div>
    </TooltipProvider>
  );
};

export default ListView;