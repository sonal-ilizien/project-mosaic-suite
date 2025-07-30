import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3,
  Activity,
  FileText,
  LayoutTemplate,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Eye,
  Clock as ClockIcon,
  Target,
  Zap,
  X,
  User,
  MessageSquare,
  Paperclip
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import NewProjectModal from "./NewProjectModal";
import { useProjects } from "../contexts/ProjectContext";

// Import the interfaces from the modal components
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

interface Project {
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

interface ScheduleTask {
  title: string;
  time: string;
  type: string;
  urgent: boolean;
  icon: any; // Using any for Lucide icons to avoid complex type issues
  color: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  comments?: number;
  attachments?: number;
  attachmentsList?: Array<{
    name: string;
    size: string;
    type: string;
    url: string;
  }>;
  commentsList?: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
}

// Using the Project interface defined above

const Dashboard = ({ onProjectSelect }: { onProjectSelect?: (project: Record<string, unknown> | { type: string }) => void }) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedScheduleTask, setSelectedScheduleTask] = useState<ScheduleTask | null>(null);
  const [upcomingTasks, setUpcomingTasks] = useState<ScheduleTask[]>([
    { 
      title: 'Sprint Planning Meeting', 
      time: '10:00 AM', 
      type: 'Meeting', 
      urgent: true,
      icon: Target,
      color: 'bg-blue-500',
      description: 'Weekly sprint planning session to discuss upcoming tasks, priorities, and team capacity. Review previous sprint outcomes and plan new sprint goals.',
      assignee: 'Sarah Johnson',
      dueDate: 'Today',
      comments: 3,
      attachments: 2,
      commentsList: [
        { id: '1', author: 'John Doe', content: 'Great points!', createdAt: '2023-10-26T10:00:00Z' },
        { id: '2', author: 'Jane Smith', content: 'I agree with John.', createdAt: '2023-10-26T10:05:00Z' },
        { id: '3', author: 'Mike Chen', content: 'Looking forward to this meeting!', createdAt: '2023-10-26T10:15:00Z' },
      ],
      attachmentsList: [
        { name: 'SprintReport.pdf', size: '1.2MB', type: 'application/pdf', url: '#' },
        { name: 'SprintNotes.txt', size: '0.5MB', type: 'text/plain', url: '#' },
      ]
    },
    { 
      title: 'Code Review - Auth Module', 
      time: '2:00 PM', 
      type: 'Review', 
      urgent: false,
      icon: Eye,
      color: 'bg-purple-500',
      description: 'Review authentication module implementation including user login, registration, and password reset functionality.',
      assignee: 'Mike Chen',
      dueDate: 'Today',
      comments: 5,
      attachments: 1,
      commentsList: [
        { id: '3', author: 'Alice Brown', content: 'Looks good!', createdAt: '2023-10-26T14:00:00Z' },
        { id: '4', author: 'Bob White', content: 'Minor comments.', createdAt: '2023-10-26T14:05:00Z' },
      ],
      attachmentsList: [
        { name: 'AuthModule.zip', size: '2.1MB', type: 'application/zip', url: '#' },
      ]
    },
    { 
      title: 'Budget Approval Call', 
      time: '4:30 PM', 
      type: 'Finance', 
      urgent: true,
      icon: BarChart3,
      color: 'bg-orange-500',
      description: 'Quarterly budget review and approval meeting with stakeholders. Discuss project funding and resource allocation.',
      assignee: 'Alex Rodriguez',
      dueDate: 'Today',
      comments: 8,
      attachments: 4,
      commentsList: [
        { id: '5', author: 'Charlie Black', content: 'Approved!', createdAt: '2023-10-26T16:00:00Z' },
        { id: '6', author: 'Diana Green', content: 'Minor adjustments needed.', createdAt: '2023-10-26T16:05:00Z' },
      ],
      attachmentsList: [
        { name: 'BudgetReport.xlsx', size: '1.5MB', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', url: '#' },
        { name: 'BudgetNotes.docx', size: '0.8MB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', url: '#' },
      ]
    },
    { 
      title: 'Design System Update', 
      time: 'Tomorrow', 
      type: 'Design', 
      urgent: false,
      icon: LayoutTemplate,
      color: 'bg-green-500',
      description: 'Update design system components and documentation. Review new component additions and style guide updates.',
      assignee: 'John Smith',
      dueDate: 'Tomorrow',
      comments: 2,
      attachments: 0,
      commentsList: [
        { id: '7', author: 'Eve Red', content: 'Ready for review.', createdAt: '2023-10-27T09:00:00Z' },
      ],
      attachmentsList: []
    }
  ]);
  const { projects, addProject } = useProjects();
  // const { projects } = useProjects();

  // Calculate real stats from actual projects
  const activeProjects = projects.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks, 0);
  const completedTasks = projects.reduce((sum, p) => sum + p.completedTasks, 0);

  const stats = [
    { 
      label: 'Active Projects', 
      value: activeProjects.toString(), 
      change: '+2', 
      icon: TrendingUp, 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      iconBg: 'bg-cyan-500/20',
      trend: 'up'
    },
    { 
      label: 'Team Members', 
      value: '24', 
      change: '+3', 
      icon: Users, 
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      iconBg: 'bg-indigo-500/20',
      trend: 'up'
    },
    { 
      label: 'Pending Tasks', 
      value: (totalTasks - completedTasks).toString(), 
      change: '-5', 
      icon: Clock, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      iconBg: 'bg-orange-500/20',
      trend: 'down'
    },
    { 
      label: 'Completed', 
      value: completedTasks.toString(), 
      change: '+12', 
      icon: CheckCircle, 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      iconBg: 'bg-emerald-500/20',
      trend: 'up'
    }
  ];

  // Get recent projects from actual data (show last 4)
  const recentProjects = projects
    .slice(0, 4)
    .map((project, index) => {
      const gradientColors = [
        'from-cyan-500 to-blue-600',
        'from-indigo-500 to-purple-600', 
        'from-orange-500 to-red-600',
        'from-emerald-500 to-green-600',
        'from-pink-500 to-rose-600',
        'from-violet-500 to-purple-600'
      ];
      
      return {
        name: project.name,
        progress: project.progress,
        status: project.status,
        priority: project.priority,
        dueDate: project.dueDate ? `Due ${project.dueDate}` : 'No due date',
        team: [project.assignee.substring(0,2).toUpperCase()],
        color: gradientColors[index % gradientColors.length]
      };
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-orange-500 text-white';
      case 'Low': return 'bg-emerald-500 text-white';
      case 'Urgent': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500 text-white';
      case 'In Progress': return 'bg-cyan-500 text-white';
      case 'Review': return 'bg-orange-500 text-white';
      case 'Planning': return 'bg-indigo-500 text-white';
      case 'On Hold': return 'bg-yellow-500 text-white';
      case 'Cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleTaskCreate = (task: Task) => {
    console.log('Task created:', task);
    // Convert task to project format and add to projects
    const newProject = {
      id: Date.now(),
      name: task.title,
      type: task.tags[0] || 'General',
      status: task.status === 'todo' ? 'Planning' : 
              task.status === 'inprogress' ? 'In Progress' : 
              task.status === 'review' ? 'Review' : 'Completed',
      priority: task.priority,
      assignee: task.assignee.name,
      dueDate: task.dueDate,
      progress: 0,
      tasks: 1,
      completedTasks: 0,
      description: task.description
    };
    addProject(newProject);
    setShowAddTaskModal(false);
  };

  const handleProjectCreate = (project: Project) => {
    console.log('Project created:', project);
    // Convert modal project to context project format
    const newProject = {
      id: Date.now(),
      name: project.name,
      type: project.template || 'General',
      status: project.status === 'backlog' ? 'Planning' : 
              project.status === 'in-progress' ? 'In Progress' : 
              project.status === 'completed' ? 'Completed' : 'Planning',
      priority: project.priority || 'Medium',
      assignee: project.team[0] || 'Unassigned',
      dueDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      progress: 0,
      tasks: 0,
      completedTasks: 0,
      description: project.description
    };
    addProject(newProject);
    setShowNewProjectModal(false);
  };

  const handleTaskDetailsClick = (task: ScheduleTask) => {
    setSelectedScheduleTask(task);
    setShowTaskDetailsModal(true);
  };

  const handleArrowClick = (e: React.MouseEvent, task: ScheduleTask) => {
    e.stopPropagation();
    handleTaskDetailsClick(task);
  };

  const handleEditTask = () => {
    setShowTaskDetailsModal(false);
    setShowEditTaskModal(true);
  };

  const handleUpdateTask = (updatedTask: ScheduleTask) => {
    if (selectedScheduleTask) {
      const updatedTasks = upcomingTasks.map(task => 
        task.title === selectedScheduleTask.title ? updatedTask : task
      );
      setUpcomingTasks(updatedTasks);
      setSelectedScheduleTask(updatedTask);
      setShowEditTaskModal(false);
      setShowTaskDetailsModal(true);
    }
  };

  const handleMarkComplete = () => {
    // Here you would typically update the task status
    console.log('Marking task as complete:', selectedScheduleTask?.title);
    setShowTaskDetailsModal(false);
  };

  const handleDownloadAttachment = (attachment: { name: string; url: string; size: string; type: string }) => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = attachment.url || '#';
    link.download = attachment.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Downloading attachment:', attachment.name);
  };

  return (
    <TooltipProvider>
      <div 
        className="p-6 space-y-8 min-h-screen"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background-secondary)) 50%, hsl(var(--background-tertiary)) 100%)'
        }}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground text-lg">Welcome back! Here's what's happening with your projects.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-12 px-6 border-2 hover:border-blue-300 hover:bg-blue-50 hover:text-black transition-all duration-200 flex-1 min-w-0"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  <span className="font-medium">Calendar View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Calendar View</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6 flex-1 min-w-0" 
                  size="lg"
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  <span className="font-medium">Analytics</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analytics</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6 flex-1 min-w-0"
                  size="lg"
                  onClick={() => {
                    // Navigate to templates page
                    if (onProjectSelect) {
                      onProjectSelect({ type: 'templates' });
                    }
                  }}
                >
                  <LayoutTemplate className="w-5 h-5 mr-3" />
                  <span className="font-medium">Templates</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Templates</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg ${stat.bgColor}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
                              <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
                    <div className="flex items-center">
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {stat.change}
                      </div>
                      <span className="text-xs text-gray-600 ml-2">this week</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.iconBg} ${stat.color} flex-shrink-0 ml-4 shadow-md`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
                        <Card className="p-6 border-0 shadow-xl h-full" style={{ 
                          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                          border: '1px solid #BFDBFE'
                        }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Recent Projects</h3>
                    <p className="text-xs text-muted-foreground">Track your active projects</p>
                  </div>
                </div>
                                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="text-xs font-medium hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                   onClick={() => onProjectSelect && onProjectSelect({ type: 'list' })}
                 >
                   View All
                   <ArrowUpRight className="w-3 h-3 ml-1" />
                 </Button>
              </div>
              <div className="space-y-3">
                {recentProjects.map((project, index) => (
                  <div 
                    key={index} 
                    className="group p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 hover:border-cyan-200 dark:hover:border-cyan-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => onProjectSelect && onProjectSelect(project)}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground text-base truncate group-hover:text-blue-700 transition-colors">
                            {project.name}
                          </h4>
                          <Badge className={`${getPriorityColor(project.priority)} text-xs font-medium border`}>
                            {project.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className={`${getStatusColor(project.status)} text-xs font-medium`}>
                            {project.status}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <ClockIcon className="w-3 h-3" />
                            <span>Due in {project.dueDate}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-foreground">Progress</span>
                            <span className="text-xs font-bold text-blue-600">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${project.color} transition-all duration-500 ease-out`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-3">
                        <div className="flex -space-x-1">
                          {project.team.map((member, idx) => (
                            <Avatar key={idx} className="w-6 h-6 border border-white shadow-sm">
                              <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                {member}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Today's Schedule */}
          <div className="h-full">
            <Card className="p-6 border-0 shadow-xl h-full" style={{ 
              background: 'linear-gradient(135deg, #FEF2F2 0%, #FED7D7 100%)',
              border: '1px solid #FECACA'
            }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Today's Schedule</h3>
                    <p className="text-xs text-muted-foreground">Your upcoming tasks</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs font-medium hover:bg-orange-50 hover:text-orange-700"
                  onClick={() => setShowAddTaskModal(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Task
                </Button>
              </div>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div 
                    key={index} 
                    className="group p-3 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-white border border-gray-100 hover:border-orange-200 transition-all duration-300 cursor-pointer"
                    onClick={() => handleTaskDetailsClick(task)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${task.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <task.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground text-xs group-hover:text-orange-700 transition-colors truncate">
                            {task.title}
                          </h4>
                          {task.urgent && (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              <span className="text-xs text-red-600 font-medium">Urgent</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs font-medium border-gray-200">
                              {task.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{task.time}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            onClick={(e) => handleArrowClick(e, task)}
                          >
                            <ArrowUpRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-foreground mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    onClick={() => setShowAddTaskModal(true)}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    New Task
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs font-medium hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                    onClick={() => setShowNewProjectModal(true)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    New Project
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTaskModal
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        onTaskCreate={handleTaskCreate}
      />

      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
        onProjectCreate={handleProjectCreate}
      />

             <Dialog open={showTaskDetailsModal} onOpenChange={setShowTaskDetailsModal}>
         <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-hidden p-0">
           <div className="flex h-full">
             {/* Left Panel - Task Details */}
             <div className="w-2/3 p-6 overflow-y-auto">
               <DialogHeader className="mb-6">
                 <div className="flex items-start space-x-4">
                   {selectedScheduleTask && (
                     <div className={`w-16 h-16 ${selectedScheduleTask.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                       <selectedScheduleTask.icon className="w-8 h-8 text-white" />
                     </div>
                   )}
                   <div className="flex-1">
                     <DialogTitle className="text-2xl font-bold mb-2">{selectedScheduleTask?.title}</DialogTitle>
                     <div className="flex items-center space-x-3 mb-4">
                       <Badge variant="outline" className="text-sm font-medium border-gray-200 px-3 py-1">
                         {selectedScheduleTask?.type}
                       </Badge>
                       <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                         <ClockIcon className="w-4 h-4" />
                         <span>{selectedScheduleTask?.time}</span>
                       </div>
                       {selectedScheduleTask?.urgent && (
                         <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
                           <AlertTriangle className="w-4 h-4 text-red-500" />
                           <span className="text-sm text-red-600 font-medium">Urgent</span>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </DialogHeader>
               
               <div className="space-y-6">
                 {/* Description Section */}
                 {selectedScheduleTask?.description && (
                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                     <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                       <FileText className="w-5 h-5 mr-2 text-blue-600" />
                       Description
                     </h3>
                     <p className="text-base text-gray-700 leading-relaxed">
                       {selectedScheduleTask.description}
                     </p>
                   </div>
                 )}
                 
                 {/* Task Details Grid */}
                 <div className="grid grid-cols-2 gap-6">
                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-sm">
                     <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                       <User className="w-5 h-5 mr-2 text-green-600" />
                       Task Details
                     </h3>
                     <div className="space-y-4">
                       <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-green-100">
                         <div className="flex items-center space-x-3">
                           <User className="w-5 h-5 text-green-600" />
                           <span className="text-sm font-medium text-gray-700">Assignee</span>
                         </div>
                         <span className="text-sm font-semibold text-gray-900">{selectedScheduleTask?.assignee || 'Unassigned'}</span>
                       </div>
                       
                       <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-green-100">
                         <div className="flex items-center space-x-3">
                           <ClockIcon className="w-5 h-5 text-green-600" />
                           <span className="text-sm font-medium text-gray-700">Due Date</span>
                         </div>
                         <span className="text-sm font-semibold text-gray-900">{selectedScheduleTask?.dueDate || 'No due date'}</span>
                       </div>
                       
                       <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-green-100">
                         <div className="flex items-center space-x-3">
                           <MessageSquare className="w-5 h-5 text-green-600" />
                           <span className="text-sm font-medium text-gray-700">Comments</span>
                         </div>
                         <span className="text-sm font-semibold text-gray-900">{selectedScheduleTask?.comments || 0}</span>
                       </div>
                       
                       <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-green-100">
                         <div className="flex items-center space-x-3">
                           <Paperclip className="w-5 h-5 text-green-600" />
                           <span className="text-sm font-medium text-gray-700">Attachments</span>
                         </div>
                         <span className="text-sm font-semibold text-gray-900">{selectedScheduleTask?.attachments || 0}</span>
                       </div>
                     </div>
                   </div>
                   
                   {/* Comments Section */}
                   {selectedScheduleTask?.commentsList && selectedScheduleTask.commentsList.length > 0 && (
                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm">
                       <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                         <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                         Comments ({selectedScheduleTask.commentsList.length})
                       </h3>
                       <div className="space-y-4 max-h-64 overflow-y-auto">
                         {selectedScheduleTask.commentsList.map((comment) => (
                           <div key={comment.id} className="bg-white/80 rounded-lg p-4 border-l-4 border-blue-300 shadow-sm">
                             <div className="flex items-center justify-between mb-2">
                               <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                               <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                                 {new Date(comment.createdAt).toLocaleDateString()}
                               </span>
                             </div>
                             <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             </div>
             
             {/* Right Panel - Attachments & Actions */}
             <div className="w-1/3 bg-gray-50 p-6 border-l border-gray-200 relative">
               {/* Top spacing to avoid overlap with modal controls */}
               <div className="h-12"></div>
               
               {/* Attachments Section */}
               {selectedScheduleTask?.attachmentsList && selectedScheduleTask.attachmentsList.length > 0 && (
                 <div className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                   <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                     <Paperclip className="w-5 h-5 mr-2 text-purple-600" />
                     Attachments ({selectedScheduleTask.attachmentsList.length})
                   </h3>
                   <div className="space-y-3">
                     {selectedScheduleTask.attachmentsList.map((attachment, index) => (
                       <div key={index} className="bg-white/80 p-4 rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                               <Paperclip className="w-5 h-5 text-purple-600" />
                             </div>
                             <div>
                               <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                               <p className="text-xs text-gray-500">{attachment.size}</p>
                             </div>
                           </div>
                           <Button variant="outline" size="sm" className="text-xs border-purple-200 text-purple-600 hover:bg-purple-50" onClick={() => handleDownloadAttachment(attachment)}>
                             Download
                           </Button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
               
               {/* Action Buttons */}
               <div className="space-y-3 mt-auto">
                 <Button variant="outline" size="lg" className="w-full" onClick={handleEditTask}>
                   <FileText className="w-4 h-4 mr-2" />
                   Edit Task
                 </Button>
                 <Button size="lg" className="w-full bg-green-600 hover:bg-green-700" onClick={handleMarkComplete}>
                   <CheckCircle className="w-4 h-4 mr-2" />
                   Mark Complete
                 </Button>
               </div>
             </div>
           </div>
         </DialogContent>
       </Dialog>

       {/* Edit Task Modal */}
       <Dialog open={showEditTaskModal} onOpenChange={setShowEditTaskModal}>
         <DialogContent className="max-w-2xl w-[80vw] max-h-[80vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle>Edit Task</DialogTitle>
           </DialogHeader>
           
           <form onSubmit={(e) => {
             e.preventDefault();
             const formData = new FormData(e.currentTarget);
             const updatedTask: ScheduleTask = {
               ...selectedScheduleTask!,
               title: formData.get('title') as string,
               description: formData.get('description') as string,
               time: formData.get('time') as string,
               type: formData.get('type') as string,
               urgent: formData.get('urgent') === 'on',
             };
             handleUpdateTask(updatedTask);
           }}>
             <div className="space-y-4">
               <div>
                 <label className="text-sm font-medium text-foreground">Task Title</label>
                 <input 
                   name="title"
                   type="text" 
                   className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   defaultValue={selectedScheduleTask?.title}
                   required
                 />
               </div>
               
               <div>
                 <label className="text-sm font-medium text-foreground">Description</label>
                 <textarea 
                   name="description"
                   className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   rows={3}
                   defaultValue={selectedScheduleTask?.description}
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-sm font-medium text-foreground">Time</label>
                   <input 
                     name="time"
                     type="time" 
                     className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     defaultValue={selectedScheduleTask?.time}
                     required
                   />
                 </div>
                 <div>
                   <label className="text-sm font-medium text-foreground">Type</label>
                   <select 
                     name="type"
                     className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     defaultValue={selectedScheduleTask?.type}
                     required
                   >
                     <option value="Meeting">Meeting</option>
                     <option value="Review">Review</option>
                     <option value="Finance">Finance</option>
                     <option value="Design">Design</option>
                   </select>
                 </div>
               </div>
               
               <div className="flex items-center space-x-2">
                 <input 
                   name="urgent"
                   type="checkbox" 
                   id="urgent" 
                   className="rounded" 
                   defaultChecked={selectedScheduleTask?.urgent} 
                 />
                 <label htmlFor="urgent" className="text-sm font-medium text-foreground">Mark as Urgent</label>
               </div>
               
               <div className="flex space-x-2 pt-4 border-t">
                 <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setShowEditTaskModal(false)}>
                   Cancel
                 </Button>
                 <Button type="submit" size="sm" className="flex-1">
                   Save Changes
                 </Button>
               </div>
             </div>
           </form>
         </DialogContent>
       </Dialog>
    </TooltipProvider>
  );
};

export default Dashboard;