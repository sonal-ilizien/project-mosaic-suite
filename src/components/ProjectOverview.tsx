import { useState } from "react";
import { ArrowLeft, Calendar, Users, Target, FileText, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanBoard from "./KanbanBoard";

interface ProjectOverviewProps {
  project: any;
  onBack: () => void;
}

const ProjectOverview = ({ project, onBack }: ProjectOverviewProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data based on template
  const getTemplateData = (templateId: string) => {
    switch (templateId) {
      case 'agile':
        return {
          sections: ['Backlog', 'Sprint 1', 'Sprint 2', 'In Progress', 'Testing', 'Done'],
          customFields: ['Story Points', 'Sprint', 'Epic', 'Assignee'],
          tasks: [
            { id: 1, title: 'User Authentication', status: 'In Progress', points: 8 },
            { id: 2, title: 'Dashboard UI', status: 'Backlog', points: 5 },
            { id: 3, title: 'API Integration', status: 'Testing', points: 13 }
          ]
        };
      case 'finance':
        return {
          sections: ['Budget Planning', 'Expense Tracking', 'Invoice Management', 'Reports', 'Approval'],
          customFields: ['Amount', 'Category', 'Due Date', 'Approver'],
          tasks: [
            { id: 1, title: 'Q1 Budget Review', status: 'Budget Planning', amount: '$50,000' },
            { id: 2, title: 'Office Expenses', status: 'Expense Tracking', amount: '$2,500' },
            { id: 3, title: 'Client Invoice #001', status: 'Invoice Management', amount: '$15,000' }
          ]
        };
      default:
        return {
          sections: ['To Do', 'In Progress', 'Review', 'Done'],
          customFields: ['Priority', 'Due Date', 'Assignee'],
          tasks: [
            { id: 1, title: 'Initial Setup', status: 'Done', priority: 'High' },
            { id: 2, title: 'Main Tasks', status: 'In Progress', priority: 'Medium' },
            { id: 3, title: 'Final Review', status: 'To Do', priority: 'Low' }
          ]
        };
    }
  };

  const templateData = getTemplateData(project.template);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{project.template}</Badge>
          <Badge className="bg-success text-white">Active</Badge>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-light rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="text-2xl font-bold text-foreground">{project.progress}%</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent-light rounded-lg">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Tasks</div>
              <div className="text-2xl font-bold text-foreground">{templateData.tasks.length}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success-light rounded-lg">
              <Users className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Team</div>
              <div className="text-2xl font-bold text-foreground">4</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning-light rounded-lg">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Days Left</div>
              <div className="text-2xl font-bold text-foreground">12</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Task Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Overview */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Project Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Overall Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                {templateData.sections.map((section, index) => (
                  <div key={section}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{section}</span>
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 100)}%</span>
                    </div>
                    <Progress value={Math.floor(Math.random() * 100)} className="h-1" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'Task completed', item: 'User Authentication', time: '2 hours ago' },
                  { action: 'Comment added', item: 'Dashboard UI', time: '4 hours ago' },
                  { action: 'File uploaded', item: 'Design Mockups', time: '1 day ago' },
                  { action: 'Task assigned', item: 'API Integration', time: '2 days ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 py-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <span className="text-sm text-foreground">{activity.action}: </span>
                      <span className="text-sm font-medium text-foreground">{activity.item}</span>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Template-specific sections */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Template Structure</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {templateData.sections.map((section) => (
                <div key={section} className="p-3 bg-background-secondary rounded-lg text-center">
                  <div className="font-medium text-foreground">{section}</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor(Math.random() * 5) + 1} tasks
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <KanbanBoard />
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="p-6">
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Project Calendar</h3>
              <p className="text-muted-foreground">Timeline and milestone view for this project</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card className="p-6">
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Project Files</h3>
              <p className="text-muted-foreground">Documents, images, and other project assets</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="p-6">
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Team Management</h3>
              <p className="text-muted-foreground">Manage team members, roles, and permissions</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectOverview;