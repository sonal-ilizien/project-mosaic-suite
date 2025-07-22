export interface Project {
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
  projectTasks?: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    assignee: { name: string; avatar: string };
    dueDate: string;
    status: string;
    comments: number;
    attachments: number;
    tags: string[];
  }>;
}

// Default projects for initial state
export const defaultProjects: Project[] = [
  {
    id: 1,
    name: 'Mobile App Redesign',
    type: 'Design',
    status: 'In Progress',
    priority: 'High',
    assignee: 'John Doe',
    dueDate: '2024-01-15',
    progress: 75,
    tasks: 12,
    completedTasks: 9,
    description: 'Redesign the mobile application with modern UI/UX principles and improved user experience.'
  },
  {
    id: 2,
    name: 'Q1 Budget Planning',
    type: 'Finance',
    status: 'Review',
    priority: 'Medium',
    assignee: 'Jane Smith',
    dueDate: '2024-01-20',
    progress: 40,
    tasks: 8,
    completedTasks: 3,
    description: 'Plan and allocate budget for Q1 2024 including all departments and projects.'
  },
  {
    id: 3,
    name: 'Website Migration',
    type: 'Development',
    status: 'Completed',
    priority: 'High',
    assignee: 'Mike Johnson',
    dueDate: '2024-01-10',
    progress: 100,
    tasks: 15,
    completedTasks: 15,
    description: 'Migrate the existing website to a new platform with improved performance and security.'
  },
  {
    id: 4,
    name: 'Team Onboarding',
    type: 'HR',
    status: 'Planning',
    priority: 'Low',
    assignee: 'Sarah Wilson',
    dueDate: '2024-02-01',
    progress: 20,
    tasks: 6,
    completedTasks: 1,
    description: 'Onboard new team members with comprehensive training and orientation programs.'
  },
  {
    id: 5,
    name: 'Product Launch',
    type: 'Marketing',
    status: 'In Progress',
    priority: 'High',
    assignee: 'David Brown',
    dueDate: '2024-01-25',
    progress: 60,
    tasks: 20,
    completedTasks: 12,
    description: 'Launch the new product with comprehensive marketing campaign and customer outreach.'
  }
];

// Global data dictionary to persist projects across the application
class ProjectDataStore {
  private projects: Project[] = [...defaultProjects];

  // Get all projects
  getProjects(): Project[] {
    return [...this.projects]; // Return a copy to prevent direct mutation
  }

  // Add a new project
  addProject(project: Project): void {
    this.projects.push(project);
  }

  // Update an existing project
  updateProject(updatedProject: Project): void {
    const index = this.projects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      this.projects[index] = updatedProject;
    }
  }

  // Delete a project
  deleteProject(projectId: number): void {
    this.projects = this.projects.filter(p => p.id !== projectId);
  }

  // Clear all projects
  clearProjects(): void {
    this.projects = [];
  }

  // Reset to default projects
  resetToDefaults(): void {
    this.projects = [...defaultProjects];
  }

  // Get project by ID
  getProjectById(id: number): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  // Get projects by status
  getProjectsByStatus(status: string): Project[] {
    return this.projects.filter(p => p.status === status);
  }

  // Get projects by type
  getProjectsByType(type: string): Project[] {
    return this.projects.filter(p => p.type === type);
  }

  // Get total number of projects
  getTotalProjects(): number {
    return this.projects.length;
  }

  // Get completed projects count
  getCompletedProjectsCount(): number {
    return this.projects.filter(p => p.status === 'Completed').length;
  }

  // Get in progress projects count
  getInProgressProjectsCount(): number {
    return this.projects.filter(p => p.status === 'In Progress').length;
  }

  // Add task to a project
  addTaskToProject(projectId: number, task: any): void {
    console.log('ProjectDataStore: Adding task to project:', projectId, task);
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      if (!project.projectTasks) {
        project.projectTasks = [];
      }
      project.projectTasks.push(task);
      project.tasks = project.projectTasks.length;
      project.completedTasks = project.projectTasks.filter(t => t.status === 'done').length;
      // Update progress based on completed tasks
      if (project.tasks > 0) {
        project.progress = Math.round((project.completedTasks / project.tasks) * 100);
      }
      console.log('ProjectDataStore: Updated project:', project.name, 'Tasks:', project.tasks, 'Completed:', project.completedTasks);
    } else {
      console.log('ProjectDataStore: Project not found with ID:', projectId);
    }
  }

  // Update task in a project
  updateTaskInProject(projectId: number, taskId: string, updatedTask: any): void {
    const project = this.projects.find(p => p.id === projectId);
    if (project && project.projectTasks) {
      const taskIndex = project.projectTasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        project.projectTasks[taskIndex] = updatedTask;
        project.completedTasks = project.projectTasks.filter(t => t.status === 'done').length;
        if (project.tasks > 0) {
          project.progress = Math.round((project.completedTasks / project.tasks) * 100);
        }
      }
    }
  }

  // Delete task from a project
  deleteTaskFromProject(projectId: number, taskId: string): void {
    const project = this.projects.find(p => p.id === projectId);
    if (project && project.projectTasks) {
      project.projectTasks = project.projectTasks.filter(t => t.id !== taskId);
      project.tasks = project.projectTasks.length;
      project.completedTasks = project.projectTasks.filter(t => t.status === 'done').length;
      if (project.tasks > 0) {
        project.progress = Math.round((project.completedTasks / project.tasks) * 100);
      }
    }
  }

  // Get tasks for a project
  getProjectTasks(projectId: number): any[] {
    const project = this.projects.find(p => p.id === projectId);
    return project?.projectTasks || [];
  }
}

// Export a singleton instance
export const projectDataStore = new ProjectDataStore(); 