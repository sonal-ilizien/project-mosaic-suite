import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Filter, Search, Clock, User, CheckCircle, AlertCircle, PlayCircle, PauseCircle, BarChart3, XCircle } from 'lucide-react';
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  project?: string;
  type: 'task' | 'meeting' | 'deadline' | 'milestone' | 'review';
  color?: string;
  progress?: number;
}

interface CalendarViewProps {
  tasks?: Task[];
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarView = ({ tasks = [] }: CalendarViewProps) => {
  // Helper function to get Monday of the week
  const getMondayOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return getMondayOfWeek(today);
  });
  const [view, setView] = useState<'month' | 'week'>('week');
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Timeline specific state
  const [timelineZoom, setTimelineZoom] = useState<'day' | 'week' | 'month' | 'year'>('year');
  const [timelineStartDate, setTimelineStartDate] = useState(() => {
    return new Date('2024-01-01'); // Start from January 2024
  });
  const [timelineEndDate, setTimelineEndDate] = useState(() => {
    return new Date('2024-12-31'); // End at December 2024
  });
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const calendarRef = useRef<HTMLDivElement>(null);

  // Mock data for tasks/events
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Budget Planning Deadline',
      description: 'Submit Q1 budget planning documents',
      date: '2024-01-20',
      startTime: '08:00',
      endTime: '17:00',
      status: 'pending',
      priority: 'urgent',
      assignee: 'Jane Smith',
      project: 'Q1 Budget Planning',
      type: 'deadline',
      color: '#EF4444',
      progress: 25
    },
    {
      id: '2',
      title: 'Team Sprint Planning',
      description: 'Plan next sprint tasks and assign responsibilities',
      date: '2024-03-15',
      startTime: '14:00',
      endTime: '16:00',
      status: 'pending',
      priority: 'medium',
      assignee: 'Alice Johnson',
      project: 'Website Migration',
      type: 'meeting',
      color: '#10B981',
      progress: 0
    },
    {
      id: '3',
      title: 'Project Milestone Review',
      description: 'Review project milestones and update progress',
      date: '2024-06-10',
      startTime: '10:00',
      endTime: '12:00',
      status: 'completed',
      priority: 'high',
      assignee: 'Bob Wilson',
      project: 'Mobile App Redesign',
      type: 'milestone',
      color: '#8B5CF6',
      progress: 100
    },
    {
      id: '4',
      title: 'Client Presentation',
      description: 'Present project progress to client',
      date: '2024-09-22',
      startTime: '15:00',
      endTime: '16:30',
      status: 'pending',
      priority: 'urgent',
      assignee: 'Sarah Chen',
      project: 'Q1 Budget Planning',
      type: 'meeting',
      color: '#F59E0B',
      progress: 100
    }
  ];

  const [calendarTasks, setCalendarTasks] = useState<Task[]>(mockTasks);

  const generateWeekDates = () => {
    const dates = [];
    const startDate = new Date(selectedWeekStart);
    startDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return calendarTasks.filter(task => task.date === dateStr);
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

  const getProgressForTask = (task: Task) => {
    switch (task.status) {
      case 'completed':
        return 100;
      case 'in-progress':
        return Math.floor(Math.random() * 40) + 30; // 30-70% for in-progress
      case 'pending':
        return Math.floor(Math.random() * 20) + 5; // 5-25% for pending
      case 'overdue':
        return Math.floor(Math.random() * 30) + 60; // 60-90% for overdue
      default:
        return 0;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10B981'; // Green for high progress
    if (progress >= 50) return '#3B82F6'; // Blue for medium progress
    if (progress >= 20) return '#F59E0B'; // Orange for low progress
    return '#EF4444'; // Red for very low progress
  };

  const handleTodayClick = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const mondayOfToday = getMondayOfWeek(today);
    setSelectedWeekStart(mondayOfToday);
    setCurrentDate(today);

    setTimeout(() => {
      const todayElement = document.querySelector('[data-today="true"]');
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleCalendarDateSelect = (date: Date) => {
    const dateWithoutTime = new Date(date);
    dateWithoutTime.setHours(0, 0, 0, 0);
    const mondayOfSelectedWeek = getMondayOfWeek(dateWithoutTime);
    setSelectedWeekStart(mondayOfSelectedWeek);
    setCurrentDate(dateWithoutTime);
    setShowCalendar(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowAddTaskModal(true);
  };

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setShowAddTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowAddTaskModal(false);
    setSelectedTask(null);
  };

  const filteredTasks = calendarTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.project?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const weekDates = generateWeekDates();

  const generateCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const dates = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const calendarDates = generateCalendarDates();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Timeline specific functions
  const generateTimelineDates = () => {
    const dates: Date[] = [];
    const start = new Date(timelineStartDate);
    const end = new Date(timelineEndDate);
    let current = new Date(start);

    switch (timelineZoom) {
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

  const getTimelineDateLabel = (date: Date) => {
    switch (timelineZoom) {
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

  const calculateTaskPosition = (task: Task) => {
    const taskStart = new Date(task.date);
    const taskEnd = new Date(task.date);
    // For timeline, we'll use the task date as both start and end
    const timelineStart = new Date(timelineStartDate);
    const timelineEnd = new Date(timelineEndDate);
    
    const totalTimelineDuration = timelineEnd.getTime() - timelineStart.getTime();
    const taskStartOffset = taskStart.getTime() - timelineStart.getTime();
    const taskDuration = taskEnd.getTime() - taskStart.getTime();
    
    const left = (taskStartOffset / totalTimelineDuration) * 100;
    const width = Math.max(8, (taskDuration / totalTimelineDuration) * 100); // Minimum 8% width for better visibility
    
    return { left: Math.max(0, left), width: Math.min(100, width) };
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

  const handleTimelineZoomChange = (newZoom: 'day' | 'week' | 'month' | 'year') => {
    setTimelineZoom(newZoom);
    
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

  const handleTaskHover = (task: Task, event: React.MouseEvent) => {
    setHoveredTask(task);
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleTaskLeave = () => {
    setHoveredTask(null);
  };

  // Calculate task bar position based on start time
  const calculateTaskBarPosition = (task: Task, zoom: string) => {
    if (!task.startTime) return 0;
    
    const [hours, minutes] = task.startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    if (zoom === 'day') {
      // For day view, position based on hour (0-23)
      return (totalMinutes / (24 * 60)) * 100;
    } else if (zoom === 'week') {
      // For week view, position based on day of week (0-6)
      const taskDate = new Date(task.date);
      const dayOfWeek = taskDate.getDay();
      return (dayOfWeek / 7) * 100;
    } else if (zoom === 'month') {
      // For month view, position based on week of month (0-4)
      const taskDate = new Date(task.date);
      const weekOfMonth = Math.ceil(taskDate.getDate() / 7);
      return ((weekOfMonth - 1) / 5) * 100;
    } else if (zoom === 'year') {
      // For year view, position based on month (0-11)
      const taskDate = new Date(task.date);
      const month = taskDate.getMonth();
      return (month / 12) * 100;
    }
    
    return 0;
  };

  // Calculate task bar width based on duration
  const calculateTaskBarWidth = (task: Task, zoom: string) => {
    if (!task.startTime || !task.endTime) return 10;
    
    const [startHours, startMinutes] = task.startTime.split(':').map(Number);
    const [endHours, endMinutes] = task.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    if (zoom === 'day') {
      // For day view, width based on duration in hours
      return Math.max(5, (durationMinutes / (24 * 60)) * 100);
    } else if (zoom === 'week') {
      // For week view, assume 1 day duration
      return Math.max(8, (1 / 7) * 100);
    } else if (zoom === 'month') {
      // For month view, assume 1 week duration
      return Math.max(10, (1 / 5) * 100);
    } else if (zoom === 'year') {
      // For year view, assume 1 month duration
      return Math.max(6, (1 / 12) * 100);
    }
    
    return 10;
  };

  return (
    <div className="w-full bg-white relative min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-50 border-b sticky top-0 z-40">
        {/* Left Section: Calendar Navigation and Today Button */}
        <div className="flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="text-xl font-medium text-blue-600 hover:bg-blue-50 px-3 py-2 rounded flex items-center space-x-2"
          >
            <span>
              {timelineZoom === 'day' && selectedWeekStart.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
              {timelineZoom === 'week' && selectedWeekStart.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
              {timelineZoom === 'month' && selectedWeekStart.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
              {timelineZoom === 'year' && selectedWeekStart.toLocaleDateString('en-US', {
                year: 'numeric'
              })}
            </span>
            <Calendar className="w-5 h-5" />
          </button>

          {/* Calendar Popup */}
          {showCalendar && (
            <div
              ref={calendarRef}
              className="absolute top-full right-0 sm:right-2 lg:right-4 mt-1 bg-white border rounded-lg shadow-lg z-50 p-3 lg:p-4 w-[280px] sm:w-80 lg:w-96 max-w-[calc(100vw-1rem)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-blue-500">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDates.map((date, index) => (
                  <button
                    key={index}
                    className={`p-2 text-sm rounded hover:bg-gray-100 ${
                      date.getMonth() !== currentDate.getMonth()
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    } ${
                      isToday(date)
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : ''
                    } ${
                      date.toDateString() === selectedWeekStart.toDateString() ||
                      (date > selectedWeekStart && date < new Date(selectedWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000))
                        ? 'bg-blue-100 text-blue-800'
                        : ''
                    }`}
                    onClick={() => handleCalendarDateSelect(date)}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Navigation and Add Task Button */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* View Selector */}
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('month')}
            >
              Month
            </Button>
          </div>

          {/* Timeline Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={timelineZoom === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimelineZoomChange('day')}
            >
              Day
            </Button>
            <Button
              variant={timelineZoom === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimelineZoomChange('week')}
            >
              Week
            </Button>
            <Button
              variant={timelineZoom === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimelineZoomChange('month')}
            >
              Month
            </Button>
            <Button
              variant={timelineZoom === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimelineZoomChange('year')}
            >
              Year
            </Button>
          </div>

          <button
            onClick={() => {
              const prevWeek = new Date(selectedWeekStart);
              prevWeek.setDate(selectedWeekStart.getDate() - 7);
              prevWeek.setHours(0, 0, 0, 0);
              setSelectedWeekStart(prevWeek);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <ChevronLeft size={16} className="text-blue-500 sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={handleTodayClick}
            className="px-2 lg:px-3 py-1 text-blue-500 text-xs sm:text-sm hover:text-blue-600 whitespace-nowrap"
          >
            Today
          </button>
          
          <button
            onClick={() => {
              const nextWeek = new Date(selectedWeekStart);
              nextWeek.setDate(selectedWeekStart.getDate() + 7);
              nextWeek.setHours(0, 0, 0, 0);
              setSelectedWeekStart(nextWeek);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <ChevronRight size={16} className="text-blue-500 sm:w-5 sm:h-5" />
          </button>

          {/* Add New Task Button */}
          <button
            onClick={handleAddNewTask}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-white border-b">
        <div className="flex items-center gap-2 flex-1">
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
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('in-progress')}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('completed')}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('overdue')}>Overdue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterPriority('all')}>All Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority('urgent')}>Urgent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority('high')}>High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority('medium')}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority('low')}>Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Gantt Chart Layout */}
      <div className="flex h-[calc(100vh-200px)] bg-white">
        {/* Project List */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
          <div className="p-3 border-b border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-800 text-lg">Projects</h3>
          </div>
          
          <div className="p-4 space-y-2">
            {filteredTasks.map((task, index) => (
              <div 
                key={task.id} 
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: task.color || '#3B82F6' }}
                />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Chart Grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-max">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="flex">
                {timelineZoom === 'day' && (
                  // Day view - show hours
                  Array.from({ length: 24 }, (_, hour) => (
                    <div key={hour} className="border-r border-gray-200 p-5 text-center min-w-[60px]">
                      <div className="text-xs font-medium text-gray-800">{hour}:00</div>
                    </div>
                  ))
                )}
                {timelineZoom === 'week' && (
                  // Week view - show days
                  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
                    <div key={dayIndex} className="border-r border-gray-200 p-2 text-center min-w-[120px]">
                      <div className="text-sm font-semibold text-gray-800">{day}</div>
                      <div className="text-xs text-gray-600">{dayIndex + 1}</div>
                    </div>
                  ))
                )}
                {timelineZoom === 'month' && (
                  // Month view - show weeks
                  ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'].map((week, weekIndex) => (
                    <div key={weekIndex} className="border-r border-gray-200 p-2 text-center min-w-[140px]">
                      <div className="text-sm font-semibold text-gray-800">{week}</div>
                      <div className="text-xs text-gray-600">Days 1-7</div>
                    </div>
                  ))
                )}
                {timelineZoom === 'year' && (
                  // Year view - show months
                  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, monthIndex) => (
                    <div key={monthIndex} className="border-r border-gray-200 p-2 text-center min-w-[100px]">
                      <div className="text-sm font-semibold text-gray-800">{month}</div>
                      <div className="text-xs text-gray-600">2024</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Project Rows */}
            <div className="bg-gray-50">
              {filteredTasks.map((task, taskIndex) => (
                <div key={task.id} className="border-b border-gray-200 relative h-12">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex">
                    {timelineZoom === 'day' && (
                      // Day view grid
                      Array.from({ length: 24 }, (_, hour) => (
                        <div key={hour} className="border-r border-gray-200 min-w-[60px]" />
                      ))
                    )}
                    {timelineZoom === 'week' && (
                      // Week view grid
                      Array.from({ length: 7 }, (_, day) => (
                        <div key={day} className="border-r border-gray-200 min-w-[120px]" />
                      ))
                    )}
                    {timelineZoom === 'month' && (
                      // Month view grid
                      Array.from({ length: 5 }, (_, week) => (
                        <div key={week} className="border-r border-gray-200 min-w-[140px]" />
                      ))
                    )}
                    {timelineZoom === 'year' && (
                      // Year view grid
                      Array.from({ length: 12 }, (_, month) => (
                        <div key={month} className="border-r border-gray-200 min-w-[100px]" />
                      ))
                    )}
                  </div>
                  
                  {/* Task Bars */}
                  <div
                    className="absolute top-2 bottom-2 rounded cursor-pointer transition-all duration-200 hover:shadow-md"
                    style={{
                      left: `${calculateTaskBarPosition(task, timelineZoom)}%`,
                      width: `${calculateTaskBarWidth(task, timelineZoom)}%`,
                      backgroundColor: task.color || '#3B82F6'
                    }}
                    onClick={() => handleTaskClick(task)}
                    onMouseEnter={(e) => handleTaskHover(task, e)}
                    onMouseLeave={handleTaskLeave}
                  >
                    <div className="flex items-center justify-center h-full">
                      <span className="text-xs font-medium text-white truncate px-1">
                        {timelineZoom === 'day' ? `${task.startTime}` : task.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium">Total Tasks</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-2">{filteredTasks.length}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-2">
              {filteredTasks.filter(t => t.status === 'completed').length}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-2">
              {filteredTasks.filter(t => t.status === 'in-progress').length}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-2">
              {filteredTasks.filter(t => t.status === 'overdue').length}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-white border-t">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">Overdue</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">Urgent Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-600">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">Low Priority</span>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[70vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse"></div>
              <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-white opacity-5 rounded-full animate-bounce"></div>
              <button
                onClick={handleCloseTaskModal}
                className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
              >
                <Plus className="w-6 h-6 transform rotate-45" />
              </button>
              <h2 className="text-2xl font-bold mb-2">
                {selectedTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              {/* <p className="text-white/90">
                {selectedTask ? 'Update task details and status' : 'Create a new task for your project'}
              </p> */}
            </div>

            <div className="p-8">
              <div className="text-center py-8">
                {/* <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {selectedTask ? 'Task Details' : 'New Task Form'}
                </h3> */}
                <p className="text-gray-600">
                  {selectedTask ? 'View and edit task information' : 'Fill in the details to create a new task'}
                </p>
              </div>

              {/* Task Details Display */}
              {selectedTask && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        {selectedTask.date}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Project</label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        {selectedTask.project || 'No project'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
                      {selectedTask.description || 'No description provided'}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={handleCloseTaskModal}>
                      Close
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Update Task
                    </Button>
                  </div>
                </div>
              )}

              {/* New Task Form */}
              {!selectedTask && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                      <Input placeholder="Enter task title..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                      <select className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300">
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                      <select className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Assignee</label>
                      <Input placeholder="Enter assignee name..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Project</label>
                      <Input placeholder="Enter project name..." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea 
                      placeholder="Enter task description..."
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 resize-none h-32"
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={handleCloseTaskModal}>
                      Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Create Task
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tooltip for Timeline */}
      {hoveredTask && (
        <div
          className="fixed z-50 bg-white border rounded-lg shadow-lg p-3 max-w-xs"
          style={{
            left: Math.max(10, hoverPosition.x - 320), // Position on the left side
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
                <span className="text-gray-500">Date:</span>
                <div className="font-medium">{hoveredTask.date}</div>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <div className="font-medium">{hoveredTask.status}</div>
              </div>
              <div>
                <span className="text-gray-500">Priority:</span>
                <div className="font-medium">{hoveredTask.priority}</div>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <div className="font-medium">{hoveredTask.type}</div>
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
            
            {hoveredTask.startTime && hoveredTask.endTime && (
              <div className="text-xs">
                <span className="text-gray-500">Time:</span>
                <div className="font-medium">{hoveredTask.startTime} - {hoveredTask.endTime}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;