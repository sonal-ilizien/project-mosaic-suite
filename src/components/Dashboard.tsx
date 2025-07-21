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
  LayoutTemplate
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

interface Project {
  id: string;
  name: string;
  progress: number;
  status: string;
  priority: string;
  dueDate: string;
}

const Dashboard = ({ onProjectSelect }: { onProjectSelect?: (project: Record<string, unknown>) => void }) => {
  const stats = [
    { label: 'Active Projects', value: '12', change: '+2', icon: TrendingUp, color: 'text-primary' },
    { label: 'Team Members', value: '24', change: '+3', icon: Users, color: 'text-accent' },
    { label: 'Pending Tasks', value: '47', change: '-5', icon: Clock, color: 'text-warning' },
    { label: 'Completed', value: '128', change: '+12', icon: CheckCircle, color: 'text-success' }
  ];

  const recentProjects = [
    { name: 'Mobile App Redesign', progress: 75, status: 'In Progress', priority: 'High', dueDate: '2 days' },
    { name: 'Financial Dashboard', progress: 90, status: 'Review', priority: 'Medium', dueDate: '1 week' },
    { name: 'API Integration', progress: 45, status: 'Development', priority: 'High', dueDate: '3 days' },
    { name: 'User Documentation', progress: 20, status: 'Planning', priority: 'Low', dueDate: '2 weeks' }
  ];

  const upcomingTasks = [
    { title: 'Sprint Planning Meeting', time: '10:00 AM', type: 'Meeting', urgent: true },
    { title: 'Code Review - Auth Module', time: '2:00 PM', type: 'Review', urgent: false },
    { title: 'Budget Approval Call', time: '4:30 PM', type: 'Finance', urgent: true },
    { title: 'Design System Update', time: 'Tomorrow', type: 'Design', urgent: false }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-destructive text-white';
      case 'Medium': return 'bg-warning text-white';
      case 'Low': return 'bg-success text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <TooltipProvider>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <div className="flex flex-row gap-2 sm:gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto h-12 sm:h-12">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Calendar View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Calendar View</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto h-12 sm:h-12" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span>Analytics</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analytics</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto h-12 sm:h-12">
                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  <span>Templates</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Templates</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 sm:p-6 hover:shadow-custom-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs sm:text-sm ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground ml-1">this week</span>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg bg-background-secondary ${stat.color} flex-shrink-0 ml-3`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Projects</h3>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">View All</Button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentProjects.map((project, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-background-secondary rounded-lg gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <h4 className="font-medium text-foreground text-sm sm:text-base truncate">{project.name}</h4>
                        <Badge className={`${getPriorityColor(project.priority)} text-xs`}>
                          {project.priority}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs sm:text-sm text-muted-foreground truncate">{project.status}</span>
                            <span className="text-xs sm:text-sm font-medium">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all" 
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground sm:ml-4 sm:text-right">
                          Due in {project.dueDate}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Upcoming Tasks */}
          <div>
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Today's Schedule</h3>
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg hover:bg-background-secondary transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${task.urgent ? 'bg-destructive' : 'bg-primary'}`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-xs sm:text-sm truncate">{task.title}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{task.time}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {task.type}
                          </Badge>
                          {task.urgent && (
                            <AlertTriangle className="w-3 h-3 text-destructive" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;