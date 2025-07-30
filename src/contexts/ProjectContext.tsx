import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, projectDataStore } from '../lib/projectData';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: number) => void;
  clearProjects: () => void;
  resetToDefaults: () => void;
  addTaskToProject: (projectId: number, task: any) => void;
  updateTaskInProject: (projectId: number, taskId: string, updatedTask: any) => void;
  deleteTaskFromProject: (projectId: number, taskId: string) => void;
  getProjectTasks: (projectId: number) => any[];
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
  const [projects, setProjects] = useState<Project[]>(() => projectDataStore.getProjects());

  const addProject = (project: Project) => {
    projectDataStore.addProject(project);
    setProjects(projectDataStore.getProjects());
  };

  const updateProject = (updatedProject: Project) => {
    projectDataStore.updateProject(updatedProject);
    setProjects(projectDataStore.getProjects());
  };

  const deleteProject = (projectId: number) => {
    projectDataStore.deleteProject(projectId);
    setProjects(projectDataStore.getProjects());
  };

  const clearProjects = () => {
    projectDataStore.clearProjects();
    setProjects(projectDataStore.getProjects());
  };

  const resetToDefaults = () => {
    projectDataStore.resetToDefaults();
    setProjects(projectDataStore.getProjects());
  };

  const addTaskToProject = (projectId: number, task: any) => {
    console.log('Adding task to project:', projectId, task);
    projectDataStore.addTaskToProject(projectId, task);
    const updatedProjects = projectDataStore.getProjects();
    console.log('Updated projects after adding task:', updatedProjects);
    setProjects(updatedProjects);
  };

  const updateTaskInProject = (projectId: number, taskId: string, updatedTask: any) => {
    projectDataStore.updateTaskInProject(projectId, taskId, updatedTask);
    setProjects(projectDataStore.getProjects());
  };

  const deleteTaskFromProject = (projectId: number, taskId: string) => {
    projectDataStore.deleteTaskFromProject(projectId, taskId);
    setProjects(projectDataStore.getProjects());
  };

  const getProjectTasks = (projectId: number) => {
    return projectDataStore.getProjectTasks(projectId);
  };

  const value: ProjectContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    clearProjects,
    resetToDefaults,
    addTaskToProject,
    updateTaskInProject,
    deleteTaskFromProject,
    getProjectTasks,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 