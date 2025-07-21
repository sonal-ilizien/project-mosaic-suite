import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([
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
  ]);

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
  };

  const deleteProject = (projectId: number) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const value: ProjectContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 