import { useState } from "react";
import { 
  Calendar, 
  Users, 
  Folder, 
  X, 
  ArrowRight,
  User,
  Target,
  Tag,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Settings,
  Star,
  Sparkles
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

interface Project {
  id: number;
  name: string;
  type: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  progress: number;
  tasks: number;
  completedTasks: number;
  description?: string;
}

interface ProjectDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

const ProjectDetailsModal = ({ open, onOpenChange, project }: ProjectDetailsModalProps) => {
  if (!project) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-success text-white';
      case 'in progress': return 'bg-primary text-white';
      case 'review': return 'bg-warning text-white';
      case 'planning': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-destructive text-white';
      case 'medium': return 'bg-warning text-white';
      case 'low': return 'bg-success text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[95vw] max-h-[95vh] overflow-hidden p-0">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Side - Project Details */}
          <div className="w-full lg:w-[70%] p-4 sm:p-6 overflow-y-auto">
            <DialogHeader className="mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 font-medium">DEE</span>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 font-semibold text-lg">Project Details</span>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Folder className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">{project.name}</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">{project.description}</p>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Progress</p>
                      <p className="text-base sm:text-lg font-semibold">{project.progress}%</p>
                    </div>
                  </div>
                  <Progress value={project.progress} className="mt-2" />
                </Card>
                
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Tasks</p>
                      <p className="text-base sm:text-lg font-semibold">{project.completedTasks}/{project.tasks}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Due Date</p>
                      <p className="text-base sm:text-lg font-semibold">{project.dueDate}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Project Attributes and Recent Activity Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Project Attributes */}
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                    Project Attributes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Type</p>
                      <Badge variant="outline">{project.type}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Priority</p>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Assignee</p>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{project.assignee}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                    Recent Activity
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Task completed</p>
                        <p className="text-xs text-muted-foreground">Mobile app redesign - UI components</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-warning rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Comment added</p>
                        <p className="text-xs text-muted-foreground">John Doe: "Need to review the latest changes"</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">4 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-success rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Milestone reached</p>
                        <p className="text-xs text-muted-foreground">Phase 1 completed - 75% overall progress</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">1 day ago</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Side - Project Info */}
          <div className="w-full lg:w-[30%] bg-gradient-to-br from-gray-50 to-gray-100 border-t lg:border-l lg:border-t-0 border-gray-200 p-4 sm:p-6 overflow-y-auto">
            <div className="space-y-3 sm:space-y-4">
              {/* Project Info Header */}
              <div className="text-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground mb-1">Project Overview</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">{project.type} Project</p>
              </div>

              {/* Quick Stats */}
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-foreground mb-2 sm:mb-3 flex items-center text-xs sm:text-sm">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary" />
                  Quick Stats
                </h3>
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tasks Completed</span>
                    <span className="font-medium">{project.completedTasks}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total Tasks</span>
                    <span className="font-medium">{project.tasks}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{Math.round((project.completedTasks / project.tasks) * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Days Remaining</span>
                    <span className="font-medium">15 days</span>
                  </div>
                </div>
              </div>

              {/* Team Info */}
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-foreground mb-2 sm:mb-3 flex items-center text-xs sm:text-sm">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary" />
                  Team Members
                </h3>
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                      {project.assignee.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs">{project.assignee}</span>
                    <Badge variant="outline" className="text-xs">Lead</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs">
                      JS
                    </div>
                    <span className="text-xs">Jane Smith</span>
                    <Badge variant="outline" className="text-xs">Member</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-warning text-warning-foreground rounded-full flex items-center justify-center text-xs">
                      MJ
                    </div>
                    <span className="text-xs">Mike Johnson</span>
                    <Badge variant="outline" className="text-xs">Member</Badge>
                  </div>
                </div>
              </div>

              {/* Project Tips */}
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center text-xs sm:text-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Project Tips
                </h3>
                <div className="space-y-1 text-xs text-blue-800">
                  <p>• Regular updates keep everyone informed</p>
                  <p>• Set realistic milestones to track progress</p>
                  <p>• Use labels to organize and categorize tasks</p>
                  <p>• Team collaboration improves project success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal; 