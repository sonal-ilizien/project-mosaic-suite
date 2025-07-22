import { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  MoreHorizontal, 
  User, 
  Calendar, 
  Flag,
  MessageSquare,
  Paperclip,
  Settings,
  Eye,
  Filter,
  List,
  X,
  Download,
  ChevronDown,
  Heart,
  Archive,
  Trash2,
  Link,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Tag,
  Clock,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import AddTaskModal from "./AddTaskModal";
import { taskDataStore, Task, KanbanColumn } from "../lib/taskData";

// Utility function to generate initials from any name
const generateInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  
  // Split the name into parts and filter out empty strings
  const nameParts = name.trim().split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 0) return '';
  
  if (nameParts.length === 1) {
    // If only one name, take first two letters
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  
  // Take first letter of first name and first letter of last name
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

interface KanbanBoardProps {
  tasks?: Task[];
  projectId?: number; // Add projectId prop to filter tasks by project
}

const KanbanBoard = ({ tasks = [], projectId }: KanbanBoardProps) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(() => {
    // Filter tasks by project if projectId is provided
    if (projectId) {
      const projectTasks = taskDataStore.getTasksForProject(projectId.toString());
      return taskDataStore.getColumns().map(column => ({
        ...column,
        tasks: projectTasks.filter(task => task.status === column.id)
      }));
    }
    return taskDataStore.getColumns();
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedColumnStatus, setSelectedColumnStatus] = useState<string>('todo');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showSidebarOptionsMenu, setShowSidebarOptionsMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [likedTasks, setLikedTasks] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [sortBy, setSortBy] = useState<string>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [automationRule, setAutomationRule] = useState<string>('');
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<string>('week');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [activeColumnIndex, setActiveColumnIndex] = useState<number | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [displaySettings, setDisplaySettings] = useState({
    showSubtasks: true,
    showAttachments: true,
    showComments: true,
    showDevelopment: true,
    showTags: true,
    showDueDate: true,
    showPriority: true,
    showAssignee: true,
    showProgress: true,
    showCompleted: true,
    groupBy: 'status',
    viewType: 'kanban'
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadDescription, setUploadDescription] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(true);
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [showReporterModal, setShowReporterModal] = useState(false);
  const [selectedReporter, setSelectedReporter] = useState<string>('');

  // Update columns when task data store changes
  useEffect(() => {
    const updateColumns = () => {
      if (projectId) {
        // Filter tasks by project if projectId is provided
        const projectTasks = taskDataStore.getTasksForProject(projectId.toString());
        const filteredColumns = taskDataStore.getColumns().map(column => ({
          ...column,
          tasks: projectTasks.filter(task => task.status === column.id)
        }));
        setColumns(filteredColumns);
      } else {
        setColumns(taskDataStore.getColumns());
      }
    };

    // Initial load
    updateColumns();
  }, [projectId]);

  // Update columns when tasks are added (triggered by addNewTask)
  const addNewTask = (task: Task) => {
    // Add task to the data store
    taskDataStore.addTask(task);
    
    // Update local columns state immediately with project filtering
    if (projectId) {
      const projectTasks = taskDataStore.getTasksForProject(projectId.toString());
      const filteredColumns = taskDataStore.getColumns().map(column => ({
        ...column,
        tasks: projectTasks.filter(task => task.status === column.id)
      }));
      setColumns(filteredColumns);
    } else {
      setColumns(taskDataStore.getColumns());
    }
  };

  // Trigger animations when component mounts or tasks change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [columns]);

  // Sequential border animation through columns
  useEffect(() => {
    // Start the sequential animation after cards have finished animating in
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setActiveColumnIndex(prev => (prev + 1) % 4); // 4 columns: todo, inprogress, review, done
      }, 5000); // Change every 15 seconds

      return () => clearInterval(interval);
    }, 2000); // Wait 2 seconds for cards to finish animating

    return () => clearTimeout(timer);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-destructive text-white';
      case 'High': return 'bg-warning text-white';
      case 'Medium': return 'bg-primary text-white';
      case 'Low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  // Get filtered and grouped tasks based on display settings
  const getFilteredTasks = () => {
    let allTasks = [];
    columns.forEach(column => {
      allTasks.push(...column.tasks);
    });

    // Filter completed tasks if needed
    if (!displaySettings.showCompleted) {
      allTasks = allTasks.filter(task => task.status !== 'done');
    }

    return allTasks;
  };

  // Get tasks for specific column based on grouping
  const getTasksForColumn = (columnId: string) => {
    const allTasks = getFilteredTasks();
    
    if (displaySettings.groupBy === 'status') {
      return allTasks.filter(task => task.status === columnId);
    } else if (displaySettings.groupBy === 'priority') {
      return allTasks.filter(task => task.priority === columnId);
    } else if (displaySettings.groupBy === 'assignee') {
      return allTasks.filter(task => task.assignee.name === columnId);
    }
    
    return [];
  };

  // Get columns based on grouping
  const getDisplayColumns = () => {
    if (displaySettings.groupBy === 'priority') {
      return [
        { id: 'Critical', title: 'Critical', color: 'bg-destructive', tasks: [] },
        { id: 'High', title: 'High Priority', color: 'bg-warning', tasks: [] },
        { id: 'Medium', title: 'Medium Priority', color: 'bg-primary', tasks: [] },
        { id: 'Low', title: 'Low Priority', color: 'bg-muted', tasks: [] }
      ];
    } else if (displaySettings.groupBy === 'assignee') {
      const allTasks = getFilteredTasks();
      const assignees = [...new Set(allTasks.map(task => task.assignee.name))];
      return assignees.map(assignee => ({
        id: assignee,
        title: assignee,
        color: 'bg-primary',
        tasks: []
      }));
    } else {
      return columns;
    }
  };

  // Render nested task view
  const renderNestedTask = (task: Task, level: number = 0, index: number = 0, columnIndex: number = 0) => {
    const allTasks = getFilteredTasks();
    const subtasks = allTasks.filter(t => t.parentId === task.id);
    
    return (
      <div key={task.id} className={`${level > 0 ? 'ml-4 border-l border-border pl-3' : ''}`}>
        <Card 
          className={`p-4 hover:shadow-custom-md transition-all cursor-pointer mb-2 w-full card-animate-in ${
            hoveredCardId === task.id ? 'card-hover-highlight' : 
            index === 0 && activeColumnIndex === columnIndex ? 'card-sequential-highlight' : ''
          }`}
          style={{ 
            animationDelay: `${index * 300}ms`
          }}
          onMouseEnter={() => setHoveredCardId(task.id)}
          onMouseLeave={() => setHoveredCardId(null)}
        >
          {/* Task Header */}
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-foreground text-sm leading-tight">
              {task.title}
            </h4>
            <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
              {task.priority}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Task Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-6 h-6 bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {task.assignee.avatar}
              </Avatar>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{task.dueDate}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {task.comments > 0 && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  <span>{task.comments}</span>
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Paperclip className="w-3 h-3" />
                  <span>{task.attachments}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Render subtasks */}
        {displaySettings.viewType === 'nested' && subtasks.map((subtask, subIndex) => 
          renderNestedTask(subtask, level + 1, subIndex)
        )}
      </div>
    );
  };

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTask) return;
    
    const comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newComment,
      createdAt: new Date().toISOString()
    };
    
    setColumns(columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, commentsList: [...(task.commentsList || []), comment], comments: task.comments + 1 }
          : task
      )
    })));
    
    setSelectedTask({
      ...selectedTask,
      commentsList: [...(selectedTask.commentsList || []), comment],
      comments: selectedTask.comments + 1
    });
    
    setNewComment('');
  };

  const handleStatusChange = (newStatus: string) => {
    if (!selectedTask) return;
    
    setColumns(columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, status: newStatus }
          : task
      )
    })));
    
    setSelectedTask({
      ...selectedTask,
      status: newStatus
    });
    
    setShowStatusDropdown(false);
  };

  const handleDevelopmentAdd = () => {
    setShowDevelopmentModal(true);
  };

  const handleUploadDocument = () => {
    setShowUploadModal(true);
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  const handleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  const handleSidebarOptionsMenu = () => {
    setShowSidebarOptionsMenu(!showSidebarOptionsMenu);
  };

  const handleViewMenu = () => {
    setShowViewMenu(!showViewMenu);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleUpload = () => {
    if (selectedTask) {
      const newAttachments = selectedFiles.map(file => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.name.split('.').pop() || 'unknown',
        url: '#',
        description: uploadDescription,
        file: file
      }));
      
      setColumns(columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === selectedTask.id 
            ? { 
                ...task, 
                attachmentsList: [...(task.attachmentsList || []), ...newAttachments],
                attachments: task.attachments + selectedFiles.length
              }
            : task
        )
      })));
      
      setSelectedTask({
        ...selectedTask,
        attachmentsList: [...(selectedTask.attachmentsList || []), ...newAttachments],
        attachments: selectedTask.attachments + selectedFiles.length
      });
    }
    
    setSelectedFiles([]);
    setUploadDescription('');
    setShowUploadModal(false);
  };

  const handleDownload = (attachment: { name: string; url: string; file?: File }) => {
    if (attachment.file) {
      const url = URL.createObjectURL(attachment.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Click outside handlers
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const sidebarOptionsMenuRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
      if (sidebarOptionsMenuRef.current && !sidebarOptionsMenuRef.current.contains(event.target as Node)) {
        setShowSidebarOptionsMenu(false);
      }
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setShowViewMenu(false);
      }
    };

    if (showStatusDropdown || showOptionsMenu || showSidebarOptionsMenu || showViewMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown, showOptionsMenu, showSidebarOptionsMenu, showViewMenu]);

  return (
    <TooltipProvider>
      <div className="p-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Project Board</h1>
            <p className="text-muted-foreground">Mobile App Redesign Sprint</p>
          </div>
          <div className="flex space-x-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog open={showDisplaySettings} onOpenChange={setShowDisplaySettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Display Settings</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Display Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">View Type</label>
                        <Select 
                          value={displaySettings.viewType} 
                          onValueChange={(value) => setDisplaySettings({...displaySettings, viewType: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flat">Flat View</SelectItem>
                            <SelectItem value="nested">Nested View</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Group By</label>
                        <Select 
                          value={displaySettings.groupBy} 
                          onValueChange={(value) => setDisplaySettings({...displaySettings, groupBy: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="priority">Priority</SelectItem>
                            <SelectItem value="assignee">Assignee</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={displaySettings.showCompleted}
                          onChange={(e) => setDisplaySettings({...displaySettings, showCompleted: e.target.checked})}
                        />
                        <label className="text-sm">Show Completed Tasks</label>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Display Settings</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <User className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Assign</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Assign</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Timeline</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Timeline</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={() => {
                    setSelectedColumnStatus('todo');
                    setShowAddTaskModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add Task</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Task</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
          {getDisplayColumns().map((column, columnIndex) => {
            const columnTasks = getTasksForColumn(column.id);
            const parentTasks = columnTasks.filter(task => !task.parentId);
            
            return (
              <div key={column.id} className="min-w-0">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    <h3 className="font-semibold text-foreground">{column.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  {displaySettings.viewType === 'nested' ? (
                    parentTasks.map((task, index) => renderNestedTask(task, 0, index, columnIndex))
                  ) : (
                    columnTasks.map((task, index) => (
                      <Card 
                        key={`${task.id}-${animationKey}`}
                        className={`p-4 hover:shadow-custom-md transition-all cursor-pointer w-full card-animate-in ${
                          hoveredCardId === task.id ? 'card-hover-highlight' : 
                          index === 0 && activeColumnIndex === columnIndex ? 'card-sequential-highlight' : ''
                        }`}
                        style={{ 
                          animationDelay: `${index * 300}ms`,
                          animationPlayState: 'running'
                        }}
                        onClick={() => handleOpenDetail(task)}
                        onMouseEnter={() => setHoveredCardId(task.id)}
                        onMouseLeave={() => setHoveredCardId(null)}
                      >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground text-sm leading-tight">
                            {task.title}
                          </h4>
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                            {task.priority}
                          </Badge>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {task.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Task Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-6 h-6 bg-primary text-primary-foreground text-xs flex items-center justify-center">
                              {task.assignee.avatar}
                            </Avatar>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{task.dueDate}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {task.comments > 0 && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <MessageSquare className="w-3 h-3" />
                                <span>{task.comments}</span>
                              </div>
                            )}
                            {task.attachments > 0 && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Paperclip className="w-3 h-3" />
                                <span>{task.attachments}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}

                  {/* Add Task Button */}
                  <Button 
                    variant="ghost" 
                    className="w-full border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary-light text-muted-foreground hover:text-primary"
                    onClick={() => {
                      setSelectedColumnStatus(column.id);
                      setShowAddTaskModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
          open={showAddTaskModal}
          onOpenChange={setShowAddTaskModal}
          onTaskCreate={(task) => {
            addNewTask(task);
            setShowAddTaskModal(false);
          }}
          defaultStatus={selectedColumnStatus}
        />

        {/* Upload Document Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Paperclip className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  ref={(input) => {
                    if (input) {
                      input.style.display = 'none';
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="cursor-pointer"
                  onClick={() => {
                    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                >
                  Choose Files
                </Button>
                {selectedFiles.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                    <div className="space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea 
                  placeholder="Add a description for the document" 
                  rows={2}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedFiles([]);
                  setUploadDescription('');
                  setShowUploadModal(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={selectedFiles.length === 0}
              >
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Development Modal */}
        <Dialog open={showDevelopmentModal} onOpenChange={setShowDevelopmentModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Development Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branch">Branch</SelectItem>
                    <SelectItem value="commit">Commit</SelectItem>
                    <SelectItem value="pull-request">Pull Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Input placeholder="Enter title" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Enter description" rows={3} />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowDevelopmentModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowDevelopmentModal(false)}>
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Detailed View Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-8xl w-[98vw] max-h-[98vh] overflow-hidden p-0 rounded-none animate-in fade-in-0 zoom-in-95 duration-500">
            {selectedTask && (
              <div className="flex h-full max-h-[95vh]">
                {/* Main Content */}
                <div className="w-[70%] overflow-y-auto p-6 min-w-0">
                  {/* Header */}
                  <div className="mb-6 bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100 -mx-6 -mt-6 px-6 py-3 animate-in slide-in-from-top-2 duration-700">
                    <div className="mb-4">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center animate-in bounce-in duration-800 delay-300 hover:scale-110 hover:rotate-12 transition-all duration-300">
                          <FileText className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 break-words animate-in slide-in-from-left-4 duration-1000 delay-600">{selectedTask.title}</h2>
                      </div>
                      <div className="text-sm text-slate-200 mb-1"></div>
                    </div>
                    <div className="flex items-center space-x-1 animate-in slide-in-from-right-4 duration-700 delay-1200">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-white/20 hover:text-white hover:scale-110 hover:rotate-6 transition-all duration-300"
                        onClick={handleUploadDocument}
                        title="Upload document"
                      >
                        <Paperclip className="w-4 h-4 text-slate-700 hover:animate-spin" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-8 w-8 p-0 hover:bg-white/20 hover:text-white hover:scale-110 hover:rotate-6 transition-all duration-300 ${isLiked ? 'text-red-500' : ''}`}
                        onClick={handleLikeToggle}
                        title={isLiked ? "Unlike" : "Like"}
                      >
                        <Heart className={`w-4 h-4 text-slate-700 hover:animate-pulse ${isLiked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-white/20 hover:text-white hover:scale-110 hover:rotate-6 transition-all duration-300"
                        onClick={() => setShowDetailModal(false)}
                        title="Close"
                      >
                        <X className="w-4 h-4 text-slate-700 hover:animate-spin" />
                      </Button>
                      <div className="relative" ref={optionsMenuRef}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-white/20 hover:text-white hover:scale-110 hover:rotate-6 transition-all duration-300"
                          onClick={handleOptionsMenu}
                          title="More options"
                        >
                          <MoreHorizontal className="w-4 h-4 text-slate-700 hover:animate-pulse" />
                        </Button>
                        
                        {showOptionsMenu && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                            <div className="py-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(window.location.href);
                                  setShowOptionsMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center transition-colors"
                              >
                                <Link className="w-4 h-4 mr-3 text-gray-500" />
                                Copy link
                              </button>
                              <button
                                onClick={() => {
                                  setShowOptionsMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center transition-colors"
                              >
                                <Download className="w-4 h-4 mr-3 text-gray-500" />
                                Export
                              </button>
                              <button
                                onClick={() => {
                                  setShowOptionsMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center transition-colors"
                              >
                                <Archive className="w-4 h-4 mr-3 text-gray-500" />
                                Archive
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => {
                                  setShowOptionsMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-5 animate-in zoom-in-50 duration-1000 delay-1500">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 rounded-xl border border-slate-300/50 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200">
                      <p className="text-slate-800 leading-relaxed text-base break-words">
                        {selectedTask.description}
                      </p>
                    </div>
                  </div>

                  {/* Attachments */}
                  {selectedTask.attachmentsList && selectedTask.attachmentsList.length > 0 && (
                    <div className="mb-4 animate-in slide-in-from-left-4 duration-1000 delay-2000">
                      <h3 className="font-semibold text-foreground mb-4 text-lg">Attachments</h3>
                      <div className={`grid gap-4 ${selectedTask.attachmentsList.length === 1 ? 'grid-cols-1' : selectedTask.attachmentsList.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} ${selectedTask.attachmentsList.length > 3 ? 'max-h-40 overflow-y-auto pr-2' : ''}`}>
                        {selectedTask.attachmentsList.map((attachment, index) => (
                          <div key={index} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-gray-50 min-w-0 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200">
                            <div className="w-16 h-12 bg-white rounded-lg border flex items-center justify-center flex-shrink-0 mb-2">
                              <FileText className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0 text-center">
                              <div className="font-medium text-foreground text-sm break-words line-clamp-2">{attachment.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">{attachment.size}</div>
                              {attachment.description && (
                                <div className="text-xs text-gray-600 mt-1 italic break-words line-clamp-1">
                                  "{attachment.description}"
                                </div>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 hover:bg-primary/20 hover:text-foreground mt-2"
                              onClick={() => handleDownload(attachment)}
                              title={`Download ${attachment.name}`}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activity/Comments */}
                  <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg border border-slate-300 p-4 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 animate-in slide-in-from-right-4 duration-1000 delay-2500">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground text-lg">Activity</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCommentsExpanded(!commentsExpanded)}
                        className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-300"
                      >
                        <span className="text-sm font-medium">Comments</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${commentsExpanded ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    
                    {/* Comments List - Show above input when expanded */}
                    {commentsExpanded && selectedTask.commentsList && (
                      <div className={`space-y-4 ${selectedTask.commentsList.length > 2 ? 'max-h-32 overflow-y-auto pr-2' : ''}`}>
                        {selectedTask.commentsList.map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarFallback>{generateInitials(comment.author)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-foreground">{comment.author}</span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-foreground leading-relaxed break-words">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Comment Input - Outside the Activity card */}
                  <div className="flex items-center space-x-3 mt-4">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback>{generateInitials('Current User')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newComment.trim()) {
                            handleAddComment();
                          }
                        }}
                        className="flex-1"
                      />
                    </div>
                    <Button 
                      onClick={handleAddComment} 
                      disabled={!newComment.trim()} 
                      className="px-4"
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-[30%] border-l border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex flex-col min-w-0 h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100 -mx-6 -mt-6 px-6 py-7 animate-in slide-in-from-top-2 duration-700">
                    <div className="animate-in slide-in-from-left-4 duration-1000 delay-800">
                      <h3 className="font-bold text-slate-800 text-xl">Details</h3>
                      <p className="text-slate-600 text-sm mt-1">Item information & actions</p>
                    </div>
                    <div className="flex space-x-1">
                      <div className="relative" ref={viewMenuRef}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 hover:bg-white/20 hover:text-white rounded-lg transition-all hover:scale-110 hover:rotate-6 duration-300"
                          onClick={handleViewMenu}
                          title="View options"
                        >
                          <Eye className="w-4 h-4 text-slate-700 hover:animate-pulse" />
                        </Button>
                        
                        {showViewMenu && (
                          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
                            <div className="py-2">
                              <button
                                onClick={() => {
                                  setShowViewMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-3 text-slate-500" />
                                View details
                              </button>
                              <button
                                onClick={() => {
                                  setShowViewMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                              >
                                <User className="w-4 h-4 mr-3 text-slate-500" />
                                View assignee
                              </button>
                              <button
                                onClick={() => {
                                  setShowViewMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                              >
                                <Calendar className="w-4 h-4 mr-3 text-slate-500" />
                                View timeline
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="relative" ref={sidebarOptionsMenuRef}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 hover:bg-white/20 hover:text-white rounded-lg transition-all hover:scale-110 hover:rotate-6 duration-300"
                          onClick={handleSidebarOptionsMenu}
                          title="More options"
                        >
                          <MoreHorizontal className="w-4 h-4 text-slate-700 hover:animate-pulse" />
                        </Button>
                        
                        {showSidebarOptionsMenu && (
                          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
                            <div className="py-2">
                              <button
                                onClick={() => {
                                  setShowSidebarOptionsMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                              >
                                <User className="w-4 h-4 mr-3 text-slate-500" />
                                Change assignee
                              </button>
                              <button
                                onClick={() => {
                                  setShowSidebarOptionsMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                              >
                                <Tag className="w-4 h-4 mr-3 text-slate-500" />
                                Add labels
                              </button>
                              <button
                                onClick={() => {
                                  setShowSidebarOptionsMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                              >
                                <Clock className="w-4 h-4 mr-3 text-slate-500" />
                                Set due date
                              </button>
                              <div className="border-t border-slate-100 my-1"></div>
                              <button
                                onClick={() => {
                                  setShowSidebarOptionsMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Delete item
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* First Row: Status and Assignee */}
                    <div className="grid grid-cols-2 gap-4 animate-in zoom-in-50 duration-800 delay-3000">
                      {/* Status */}
                      <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 relative z-10">
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Status
                        </h4>
                        <div className="relative" ref={statusDropdownRef}>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="default" 
                              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shadow-md hover:shadow-lg ${
                                selectedTask.status === 'done' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' :
                                selectedTask.status === 'todo' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' :
                                selectedTask.status === 'inprogress' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200' :
                                'bg-slate-500 hover:bg-slate-600 shadow-slate-200'
                              } text-white`}
                              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            >
                              {selectedTask.status === 'done' ? 'Done' : 
                               selectedTask.status === 'todo' ? 'To Do' : 
                               selectedTask.status === 'inprogress' ? 'In Progress' :
                               selectedTask.status === 'review' ? 'In Review' :
                               selectedTask.status}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 hover:bg-slate-100 rounded-lg transition-all"
                              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            >
                              <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>
                          
                          {showStatusDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-[9999]">
                              <div className="py-2">
                                <button
                                  onClick={() => handleStatusChange('todo')}
                                  className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 hover:text-orange-700 flex items-center transition-colors"
                                >
                                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                                  To Do
                                </button>
                                <button
                                  onClick={() => handleStatusChange('inprogress')}
                                  className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                                >
                                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                  In Progress
                                </button>
                                <button
                                  onClick={() => handleStatusChange('review')}
                                  className="w-full text-left px-4 py-3 text-sm hover:bg-yellow-50 hover:text-yellow-700 flex items-center transition-colors"
                                >
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                  In Review
                                </button>
                                <button
                                  onClick={() => handleStatusChange('done')}
                                  className="w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-700 flex items-center transition-colors"
                                >
                                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                                  Done
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Assignee */}
                      <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 cursor-pointer" onClick={() => setShowAssigneeModal(true)}>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center text-sm">
                          <User className="w-4 h-4 mr-2 text-slate-500" />
                          Assignee
                        </h4>
                        <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                          <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm hover:scale-110 transition-transform duration-200">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-xs">
                              {generateInitials(selectedAssignee || selectedTask.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium text-slate-800 text-sm">
                              {selectedAssignee || selectedTask.assignee.name}
                            </span>
                            <div className="text-xs text-slate-500">Assigned</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-400">Click to change assignee</div>
                      </div>
                    </div>

                    {/* Second Row: Labels and Reporter */}
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-800 delay-3500">
                      {/* Labels */}
                      <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 cursor-pointer" onClick={() => setShowLabelsModal(true)}>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center text-sm">
                          <Tag className="w-4 h-4 mr-2 text-slate-500" />
                          Labels
                        </h4>
                        <div className="text-slate-500 text-sm italic">
                          {selectedLabels.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedLabels.map((label, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {label}
                                </span>
                              ))}
                            </div>
                          ) : (
                            "No labels added"
                          )}
                        </div>
                        <div className="mt-2 text-xs text-slate-400">Click to add labels</div>
                      </div>

                      {/* Reporter */}
                      <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 cursor-pointer" onClick={() => setShowReporterModal(true)}>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center text-sm">
                          <User className="w-4 h-4 mr-2 text-slate-500" />
                          Reporter
                        </h4>
                        <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                          <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm hover:scale-110 transition-transform duration-200">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold text-xs">
                              {generateInitials(selectedReporter || 'Current User')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium text-slate-800 text-sm">
                              {selectedReporter || 'Current User'}
                            </span>
                            <div className="text-xs text-slate-500">Reporter</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-400">Click to change reporter</div>
                      </div>
                    </div>

                    {/* Development */}
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 animate-in slide-in-from-left-4 duration-800 delay-4000">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-800 flex items-center">
                          <GitBranch className="w-4 h-4 mr-2 text-slate-500" />
                          Development
                        </h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all hover:scale-110 hover:rotate-90 duration-300"
                          onClick={handleDevelopmentAdd}
                        >
                          <Plus className="w-4 h-4 hover:animate-pulse" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <GitBranch className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">{selectedTask.development?.branches || 0} branches</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <GitCommit className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">{selectedTask.development?.commits || 0} commits</span>
                          </div>
                          <span className="text-xs text-slate-500">9 days ago</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <GitPullRequest className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">{selectedTask.development?.pullRequests || 0} pull requests</span>
                          </div>
                          <Button variant="outline" size="sm" className="h-6 px-3 text-xs font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all">
                            OPEN
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Share and Embed */}
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 animate-in slide-in-from-right-4 duration-800 delay-4500">
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                        <Link className="w-4 h-4 mr-2 text-slate-500" />
                        Share and Embed
                      </h4>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all hover:scale-105 duration-200"
                      >
                        <Link className="w-4 h-4 mr-2 hover:animate-pulse" />
                        Open Share and Embed
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Upload Document Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-md rounded-none">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Paperclip className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  ref={(input) => {
                    if (input) {
                      input.style.display = 'none';
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="cursor-pointer"
                  onClick={() => {
                    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                >
                  Choose Files
                </Button>
                {selectedFiles.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                    <div className="space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea 
                  placeholder="Add a description for the document" 
                  rows={2}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedFiles([]);
                  setUploadDescription('');
                  setShowUploadModal(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={selectedFiles.length === 0}
              >
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Labels Modal */}
        <Dialog open={showLabelsModal} onOpenChange={setShowLabelsModal}>
          <DialogContent className="max-w-md rounded-none">
            <DialogHeader>
              <DialogTitle>Add Labels</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Labels (comma-separated)</Label>
                <Input
                  placeholder="e.g., bug, feature, high-priority"
                  className="mt-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = e.currentTarget.value;
                      if (value.trim()) {
                        setSelectedLabels([...selectedLabels, value.trim()]);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>
              <div>
                <Label>Available Labels</Label>
                <div className="mt-2 space-y-2">
                  {['bug', 'feature', 'high-priority', 'documentation'].map((label) => (
                    <div key={label} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={label} 
                        className="rounded"
                        checked={selectedLabels.includes(label)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLabels([...selectedLabels, label]);
                          } else {
                            setSelectedLabels(selectedLabels.filter(l => l !== label));
                          }
                        }}
                      />
                      <label htmlFor={label} className="text-sm">{label}</label>
                    </div>
                  ))}
                </div>
              </div>
              {selectedLabels.length > 0 && (
                <div>
                  <Label>Selected Labels</Label>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedLabels.map((label, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                        {label}
                        <button
                          onClick={() => setSelectedLabels(selectedLabels.filter((_, i) => i !== index))}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowLabelsModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowLabelsModal(false)}>
                Add Labels
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assignee Modal */}
        <Dialog open={showAssigneeModal} onOpenChange={setShowAssigneeModal}>
          <DialogContent className="max-w-md rounded-none">
            <DialogHeader>
              <DialogTitle>Change Assignee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Assignee</Label>
                <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                    <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                    <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAssigneeModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAssigneeModal(false)}>
                Change Assignee
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reporter Modal */}
        <Dialog open={showReporterModal} onOpenChange={setShowReporterModal}>
          <DialogContent className="max-w-md rounded-none">
            <DialogHeader>
              <DialogTitle>Change Reporter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Reporter</Label>
                <Select value={selectedReporter} onValueChange={setSelectedReporter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose reporter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                    <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                    <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowReporterModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowReporterModal(false)}>
                Change Reporter
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Development Modal */}
        <Dialog open={showDevelopmentModal} onOpenChange={setShowDevelopmentModal}>
          <DialogContent className="max-w-md rounded-none">
            <DialogHeader>
              <DialogTitle>Add Development Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branch">Branch</SelectItem>
                    <SelectItem value="commit">Commit</SelectItem>
                    <SelectItem value="pull-request">Pull Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Input placeholder="Enter title" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Enter description" rows={3} />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowDevelopmentModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowDevelopmentModal(false)}>
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default KanbanBoard;