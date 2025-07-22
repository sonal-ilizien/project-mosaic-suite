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
  Zap
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

// Using the Project interface defined above

const Dashboard = ({ onProjectSelect }: { onProjectSelect?: (project: Record<string, unknown> | { type: string }) => void }) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
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
      value: '12', 
      change: '+2', 
      icon: TrendingUp, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      iconBg: 'bg-blue-600',
      trend: 'up'
    },
    { 
      label: 'Team Members', 
      value: '24', 
      change: '+3', 
      icon: Users, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-500',
      iconBg: 'bg-indigo-600',
      trend: 'up'
    },
    { 
      label: 'Pending Tasks', 
      value: '47', 
      change: '-5', 
      icon: Clock, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-500',
      iconBg: 'bg-orange-600',
      trend: 'down'
    },
    { 
      label: 'Completed', 
      value: '128', 
      change: '+12', 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      iconBg: 'bg-green-600',
      trend: 'up'
    }
  ];

  const recentProjects = [
    { 
      name: 'Mobile App Redesign', 
      progress: 75, 
      status: 'In Progress', 
      priority: 'High', 
      dueDate: '2 days',
      team: ['SC', 'MJ', 'AK'],
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Financial Dashboard', 
      progress: 90, 
      status: 'Review', 
      priority: 'Medium', 
      dueDate: '1 week',
      team: ['JS', 'ED'],
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      name: 'API Integration', 
      progress: 45, 
      status: 'Development', 
      priority: 'High', 
      dueDate: '3 days',
      team: ['MC', 'AR'],
      color: 'from-orange-500 to-orange-600'
    },
    { 
      name: 'User Documentation', 
      progress: 20, 
      status: 'Planning', 
      priority: 'Low', 
      dueDate: '2 weeks',
      team: ['SJ'],
      color: 'from-green-500 to-green-600'
    }
  ];

  const upcomingTasks = [
    { 
      title: 'Sprint Planning Meeting', 
      time: '10:00 AM', 
      type: 'Meeting', 
      urgent: true,
      icon: Target,
      color: 'bg-blue-500'
    },
    { 
      title: 'Code Review - Auth Module', 
      time: '2:00 PM', 
      type: 'Review', 
      urgent: false,
      icon: Eye,
      color: 'bg-purple-500'
    },
    { 
      title: 'Budget Approval Call', 
      time: '4:30 PM', 
      type: 'Finance', 
      urgent: true,
      icon: BarChart3,
      color: 'bg-orange-500'
    },
    { 
      title: 'Design System Update', 
      time: 'Tomorrow', 
      type: 'Design', 
      urgent: false,
      icon: LayoutTemplate,
      color: 'bg-green-500'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Review': return 'bg-yellow-100 text-yellow-700';
      case 'Development': return 'bg-indigo-100 text-indigo-700';
      case 'Planning': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
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
                <Button variant="outline" size="lg" className="h-12 px-6 border-2 hover:border-blue-300 hover:bg-blue-50 hover:text-black transition-all duration-200">
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
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6" size="lg">
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
                <Button variant="outline" size="lg" className="h-12 px-6 border-2 hover:border-green-300 hover:bg-green-50 hover:text-black transition-all duration-200">
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
                    <p className="text-sm font-medium text-white mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mb-3">{stat.value}</p>
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
                      <span className="text-xs text-white/80 ml-2">this week</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.iconBg} text-white flex-shrink-0 ml-4 shadow-md`}>
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
                   className="text-xs font-medium hover:bg-blue-50 hover:text-blue-700"
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
                    className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
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
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
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
    </TooltipProvider>
  );
};

export default Dashboard;