import apiService from "@/services/apiService";

// Interfaces for Agile API payloads
export interface CreateSprintPayload {
  project: number;
  name: string;
  start_date: string;
  end_date: string;
  goal: string;
}

export interface CreateTaskPayload {
  project: number;
  title: string;
  description: string;
  assignee: number;
  status: string;
  priority: string;
  due_date: string;
  start_date: string;
  sprint: number;
  story_points: number;
  epic: string;
  man_days: string;
}

export interface CreateBugPayload {
  title: string;
  description: string;
  project: number;
  assignee: number;
  priority: string;
  severity: string;
  reproducible: boolean;
  steps_to_reproduce: string;
}

export interface CreateCommentPayload {
  text: string;
}

export interface CreateWorkLogPayload {
  start_time: string;
  end_time: string;
  description: string;
}

// Agile API Functions
export const agileAPI = {
  // Create Sprint
  createSprint: async (sprintPayload: CreateSprintPayload) => {
    try {
      const response = await apiService.post('/agile/sprints/', sprintPayload);
      return response;
    } catch (error) {
      console.error('Error creating sprint:', error);
      throw error;
    }
  },

  // Create Task
  createTask: async (taskPayload: CreateTaskPayload) => {
    try {
      const response = await apiService.post('/agile/tasks/', taskPayload);
      return response;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Create Bug
  createBug: async (bugPayload: CreateBugPayload) => {
    try {
      const response = await apiService.post('/agile/bugs/', bugPayload);
      return response;
    } catch (error) {
      console.error('Error creating bug:', error);
      throw error;
    }
  },

  // Add Comment to Task
  addTaskComment: async (taskId: number, commentPayload: CreateCommentPayload) => {
    try {
      const response = await apiService.post(`/agile/tasks/${taskId}/comments/`, commentPayload);
      return response;
    } catch (error) {
      console.error('Error adding task comment:', error);
      throw error;
    }
  },

  // Upload Task Attachment
  uploadTaskAttachment: async (taskId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiService.post(`/agile/tasks/${taskId}/attachments/`, formData);
      return response;
    } catch (error) {
      console.error('Error uploading task attachment:', error);
      throw error;
    }
  },

  // Add Work Log to Task
  addWorkLog: async (taskId: number, workLogPayload: CreateWorkLogPayload) => {
    try {
      const response = await apiService.post(`/agile/tasks/${taskId}/work-logs/`, workLogPayload);
      return response;
    } catch (error) {
      console.error('Error adding work log:', error);
      throw error;
    }
  },

  // Get Sprints for Project
  getSprints: async (projectId: number) => {
    try {
      const response = await apiService.get(`/agile/sprints/`, { project: projectId });
      return response;
    } catch (error) {
      console.error('Error fetching sprints:', error);
      throw error;
    }
  },

  // Get Tasks for Project
  getTasks: async (projectId: number, sprintId?: number) => {
    try {
      const params: { project: number; sprint?: number } = { project: projectId };
      if (sprintId) {
        params.sprint = sprintId;
      }
      const response = await apiService.get('/agile/tasks/', params);
      return response;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get Bugs for Project
  getBugs: async (projectId: number) => {
    try {
      const response = await apiService.get('/agile/bugs/', { project: projectId });
      return response;
    } catch (error) {
      console.error('Error fetching bugs:', error);
      throw error;
    }
  },

  // Update Task Status
  updateTaskStatus: async (taskId: number, status: string) => {
    try {
      const response = await apiService.put(`/agile/tasks/${taskId}/`, { status });
      return response;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },

  // Update Task Story Points
  updateTaskStoryPoints: async (taskId: number, storyPoints: number) => {
    try {
      const response = await apiService.put(`/agile/tasks/${taskId}/`, { story_points: storyPoints });
      return response;
    } catch (error) {
      console.error('Error updating task story points:', error);
      throw error;
    }
  }
};

export default agileAPI; 