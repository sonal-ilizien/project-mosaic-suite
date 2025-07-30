import { useState } from "react";
import { 
  Calendar, 
  Plus, 
  Clock, 
  MessageSquare, 
  AlertCircle,
  Play,
  Square,
  FileText,
  Users,
  Target,
  CheckCircle,
  Loader2,
  Sparkles,
  BarChart3,
  Star,
  Timer,
  Paperclip,
  Send,
  Download,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Zap,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

// Import all our Agile modals
import SprintPlanningModal from "./SprintPlanningModal";
import AgileTaskModal from "./AgileTaskModal";
import BugTrackingModal from "./BugTrackingModal";
import WorkLogModal from "./WorkLogModal";
import TaskCommentsModal from "./TaskCommentsModal";

interface Sprint {
  id: number;
  name: string;
  goal: string;
  start_date: string;
  end_date: string;
  project: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  story_points: number;
  status: string;
  priority: string;
}

interface Bug {
  id: number;
  title: string;
  description: string;
  priority: string;
  severity: string;
}

interface WorkLog {
  id: number;
  description: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
}

interface Comment {
  id: number;
  text: string;
  author: {
    name: string;
  };
}

interface Attachment {
  id: number;
  filename: string;
  file_size: number;
}

interface AgileTestDashboardProps {
  projectId: number;
  projectName: string;
  onBack?: () => void;
}

const AgileTestDashboard = ({ projectId, projectName, onBack }: AgileTestDashboardProps) => {
  const { toast } = useToast();
  
  // Modal states
  const [sprintModalOpen, setSprintModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [workLogModalOpen, setWorkLogModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);

  // Test data states
  const [testTaskId] = useState(1); // Mock task ID for testing
  const [testTaskTitle] = useState("Implement Login Form");
  const [createdSprints, setCreatedSprints] = useState<Sprint[]>([]);
  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [createdBugs, setCreatedBugs] = useState<Bug[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // Stats data
  const stats = [
    {
      label: "Total Sprints",
      value: createdSprints.length,
      change: "+2",
      trend: "up" as const,
      icon: Calendar,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
    },
    {
      label: "Active Tasks",
      value: createdTasks.length,
      change: "+5",
      trend: "up" as const,
      icon: Target,
      color: "text-green-600",
      iconBg: "bg-green-100",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
    },
    {
      label: "Bugs Reported",
      value: createdBugs.length,
      change: "-1",
      trend: "down" as const,
      icon: AlertCircle,
      color: "text-red-600",
      iconBg: "bg-red-100",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
    },
    {
      label: "Work Hours",
      value: workLogs.reduce((total, log) => total + Math.floor(log.duration_minutes / 60), 0),
      change: "+12",
      trend: "up" as const,
      icon: Clock,
      color: "text-purple-600",
      iconBg: "bg-purple-100",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
    }
  ];

  const handleSprintCreated = (sprint: Sprint) => {
    setCreatedSprints(prev => [...prev, sprint]);
    toast({
      title: "Sprint Created!",
      description: `Sprint "${sprint.name}" has been created successfully.`,
    });
  };

  const handleTaskCreated = (task: Task) => {
    setCreatedTasks(prev => [...prev, task]);
    toast({
      title: "Task Created!",
      description: `Task "${task.title}" has been created successfully.`,
    });
  };

  const handleBugCreated = (bug: Bug) => {
    setCreatedBugs(prev => [...prev, bug]);
    toast({
      title: "Bug Reported!",
      description: `Bug "${bug.title}" has been reported successfully.`,
    });
  };

  const handleWorkLogCreated = (workLog: WorkLog) => {
    setWorkLogs(prev => [...prev, workLog]);
    toast({
      title: "Work Log Added!",
      description: `Work log has been added successfully.`,
    });
  };

  const handleCommentCreated = (comment: Comment) => {
    setComments(prev => [...prev, comment]);
    toast({
      title: "Comment Added!",
      description: `Comment has been added successfully.`,
    });
  };

  const handleAttachmentUploaded = (attachment: Attachment) => {
    toast({
      title: "File Uploaded!",
      description: `File "${attachment.filename}" has been uploaded successfully.`,
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8 pb-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                {onBack && (
                  <Button 
                    variant="outline" 
                    onClick={onBack}
                    className="mr-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Project
                  </Button>
                )}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Agile Dashboard</h1>
                  <p className="text-muted-foreground text-lg">Agile features for project: {projectName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Testing Mode
              </Badge>
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
                          <TrendingUp className="w-3 h-3 mr-1" />
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

          {/* Test Actions */}
          <Card className="p-6 border-0 shadow-xl" style={{ 
            background: 'linear-gradient(135deg, #FEF9E7 0%, #FEF3C7 100%)',
            border: '1px solid #FCD34D'
          }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">Test Actions</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Click the buttons below to test each Agile feature
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Sprint Planning */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => setSprintModalOpen(true)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-16 px-4 flex-col space-y-2"
                    >
                      <Calendar className="w-6 h-6" />
                      <span className="font-medium text-sm">Create Sprint</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create and manage sprints</p>
                  </TooltipContent>
                </Tooltip>

                {/* Task Creation */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => setTaskModalOpen(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-16 px-4 flex-col space-y-2"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="font-medium text-sm">Create Task</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create Agile tasks with story points</p>
                  </TooltipContent>
                </Tooltip>

                {/* Bug Tracking */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => setBugModalOpen(true)}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-16 px-4 flex-col space-y-2"
                    >
                      <AlertCircle className="w-6 h-6" />
                      <span className="font-medium text-sm">Report Bug</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Report and track bugs</p>
                  </TooltipContent>
                </Tooltip>

                {/* Work Log */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => setWorkLogModalOpen(true)}
                      className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-16 px-4 flex-col space-y-2"
                    >
                      <Clock className="w-6 h-6" />
                      <span className="font-medium text-sm">Log Time</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Track work time and activities</p>
                  </TooltipContent>
                </Tooltip>

                {/* Comments */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => setCommentsModalOpen(true)}
                      className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-16 px-4 flex-col space-y-2"
                    >
                      <MessageSquare className="w-6 h-6" />
                      <span className="font-medium text-sm">Comments</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add comments and attachments</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Sprints */}
              <Card className="p-4 border-0 shadow-xl" style={{ 
                background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                border: '1px solid #FCA5A5'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Created Sprints</h3>
                      <p className="text-xs text-muted-foreground">Track your sprints</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {createdSprints.length} sprints
                  </Badge>
                </div>
                <div className="space-y-2 h-40 overflow-y-auto">
                  {createdSprints.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 text-sm">No sprints created yet</p>
                    </div>
                  ) : (
                    createdSprints.map((sprint, index) => (
                      <div key={index} className="group p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-xs truncate group-hover:text-blue-700 transition-colors">
                              {sprint.name}
                            </h4>
                          </div>
                          <Badge className="bg-blue-600 text-white text-xs ml-1">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Tasks */}
              <Card className="p-4 border-0 shadow-xl" style={{ 
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                border: '1px solid #7DD3FC'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Created Tasks</h3>
                      <p className="text-xs text-muted-foreground">Track your tasks</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {createdTasks.length} tasks
                  </Badge>
                </div>
                <div className="space-y-2 h-40 overflow-y-auto">
                  {createdTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 text-sm">No tasks created yet</p>
                    </div>
                  ) : (
                    createdTasks.map((task, index) => (
                      <div key={index} className="group p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-xs truncate group-hover:text-green-700 transition-colors">
                              {task.title}
                            </h4>
                          </div>
                          <Badge className="bg-green-600 text-white text-xs ml-1">
                            {task.story_points} SP
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Middle Column */}
            <div className="space-y-6">
              {/* Bugs */}
              <Card className="p-4 border-0 shadow-xl" style={{ 
                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                border: '1px solid #A7F3D0'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Reported Bugs</h3>
                      <p className="text-xs text-muted-foreground">Track your bugs</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                    {createdBugs.length} bugs
                  </Badge>
                </div>
                <div className="space-y-2 h-40 overflow-y-auto">
                  {createdBugs.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 text-sm">No bugs reported yet</p>
                    </div>
                  ) : (
                    createdBugs.map((bug, index) => (
                      <div key={index} className="group p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-xs truncate group-hover:text-red-700 transition-colors">
                              {bug.title}
                            </h4>
                          </div>
                          <Badge className="bg-red-600 text-white text-xs ml-1">
                            {bug.priority}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Work Logs */}
              <Card className="p-4 border-0 shadow-xl" style={{ 
                background: 'linear-gradient(135deg,rgb(199, 254, 244) 0%,rgb(147, 196, 210) 100%)',
                border: '1px solid #F59E0B'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Work Logs</h3>
                      <p className="text-xs text-muted-foreground">Track your time</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    {workLogs.length} logs
                  </Badge>
                </div>
                <div className="space-y-2 h-40 overflow-y-auto">
                  {workLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 text-sm">No work logs yet</p>
                    </div>
                  ) : (
                    workLogs.map((log, index) => (
                      <div key={index} className="group p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-xs">Work Log #{index + 1}</h4>
                          </div>
                          <Badge className="bg-purple-600 text-white text-xs ml-1">
                            {Math.floor(log.duration_minutes / 60)}h {log.duration_minutes % 60}m
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Comments */}
              <Card className="p-4 border-0 shadow-xl" style={{ 
                background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
                border: '1px solid #F9A8D4'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Comments</h3>
                      <p className="text-xs text-muted-foreground">Track your discussions</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                    {comments.length} comments
                  </Badge>
                </div>
                <div className="space-y-2 h-40 overflow-y-auto">
                  {comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 text-sm">No comments yet</p>
                    </div>
                  ) : (
                    comments.map((comment, index) => (
                      <div key={index} className="group p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-xs">Comment #{index + 1}</h4>
                          </div>
                          <Badge className="bg-orange-600 text-white text-xs ml-1">
                            New
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* API Status */}
              <Card className="p-4 border-0 shadow-xl" style={{ 
                background: 'linear-gradient(135deg, #FEF9E7 0%, #FEF3C7 100%)',
                border: '1px solid #FCD34D'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">API Status</h3>
                      <p className="text-xs text-muted-foreground">System health</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 h-40 overflow-y-auto">
                  {[
                    { name: "Sprint API", status: "Ready" },
                    { name: "Task API", status: "Ready" },
                    { name: "Bug API", status: "Ready" },
                    { name: "Work Log API", status: "Ready" },
                    { name: "Comments API", status: "Ready" }
                  ].map((api, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100">
                      <span className="text-xs font-medium text-gray-700">{api.name}</span>
                      <Badge className="bg-green-600 text-white text-xs">
                        {api.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Modals */}
        <SprintPlanningModal
          open={sprintModalOpen}
          onOpenChange={setSprintModalOpen}
          projectId={projectId}
          projectName={projectName}
          onSprintCreated={handleSprintCreated}
        />

        <AgileTaskModal
          open={taskModalOpen}
          onOpenChange={setTaskModalOpen}
          projectId={projectId}
          projectName={projectName}
          onTaskCreated={handleTaskCreated}
        />

        <BugTrackingModal
          open={bugModalOpen}
          onOpenChange={setBugModalOpen}
          projectId={projectId}
          projectName={projectName}
          onBugCreated={handleBugCreated}
        />

        <WorkLogModal
          open={workLogModalOpen}
          onOpenChange={setWorkLogModalOpen}
          taskId={testTaskId}
          taskTitle={testTaskTitle}
          projectName={projectName}
          onWorkLogCreated={handleWorkLogCreated}
        />

        <TaskCommentsModal
          open={commentsModalOpen}
          onOpenChange={setCommentsModalOpen}
          taskId={testTaskId}
          taskTitle={testTaskTitle}
          projectName={projectName}
          onCommentCreated={handleCommentCreated}
          onAttachmentUploaded={handleAttachmentUploaded}
        />
      </div>
    </TooltipProvider>
  );
};

export default AgileTestDashboard; 