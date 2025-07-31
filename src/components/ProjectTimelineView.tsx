import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Plus, 
  Filter, 
  Search, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle, 
  PlayCircle, 
  PauseCircle,
  ZoomIn,
  ZoomOut,
  Calendar as CalendarIcon,
  BarChart3,
  Target,
  Settings,
  Download,
  Eye,
  Edit,
  Trash2,
  XCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  project?: string;
  type: 'task' | 'meeting' | 'deadline' | 'milestone' | 'review';
  color?: string;
  progress?: number;
  estimatedHours?: number;
  actualHours?: number;
}

interface ProjectTimelineViewProps {
  tasks?: Task[];
  startDate?: string;
  endDate?: string;
  onTaskClick?: (task: Task) => void;
  onAddTask?: () => void;
  onExport?: () => void;
}

type ZoomLevel = 'day' | 'week' | 'month' | 'year';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ProjectTimelineView: React.FC<ProjectTimelineViewProps> = ({ 
  tasks = [], 
  startDate, 
  endDate,
  onTaskClick,
  onAddTask,
  onExport
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('week');
  const [timelineStartDate, setTimelineStartDate] = useState(() => {
    if (startDate) return new Date(startDate);
    const today = new Date();
    today.setDate(today.getDate() - 7);
    return today;
  });
  const [timelineEndDate, setTimelineEndDate] = useState(() => {
    if (endDate) return new Date(endDate);
    const today = new Date();
    today.setDate(today.getDate() + 30);
    return today;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const timelineRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Receive Proposal',
      description: 'Review and analyze the initial project proposal',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      status: 'completed',
      priority: 'high',
      assignee: 'John Doe',
      project: 'Mobile App Redesign',
      type: 'task',
      color: '#3B82F6',
      progress: 100,
      estimatedHours: 16,
      actualHours: 14
    },
    {
      id: '2',
      title: 'Approval',
      description: 'Get stakeholder approval for the project',
      startDate: '2024-01-21',
      endDate: '2024-01-25',
      status: 'completed',
      priority: 'urgent',
      assignee: 'Jane Smith',
      project: 'Mobile App Redesign',
      type: 'milestone',
      color: '#10B981',
      progress: 100,
      estimatedHours: 8,
      actualHours: 6
    },
    {
      id: '3',
      title: 'Design Phase',
      description: 'Create wireframes and mockups',
      startDate: '2024-01-26',
      endDate: '2024-02-10',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Alice Johnson',
      project: 'Mobile App Redesign',
      type: 'task',
      color: '#8B5CF6',
      progress: 65,
      estimatedHours: 80,
      actualHours: 52
    },
    {
      id: '4',
      title: 'Development Phase',
      description: 'Implement the mobile application',
      startDate: '2024-02-11',
      endDate: '2024-03-15',
      status: 'pending',
      priority: 'high',
      assignee: 'Bob Wilson',
      project: 'Mobile App Redesign',
      type: 'task',
      color: '#F59E0B',
      progress: 0,
      estimatedHours: 200,
      actualHours: 0
    },
    {
      id: '5',
      title: 'Testing Phase',
      description: 'Quality assurance and testing',
      startDate: '2024-03-16',
      endDate: '2024-03-30',
      status: 'pending',
      priority: 'medium',
      assignee: 'Sarah Chen',
      project: 'Mobile App Redesign',
      type: 'task',
      color: '#EF4444',
      progress: 0,
      estimatedHours: 60,
      actualHours: 0
    },
    {
      id: '6',
      title: 'Launch',
      description: 'Deploy to production and launch',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      status: 'pending',
      priority: 'urgent',
      assignee: 'Mike Davis',
      project: 'Mobile App Redesign',
      type: 'milestone',
      color: '#06B6D4',
      progress: 0,
      estimatedHours: 40,
      actualHours: 0
    }
  ];

  const [timelineTasks, setTimelineTasks] = useState<Task[]>(mockTasks);

  // Generate timeline dates based on zoom level
  const generateTimelineDates = () => {
    const dates: Date[] = [];
    const start = new Date(timelineStartDate);
    const end = new Date(timelineEndDate);
    let current = new Date(start);

    switch (zoomLevel) {
      case 'day':
        while (current <= end) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        break;
      case 'week':
        while (current <= end) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 7);
        }
        break;
      case 'month':
        while (current <= end) {
          dates.push(new Date(current));
          current.setMonth(current.getMonth() + 1);
        }
        break;
      case 'year':
        while (current <= end) {
          dates.push(new Date(current));
          current.setFullYear(current.getFullYear() + 1);
        }
        break;
    }
    return dates;
  };

  const getDateLabel = (date: Date) => {
    switch (zoomLevel) {
      case 'day':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          weekday: 'short'
        });
      case 'week':
        return `Week ${getWeekNumber(date)}`;
      case 'month':
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric'
        });
      case 'year':
        return date.getFullYear().toString();
      default:
        return date.toLocaleDateString();
    }
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', text: '#10B981' };
      case 'in-progress':
        return { background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3B82F6', text: '#3B82F6' };
      case 'pending':
        return { background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #F59E0B', text: '#F59E0B' };
      case 'overdue':
        return { background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', text: '#EF4444' };
      default:
        return { background: 'rgba(156, 163, 175, 0.2)', border: '1px solid #9CA3AF', text: '#9CA3AF' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#EF4444';
      case 'high':
        return '#F59E0B';
      case 'medium':
        return '#3B82F6';
      case 'low':
        return '#10B981';
      default:
        return '#9CA3AF';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <PlayCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const calculateTaskPosition = (task: Task) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const timelineStart = new Date(timelineStartDate);
    const timelineEnd = new Date(timelineEndDate);
    
    const totalTimelineDuration = timelineEnd.getTime() - timelineStart.getTime();
    const taskStartOffset = taskStart.getTime() - timelineStart.getTime();
    const taskDuration = taskEnd.getTime() - taskStart.getTime();
    
    const left = (taskStartOffset / totalTimelineDuration) * 100;
    const width = (taskDuration / totalTimelineDuration) * 100;
    
    return { left: Math.max(0, left), width: Math.min(100, width) };
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    
    // Adjust timeline to show today
    const newStart = new Date(today);
    const newEnd = new Date(today);
    
    switch (zoomLevel) {
      case 'day':
        newStart.setDate(today.getDate() - 7);
        newEnd.setDate(today.getDate() + 7);
        break;
      case 'week':
        newStart.setDate(today.getDate() - 21);
        newEnd.setDate(today.getDate() + 21);
        break;
      case 'month':
        newStart.setMonth(today.getMonth() - 2);
        newEnd.setMonth(today.getMonth() + 2);
        break;
      case 'year':
        newStart.setFullYear(today.getFullYear() - 1);
        newEnd.setFullYear(today.getFullYear() + 1);
        break;
    }
    
    setTimelineStartDate(newStart);
    setTimelineEndDate(newEnd);
  };

  const handleZoomChange = (newZoom: ZoomLevel) => {
    setZoomLevel(newZoom);
    
    // Adjust timeline dates based on new zoom level
    const today = new Date();
    const newStart = new Date(today);
    const newEnd = new Date(today);
    
    switch (newZoom) {
      case 'day':
        newStart.setDate(today.getDate() - 7);
        newEnd.setDate(today.getDate() + 7);
        break;
      case 'week':
        newStart.setDate(today.getDate() - 21);
        newEnd.setDate(today.getDate() + 21);
        break;
      case 'month':
        newStart.setMonth(today.getMonth() - 2);
        newEnd.setMonth(today.getMonth() + 2);
        break;
      case 'year':
        newStart.setFullYear(today.getFullYear() - 1);
        newEnd.setFullYear(today.getFullYear() + 1);
        break;
    }
    
    setTimelineStartDate(newStart);
    setTimelineEndDate(newEnd);
  };

  const handleTimelineNavigation = (direction: 'prev' | 'next') => {
    const newStart = new Date(timelineStartDate);
    const newEnd = new Date(timelineEndDate);
    const duration = newEnd.getTime() - newStart.getTime();
    
    if (direction === 'prev') {
      newStart.setTime(newStart.getTime() - duration);
      newEnd.setTime(newEnd.getTime() - duration);
    } else {
      newStart.setTime(newStart.getTime() + duration);
      newEnd.setTime(newEnd.getTime() + duration);
    }
    
    setTimelineStartDate(newStart);
    setTimelineEndDate(newEnd);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
    onTaskClick?.(task);
  };

  const handleTaskHover = (task: Task, event: React.MouseEvent) => {
    setHoveredTask(task);
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleTaskLeave = () => {
    setHoveredTask(null);
  };

  const filteredTasks = timelineTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.project?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const timelineDates = generateTimelineDates();

  return (
    <div className="w-full bg-white relative min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Project Timeline</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTimelineNavigation('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleTodayClick}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Today
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTimelineNavigation('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoomChange('day')}
              className={zoomLevel === 'day' ? 'bg-blue-100 border-blue-300' : ''}
            >
              Day
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoomChange('week')}
              className={zoomLevel === 'week' ? 'bg-blue-100 border-blue-300' : ''}
            >
              Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoomChange('month')}
              className={zoomLevel === 'month' ? 'bg-blue-100 border-blue-300' : ''}
            >
              Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoomChange('year')}
              className={zoomLevel === 'year' ? 'bg-blue-100 border-blue-300' : ''}
            >
              Year
            </Button>
          </div>

          <Button
            onClick={onAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onExport}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Task List */}
        <div className="w-80 bg-white border-r flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-800">Tasks</h3>
          </div>
          
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className="p-4 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: task.color || '#3B82F6' }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{task.title}</h4>
                  <p className="text-sm text-gray-500 truncate">{task.assignee}</p>
                </div>
                <Badge className={getStatusColor(task.status).text}>
                  {task.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{task.startDate} - {task.endDate}</span>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                />
              </div>
              
              {task.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-1" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline Grid */}
        <div className="flex-1 overflow-x-auto" ref={timelineRef}>
          <div className="min-w-max">
            {/* Timeline Header */}
            <div className="border-b bg-gray-50">
              <div className="flex">
                {timelineDates.map((date, index) => (
                  <div 
                    key={index} 
                    className={`border-r p-3 text-center min-w-[120px] ${
                      isToday(date) ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {getDateLabel(date)}
                    </div>
                    {isToday(date) && (
                      <div className="text-xs text-blue-600 font-medium mt-1">Today</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Rows */}
            {filteredTasks.map((task) => {
              const position = calculateTaskPosition(task);
              const statusColors = getStatusColor(task.status);
              
              return (
                <div key={task.id} className="border-b relative h-16">
                  <div className="absolute inset-0 flex">
                    {timelineDates.map((date, index) => (
                      <div key={index} className="border-r min-w-[120px]" />
                    ))}
                  </div>
                  
                  {/* Task Bar */}
                  <div
                    className="absolute top-2 bottom-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg"
                    style={{
                      left: `${position.left}%`,
                      width: `${position.width}%`,
                      ...statusColors
                    }}
                    onClick={() => handleTaskClick(task)}
                    onMouseEnter={(e) => handleTaskHover(task, e)}
                    onMouseLeave={handleTaskLeave}
                  >
                    <div className="flex items-center justify-between h-full px-2">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        {getStatusIcon(task.status)}
                        <span className="text-xs font-medium truncate">{task.title}</span>
                      </div>
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredTask && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-white border rounded-lg shadow-lg p-3 max-w-xs"
          style={{
            left: hoverPosition.x + 10,
            top: hoverPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: hoveredTask.color || '#3B82F6' }}
              />
              <h4 className="font-semibold text-gray-800">{hoveredTask.title}</h4>
            </div>
            
            <div className="text-sm text-gray-600">
              {hoveredTask.description}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Start:</span>
                <div className="font-medium">{hoveredTask.startDate}</div>
              </div>
              <div>
                <span className="text-gray-500">End:</span>
                <div className="font-medium">{hoveredTask.endDate}</div>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <div className="font-medium">{hoveredTask.status}</div>
              </div>
              <div>
                <span className="text-gray-500">Priority:</span>
                <div className="font-medium">{hoveredTask.priority}</div>
              </div>
            </div>
            
            {hoveredTask.assignee && (
              <div className="text-xs">
                <span className="text-gray-500">Assignee:</span>
                <div className="font-medium">{hoveredTask.assignee}</div>
              </div>
            )}
            
            {hoveredTask.progress !== undefined && (
              <div className="text-xs">
                <span className="text-gray-500">Progress:</span>
                <div className="font-medium">{hoveredTask.progress}%</div>
              </div>
            )}
            
            {hoveredTask.estimatedHours && (
              <div className="text-xs">
                <span className="text-gray-500">Hours:</span>
                <div className="font-medium">
                  {hoveredTask.actualHours || 0}h / {hoveredTask.estimatedHours}h
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Task Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTaskModal(false)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      {selectedTask.title}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <Badge className={getStatusColor(selectedTask.status).text}>
                        {selectedTask.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <Badge style={{ backgroundColor: getPriorityColor(selectedTask.priority) }}>
                        {selectedTask.priority}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assignee</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      {selectedTask.assignee || 'Unassigned'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      {selectedTask.startDate}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      {selectedTask.endDate}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
                    {selectedTask.description || 'No description provided'}
                  </div>
                </div>

                {selectedTask.progress !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Progress</label>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{selectedTask.progress}% Complete</span>
                        <span>{selectedTask.progress}%</span>
                      </div>
                      <Progress value={selectedTask.progress} className="h-2" />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setShowTaskModal(false)}>
                    Close
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Edit Task
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTimelineView; 