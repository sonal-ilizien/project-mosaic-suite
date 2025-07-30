export interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  assignee: { name: string; avatar: string };
  dueDate: string;
  comments: number;
  attachments: number;
  tags: string[];
  status: string;
  parentId: string | null;
  subtasks: string[];
  attachmentsList?: Array<{
    name: string;
    size: string;
    type: string;
    url: string;
    description: string;
    file?: File;
  }>;
  commentsList?: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
  development?: {
    branches: number;
    commits: number;
    pullRequests: number;
  };
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
}

// Global data dictionary to persist tasks across the application
class TaskDataStore {
  private tasks: Task[] = [];
  private columns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: []
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: []
    },
    {
      id: 'review',
      title: 'In Review',
      tasks: []
    },
    {
      id: 'done',
      title: 'Done',
      tasks: []
    }
  ];

  // Get all tasks
  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  // Get all columns with tasks
  getColumns(): KanbanColumn[] {
    return this.columns.map(column => ({
      ...column,
      tasks: this.tasks.filter(task => task.status === column.id)
    }));
  }

  // Add a new task
  addTask(task: Task): void {
    // Check if task with same ID already exists
    const existingTask = this.tasks.find(t => t.id === task.id);
    if (existingTask) {
      console.log('Task already exists, skipping duplicate addition:', task.id);
      return;
    }
    
    this.tasks.push(task);
    this.updateColumnTasks();
  }

  // Update an existing task
  updateTask(taskId: string, updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.updateColumnTasks();
    }
  }

  // Delete a task
  deleteTask(taskId: string): void {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.updateColumnTasks();
  }

  // Move task between columns
  moveTask(taskId: string, newStatus: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      this.updateColumnTasks();
    }
  }

  // Get tasks by status
  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  // Get task by ID
  getTaskById(taskId: string): Task | undefined {
    return this.tasks.find(task => task.id === taskId);
  }

  // Get total number of tasks
  getTotalTasks(): number {
    return this.tasks.length;
  }

  // Get completed tasks count
  getCompletedTasksCount(): number {
    return this.tasks.filter(task => task.status === 'done').length;
  }

  // Get in progress tasks count
  getInProgressTasksCount(): number {
    return this.tasks.filter(task => task.status === 'inprogress').length;
  }

  // Update column tasks based on current task statuses
  private updateColumnTasks(): void {
    this.columns = this.columns.map(column => ({
      ...column,
      tasks: this.tasks.filter(task => task.status === column.id)
    }));
  }

  // Clear all tasks
  clearTasks(): void {
    this.tasks = [];
    this.updateColumnTasks();
  }

  // Add multiple tasks at once
  addTasks(tasks: Task[]): void {
    this.tasks.push(...tasks);
    this.updateColumnTasks();
  }

  // Get tasks for a specific project
  getTasksForProject(projectId: string): Task[] {
    return this.tasks.filter(task => {
      // Check if any tag contains the project ID or name
      return task.tags.some(tag => 
        tag === projectId || // Exact match for project ID
        tag.toLowerCase().includes(projectId.toLowerCase()) // Partial match
      );
    });
  }
}

// Export a singleton instance
export const taskDataStore = new TaskDataStore(); 