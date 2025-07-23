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
  LayoutGrid,
  SortAsc,
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
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight
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
import { Switch } from "@/components/ui/switch";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import AddTaskModal from "./AddTaskModal";

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

interface Task {
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

interface KanbanBoardProps {
  tasks?: Task[];
}

const KanbanBoard = ({ tasks = [] }: KanbanBoardProps) => {
  // Add custom CSS animations for card entrance
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cardSlideIn {
        0% {
          opacity: 0;
          transform: translateY(-15px) scale(0.98);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .card-animate-in {
        animation: cardSlideIn 0.8s ease-out forwards;
        opacity: 1 !important;
      }
      
      .card-top-highlight {
        border: 2px solid #1e40af !important;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3) !important;
        transform: translateY(-2px);
        transition: all 0.2s ease-in-out;
      }
      
      .card-top-highlight:hover {
        box-shadow: 0 6px 16px rgba(30, 64, 175, 0.4) !important;
        transform: translateY(-3px);
      }
      
      .card-hover-highlight {
        border: 2px solid #1e40af !important;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3) !important;
        transform: translateY(-2px);
        transition: all 0.2s ease-in-out;
      }
      
      .card-hover-highlight:hover {
        box-shadow: 0 6px 16px rgba(30, 64, 175, 0.4) !important;
        transform: translateY(-3px);
      }
      
      .card-sequential-highlight {
        border: 2px solid #1e40af !important;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3) !important;
        transform: translateY(-2px);
        transition: all 0.3s ease-in-out;
        animation: pulseBorder 2s ease-in-out infinite;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      @keyframes pulseBorder {
        0%, 100% {
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
          opacity: 1;
        }
        50% {
          box-shadow: 0 6px 16px rgba(30, 64, 175, 0.5);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [displaySettings, setDisplaySettings] = useState({
    viewType: 'board', // 'list', 'board', or 'timeline'
    showCompleted: true,
    groupBy: 'none', // 'none', 'status', 'priority', 'assignee', 'team'
    showEmptyColumns: true, // Show empty columns in board view
    showProjectList: true, // Show project list in timeline view
    showWeekNumbers: true, // Show week numbers in timeline view
    showClosedProjects: 'all', // 'none', 'past-week', 'past-month', 'past-3-months', 'past-6-months', 'all'
    orderBy: 'manual', // 'manual', 'name', 'priority', 'due-date', 'created'
    timelineZoom: 'month' // 'year', 'quarter', 'month', 'week'
  });
  const [selectedProperties, setSelectedProperties] = useState([
    'Status', 'Priority', 'Assignee', 'Target Date'
  ]);
  const [defaultProperties, setDefaultProperties] = useState([
    'Status', 'Priority', 'Assignee', 'Target Date'
  ]);
  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedColumnStatus, setSelectedColumnStatus] = useState<string>('todo');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showSidebarOptionsMenu, setShowSidebarOptionsMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadDescription, setUploadDescription] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const [showReporterModal, setShowReporterModal] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedReporter, setSelectedReporter] = useState('');
  
  // Timeline-specific state
  const [timelineCurrentDate, setTimelineCurrentDate] = useState(new Date());
  const [timelineStartDate, setTimelineStartDate] = useState(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return startOfMonth;
  });
  
  // Details panel state
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<Task | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);
  
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-muted',
      tasks: []
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-primary',
      tasks: []
    },
    {
      id: 'review',
      title: 'In Review',
      color: 'bg-warning',
      tasks: []
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-success',
      tasks: []
    }
  ]);

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

  // Render property value for list view
  const renderPropertyValue = (task: Task, property: string) => {
    switch (property) {
      case 'Status':
        return (
          <Badge 
            variant="outline" 
            className={`text-xs ${
              task.status === 'todo' ? 'bg-gray-100 text-gray-700' :
              task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
              task.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}
          >
            {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        );
      
      case 'Priority':
        return (
          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
            {task.priority}
          </Badge>
        );
      
      case 'Assignee':
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6 bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {task.assignee.avatar}
            </Avatar>
            <span className="text-sm text-gray-700">{task.assignee.name}</span>
          </div>
        );
      
      case 'Target Date':
      case 'Due Date':
        return (
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{task.dueDate}</span>
          </div>
        );
      
      case 'Milestones':
        return (
          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
            Milestone 1
          </Badge>
        );
      
      case 'Health':
        return (
          <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
            Good
          </Badge>
        );
      
      case 'Teams':
        return (
          <span className="text-sm text-gray-700">Design Team</span>
        );
      
      case 'Lead':
        return (
          <span className="text-sm text-gray-700">John Doe</span>
        );
      
      case 'Members':
        return (
          <div className="flex -space-x-1 justify-center">
            <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">JD</div>
            <div className="w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-medium">MC</div>
            <div className="w-6 h-6 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-medium">SJ</div>
          </div>
        );
      
      case 'Dependencies':
        return (
          <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">
            Task-123
          </Badge>
        );
      
      case 'Start Date':
        return (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>Jul 20</span>
          </div>
        );
      
      case 'Created':
        return (
          <span className="text-sm text-gray-600">Jul 15</span>
        );
      
      case 'Updated':
        return (
          <span className="text-sm text-gray-600">Jul 22</span>
        );
      
      case 'Completed':
        return (
          <span className="text-sm text-gray-600">-</span>
        );
      
      case 'Labels':
        return (
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">UI</Badge>
            <Badge variant="outline" className="text-xs bg-green-100 text-green-700">Design</Badge>
          </div>
        );
      
      default:
        return (
          <span className="text-sm text-gray-600">-</span>
        );
    }
  };

  // Get filtered and grouped tasks based on display settings
  const getFilteredTasks = () => {
    let allTasks = [];
    columns.forEach(column => {
      allTasks.push(...column.tasks);
    });

    // Filter based on "Show closed projects" setting
    if (displaySettings.showClosedProjects === 'none') {
      allTasks = allTasks.filter(task => task.status !== 'done');
    } else if (displaySettings.showClosedProjects === 'past-week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      allTasks = allTasks.filter(task => {
        if (task.status === 'done') {
          const taskDate = new Date(task.dueDate);
          return taskDate >= oneWeekAgo;
        }
        return true;
      });
    } else if (displaySettings.showClosedProjects === 'past-month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      allTasks = allTasks.filter(task => {
        if (task.status === 'done') {
          const taskDate = new Date(task.dueDate);
          return taskDate >= oneMonthAgo;
        }
        return true;
      });
    } else if (displaySettings.showClosedProjects === 'past-3-months') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      allTasks = allTasks.filter(task => {
        if (task.status === 'done') {
          const taskDate = new Date(task.dueDate);
          return taskDate >= threeMonthsAgo;
        }
        return true;
      });
    } else if (displaySettings.showClosedProjects === 'past-6-months') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      allTasks = allTasks.filter(task => {
        if (task.status === 'done') {
          const taskDate = new Date(task.dueDate);
          return taskDate >= sixMonthsAgo;
        }
        return true;
      });
    }
    // 'all' shows all tasks including closed ones

    // Sort tasks based on ordering setting
    if (displaySettings.orderBy === 'name') {
      allTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (displaySettings.orderBy === 'priority') {
      const priorityOrder = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };
      allTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (displaySettings.orderBy === 'due-date') {
      allTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (displaySettings.orderBy === 'created') {
      // Assuming tasks have a created date, using due date as fallback
      allTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
    // 'manual' keeps original order

    console.log('Filtered tasks:', allTasks);
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
    // Get all tasks from both the original columns and any newly added tasks
    const allTasksFromColumns = columns.flatMap(column => column.tasks);
    const allTasks = getFilteredTasks();
    
    if (displaySettings.groupBy === 'priority') {
      const priorityColumns = [
        { id: 'Critical', title: 'Critical', color: 'bg-destructive', tasks: [] },
        { id: 'High', title: 'High Priority', color: 'bg-warning', tasks: [] },
        { id: 'Medium', title: 'Medium Priority', color: 'bg-primary', tasks: [] },
        { id: 'Low', title: 'Low Priority', color: 'bg-muted', tasks: [] }
      ];
      
      // Filter out empty columns if showEmptyColumns is false
      if (!displaySettings.showEmptyColumns) {
        return priorityColumns.filter(column => {
          const columnTasks = allTasks.filter(task => task.priority === column.id);
          return columnTasks.length > 0;
        });
      }
      return priorityColumns;
    } else if (displaySettings.groupBy === 'assignee') {
      const assignees = [...new Set(allTasks.map(task => task.assignee.name))];
      const assigneeColumns = assignees.map(assignee => ({
        id: assignee,
        title: assignee,
        color: 'bg-primary',
        tasks: []
      }));
      
      // Filter out empty columns if showEmptyColumns is false
      if (!displaySettings.showEmptyColumns) {
        return assigneeColumns.filter(column => {
          const columnTasks = allTasks.filter(task => task.assignee.name === column.id);
          return columnTasks.length > 0;
        });
      }
      return assigneeColumns;
    } else {
      // Default status-based grouping - use original columns but with filtered tasks
      const statusColumns = columns.map(column => ({
        ...column,
        tasks: allTasks.filter(task => task.status === column.id)
      }));
      
      // Filter out empty columns if showEmptyColumns is false
      if (!displaySettings.showEmptyColumns) {
        return statusColumns.filter(column => column.tasks.length > 0);
      }
      return statusColumns;
    }
  };

  // Render Board card with dynamic properties
  const renderBoardCard = (task: Task, index: number = 0, columnIndex: number = 0) => {
    return (
      <Card 
        key={`${task.id}-${animationKey}`}
        className={`p-3 hover:shadow-custom-md transition-all cursor-pointer w-full card-animate-in ${
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
        {/* Task Title and Priority */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-foreground text-sm leading-tight flex-1">
            {task.title}
          </h4>
          {selectedProperties.includes('Priority') && (
            <Badge className={`${getPriorityColor(task.priority)} text-xs ml-2`}>
              {task.priority}
            </Badge>
          )}
        </div>

        {/* Horizontal Layout - More compact */}
        <div className="space-y-1.5 text-xs">
          {/* Row 1: Milestones and Lead */}
          <div className="flex items-center justify-between">
            {selectedProperties.includes('Milestones') && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span>Jul 24</span>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Jul 22</span>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Jul 22</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>hh</span>
              </div>
            )}
            {selectedProperties.includes('Lead') && (
              <div className="flex items-center space-x-1">
                <Avatar className="w-4 h-4 bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {task.assignee.avatar}
                </Avatar>
                <span className="text-muted-foreground">{task.assignee.name}</span>
              </div>
            )}
          </div>

          {/* Row 2: Status, Health, Teams */}
          <div className="flex items-center space-x-2">
            {selectedProperties.includes('Status') && (
              <Badge variant="outline" className="text-xs">
                {task.status}
              </Badge>
            )}
            {selectedProperties.includes('Health') && (
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">Good</span>
              </div>
            )}
            {selectedProperties.includes('Teams') && (
              <Badge variant="outline" className="text-xs">
                Development
              </Badge>
            )}
          </div>

          {/* Row 3: Members and Dependencies */}
          <div className="flex items-center justify-between">
            {selectedProperties.includes('Members') && (
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-0.5">
                  <Avatar className="w-4 h-4 bg-blue-500 text-white text-xs flex items-center justify-center border border-white">
                    JD
                  </Avatar>
                  <Avatar className="w-4 h-4 bg-green-500 text-white text-xs flex items-center justify-center border border-white">
                    MC
                  </Avatar>
                  <Avatar className="w-4 h-4 bg-purple-500 text-white text-xs flex items-center justify-center border border-white">
                    SJ
                  </Avatar>
                </div>
              </div>
            )}
            {selectedProperties.includes('Dependencies') && (
              <Badge variant="outline" className="text-xs">
                Task-123
              </Badge>
            )}
          </div>

          {/* Row 4: Dates */}
          <div className="flex items-center space-x-3">
            {selectedProperties.includes('Start Date') && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Calendar className="w-2.5 h-2.5" />
                <span>Jul 15</span>
              </div>
            )}
            {selectedProperties.includes('Target Date') && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Calendar className="w-2.5 h-2.5" />
                <span>{task.dueDate}</span>
              </div>
            )}
            {selectedProperties.includes('Created') && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Calendar className="w-2.5 h-2.5" />
                <span>Jul 10</span>
              </div>
            )}
            {selectedProperties.includes('Updated') && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Calendar className="w-2.5 h-2.5" />
                <span>Jul 20</span>
              </div>
            )}
          </div>

          {/* Row 5: Labels and Completed */}
          <div className="flex items-center justify-between">
            {selectedProperties.includes('Labels') && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {selectedProperties.includes('Completed') && task.status === 'done' && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <CheckCircle className="w-2.5 h-2.5 text-green-500" />
                <span>Jul 25</span>
              </div>
            )}
          </div>

          {/* Row 6: Description (if selected) */}
          {selectedProperties.includes('Description') && (
            <p className="text-muted-foreground line-clamp-1">
              {task.description}
            </p>
          )}
        </div>

        {/* Progress indicator - Full width at bottom */}
        <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>jrrr · 0%</span>
        </div>
      </Card>
    );
  };

  // Timeline utility functions
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  const getQuarterName = (date: Date) => {
    const month = date.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter}`;
  };

  const generateTimelineDates = () => {
    const dates = [];
    const startDate = new Date(timelineStartDate);

    switch (displaySettings.timelineZoom) {
      case 'year':
        // Generate 12 months
        for (let i = 0; i < 12; i++) {
          const currentDate = new Date(startDate);
          currentDate.setMonth(startDate.getMonth() + i);
          dates.push(currentDate);
        }
        break;
      case 'quarter':
        // Generate 4 quarters
        for (let i = 0; i < 4; i++) {
          const currentDate = new Date(startDate);
          currentDate.setMonth(startDate.getMonth() + (i * 3));
          dates.push(currentDate);
        }
        break;
      case 'month':
        // Generate 12 weeks
        for (let i = 0; i < 12; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + (i * 7));
          dates.push(currentDate);
        }
        break;
      case 'week':
        // Generate 5 days
        for (let i = 0; i < 5; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          dates.push(currentDate);
        }
        break;
    }
    return dates;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const getTaskTimelinePosition = (task: Task) => {
    const startDate = new Date(task.dueDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7); // Default 1 week duration
    
    return {
      start: startDate,
      end: endDate,
      left: 0, // Will be calculated based on timeline
      width: 0 // Will be calculated based on timeline
    };
  };

  // Progress calculation functions
  const calculateTaskProgress = (task: Task) => {
    // Calculate progress based on status
    switch (task.status) {
      case 'todo':
        return 0;
      case 'in-progress':
        return 50;
      case 'review':
        return 75;
      case 'done':
        return 100;
      default:
        return 0;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
      case 'in-progress':
        return <div className="w-3 h-3 rounded-full bg-blue-500"></div>;
      case 'review':
        return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>;
      case 'done':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
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

  const addNewTask = (task: Task) => {
    // Ensure the task has all required properties
    const newTask = {
      ...task,
      id: task.id || Date.now().toString(),
      title: task.title || 'New Task',
      description: task.description || '',
      priority: task.priority || 'Medium',
      assignee: task.assignee || { name: 'Unassigned', avatar: 'U' },
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      comments: task.comments || 0,
      attachments: task.attachments || 0,
      tags: task.tags || [],
      status: task.status || 'todo',
      parentId: task.parentId || null,
      subtasks: task.subtasks || [],
      attachmentsList: task.attachmentsList || [],
      commentsList: task.commentsList || [],
      development: task.development || {
        branches: 0,
        commits: 0,
        pullRequests: 0
      }
    };

    const targetColumnId = newTask.status;
    const updatedColumns = columns.map(column => {
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, newTask]
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    console.log('New task added:', newTask);
    console.log('Updated columns:', updatedColumns);
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
  const displaySettingsRef = useRef<HTMLDivElement>(null);

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
      // Removed display settings click outside handler - dropdown will stay open
    };

    if (showStatusDropdown || showOptionsMenu || showSidebarOptionsMenu || showViewMenu || showDisplaySettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown, showOptionsMenu, showSidebarOptionsMenu, showViewMenu, showDisplaySettings]);

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
                <div className="relative" ref={displaySettingsRef}>
                  <Button 
                    variant="outline"
                    onClick={() => setShowDisplaySettings(!showDisplaySettings)}
                  >
                      <Settings className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Display Settings</span>
                    </Button>
                  
                  {showDisplaySettings && (
                                        <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
                    <div className="space-y-4">
                        {/* View Type Section */}
                      <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-gray-700">View Type</label>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                              onClick={() => setShowDisplaySettings(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <Button 
                              variant={displaySettings.viewType === 'list' ? "default" : "outline"}
                              className={`h-8 flex items-center justify-center space-x-2 rounded-md transition-all duration-200 ${
                                displaySettings.viewType === 'list' 
                                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                                  : 'border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                              }`}
                              onClick={() => setDisplaySettings({...displaySettings, viewType: 'list'})}
                            >
                              <List className={`w-3 h-3 transition-colors duration-200 ${
                                displaySettings.viewType === 'list' 
                                  ? 'text-white' 
                                  : 'text-gray-600 hover:text-blue-600'
                              }`} />
                              <span className="text-xs font-medium">List</span>
                            </Button>
                            <Button 
                              variant={displaySettings.viewType === 'board' ? "default" : "outline"}
                              className={`h-8 flex items-center justify-center space-x-2 rounded-md transition-all duration-200 ${
                                displaySettings.viewType === 'board' 
                                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                                  : 'border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                              }`}
                              onClick={() => setDisplaySettings({...displaySettings, viewType: 'board'})}
                            >
                              <LayoutGrid className={`w-3 h-3 transition-colors duration-200 ${
                                displaySettings.viewType === 'board' 
                                  ? 'text-white' 
                                  : 'text-gray-600 hover:text-blue-600'
                              }`} />
                              <span className="text-xs font-medium">Board</span>
                            </Button>
                            <Button 
                              variant={displaySettings.viewType === 'timeline' ? "default" : "outline"}
                              className={`h-8 flex items-center justify-center space-x-2 rounded-md transition-all duration-200 ${
                                displaySettings.viewType === 'timeline' 
                                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                                  : 'border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                              }`}
                              onClick={() => setDisplaySettings({...displaySettings, viewType: 'timeline'})}
                            >
                              <Calendar className={`w-3 h-3 transition-colors duration-200 ${
                                displaySettings.viewType === 'timeline' 
                                  ? 'text-white' 
                                  : 'text-gray-600 hover:text-blue-600'
                              }`} />
                              <span className="text-xs font-medium">Timeline</span>
                            </Button>
                      </div>
                        </div>

                        {/* Grouping and Ordering Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-700 flex items-center">
                              <List className="w-3 h-3 mr-1 text-gray-500" />
                              {displaySettings.viewType === 'board' ? 'Columns' : 'Grouping'}
                            </label>
                        <Select 
                          value={displaySettings.groupBy} 
                          onValueChange={(value) => setDisplaySettings({...displaySettings, groupBy: value})}
                        >
                              <SelectTrigger className="h-6 text-xs border-gray-200 hover:bg-blue-50 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 w-32">
                                <SelectValue placeholder={displaySettings.viewType === 'board' ? "Status" : "No grouping"} />
                          </SelectTrigger>
                          <SelectContent>
                                <SelectItem value="none">No grouping</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="priority">Priority</SelectItem>
                            <SelectItem value="assignee">Assignee</SelectItem>
                                <SelectItem value="team">Team</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-700 flex items-center">
                              <SortAsc className="w-3 h-3 mr-1 text-gray-500" />
                              {displaySettings.viewType === 'board' ? 'Rows' : 'Ordering'}
                            </label>
                        <Select 
                              value={displaySettings.orderBy}
                              onValueChange={(value) => setDisplaySettings({...displaySettings, orderBy: value})}
                        >
                              <SelectTrigger className="h-6 text-xs border-gray-200 hover:bg-blue-50 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 w-32">
                                <SelectValue placeholder={displaySettings.viewType === 'board' ? "No grouping" : "Manual"} />
                          </SelectTrigger>
                          <SelectContent>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="priority">Priority</SelectItem>
                                <SelectItem value="due-date">Due Date</SelectItem>
                                <SelectItem value="created">Created</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-700">Show closed projects</label>
                            <Select 
                              value={displaySettings.showClosedProjects}
                              onValueChange={(value) => setDisplaySettings({...displaySettings, showClosedProjects: value})}
                            >
                              <SelectTrigger className="h-6 text-xs border-gray-200 hover:bg-blue-50 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 w-32">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="past-week">Past week</SelectItem>
                                <SelectItem value="past-month">Past month</SelectItem>
                                <SelectItem value="past-3-months">Past 3 months</SelectItem>
                                <SelectItem value="past-6-months">Past 6 months</SelectItem>
                                <SelectItem value="all">All</SelectItem>
                              </SelectContent>
                            </Select>
                    </div>

                        {/* Zoom Section - Only show when Timeline view is selected */}
                        {displaySettings.viewType === 'timeline' && (
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-700">Zoom</label>
                            <Select 
                              value={displaySettings.timelineZoom}
                              onValueChange={(value) => setDisplaySettings({...displaySettings, timelineZoom: value})}
                            >
                              <SelectTrigger className="h-6 text-xs border-gray-200 hover:bg-blue-50 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 w-32">
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="week">Week</SelectItem>
                                <SelectItem value="month">Month</SelectItem>
                                <SelectItem value="quarter">Quarter</SelectItem>
                                <SelectItem value="year">Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        </div>

                        {/* Board Options Section - Only show when Board view is selected */}
                        {displaySettings.viewType === 'board' && (
                          <div className="space-y-3">
                            <div className="mb-3">
                              <h4 className="text-xs font-medium text-gray-700">Board options</h4>
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-gray-700">Show empty columns</label>
                              <Switch 
                                checked={displaySettings.showEmptyColumns || false}
                                onCheckedChange={(checked) => setDisplaySettings({...displaySettings, showEmptyColumns: checked})}
                                className="data-[state=checked]:bg-blue-600"
                              />
                      </div>
                    </div>
                        )}

                        {/* Timeline Options Section - Only show when Timeline view is selected */}
                        {displaySettings.viewType === 'timeline' && (
                          <div className="space-y-3">
                            <div className="mb-3">
                              <h4 className="text-xs font-medium text-gray-700">Timeline options</h4>
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-gray-700">Show project list</label>
                              <Switch 
                                checked={displaySettings.showProjectList || false}
                                onCheckedChange={(checked) => setDisplaySettings({...displaySettings, showProjectList: checked})}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-gray-700">Show week numbers</label>
                              <Switch 
                                checked={displaySettings.showWeekNumbers || false}
                                onCheckedChange={(checked) => setDisplaySettings({...displaySettings, showWeekNumbers: checked})}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                          </div>
                        )}

                        {/* Display Properties Section */}
                        <div>
                          <div className="mb-3">
                            <h4 className="text-xs font-medium text-gray-700">
                              {displaySettings.viewType === 'board' ? 'Display properties' : 'List options'}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {displaySettings.viewType === 'board' ? 'Select properties to display on cards' : 'Display properties'}
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            {/* Timeline-specific properties when Timeline view is selected */}
                            {displaySettings.viewType === 'timeline' ? (
                              ['Milestones', 'Priority', 'Status', 'Health', 'Lead', 'Dependencies', 'Predictions', 'Members', 'Teams', 'Target Date', 'Start Date', 'Created', 'Updated', 'Completed', 'Labels'].map((property) => (
                                <Button
                                  key={property}
                                  variant={selectedProperties.includes(property) ? "default" : "outline"}
                                  size="sm"
                                  className={`h-6 text-xs rounded font-medium transition-all duration-200 cursor-pointer ${
                                    selectedProperties.includes(property)
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                                  }`}
                                  onClick={() => {
                                    if (selectedProperties.includes(property)) {
                                      setSelectedProperties(selectedProperties.filter(p => p !== property));
                                    } else {
                                      setSelectedProperties([...selectedProperties, property]);
                                    }
                                  }}
                                >
                                  {property}
                                </Button>
                              ))
                            ) : displaySettings.viewType === 'board' ? (
                              // Board-specific properties when Board view is selected
                              ['Milestones', 'Description', 'Priority', 'Status', 'Health', 'Teams', 'Lead', 'Members', 'Target Date', 'Dependencies', 'Start Date', 'Created', 'Updated', 'Completed', 'Labels'].map((property) => (
                                <Button
                                  key={property}
                                  variant={selectedProperties.includes(property) ? "default" : "outline"}
                                  size="sm"
                                  className={`h-6 text-xs rounded font-medium transition-all duration-200 cursor-pointer ${
                                    selectedProperties.includes(property)
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                                  }`}
                                  onClick={() => {
                                    if (selectedProperties.includes(property)) {
                                      setSelectedProperties(selectedProperties.filter(p => p !== property));
                                    } else {
                                      setSelectedProperties([...selectedProperties, property]);
                                    }
                                  }}
                                >
                                  {property}
                                </Button>
                              ))
                            ) : (
                              // List view properties
                              ['Milestones', 'Priority', 'Status', 'Health', 'Teams', 'Lead', 'Target Date', 'Members', 'Dependencies', 'Start Date', 'Created', 'Updated', 'Completed', 'Labels'].map((property) => (
                                <Button
                                  key={property}
                                  variant={selectedProperties.includes(property) ? "default" : "outline"}
                                  size="sm"
                                  className={`h-6 text-xs rounded font-medium transition-all duration-200 cursor-pointer ${
                                    selectedProperties.includes(property)
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                                  }`}
                                  onClick={() => {
                                    if (selectedProperties.includes(property)) {
                                      setSelectedProperties(selectedProperties.filter(p => p !== property));
                                    } else {
                                      setSelectedProperties([...selectedProperties, property]);
                                    }
                                  }}
                                >
                                  {property}
                                </Button>
                              ))
                            )}
                          </div>
                          
                          {/* Add Label Group Button - Only show for List view */}
                          {displaySettings.viewType === 'list' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-3 text-xs text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 rounded font-medium transition-all duration-200"
                            >
                              Add label group...
                            </Button>
                          )}
                          
                          {/* Action Buttons - Show when properties are modified */}
                          {JSON.stringify(selectedProperties.sort()) !== JSON.stringify(defaultProperties.sort()) && (
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                onClick={() => setSelectedProperties([...defaultProperties])}
                              >
                                Reset
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => setShowDefaultModal(true)}
                              >
                                Set default for everyone
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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

        {/* Conditional View Rendering */}
        {displaySettings.viewType === 'board' ? (
          /* Board View - Kanban Columns */
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
                      columnTasks.map((task, index) => renderBoardCard(task, index, columnIndex))
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
        ) : displaySettings.viewType === 'list' ? (
          /* List View */
          <div className="space-y-4 pb-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* List Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 min-w-max">
                  <div className="flex gap-6 text-sm font-medium text-gray-700">
                    <div className="w-64">Task</div>
                    {selectedProperties.map((property) => (
                      <div key={property} className="w-32 flex justify-center items-center">
                        {property}
                      </div>
                    ))}
                  </div>
        </div>
                
                {/* List Items */}
                <div className="divide-y divide-gray-200">
                  {getFilteredTasks().map((task, index) => (
                    <div 
                      key={task.id}
                      className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleOpenDetail(task)}
                    >
                      <div className="flex gap-6 items-center min-w-max">
                        <div className="w-64">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{task.title}</h4>
                              <p className="text-xs text-gray-500 truncate">{task.description}</p>
                            </div>
                          </div>
                        </div>
                        
                        {selectedProperties.map((property) => (
                          <div key={property} className="w-32 flex justify-center items-center">
                            {renderPropertyValue(task, property)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : displaySettings.viewType === 'timeline' ? (
          /* Timeline View - Gantt Chart */
          <div className="space-y-4 pb-6">
            {/* Timeline Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      const prevDate = new Date(timelineStartDate);
                      switch (displaySettings.timelineZoom) {
                        case 'year':
                          prevDate.setFullYear(prevDate.getFullYear() - 1);
                          break;
                        case 'quarter':
                          prevDate.setMonth(prevDate.getMonth() - 3);
                          break;
                        case 'month':
                          prevDate.setDate(prevDate.getDate() - 28);
                          break;
                        case 'week':
                          prevDate.setDate(prevDate.getDate() - 7);
                          break;
                      }
                      setTimelineStartDate(prevDate);
                    }}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      const today = new Date();
                      setTimelineStartDate(today);
                      setTimelineCurrentDate(today);
                    }}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium"
                  >
                    Today
                  </button>
                  
                  <button
                    onClick={() => {
                      const nextDate = new Date(timelineStartDate);
                      switch (displaySettings.timelineZoom) {
                        case 'year':
                          nextDate.setFullYear(nextDate.getFullYear() + 1);
                          break;
                        case 'quarter':
                          nextDate.setMonth(nextDate.getMonth() + 3);
                          break;
                        case 'month':
                          nextDate.setDate(nextDate.getDate() + 28);
                          break;
                        case 'week':
                          nextDate.setDate(nextDate.getDate() + 7);
                          break;
                      }
                      setTimelineStartDate(nextDate);
                    }}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select 
                    value={displaySettings.timelineZoom}
                    onValueChange={(value) => setDisplaySettings({...displaySettings, timelineZoom: value})}
                  >
                    <SelectTrigger className="w-24 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Timeline Chart with Details Panel */}
            <div className="flex space-x-4">
              {/* Main Timeline */}
              <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex">
                  {/* Fixed Task Column */}
                  <div className="w-64 bg-gray-50 border-r flex-shrink-0">
                    <div className="p-4 border-b bg-gray-100">
                      <h3 className="font-semibold text-gray-800">Tasks</h3>
                    </div>
                    {getFilteredTasks().map((task) => (
                      <div 
                        key={task.id} 
                        className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedTaskForDetails(task);
                          setShowDetailsPanel(true);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 truncate">{task.title}</div>
                            <div className="text-xs text-gray-500">{task.assignee.name}</div>
                          </div>
                          <div 
                            className="flex items-center space-x-1 p-1 hover:bg-gray-200 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTaskForDetails(task);
                              setShowFullOverview(true);
                            }}
                          >
                            <div className="text-xs text-gray-400 hover:text-gray-600">→</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Timeline Grid */}
                  <div className="flex-1 overflow-x-auto">
                    <div className="min-w-max">
                      {/* Timeline Header */}
                      <div className="border-b bg-gray-50">
                        <div className="flex">
                          {generateTimelineDates().map((date, index) => (
                            <div key={index} className="border-r min-w-[120px] p-2 text-center">
                              <div className="text-xs font-medium text-gray-600">
                                {displaySettings.timelineZoom === 'year' && getMonthName(date)}
                                {displaySettings.timelineZoom === 'quarter' && getQuarterName(date)}
                                {displaySettings.timelineZoom === 'month' && `${getMonthName(date)} ${date.getDate()}`}
                                {displaySettings.timelineZoom === 'week' && `${date.getDate()} ${date.toLocaleDateString('en-US', { weekday: 'short' })}`}
                              </div>
                              {displaySettings.showWeekNumbers && (
                                <div className="text-xs text-gray-500">
                                  {displaySettings.timelineZoom === 'month' && `Week ${getWeekNumber(date)}`}
                                  {displaySettings.timelineZoom === 'week' && `Week ${getWeekNumber(date)}`}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline Rows */}
                      {getFilteredTasks().map((task) => {
                        const progress = calculateTaskProgress(task);
                        return (
                          <div key={task.id} className="border-b relative">
                            <div className="flex h-16">
                              {generateTimelineDates().map((date, index) => {
                                const taskStart = new Date(task.dueDate);
                                const isTaskInPeriod = taskStart.getTime() >= date.getTime() && 
                                  taskStart.getTime() < new Date(date.getTime() + (displaySettings.timelineZoom === 'week' ? 24*60*60*1000 : 7*24*60*60*1000)).getTime();
                                
                                return (
                                  <div key={index} className="border-r min-w-[120px] relative">
                                    {isTaskInPeriod && (
                                      <div 
                                        className="absolute top-2 left-2 right-2 bottom-2 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-medium relative overflow-hidden"
                                        title={`${task.title} - ${task.status} - ${progress}%`}
                                      >
                                        {/* Progress bar overlay */}
                                        <div 
                                          className={`absolute top-0 left-0 h-full ${getProgressColor(progress)} transition-all duration-300`}
                                          style={{ width: `${progress}%` }}
                                        ></div>
                                        <span className="relative z-10">{task.title}</span>
                                      </div>
                                    )}
                                    {isToday(date) && (
                                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500"></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Panel */}
              {showDetailsPanel && selectedTaskForDetails && (
                <div className="w-80 bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{selectedTaskForDetails.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Heart className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => setShowDetailsPanel(false)}
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Properties Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Properties</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Status</span>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(selectedTaskForDetails.status)}
                            <span className="text-xs text-gray-700 capitalize">{selectedTaskForDetails.status.replace('-', ' ')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Priority</span>
                          <Badge className={`${getPriorityColor(selectedTaskForDetails.priority)} text-xs`}>
                            {selectedTaskForDetails.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Lead</span>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {generateInitials(selectedTaskForDetails.assignee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-700">{selectedTaskForDetails.assignee.name}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Start date</span>
                          <span className="text-xs text-gray-700">{new Date(selectedTaskForDetails.dueDate).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Target date</span>
                          <span className="text-xs text-gray-700">{new Date(selectedTaskForDetails.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Progress</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Scope</span>
                          <span className="text-xs text-gray-700">1</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Completed</span>
                          <span className="text-xs text-gray-700">{calculateTaskProgress(selectedTaskForDetails)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(calculateTaskProgress(selectedTaskForDetails))}`}
                            style={{ width: `${calculateTaskProgress(selectedTaskForDetails)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Full Overview Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => setShowFullOverview(true)}
                        className="w-full flex items-center justify-center space-x-2 p-2 text-xs text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                      >
                        <span>Full Overview</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Default View (fallback) */
          <div className="space-y-4 pb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a View Type</h3>
              <p className="text-gray-600">Please select a view type from the Display Settings to see the content.</p>
            </div>
          </div>
        )}

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
                Add
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
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Set Default Modal */}
        <Dialog open={showDefaultModal} onOpenChange={setShowDefaultModal}>
          <DialogContent className="max-w-md bg-gray-900 border-gray-700 [&>button]:text-white [&>button]:hover:text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-lg font-semibold">
                Save display options for this view?
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-300 text-sm">
                Publishing the configuration will make it the default for everyone in the workspace.
              </p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-800"
                onClick={() => setShowDefaultModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // Update the default properties to current selection
                  setDefaultProperties([...selectedProperties]);
                  setShowDefaultModal(false);
                  // You could add a toast notification here
                }}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Full Overview Modal */}
        <Dialog open={showFullOverview} onOpenChange={setShowFullOverview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">
                  {selectedTaskForDetails?.title}
                </DialogTitle>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Heart className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{selectedTaskForDetails?.description}</p>
            </DialogHeader>
            
            {selectedTaskForDetails && (
              <div className="space-y-6">
                {/* Task Overview */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Task Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(selectedTaskForDetails.status)}
                          <span className="text-sm text-gray-700 capitalize">{selectedTaskForDetails.status.replace('-', ' ')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Priority</span>
                        <Badge className={`${getPriorityColor(selectedTaskForDetails.priority)}`}>
                          {selectedTaskForDetails.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Assignee</span>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {generateInitials(selectedTaskForDetails.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700">{selectedTaskForDetails.assignee.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Due Date</span>
                        <span className="text-sm text-gray-700">{new Date(selectedTaskForDetails.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Progress</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Overall Progress</span>
                        <span className="text-sm font-medium text-gray-700">{calculateTaskProgress(selectedTaskForDetails)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${getProgressColor(calculateTaskProgress(selectedTaskForDetails))}`}
                          style={{ width: `${calculateTaskProgress(selectedTaskForDetails)}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-lg font-semibold text-gray-900">{selectedTaskForDetails.comments}</div>
                          <div className="text-xs text-gray-600">Comments</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-lg font-semibold text-gray-900">{selectedTaskForDetails.attachments}</div>
                          <div className="text-xs text-gray-600">Attachments</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                {selectedTaskForDetails.tags.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTaskForDetails.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Description */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Description</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded">
                    {selectedTaskForDetails.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowFullOverview(false)}>
                Close
              </Button>
              <Button onClick={() => setShowFullOverview(false)}>
                Edit Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default KanbanBoard;